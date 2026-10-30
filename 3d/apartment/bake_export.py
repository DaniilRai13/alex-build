"""
Bakes the Cycles lighting of apartment.blend into textures and exports the
web model, out/apartment.glb.

    blender --background out/apartment.blend --python 3d/apartment/bake_export.py -- [--size 2048] [--samples 256]

Why bake: the browser cannot afford soft shadows, bounced light or the glow of
a lamp. Cycles can. Baking renders that light once, into one texture per group,
and the page then only has to paint those textures — which is why the model
can look like the render and still turn smoothly on a phone.

Exported nodes (names are what the page looks for):
    Shell, Before, After     baked, unlit — show Shell plus one state
    Glass_Shell, Glass_After, Glass_Before
                             window and shower panes, drawn translucent
    Props_After, Props_Before
                             plants and vases with their own textures, lit live
    Shadow                   the model's shadow on the page, as alpha
    Underlay                 the drawing sheet lines
    HS_*                     hotspot anchors
"""

import os
import subprocess
import sys

import bmesh
import bpy
import numpy as np

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(HERE, "out")
sys.path.insert(0, HERE)

ARGS = sys.argv[sys.argv.index("--") + 1:] if "--" in sys.argv else []


def arg(name, default):
    return type(default)(ARGS[ARGS.index(name) + 1]) if name in ARGS else default


SIZE = arg("--size", 2048)
SAMPLES = arg("--samples", 256)

scene = bpy.context.scene


def coll(name):
    return bpy.data.collections[name]


def use_gpu():
    prefs = bpy.context.preferences.addons["cycles"].preferences
    for kind in ("OPTIX", "CUDA", "HIP", "ONEAPI"):
        try:
            prefs.compute_device_type = kind
        except TypeError:
            continue
        prefs.get_devices()
        if any(d.type == kind for d in prefs.devices):
            for d in prefs.devices:
                d.use = d.type == kind
            scene.cycles.device = "GPU"
            return kind
    return "CPU"


def show_all():
    """Hidden collections are skipped by the depsgraph; un-hide for flattening."""
    for layer in bpy.context.view_layer.layer_collection.children:
        if layer.name != "Library":
            layer.hide_viewport = False
            layer.exclude = False


def is_glass(obj):
    return obj.type == "MESH" and any(m and m.name == "glass" for m in obj.data.materials)


def is_prop(obj):
    """Poly Haven models: they bring their own textures and UVs. Baking their
    thousands of leaves would eat the whole lightmap for a few plants."""
    return obj.type == "MESH" and "height" in obj.data


def flatten(objects, name, drop_undersides=True):
    """
    Merges objects into one world-space mesh with modifiers applied — one
    draw call on the page, one texture to bake into.
    """
    depsgraph = bpy.context.evaluated_depsgraph_get()
    bm, mats = bmesh.new(), []
    for obj in objects:
        if obj.type not in ("MESH", "CURVE", "FONT"):
            continue
        part = bpy.data.meshes.new_from_object(obj.evaluated_get(depsgraph))
        part.transform(obj.matrix_world)
        remap = []
        for m in part.materials:
            if m not in mats:
                mats.append(m)
            remap.append(mats.index(m))
        for poly in part.polygons:
            poly.material_index = remap[poly.material_index] if remap else 0
        bm.from_mesh(part)
        bpy.data.meshes.remove(part)

    if drop_undersides:
        # The camera never goes below the floor: faces looking down only
        # waste texture space.
        bm.normal_update()
        bmesh.ops.delete(bm, geom=[f for f in bm.faces if f.normal.z < -0.7],
                         context="FACES")

    mesh = bpy.data.meshes.new(name)
    bm.to_mesh(mesh)
    bm.free()
    for m in mats:
        mesh.materials.append(m)
    obj = bpy.data.objects.new(name, mesh)
    coll("Export").objects.link(obj)
    return obj


def lightmap_uv(obj):
    """A second UV set that gives every face its own patch of the bake."""
    mesh = obj.data
    render_uv = mesh.uv_layers.get("UVMap")
    bake = mesh.uv_layers.new(name="bake")
    mesh.uv_layers.active = bake
    if render_uv:
        render_uv.active_render = True  # prop textures keep reading their own UVs

    bpy.ops.object.select_all(action="DESELECT")
    obj.select_set(True)
    bpy.context.view_layer.objects.active = obj
    bpy.ops.object.mode_set(mode="EDIT")
    bpy.ops.mesh.select_all(action="SELECT")
    bpy.ops.uv.smart_project(angle_limit=1.15, island_margin=0.0015,
                             area_weight=0.0, scale_to_bounds=False)
    bpy.ops.object.mode_set(mode="OBJECT")


def bake(obj, image):
    """Cycles "combined" bake, minus glossy: reflections belong to one viewpoint."""
    for m in obj.data.materials:
        m.use_nodes = True
        nodes = m.node_tree.nodes
        node = nodes.get("BakeTarget") or nodes.new("ShaderNodeTexImage")
        node.name = "BakeTarget"
        node.image = image
        nodes.active = node

    settings = scene.render.bake
    settings.use_pass_direct = True
    settings.use_pass_indirect = True
    settings.use_pass_diffuse = True
    settings.use_pass_glossy = False
    settings.use_pass_transmission = True
    settings.use_pass_emit = True
    settings.margin = 3
    settings.use_clear = True

    bpy.ops.object.select_all(action="DESELECT")
    obj.select_set(True)
    bpy.context.view_layer.objects.active = obj
    bpy.ops.object.bake(type="COMBINED")


def colour_only(obj):
    """
    Props keep just their colour texture. The page lights them flatly, so
    roughness and normal maps would be dead weight — and the exporter fails to
    repack Poly Haven's roughness maps, leaving broken image references.
    """
    for m in obj.data.materials:
        bsdf = m.node_tree.nodes.get("Principled BSDF")
        if not bsdf:
            continue
        for name in ("Roughness", "Metallic", "Normal"):
            for link in list(bsdf.inputs[name].links):
                m.node_tree.links.remove(link)
        bsdf.inputs["Roughness"].default_value = 0.8
        bsdf.inputs["Metallic"].default_value = 0.0


def solo(obj):
    """Only this one of the merged copies takes part in the bake."""
    for o in coll("Export").objects:
        o.hide_render = o is not obj


def save_display(image, path):
    """
    Saves the raw bake, has denoise.py clean it (a bake is as noisy as its
    sample count) and write it through the view transform, then loads the
    result for export.
    """
    raw = os.path.splitext(path)[0] + ".exr"
    image.filepath_raw = raw
    image.file_format = "OPEN_EXR"
    image.save()
    subprocess.run([bpy.app.binary_path, "--background", "--factory-startup",
                    "--python", os.path.join(HERE, "denoise.py"), "--", raw, path],
                   check=True, stdout=subprocess.DEVNULL)
    return bpy.data.images.load(path)


def unlit(obj, image, name):
    """Swap the scene's materials for the baked texture on the "bake" UVs."""
    m = bpy.data.materials.new(name)
    m.use_nodes = True
    nodes, links = m.node_tree.nodes, m.node_tree.links
    bsdf = nodes["Principled BSDF"]
    tex = nodes.new("ShaderNodeTexImage")
    tex.image = image
    uv = nodes.new("ShaderNodeUVMap")
    uv.uv_map = "bake"
    links.new(uv.outputs["UV"], tex.inputs["Vector"])
    links.new(tex.outputs["Color"], bsdf.inputs["Base Color"])
    bsdf.inputs["Roughness"].default_value = 1.0

    mesh = obj.data
    for layer in [l for l in mesh.uv_layers if l.name != "bake"]:
        mesh.uv_layers.remove(layer)
    mesh.materials.clear()
    mesh.materials.append(m)
    for poly in mesh.polygons:
        poly.material_index = 0


def bake_group(name, objects, state):
    """
    state "before"/"after" bakes with that flat's furniture in place. "shell"
    is for the walls both states share: no furniture from either, only the
    lamps — otherwise a new wardrobe leaves its black silhouette on a wall that
    the old flat shows bare.
    """
    coll("Before").hide_render = state != "before"
    coll("After").hide_render = state not in ("after", "shell")
    furniture = []
    if state == "shell":
        furniture = [o for o in coll("After").all_objects if o.type != "LIGHT"]
        for o in furniture:
            o.hide_render = True
    obj = flatten(objects, name)
    lightmap_uv(obj)
    size = SIZE if name == "Shell" else SIZE * 2  # rooms are looked at up close
    image = bpy.data.images.new(f"bake_{name}", size, size, alpha=False,
                                float_buffer=True)
    print(f"[bake] {name}: {len(obj.data.polygons)} faces, {size}px, {SAMPLES} spp")
    # The merged copy sits exactly on its originals; rays leaving one surface
    # would hit its twin and bake black. Hide the twins while this one bakes.
    solo(obj)
    for o in objects:
        o.hide_render = True
    bake(obj, image)
    for o in objects + furniture:
        o.hide_render = False
    baked = save_display(image, os.path.join(OUT, f"bake_{name}.png"))
    unlit(obj, baked, f"Baked_{name}")
    return obj


def bake_shadow():
    """
    The model's shadow on the page, as a black texture with alpha: bake a
    white sheet under the model, divide by the unshadowed white, invert.
    """
    coll("Before").hide_render = True
    coll("After").hide_render = False
    x0, y0, x1, y1 = -3.0, -4.5, 14.0, 11.0
    mesh = bpy.data.meshes.new("Shadow")
    mesh.from_pydata([(x0, y0, -0.179), (x1, y0, -0.179), (x1, y1, -0.179),
                      (x0, y1, -0.179)], [], [(0, 1, 2, 3)])
    uv = mesh.uv_layers.new(name="bake")
    for loop, co in zip(mesh.loops, ((0, 0), (1, 0), (1, 1), (0, 1))):
        uv.data[loop.index].uv = co
    white = bpy.data.materials.new("shadow_sheet")
    white.use_nodes = True
    white.node_tree.nodes["Principled BSDF"].inputs["Base Color"].default_value = (1, 1, 1, 1)
    mesh.materials.append(white)
    obj = bpy.data.objects.new("Shadow", mesh)
    coll("Export").objects.link(obj)

    size = SIZE // 2
    image = bpy.data.images.new("bake_Shadow", size, size, alpha=False, float_buffer=True)
    settings = scene.render.bake
    settings.use_pass_emit = False
    solo(obj)
    bake(obj, image)

    px = np.empty(size * size * 4, dtype=np.float32)
    image.pixels.foreach_get(px)
    lum = px.reshape(-1, 4)[:, :3].mean(axis=1)
    reference = np.percentile(lum, 99.5)  # open, unshadowed paper
    # Ignore the faint sky occlusion that covers the whole sheet, keep the
    # shadow proper, and fade it out towards the sheet's edges so the page
    # never shows where the plane ends.
    alpha = np.clip((1 - lum / reference - 0.08) / 0.92, 0, 1) * 0.8
    u = np.linspace(0, 1, size)
    edge = np.minimum(np.minimum(u, 1 - u) / 0.18, 1)
    alpha *= (np.outer(edge, edge) ** 1.5).ravel()
    out = np.zeros((size * size, 4), dtype=np.float32)
    out[:, 3] = alpha
    shadow = bpy.data.images.new("Shadow", size, size, alpha=True)
    shadow.pixels.foreach_set(out.ravel())
    shadow.filepath_raw = os.path.join(OUT, "bake_Shadow.png")
    shadow.file_format = "PNG"
    shadow.save()
    unlit(obj, shadow, "Baked_Shadow")
    obj.data.materials[0].blend_method = "BLEND"
    tex = next(n for n in obj.data.materials[0].node_tree.nodes if n.type == "TEX_IMAGE")
    obj.data.materials[0].node_tree.links.new(
        tex.outputs["Alpha"],
        obj.data.materials[0].node_tree.nodes["Principled BSDF"].inputs["Alpha"])
    return obj


def matte_metals():
    """
    A bake without glossy light turns pure metal black — the mirror would
    bake as a hole. Give metals a pale matte stand-in for the bake.
    """
    for key in ("chrome", "mirror"):
        m = bpy.data.materials.get(key)
        if m:
            bsdf = m.node_tree.nodes["Principled BSDF"]
            bsdf.inputs["Metallic"].default_value = 0.0
            bsdf.inputs["Base Color"].default_value = (0.62, 0.65, 0.67, 1)
            bsdf.inputs["Roughness"].default_value = 0.3


def main():
    scene.render.engine = "CYCLES"
    matte_metals()
    print("[bake] device:", use_gpu())
    scene.cycles.samples = SAMPLES
    scene.cycles.use_denoising = False
    scene.collection.children.link(bpy.data.collections.new("Export"))
    show_all()

    groups = {name: [o for o in coll(name).all_objects if o.type in ("MESH", "CURVE", "FONT")]
              for name in ("Shell", "Before", "After")}
    exported = []
    for name, state in (("Shell", "shell"), ("After", "after"), ("Before", "before")):
        solid = [o for o in groups[name] if not is_glass(o) and not is_prop(o)]
        exported.append(bake_group(name, solid, state))
        glass = [o for o in groups[name] if is_glass(o)]
        if glass:
            exported.append(flatten(glass, f"Glass_{name}", drop_undersides=False))
        props = [o for o in groups[name] if is_prop(o)]
        if props:
            obj = flatten(props, f"Props_{name}", drop_undersides=False)
            colour_only(obj)
            exported.append(obj)

    exported.append(bake_shadow())
    for obj in exported:
        obj.hide_render = False
    exported.append(flatten(list(coll("Underlay").all_objects), "Underlay",
                            drop_undersides=False))

    bpy.ops.object.select_all(action="DESELECT")
    for obj in exported:
        obj.select_set(True)
    for obj in coll("Shell").all_objects:
        if obj.name.startswith("HS_"):
            obj.select_set(True)

    path = os.path.join(OUT, "apartment.glb")
    bpy.ops.export_scene.gltf(
        filepath=path,
        export_format="GLB",
        use_selection=True,
        export_apply=True,
        export_image_format="WEBP",
        export_image_quality=82,
        export_draco_mesh_compression_enable=True,
        export_draco_mesh_compression_level=7,
        export_yup=True,
    )
    print(f"[bake] wrote {path}: {os.path.getsize(path) / 1e6:.1f} MB")


main()
