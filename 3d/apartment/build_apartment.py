"""
Builds the hero apartment: a panel-block flat (~86 m²) in two states.

    before — 4+1: closed kitchen, umakart bathroom core, pantry, long corridor
    after  — 4+kk: kitchen opened into the living room, the core and pantry
             merged into one built bathroom, fitted wardrobes, a study

Run headless:
    blender --background --factory-startup --python 3d/apartment/build_apartment.py -- [--render] [--blend]

Everything is generated from the numbers below, so the model is edited here
rather than in the Blender UI. Collections:
    Shell   — shared by both states (outer walls, bearing wall, unchanged partitions)
    Before  — only in the original state
    After   — only after the renovation
    Underlay — the drawing sheet the model stands on
Hotspot empties (HS_*) mark where the web page pins its labels.

Textures and props come from Poly Haven (CC0); fetch them first with
    node 3d/fetch-assets.mjs
"""

import math
import os
import random
import sys

import bmesh
import bpy
import numpy as np

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(HERE, "out")
ASSETS = os.path.join(HERE, "..", "assets", "polyhaven")

ARGS = sys.argv[sys.argv.index("--") + 1:] if "--" in sys.argv else []

rnd = random.Random(7)

# ---------------------------------------------------------------- dimensions
# Interior clear size; x runs along the front facade, y into the building.
W, D = 10.8, 8.0
H = 2.3            # cut height of the walls (the model is shown roofless)
EXT = 0.3          # outer panel wall with insulation
BEAR = 0.18        # bearing cross wall
PART = 0.10        # partition
UMAKART = 0.05     # the old bathroom core's panels

X_BEAR = 3.6       # bearing wall: bedroom / living room, kids' room / bathroom
Y_FRONT = 3.9      # partition between the facade rooms and the corridor
Y_HALL = 5.1       # partition between the corridor and the back rooms
X_KITCHEN = 7.2    # the wall the renovation removes
X_STUDY = 6.4      # bathroom / study wall, same in both states

DOOR = 2.05
SILL, HEAD = 0.85, 2.0

# ---------------------------------------------------------------- materials
# key: (hex, roughness)
PALETTE = {
    "wall": ("#F1EDE6", 0.85),
    "cap": ("#3A3633", 0.7),
    "base": ("#D8D1C4", 0.9),
    "ground": ("#EAE7DC", 1.0),
    "frame": ("#2F2D2B", 0.45),
    "glass": ("#DDE6E8", 0.03),
    "mirror": ("#D5DADC", 0.05),
    "oak": ("#C4A686", 0.5),
    "oak_dark": ("#7C5E44", 0.5),
    "white": ("#F4F2EE", 0.3),
    "black": ("#262524", 0.4),
    "screen": ("#1C1D1F", 0.15),
    "chrome": ("#C9CCCE", 0.2),
    "fabric": ("#D3CDC3", 0.95),
    "fabric_dark": ("#8F877C", 0.95),
    "linen": ("#F3F0EA", 0.95),
    "terracotta": ("#B8795A", 0.9),
    "sage": ("#9AA58C", 0.9),
    "navy": ("#4E5968", 0.9),
    "mustard": ("#C9A55A", 0.9),
    "rug": ("#E4DDD0", 1.0),
    "leaf": ("#6B8A57", 0.8),
    "leaf_dark": ("#4F6E45", 0.8),
    "pot": ("#B9AFA2", 0.8),
    "pot_dark": ("#6F6861", 0.8),
    "tile_dark": ("#8E8B86", 0.35),
    "paint_sage": ("#AEB5A0", 0.9),
    "paint_clay": ("#D9B8A0", 0.9),
    "paint_greige": ("#D2C8B9", 0.9),
    # the "before" state: dated, browner, busier
    "brown": ("#6E4F36", 0.55),
    "brown_light": ("#94704F", 0.55),
    "old_fabric": ("#8C6F55", 0.95),
    "old_green": ("#7B7A4F", 0.95),
    "old_red": ("#8A4B3A", 1.0),
    "old_kitchen": ("#E8E0CF", 0.45),
    "old_counter": ("#9B8870", 0.5),
    "crt": ("#4A4744", 0.4),
    # book spines and pictures
    "book1": ("#8C6E54", 0.8),
    "book2": ("#5E6B73", 0.8),
    "book3": ("#B9A27F", 0.8),
    "book4": ("#7A5040", 0.8),
    "book5": ("#D8CFC0", 0.8),
    "book6": ("#4F5A4C", 0.8),
}

# Procedural patterns: Blender's brick texture, laid in world metres.
TEXTURED = {
    "tile_old": dict(c1="#AFC2BF", c2="#A4B7B4", mortar="#E3E2DC", w=0.15,
                     h=0.15, offset=0.0, mortar_size=0.004, rough=0.3),
    "tile_loggia": dict(c1="#A39D94", c2="#98928A", mortar="#827D76", w=0.3,
                        h=0.3, offset=0.0, mortar_size=0.004, rough=0.6),
    "umakart": dict(c1="#CDB793", c2="#C4AD88", mortar="#9E8A6B", w=0.6,
                    h=5.0, offset=0.0, mortar_size=0.006, rough=0.35),
}

# Photographed surfaces from Poly Haven, projected in world metres.
# key: (asset, metres per tile, normal strength, tint or None)
# A tint keeps the texture's pattern but takes its colour from the tint, so one
# fabric scan dresses every sofa and cushion in the flat.
PHOTO = {
    "oak_floor": ("laminate_floor_02", 1.8, 0.35, "#CDB395"),
    "oak": ("laminate_floor_02", 1.2, 0.0, "#C6A887"),
    "parquet": ("herringbone_parquet", 1.2, 0.35, None),
    "lino": ("square_tiles", 1.4, 0.0, "#B8A283"),
    "tile_bath": ("marble_01", 2.4, 0.2, None),
    "linen": ("rough_linen", 0.35, 0.3, "#F2EEE7"),
    "curtain": ("rough_linen", 0.35, 0.2, "#EEE8DD"),
    "shade": ("rough_linen", 0.25, 0.0, "#F4EBDD"),
    "led": ("rough_linen", 1.0, 0.0, "#FFF4E0"),
    "rug": ("hessian_230", 0.4, 0.4, "#DCCFB9"),
    "old_red": ("wool_boucle", 0.8, 0.2, "#8A4B3A"),
}
for _key in ("fabric", "fabric_dark", "terracotta", "sage", "navy", "mustard",
             "old_fabric", "old_green"):
    PHOTO[_key] = ("poly_wool_herringbone", 0.45, 0.3, PALETTE[_key][0])

WARM = (1.0, 0.76, 0.52)  # ~2700 K, an ordinary warm-white bulb

BOOKS = ["book1", "book2", "book3", "book4", "book5", "book6"]

_mats = {}


def srgb_to_linear(c):
    return c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4


def rgba(hex_):
    return (*[srgb_to_linear(int(hex_[i:i + 2], 16) / 255) for i in (1, 3, 5)], 1)


def socket(sockets, name, type_):
    return next(s for s in sockets if s.name == name and s.type == type_)


def textured(key, spec):
    m = bpy.data.materials.new(key)
    m.use_nodes = True
    nodes, links = m.node_tree.nodes, m.node_tree.links
    bsdf = nodes["Principled BSDF"]
    coords = nodes.new("ShaderNodeTexCoord")

    brick = nodes.new("ShaderNodeTexBrick")
    brick.offset = spec["offset"]
    links.new(coords.outputs["Object"], brick.inputs["Vector"])
    brick.inputs["Color1"].default_value = rgba(spec["c1"])
    brick.inputs["Color2"].default_value = rgba(spec["c2"])
    brick.inputs["Mortar"].default_value = rgba(spec["mortar"])
    brick.inputs["Scale"].default_value = 1.0
    brick.inputs["Mortar Size"].default_value = spec["mortar_size"]
    brick.inputs["Brick Width"].default_value = spec["w"]
    brick.inputs["Row Height"].default_value = spec["h"]
    color = brick.outputs["Color"]

    if spec.get("grain"):
        # Streaks along the planks: noise stretched across them, overlaid.
        mapping = nodes.new("ShaderNodeMapping")
        mapping.inputs["Scale"].default_value = (1.5, 40.0, 1.0)
        links.new(coords.outputs["Object"], mapping.inputs["Vector"])
        noise = nodes.new("ShaderNodeTexNoise")
        noise.inputs["Scale"].default_value = 4.0
        noise.inputs["Detail"].default_value = 6.0
        links.new(mapping.outputs["Vector"], noise.inputs["Vector"])
        mix = nodes.new("ShaderNodeMix")
        mix.data_type = "RGBA"
        mix.blend_type = "OVERLAY"
        socket(mix.inputs, "Factor", "VALUE").default_value = 0.35
        links.new(color, socket(mix.inputs, "A", "RGBA"))
        links.new(noise.outputs["Fac"], socket(mix.inputs, "B", "RGBA"))
        color = socket(mix.outputs, "Result", "RGBA")

    links.new(color, bsdf.inputs["Base Color"])
    bsdf.inputs["Roughness"].default_value = spec["rough"]
    m.diffuse_color = rgba(spec["c1"])
    return m


def load_image(asset, short, color=True):
    path = os.path.join(ASSETS, asset, f"{short}.jpg")
    if not os.path.exists(path):
        return None
    img = bpy.data.images.load(path, check_existing=True)
    if not color:
        img.colorspace_settings.name = "Non-Color"
    return img


def mean_luminance(img):
    """Average linear luminance, to normalise a texture before tinting it."""
    px = np.empty(len(img.pixels), dtype=np.float32)
    img.pixels.foreach_get(px)
    rgb = px.reshape(-1, 4)[:, :3]
    lin = np.where(rgb <= 0.04045, rgb / 12.92, ((rgb + 0.055) / 1.055) ** 2.4)
    return float((lin @ np.array([0.2126, 0.7152, 0.0722])).mean())


def photo_material(key, asset, size, normal, tint):
    m = bpy.data.materials.new(key)
    m.use_nodes = True
    nodes, links = m.node_tree.nodes, m.node_tree.links
    bsdf = nodes["Principled BSDF"]
    coords = nodes.new("ShaderNodeTexCoord")
    mapping = nodes.new("ShaderNodeMapping")
    mapping.inputs["Scale"].default_value = (1 / size,) * 3
    links.new(coords.outputs["Object"], mapping.inputs["Vector"])

    def tex(img):
        node = nodes.new("ShaderNodeTexImage")
        node.image = img
        # Box projection: the boxes have no UVs, and this lays the texture on
        # every face at the same scale, in world metres.
        node.projection = "BOX"
        node.projection_blend = 0.2
        links.new(mapping.outputs["Vector"], node.inputs["Vector"])
        return node

    diff = load_image(asset, "diff")
    color = tex(diff).outputs["Color"]
    if tint:
        bw = nodes.new("ShaderNodeRGBToBW")
        links.new(color, bw.inputs["Color"])
        gain = nodes.new("ShaderNodeMath")
        gain.operation = "MULTIPLY"
        gain.inputs[1].default_value = 1 / max(mean_luminance(diff), 1e-3)
        links.new(bw.outputs["Val"], gain.inputs[0])
        mix = nodes.new("ShaderNodeMix")
        mix.data_type = "RGBA"
        mix.blend_type = "MULTIPLY"
        socket(mix.inputs, "Factor", "VALUE").default_value = 1.0
        socket(mix.inputs, "A", "RGBA").default_value = rgba(tint)
        links.new(gain.outputs["Value"], socket(mix.inputs, "B", "RGBA"))
        color = socket(mix.outputs, "Result", "RGBA")
    links.new(color, bsdf.inputs["Base Color"])

    rough = load_image(asset, "rough", color=False)
    if rough:
        links.new(tex(rough).outputs["Color"], bsdf.inputs["Roughness"])
    nor = load_image(asset, "nor", color=False)
    if nor and normal > 0:
        nmap = nodes.new("ShaderNodeNormalMap")
        nmap.inputs["Strength"].default_value = normal
        links.new(tex(nor).outputs["Color"], nmap.inputs["Color"])
        links.new(nmap.outputs["Normal"], bsdf.inputs["Normal"])

    m.diffuse_color = rgba(tint) if tint else (0.55, 0.4, 0.28, 1)
    return m


def mat(key):
    if key in _mats:
        return _mats[key]
    if key in PHOTO:
        m = photo_material(key, *PHOTO[key])
        if key in ("shade", "led"):  # lit from inside
            bsdf = m.node_tree.nodes["Principled BSDF"]
            bsdf.inputs["Emission Color"].default_value = (*WARM, 1)
            bsdf.inputs["Emission Strength"].default_value = 2.5
        _mats[key] = m
        return m
    if key in TEXTURED:
        _mats[key] = textured(key, TEXTURED[key])
        return _mats[key]
    hex_, rough = PALETTE[key]
    m = bpy.data.materials.new(key)
    m.use_nodes = True
    bsdf = m.node_tree.nodes["Principled BSDF"]
    bsdf.inputs["Base Color"].default_value = rgba(hex_)
    bsdf.inputs["Roughness"].default_value = rough
    if key == "glass":
        bsdf.inputs["Transmission Weight"].default_value = 1.0
        bsdf.inputs["IOR"].default_value = 1.2
    if key in ("chrome", "mirror"):
        bsdf.inputs["Metallic"].default_value = 1.0
    m.diffuse_color = rgba(hex_)
    _mats[key] = m
    return m


# ---------------------------------------------------------------- primitives
def reset():
    bpy.ops.wm.read_factory_settings(use_empty=True)
    scene = bpy.context.scene
    for name in ("Shell", "Before", "After", "Underlay", "Stage", "Library"):
        scene.collection.children.link(bpy.data.collections.new(name))
    # Imported props live here once and are placed as linked copies.
    coll("Library").hide_render = True
    coll("Library").hide_viewport = True


def coll(name):
    return bpy.data.collections[name]


def link(obj, material, collection):
    obj.data.materials.append(mat(material))
    coll(collection).objects.link(obj)
    return obj


def box(name, x0, y0, z0, x1, y1, z1, material, collection, bevel=0.01,
        soft=False):
    """
    Axis-aligned box from two corners, in metres. A small bevel catches the
    light the way real edges do; soft=True rounds it into a cushion.
    """
    x0, x1 = sorted((x0, x1))
    y0, y1 = sorted((y0, y1))
    z0, z1 = sorted((z0, z1))
    verts = [
        (x0, y0, z0), (x1, y0, z0), (x1, y1, z0), (x0, y1, z0),
        (x0, y0, z1), (x1, y0, z1), (x1, y1, z1), (x0, y1, z1),
    ]
    faces = [
        (0, 3, 2, 1), (4, 5, 6, 7), (0, 1, 5, 4),
        (1, 2, 6, 5), (2, 3, 7, 6), (3, 0, 4, 7),
    ]
    mesh = bpy.data.meshes.new(name)
    mesh.from_pydata(verts, [], faces)
    obj = bpy.data.objects.new(name, mesh)
    if bevel:
        mod = obj.modifiers.new("Bevel", "BEVEL")
        mod.width = bevel
        mod.segments = 3 if soft else 2
        mod.limit_method = "ANGLE"
    if soft:
        for p in mesh.polygons:
            p.use_smooth = True
    return link(obj, material, collection)


def cylinder(name, x, y, z0, z1, r, material, collection, segments=24,
             r_top=None):
    r_top = r if r_top is None else r_top
    verts, faces = [], []
    for z, radius in ((z0, r), (z1, r_top)):
        for i in range(segments):
            a = 2 * math.pi * i / segments
            verts.append((x + radius * math.cos(a), y + radius * math.sin(a), z))
    faces.append(tuple(reversed(range(segments))))
    faces.append(tuple(range(segments, 2 * segments)))
    for i in range(segments):
        j = (i + 1) % segments
        faces.append((i, j, segments + j, segments + i))
    mesh = bpy.data.meshes.new(name)
    mesh.from_pydata(verts, [], faces)
    for p in mesh.polygons[2:]:
        p.use_smooth = True
    return link(bpy.data.objects.new(name, mesh), material, collection)


# ---------------------------------------------------------------- props
_library = {}


def evaluated_mesh(obj):
    """The mesh an object shows after its modifiers (or a text curve, as mesh)."""
    depsgraph = bpy.context.evaluated_depsgraph_get()
    return bpy.data.meshes.new_from_object(obj.evaluated_get(depsgraph))


def load_model(asset, decimate=None):
    """
    Imports a Poly Haven glTF once and flattens it into a single mesh standing
    on its base at the origin. Every placement then shares that mesh.
    """
    if asset in _library:
        return _library[asset]
    before = set(bpy.data.objects)
    bpy.ops.import_scene.gltf(filepath=os.path.join(ASSETS, asset, f"{asset}.gltf"))
    imported = [o for o in bpy.data.objects if o not in before]
    bpy.context.view_layer.update()

    bm, mats = bmesh.new(), []
    for obj in (o for o in imported if o.type == "MESH"):
        part = obj.data.copy()
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
    for obj in imported:
        bpy.data.objects.remove(obj, do_unlink=True)

    lo = [min(v.co[i] for v in bm.verts) for i in range(3)]
    hi = [max(v.co[i] for v in bm.verts) for i in range(3)]
    bmesh.ops.translate(bm, verts=bm.verts,
                        vec=(-(lo[0] + hi[0]) / 2, -(lo[1] + hi[1]) / 2, -lo[2]))
    mesh = bpy.data.meshes.new(asset)
    bm.to_mesh(mesh)
    bm.free()
    for m in mats:
        mesh.materials.append(m)

    if decimate:
        # The 70k-triangle scans would outweigh the whole flat on the web.
        tmp = bpy.data.objects.new(f"{asset}_tmp", mesh)
        bpy.context.scene.collection.objects.link(tmp)
        tmp.modifiers.new("Decimate", "DECIMATE").ratio = decimate
        reduced = evaluated_mesh(tmp)
        bpy.data.objects.remove(tmp, do_unlink=True)
        bpy.data.meshes.remove(mesh)
        mesh = reduced
        mesh.name = asset

    mesh["height"] = hi[2] - lo[2]
    _library[asset] = mesh
    return mesh


def prop(asset, name, x, y, z, height, collection, rot=None, decimate=None):
    """Places a library model scaled to a real-world height, in metres."""
    mesh = load_model(asset, decimate)
    obj = bpy.data.objects.new(name, mesh)
    obj.location = (x, y, z)
    obj.rotation_euler = (0, 0, rnd.uniform(0, 2 * math.pi) if rot is None else rot)
    obj.scale = (height / mesh["height"],) * 3
    coll(collection).objects.link(obj)
    return obj


def plant(name, x, y, c, height=0.8, z=0.0, big=False):
    if big:
        return prop("potted_plant_02", name, x, y, z, height, c, decimate=0.12)
    return prop("potted_plant_04", name, x, y, z, height, c)


# ---------------------------------------------------------------- light
def point_light(name, x, y, z, watts, collection, radius=0.06):
    data = bpy.data.lights.new(name, "POINT")
    data.energy = watts
    data.color = WARM
    data.shadow_soft_size = radius
    obj = bpy.data.objects.new(name, data)
    obj.location = (x, y, z)
    coll(collection).objects.link(obj)
    return obj


def area_light(name, x, y, z, sx, sy, watts, collection):
    """A soft panel shining straight down — the room's ceiling light."""
    data = bpy.data.lights.new(name, "AREA")
    data.shape = "RECTANGLE"
    data.size, data.size_y = sx, sy
    data.energy = watts
    data.color = WARM
    obj = bpy.data.objects.new(name, data)
    obj.location = (x, y, z)
    coll(collection).objects.link(obj)
    return obj


def curtain(name, axis, t, s0, s1, collection, z0=0.04, z1=2.2, folds=None,
            depth=0.07, material="curtain"):
    """
    A curtain panel hanging in real folds: a sheet waved along its width.
    axis="x" runs along x at y=t; axis="y" runs along y at x=t.
    """
    folds = folds or max(2, round((s1 - s0) / 0.12))
    steps = folds * 8
    verts, faces = [], []
    for i in range(steps + 1):
        s = s0 + (s1 - s0) * i / steps
        off = depth / 2 * math.sin(2 * math.pi * folds * i / steps)
        for z in (z0, z1):
            verts.append((s, t + off, z) if axis == "x" else (t + off, s, z))
    for i in range(steps):
        a = 2 * i
        faces.append((a, a + 2, a + 3, a + 1))
    mesh = bpy.data.meshes.new(name)
    mesh.from_pydata(verts, [], faces)
    for p in mesh.polygons:
        p.use_smooth = True
    obj = bpy.data.objects.new(name, mesh)
    # Thickness so it reads from both sides and bakes without holes.
    obj.modifiers.new("Solidify", "SOLIDIFY").thickness = 0.008
    return link(obj, material, collection)


# ---------------------------------------------------------------- walls
def wall(name, axis, t0, t1, a0, a1, collection, openings=(), material="wall",
         height=H, inside=0, door_material="white", skirting=None):
    """
    A straight wall. axis="x" runs along x between a0..a1 and spans y t0..t1;
    axis="y" runs along y and spans x t0..t1. Openings are
    (start, end, bottom, top, kind[, swing]) along the run; kind is "door"
    (a doorway with casings), "opening" (a plain passage), "window",
    "glassdoor" or "entrance". A door with swing = (hinge, side) gets a leaf
    standing ajar: hinge "s" or "e" is the jamb it hangs on, side +1/-1 the
    side of t it opens into. inside is +1 or -1 for an outer wall — which side
    of t the room is on — and puts sills, radiators and skirting there.
    """
    if skirting is None:
        skirting = height >= H - 0.01 and material != "umakart"
    # Faces that face a room: both for a partition, one for an outer wall.
    room_faces = [(t0, -1), (t1, +1)] if not inside else \
        [(t1, +1)] if inside > 0 else [(t0, -1)]

    def piece(suffix, s0, s1, z0, z1):
        if s1 - s0 < 1e-4 or z1 - z0 < 1e-4:
            return
        span(f"{name}_{suffix}", axis, t0, t1, s0, s1, z0, z1, material, collection)
        if skirting and z0 == 0:
            for j, (face, sign) in enumerate(room_faces):
                span(f"{name}_{suffix}_skirt{j}", axis, *sorted((face, face + 0.012 * sign)),
                     s0, s1, 0, 0.07, "white", collection, bevel=0.003)

    cur = a0
    for i, (s, e, lo, hi, kind, *swing) in enumerate(sorted(openings)):
        piece(f"s{i}", cur, s, 0, height)
        piece(f"b{i}", s, e, 0, lo)
        piece(f"t{i}", s, e, hi, height)
        if kind in ("window", "glassdoor"):
            glazing(f"{name}_w{i}", axis, t0, t1, s, e, lo, hi, collection, inside)
        elif kind == "entrance":
            span(f"{name}_door{i}", axis, (t0 + t1) / 2 - 0.025, (t0 + t1) / 2 + 0.025,
                 s, e, lo, hi, "oak_dark", collection)
        elif kind == "door":
            casing(f"{name}_case{i}", axis, t0, t1, s, e, hi, collection, door_material)
            if swing:
                hinge, side = swing[0]
                door_leaf(f"{name}_leaf{i}", axis, t0, t1, s, e, hi, hinge, side,
                          collection, door_material,
                          angle=65 if e - s < 0.7 else 72)
        cur = e
    piece("end", cur, a1, 0, height)

    # The dark cap along the cut — what makes a cutaway read as a model.
    # Thicker walls sit a hair higher so crossing caps never share a plane.
    top = height + 0.012 + 0.02 * (t1 - t0)
    span(f"{name}_cap", axis, t0, t1, a0, a1, height, top, "cap", collection)


def span(name, axis, t0, t1, s0, s1, z0, z1, material, collection, bevel=0):
    if axis == "x":
        return box(name, s0, t0, z0, s1, t1, z1, material, collection, bevel=bevel)
    return box(name, t0, s0, z0, t1, s1, z1, material, collection, bevel=bevel)


def casing(name, axis, t0, t1, s, e, hi, collection, material):
    """Architraves round a doorway, on both faces of the wall."""
    w, proud = 0.07, 0.012
    for j, (a, b) in enumerate(((t0 - proud, t0), (t1, t1 + proud))):
        span(f"{name}_{j}l", axis, a, b, s - w, s, 0, hi + w, material, collection, bevel=0.003)
        span(f"{name}_{j}r", axis, a, b, e, e + w, 0, hi + w, material, collection, bevel=0.003)
        span(f"{name}_{j}h", axis, a, b, s - w, e + w, hi, hi + w, material, collection,
             bevel=0.003)


def rotated_box(name, x0, y0, z0, x1, y1, z1, location, heading, material,
                collection, bevel=0.004):
    """A box in local coordinates, turned about z — for anything not square to the walls."""
    obj = box(name, x0, y0, z0, x1, y1, z1, material, collection, bevel=bevel)
    obj.location = location
    obj.rotation_euler = (0, 0, heading)
    return obj


def door_leaf(name, axis, t0, t1, s, e, hi, hinge, side, collection, material,
              angle=72):
    """
    A door standing ajar. Closed, it would lie along the wall from its hinge
    jamb; it swings `angle` degrees into the room on `side`.
    """
    width = e - s - 0.01
    along = 1 if hinge == "s" else -1          # closed leaf points this way along the run
    pivot_s = s + 0.005 if hinge == "s" else e - 0.005
    pivot_t = (t1 if side > 0 else t0) + 0.02 * side
    if axis == "x":
        location = (pivot_s, pivot_t, 0)
        heading = 0 if along > 0 else math.pi
        turn = side * along
    else:
        location = (pivot_t, pivot_s, 0)
        heading = math.pi / 2 if along > 0 else -math.pi / 2
        turn = -side * along
    heading += turn * math.radians(angle)
    rotated_box(f"{name}", 0, -0.02, 0.01, width, 0.02, hi - 0.01, location, heading,
                material, collection)
    rotated_box(f"{name}_handle", width - 0.1, -0.055, 0.98, width - 0.06, 0.055, 1.02,
                location, heading, "chrome", collection, bevel=0)


def glazing(name, axis, t0, t1, s, e, lo, hi, collection, inside):
    f = 0.05
    mid = (t0 + t1) / 2
    for suffix, a, b, z0, z1 in (("fl", s, s + f, lo, hi), ("fr", e - f, e, lo, hi),
                                 ("fb", s, e, lo, lo + f), ("ft", s, e, hi - f, hi)):
        span(f"{name}_{suffix}", axis, mid - 0.035, mid + 0.035, a, b, z0, z1,
             "frame", collection)
    if e - s > 1.2:  # mullion on wide windows
        m = (s + e) / 2
        span(f"{name}_fm", axis, mid - 0.035, mid + 0.035, m - f / 2, m + f / 2,
             lo, hi, "frame", collection)
    span(f"{name}_glass", axis, mid - 0.006, mid + 0.006, s + f, e - f,
         lo + f, hi - f, "glass", collection)
    if lo > 0.1 and inside:
        room_face = t1 if inside > 0 else t0
        street_face = t0 if inside > 0 else t1
        # White sill inside, dark flashing outside.
        # Both stand a few millimetres proud of the wall below: flush, their
        # tops share a plane with the wall's and flicker on the page.
        span(f"{name}_sill", axis, *sorted((mid, room_face + 0.06 * inside)),
             s - 0.03, e + 0.03, lo - 0.03, lo + 0.006, "white", collection, bevel=0.005)
        span(f"{name}_flash", axis, *sorted((mid, street_face - 0.05 * inside)),
             s, e, lo - 0.02, lo + 0.004, "frame", collection)
        # Panel radiator under the sill — every panel flat has one there.
        span(f"{name}_radiator", axis,
             *sorted((room_face + 0.04 * inside, room_face + 0.14 * inside)),
             s + 0.15, e - 0.15, 0.15, 0.62, "white", collection, bevel=0.01)


# ---------------------------------------------------------------- furniture
def placer(ox, oy, facing, collection):
    """
    Returns a function that places boxes given in local coordinates:
    u across the piece, v from its back (0) towards the side it faces.
    """
    def to_world(u, v):
        if facing == "+y":
            return ox + u, oy + v
        if facing == "-y":
            return ox - u, oy - v
        if facing == "+x":
            return ox + v, oy - u
        return ox - v, oy + u  # "-x"

    def put(name, u0, v0, z0, u1, v1, z1, m, bevel=0.01, soft=False):
        x0, y0 = to_world(u0, v0)
        x1, y1 = to_world(u1, v1)
        return box(name, x0, y0, z0, x1, y1, z1, m, collection, bevel=bevel, soft=soft)

    put.world = to_world
    return put


def sofa(name, ox, oy, facing, c, w=2.2, d=0.92, m="fabric", accent=None):
    p = placer(ox, oy, facing, c)
    for i, u in enumerate((0.05, w - 0.09)):
        for j, v in enumerate((0.05, d - 0.09)):
            p(f"{name}_leg{i}{j}", u, v, 0, u + 0.04, v + 0.04, 0.1, "black", bevel=0)
    p(f"{name}_base", 0, 0, 0.1, w, d, 0.36, m, bevel=0.02)
    p(f"{name}_back", 0, 0, 0.36, w, 0.2, 0.74, m, bevel=0.04, soft=True)
    p(f"{name}_armL", 0, 0.2, 0.1, 0.16, d, 0.6, m, bevel=0.04, soft=True)
    p(f"{name}_armR", w - 0.16, 0.2, 0.1, w, d, 0.6, m, bevel=0.04, soft=True)
    n = 1 if w < 1.3 else 2 if w < 2.1 else 3
    seat = (w - 0.34) / n
    for i in range(n):
        u = 0.17 + i * seat
        p(f"{name}_seat{i}", u + 0.005, 0.2, 0.36, u + seat - 0.005, d - 0.02, 0.5,
          m, bevel=0.05, soft=True)
        p(f"{name}_cush{i}", u + 0.01, 0.18, 0.5, u + seat - 0.01, 0.36, 0.84,
          m, bevel=0.06, soft=True)
    if accent:
        p(f"{name}_pillowL", 0.2, 0.34, 0.5, 0.6, 0.48, 0.86, accent, bevel=0.06, soft=True)
        p(f"{name}_pillowR", w - 0.6, 0.34, 0.5, w - 0.2, 0.48, 0.86, accent,
          bevel=0.06, soft=True)


def bed(name, ox, oy, facing, c, w=1.6, l=2.05, frame="oak", cover="fabric",
        head="fabric_dark", throw=None):
    p = placer(ox, oy, facing, c)
    p(f"{name}_frame", 0, 0, 0.08, w, l, 0.3, frame, bevel=0.015)
    p(f"{name}_mattress", 0.03, 0.05, 0.3, w - 0.03, l - 0.03, 0.5, "linen",
      bevel=0.04, soft=True)
    p(f"{name}_head", 0, 0, 0.08, w, 0.09, 1.05, head, bevel=0.03, soft=True)
    pillows = 2 if w > 1.2 else 1
    pw = (w - 0.24) / pillows
    for i in range(pillows):
        u = 0.12 + i * pw
        p(f"{name}_pillow{i}", u + 0.02, 0.12, 0.5, u + pw - 0.02, 0.55, 0.64,
          "linen", bevel=0.05, soft=True)
    p(f"{name}_duvet", -0.02, 0.72, 0.46, w + 0.02, l + 0.01, 0.57, cover,
      bevel=0.04, soft=True)
    if throw:
        p(f"{name}_throw", -0.03, l - 0.55, 0.47, w + 0.03, l + 0.02, 0.59, throw,
          bevel=0.03, soft=True)


def table(name, ox, oy, facing, c, w=1.8, d=0.9, h=0.75, top="oak", legs="black"):
    p = placer(ox, oy, facing, c)
    p(f"{name}_top", 0, 0, h - 0.04, w, d, h, top, bevel=0.008)
    for i, (u, v) in enumerate(((0.06, 0.06), (w - 0.1, 0.06),
                                (0.06, d - 0.1), (w - 0.1, d - 0.1))):
        p(f"{name}_leg{i}", u, v, 0, u + 0.04, v + 0.04, h - 0.04, legs, bevel=0)


def chair(name, ox, oy, facing, c, m="fabric_dark", legs="black"):
    p = placer(ox, oy, facing, c)
    p(f"{name}_seat", 0.02, 0.02, 0.43, 0.44, 0.44, 0.49, m, bevel=0.02, soft=True)
    p(f"{name}_back", 0.03, 0.0, 0.49, 0.43, 0.05, 0.86, m, bevel=0.02, soft=True)
    for i, (u, v) in enumerate(((0.04, 0.02), (0.38, 0.02), (0.04, 0.38), (0.38, 0.38))):
        p(f"{name}_leg{i}", u, v, 0, u + 0.025, v + 0.025, 0.43, legs, bevel=0)


def office_chair(name, x, y, c):
    cylinder(f"{name}_base", x, y, 0.02, 0.06, 0.28, "black", c, segments=5)
    cylinder(f"{name}_post", x, y, 0.06, 0.45, 0.025, "chrome", c)
    box(f"{name}_seat", x - 0.25, y - 0.25, 0.45, x + 0.25, y + 0.25, 0.53,
        "black", c, bevel=0.03, soft=True)
    box(f"{name}_back", x - 0.23, y - 0.3, 0.6, x + 0.23, y - 0.24, 1.05,
        "black", c, bevel=0.03, soft=True)


def kitchen(name, ox, oy, facing, c, length, old=False, sink_at=None,
            hob_at=None, upper=True):
    front = "old_kitchen" if old else "white"
    top = "old_counter" if old else "black"
    wood = "old_kitchen" if old else "oak"
    p = placer(ox, oy, facing, c)
    p(f"{name}_plinth", 0, 0, 0, length, 0.54, 0.1, "black", bevel=0)
    p(f"{name}_body", 0, 0, 0.1, length, 0.57, 0.86, front, bevel=0)
    n = max(1, round(length / 0.6))
    fw = length / n
    for i in range(n):
        u = i * fw
        p(f"{name}_front{i}", u + 0.003, 0.57, 0.11, u + fw - 0.003, 0.59, 0.85,
          front, bevel=0.004)
        if old:
            p(f"{name}_handle{i}", u + fw / 2 - 0.07, 0.59, 0.77, u + fw / 2 + 0.07,
              0.61, 0.79, "chrome", bevel=0)
    p(f"{name}_top", 0, 0, 0.86, length, 0.62, 0.9, top, bevel=0.004)
    p(f"{name}_splash", 0, 0, 0.9, length, 0.012, 1.45,
      "tile_old" if old else "oak", bevel=0)
    if sink_at is not None:
        p(f"{name}_sink", sink_at, 0.1, 0.889, sink_at + 0.55, 0.5, 0.903,
          "chrome" if old else "black", bevel=0.01)
        p(f"{name}_tap", sink_at + 0.25, 0.03, 0.9, sink_at + 0.3, 0.08, 1.18,
          "chrome", bevel=0)
    if hob_at is not None:
        p(f"{name}_hob", hob_at, 0.07, 0.9, hob_at + 0.6, 0.55, 0.907,
          "white" if old else "screen", bevel=0.004)
    if upper:
        p(f"{name}_upper", 0, 0, 1.45, length, 0.33, 2.15, wood, bevel=0)
        for i in range(n):
            u = i * fw
            p(f"{name}_ufront{i}", u + 0.003, 0.33, 1.455, u + fw - 0.003, 0.35,
              2.145, wood, bevel=0.004)


def tall_units(name, ox, oy, facing, c, width, m="white"):
    p = placer(ox, oy, facing, c)
    p(f"{name}_body", 0, 0, 0, width, 0.6, 2.15, m, bevel=0)
    n = max(1, round(width / 0.6))
    fw = width / n
    for i in range(n):
        u = i * fw
        p(f"{name}_front{i}", u + 0.003, 0.6, 0.02, u + fw - 0.003, 0.62, 2.14,
          m, bevel=0.004)


def wardrobe(name, ox, oy, facing, c, width, h=2.1, depth=0.6, m="white",
             handles=False):
    p = placer(ox, oy, facing, c)
    p(f"{name}_body", 0, 0, 0, width, depth - 0.02, h, m, bevel=0)
    n = max(1, round(width / 0.5))
    fw = width / n
    for i in range(n):
        u = i * fw
        p(f"{name}_door{i}", u + 0.003, depth - 0.02, 0.01, u + fw - 0.003, depth,
          h - 0.01, m, bevel=0.004)
        if handles:
            hu = u + fw - 0.08 if i % 2 == 0 else u + 0.06
            p(f"{name}_handle{i}", hu, depth, h * 0.45, hu + 0.02, depth + 0.02,
              h * 0.55, "chrome", bevel=0)


def bookshelf(name, ox, oy, facing, c, width, h=2.0, depth=0.32, shelves=5,
              m="white"):
    p = placer(ox, oy, facing, c)
    p(f"{name}_sideL", 0, 0, 0, 0.025, depth, h, m, bevel=0.003)
    p(f"{name}_sideR", width - 0.025, 0, 0, width, depth, h, m, bevel=0.003)
    p(f"{name}_backp", 0.025, 0, 0, width - 0.025, 0.01, h, m, bevel=0)
    step = (h - 0.05) / shelves
    for s in range(shelves + 1):
        z = 0.03 + s * step
        p(f"{name}_board{s}", 0.025, 0.01, z - 0.025, width - 0.025, depth, z, m,
          bevel=0.003)
        if s < shelves:
            books(p, f"{name}_s{s}", 0.03, width - 0.03, 0.03, depth - 0.03, z,
                  max_h=step - 0.05)


def books(p, name, u0, u1, v0, v1, z, max_h=0.3):
    u, i = u0 + 0.02, 0
    while u < u1 - 0.06:
        if rnd.random() < 0.12:  # a gap, or a lying stack would go here
            u += rnd.uniform(0.08, 0.2)
            continue
        bw = rnd.uniform(0.025, 0.05)
        bh = min(max_h, rnd.uniform(0.17, 0.28))
        p(f"{name}_b{i}", u, v0 + rnd.uniform(0, 0.03), z, u + bw, v1, z + bh,
          rnd.choice(BOOKS), bevel=0.002)
        u += bw + 0.004
        i += 1


def picture(name, ox, oy, facing, c, w, h, z0, art=("terracotta", "linen")):
    p = placer(ox, oy, facing, c)
    p(f"{name}_frame", 0, 0, z0, w, 0.03, z0 + h, "black", bevel=0.003)
    p(f"{name}_canvas", 0.03, 0.03, z0 + 0.03, w - 0.03, 0.034, z0 + h - 0.03,
      art[1], bevel=0)
    p(f"{name}_art", w * 0.25, 0.034, z0 + h * 0.3, w * 0.7, 0.036, z0 + h * 0.75,
      art[0], bevel=0)


def rug(name, x0, y0, x1, y1, c, m="rug"):
    box(name, x0, y0, 0.01, x1, y1, 0.022, m, c, bevel=0.006)


def floor_lamp(name, x, y, c, shade="shade", watts=35):
    cylinder(f"{name}_foot", x, y, 0, 0.03, 0.15, "black", c)
    cylinder(f"{name}_pole", x, y, 0.03, 1.45, 0.012, "black", c, segments=8)
    cylinder(f"{name}_shade", x, y, 1.35, 1.65, 0.22, shade, c, r_top=0.17)
    point_light(f"{name}_bulb", x, y, 1.5, watts, c)


def table_lamp(name, x, y, z, c, watts=18):
    cylinder(f"{name}_foot", x, y, z, z + 0.25, 0.05, "pot_dark", c, r_top=0.03)
    cylinder(f"{name}_shade", x, y, z + 0.22, z + 0.42, 0.13, "shade", c, r_top=0.1)
    point_light(f"{name}_bulb", x, y, z + 0.32, watts, c, radius=0.04)


def hotspot(name, x, y, z=1.3):
    e = bpy.data.objects.new(f"HS_{name}", None)
    e.empty_display_type = "SPHERE"
    e.empty_display_size = 0.15
    e.location = (x, y, z)
    coll("Shell").objects.link(e)


# ---------------------------------------------------------------- build
def build_shell():
    c = "Shell"
    # Plinth the model stands on; it also carries the loggia.
    # A frame rather than a slab: the middle would sit under the floors, never
    # seen, and still take a quarter of the baked texture.
    x0, x1, y1 = -EXT - 0.12, W + EXT + 0.12, D + EXT + 0.12
    box("Base_Front", x0, -1.62, -0.18, x1, 0, 0, "base", c, bevel=0)
    box("Base_Back", x0, D, -0.18, x1, y1, 0, "base", c, bevel=0)
    box("Base_Left", x0, 0, -0.18, 0, D, 0, "base", c, bevel=0)
    box("Base_Right", W, 0, -0.18, x1, D, 0, "base", c, bevel=0)

    # Front facade: bedroom window, balcony door + window, kitchen window.
    wall("Wall_Front", "x", -EXT, 0, -EXT, W + EXT, c, inside=+1, openings=[
        (0.9, 2.7, SILL, HEAD, "window"),
        (4.25, 5.05, 0.0, HEAD, "glassdoor"),
        (5.25, 6.85, SILL, HEAD, "window"),
        (8.0, 10.0, SILL, HEAD, "window"),
    ])
    # Back facade: kids' room and study.
    wall("Wall_Back", "x", D, D + EXT, -EXT, W + EXT, c, inside=-1, openings=[
        (0.9, 2.7, SILL, HEAD, "window"),
        (7.6, 9.8, SILL, HEAD, "window"),
    ])
    # Staircase side: the front door.
    wall("Wall_Left", "y", -EXT, 0, 0, D, c, inside=+1, openings=[
        (4.05, 4.95, 0.0, DOOR, "entrance"),
    ])
    # Gable side: the study window.
    wall("Wall_Right", "y", W, W + EXT, 0, D, c, inside=-1, openings=[
        (5.8, 7.4, SILL, HEAD, "window"),
    ])

    # Bearing wall with the corridor passing through it.
    wall("Wall_Bearing", "y", X_BEAR - BEAR / 2, X_BEAR + BEAR / 2, 0, D, c,
         openings=[(Y_FRONT + 0.05, Y_HALL - 0.05, 0, DOOR, "opening")])

    # Partitions the renovation leaves alone.
    wall("Wall_Front_A", "x", Y_FRONT - PART / 2, Y_FRONT + PART / 2, 0, X_BEAR, c,
         openings=[(2.55, 3.35, 0, DOOR, "door", ("e", -1))])
    wall("Wall_Hall_A", "x", Y_HALL - PART / 2, Y_HALL + PART / 2, 0, X_BEAR, c,
         openings=[(2.55, 3.35, 0, DOOR, "door", ("e", +1))])
    wall("Wall_Hall_C", "x", Y_HALL - PART / 2, Y_HALL + PART / 2, X_STUDY, W, c,
         openings=[(7.0, 7.8, 0, DOOR, "door", ("s", +1))])
    wall("Wall_Study", "y", X_STUDY - PART / 2, X_STUDY + PART / 2, Y_HALL, D, c)

    # Service shaft: the risers every panel flat has in the same corner.
    box("Shaft", X_BEAR + BEAR / 2, 7.4, 0, 4.25, D, H, "wall", c, bevel=0)
    box("Shaft_cap", X_BEAR + BEAR / 2, 7.4, H, 4.25, D, H + 0.014, "cap", c, bevel=0)

    # Loggia: tiled slab and a low parapet.
    box("Loggia_Floor", 4.0, -1.5, 0, 7.3, -EXT, 0.012, "tile_loggia", c, bevel=0)
    wall("Loggia_Parapet", "x", -1.62, -1.5, 3.88, 7.42, c, height=1.0)
    wall("Loggia_SideL", "y", 3.88, 4.0, -1.5, -EXT, c, height=1.0)
    wall("Loggia_SideR", "y", 7.3, 7.42, -1.5, -EXT, c, height=1.0)

    hotspot("Loznice", 1.8, 1.9)
    hotspot("Kuchyne", 7.0, 1.9)
    hotspot("Koupelna", 5.0, 6.5)
    hotspot("Detsky", 1.8, 6.6)
    hotspot("Pracovna", 8.6, 6.6)


def build_before():
    c = "Before"
    box("Floor_Before_Loznice", 0, 0, 0, X_BEAR, Y_FRONT, 0.01, "parquet", c, bevel=0)
    box("Floor_Before_Obyvak", X_BEAR, 0, 0, X_KITCHEN, Y_FRONT, 0.01, "parquet", c, bevel=0)
    box("Floor_Before_Kuchyne", X_KITCHEN, 0, 0, W, Y_FRONT, 0.01, "lino", c, bevel=0)
    box("Floor_Before_Chodba", 0, Y_FRONT, 0, W, Y_HALL, 0.01, "lino", c, bevel=0)
    box("Floor_Before_Detsky", 0, Y_HALL, 0, X_BEAR, D, 0.01, "parquet", c, bevel=0)
    box("Floor_Before_Jadro", X_BEAR, Y_HALL, 0, 5.6, D, 0.01, "tile_old", c, bevel=0)
    box("Floor_Before_Komora", 5.6, Y_HALL, 0, X_STUDY, D, 0.01, "lino", c, bevel=0)
    box("Floor_Before_Pokoj", X_STUDY, Y_HALL, 0, W, D, 0.01, "parquet", c, bevel=0)

    # The wall the renovation takes out, and the doors off the old corridor.
    wall("Wall_Kitchen", "y", X_KITCHEN - PART / 2, X_KITCHEN + PART / 2,
         0, Y_FRONT, c)
    wall("Wall_Front_BC_Before", "x", Y_FRONT - PART / 2, Y_FRONT + PART / 2,
         X_BEAR, W, c, openings=[(4.3, 5.1, 0, DOOR, "door", ("s", -1)),
                                 (7.7, 8.5, 0, DOOR, "door", ("e", -1))],
         door_material="old_kitchen")
    wall("Wall_Hall_B_Before", "x", Y_HALL - PART / 2, Y_HALL + PART / 2,
         5.6, X_STUDY, c, openings=[(5.7, 6.3, 0, DOOR, "door", ("s", +1))],
         door_material="old_kitchen")
    wall("Wall_Komora", "y", 5.6 - PART / 2, 5.6 + PART / 2, Y_HALL, D, c)

    # Umakart core: WC cell and bath cell behind 60 cm doors.
    wall("Core_Front", "x", Y_HALL - UMAKART / 2, Y_HALL + UMAKART / 2, X_BEAR, 5.55,
         c, material="umakart", door_material="umakart",
         openings=[(3.75, 4.35, 0, 1.95, "door", ("s", +1)),
                                          (4.75, 5.35, 0, 1.95, "door", ("e", +1))])
    wall("Core_Split", "y", 4.5 - UMAKART / 2, 4.5 + UMAKART / 2, Y_HALL, 7.3, c,
         material="umakart")
    wall("Core_Back", "x", 7.3, 7.3 + UMAKART, X_BEAR, 5.55, c, material="umakart")
    box("Bath_Old", 4.83, 5.7, 0, 5.53, 7.25, 0.5, "white", c, bevel=0.03)
    box("Bath_Old_in", 4.9, 5.77, 0.3, 5.46, 7.18, 0.505, "tile_old", c, bevel=0)
    box("Sink_Old", 4.54, 5.55, 0.75, 4.9, 6.0, 0.85, "white", c, bevel=0.02)
    box("Mirror_Old", 4.53, 5.6, 1.1, 4.54, 5.95, 1.5, "mirror", c, bevel=0)
    box("WC_Old", 3.85, 6.65, 0, 4.25, 7.15, 0.4, "white", c, bevel=0.05, soft=True)
    box("Cistern_Old", 3.8, 7.1, 0.8, 4.3, 7.27, 1.15, "white", c, bevel=0.02)

    # Closed kitchen: a short run on the gable wall, fridge, small table.
    kitchen("Kitchen_Old", W, 0.35, "-x", c, 2.8, old=True, sink_at=0.3, hob_at=1.7)
    box("Fridge_Old", 10.2, 3.2, 0, W, Y_FRONT - PART / 2, 1.55, "old_kitchen", c,
        bevel=0.04)
    table("Table_Old", 8.8, 1.3, "-x", c, w=1.0, d=0.75, top="old_counter",
          legs="brown")
    chair("Chair_Old1", 7.6, 2.05, "+x", c, m="old_green", legs="brown")
    chair("Chair_Old2", 8.2, 0.85, "+y", c, m="old_green", legs="brown")
    chair("Chair_Old3", 8.8, 2.75, "-y", c, m="old_green", legs="brown")

    # Living room: the wall unit with a CRT, a brown sofa, patterned rug.
    wx = X_BEAR + BEAR / 2
    box("WallUnit_L", wx, 0.4, 0, wx + 0.5, 1.3, 2.0, "brown", c, bevel=0.01)
    box("WallUnit_R", wx, 2.4, 0, wx + 0.5, 3.3, 2.0, "brown", c, bevel=0.01)
    box("WallUnit_M", wx, 1.3, 0, wx + 0.5, 2.4, 0.7, "brown", c, bevel=0.01)
    box("WallUnit_Top", wx, 1.3, 1.6, wx + 0.5, 2.4, 2.0, "brown", c, bevel=0.01)
    box("WallUnit_Glass", wx + 0.5, 0.5, 1.0, wx + 0.505, 1.2, 1.8, "glass", c, bevel=0)
    box("CRT", wx + 0.05, 1.55, 0.7, wx + 0.5, 2.15, 1.2, "crt", c, bevel=0.03)
    box("CRT_screen", wx + 0.5, 1.62, 0.76, wx + 0.505, 2.08, 1.12, "screen", c, bevel=0)
    rug("Rug_Old", 4.6, 0.7, 6.9, 3.2, c, m="old_red")
    sofa("Sofa_Old", X_KITCHEN - 0.05, 0.75, "-x", c, w=2.2, d=0.9, m="old_fabric")
    box("Coffee_Old", 5.1, 1.5, 0, 5.7, 2.4, 0.45, "brown", c, bevel=0.01)
    floor_lamp("Lamp_Old", 6.85, 3.55, c, shade="mustard")

    # Bedroom.
    bed("Bed_Old", 0, 2.95, "+x", c, frame="brown", cover="old_fabric", head="brown")
    box("Night_Old1", 0, 0.85, 0, 0.45, 1.3, 0.55, "brown", c)
    box("Night_Old2", 0, 3.0, 0, 0.45, 3.45, 0.55, "brown", c)
    wardrobe("Wardrobe_Old", X_BEAR - BEAR / 2, 0.3, "-x", c, 2.1, h=2.0, m="brown",
             handles=True)

    # Kids' room.
    bed("Bed_Kid_Old", 0, 6.15, "+x", c, w=0.9, l=1.9, frame="brown",
        cover="old_green", head="brown")
    table("Desk_Kid_Old", 2.2, D, "-y", c, w=1.1, d=0.6, top="brown_light", legs="brown")
    chair("Chair_Kid_Old", 1.45, 6.95, "+y", c, m="old_fabric", legs="brown")
    wardrobe("Wardrobe_Kid_Old", X_BEAR - BEAR / 2, 6.2, "-x", c, 1.6, h=1.9,
             m="brown_light", handles=True)

    # Third room: sofa bed and wardrobe.
    sofa("Sofa_Pokoj_Old", W, 5.45, "-x", c, w=1.9, d=0.85, m="old_green")
    wardrobe("Wardrobe_Pokoj_Old", X_STUDY + PART / 2, 7.9, "+x", c, 2.0, h=2.0,
             m="brown", handles=True)
    table("Desk_Pokoj_Old", 9.4, D, "-y", c, w=1.2, d=0.6, top="brown_light",
          legs="brown")

    # Pantry shelves.
    for i, z in enumerate((0.4, 0.9, 1.4, 1.9)):
        box(f"Komora_Shelf{i}", 5.68, 6.2, z - 0.02, X_STUDY - 0.07, D, z,
            "brown_light", c, bevel=0.003)

    # Corridor.
    box("Shoe_Old", 0.3, Y_HALL - 0.4, 0, 1.3, Y_HALL - 0.05, 0.9, "brown", c)
    box("Hall_Runner_Old", 3.9, 4.2, 0.01, 9.0, 4.8, 0.02, "old_red", c, bevel=0.004)

    # Heavy drapes and one sad plant on the kitchen table.
    curtain("Drape_Kid_L", "x", D - 0.1, 0.55, 1.05, c, material="old_fabric")
    curtain("Drape_Kid_R", "x", D - 0.1, 2.55, 3.05, c, material="old_fabric")
    prop("ceramic_vase_03", "Vase_Old", 8.4, 1.8, 0.75, 0.22, c)
    plant("Plant_Old", 9.4, 3.5, c, height=0.55)
    room_lights(c, dim=0.7)


def build_after():
    c = "After"
    box("Floor_After_Loznice", 0, 0, 0, X_BEAR, Y_FRONT, 0.01, "oak_floor", c, bevel=0)
    box("Floor_After_Obyvak", X_BEAR, 0, 0, W, Y_FRONT, 0.01, "oak_floor", c, bevel=0)
    box("Floor_After_Predsin", 0, Y_FRONT, 0, W, Y_HALL, 0.01, "oak_floor", c, bevel=0)
    box("Floor_After_Detsky", 0, Y_HALL, 0, X_BEAR, D, 0.01, "oak_floor", c, bevel=0)
    box("Floor_After_Koupelna", X_BEAR, Y_HALL, 0, X_STUDY, D, 0.01, "tile_bath", c,
        bevel=0)
    box("Floor_After_Pracovna", X_STUDY, Y_HALL, 0, W, D, 0.01, "oak_floor", c, bevel=0)

    # Corridor wall: a wide opening into the kitchen-living room.
    wall("Wall_Front_BC_After", "x", Y_FRONT - PART / 2, Y_FRONT + PART / 2,
         X_BEAR, W, c, openings=[(4.0, 7.4, 0, DOOR, "opening")])
    # Bathroom wall: one 80 cm door where the core had two narrow ones.
    wall("Wall_Hall_B_After", "x", Y_HALL - PART / 2, Y_HALL + PART / 2,
         X_BEAR, X_STUDY, c, openings=[(5.45, 6.25, 0, DOOR, "door", ("e", +1))])

    # ---- paint: one warm accent wall per room instead of white everywhere.
    # A skin a few millimetres thick on the shared wall, so "before" keeps
    # its own plain walls.
    # Only walls that face the camera are worth painting.
    wx = X_BEAR + BEAR / 2
    front = Y_FRONT - PART / 2
    box("Paint_Bedroom", 0, front - 0.004, 0, 2.48, front, H - 0.002,
        "paint_sage", c, bevel=0)
    box("Paint_Kids", X_BEAR - BEAR / 2 - 0.004, Y_HALL + PART / 2, 0,
        X_BEAR - BEAR / 2, D, H - 0.002, "paint_clay", c, bevel=0)
    box("Paint_Dining", 7.4, front - 0.004, 0, 9.55, front, H - 0.002,
        "paint_greige", c, bevel=0)

    # ---- bathroom walls tiled floor to ceiling, round the service shaft
    t, top = 0.008, H - 0.002
    for name, x0, y0, x1, y1 in (
        ("Bearing", wx, Y_HALL + PART / 2, wx + t, 7.4),
        ("ShaftFront", wx, 7.4 - t, 4.25, 7.4),
        ("ShaftSide", 4.25, 7.4, 4.25 + t, D),
        ("Back", 4.25, D - t, X_STUDY - PART / 2, D),
        ("Study", X_STUDY - PART / 2 - t, Y_HALL + PART / 2, X_STUDY - PART / 2, D),
        ("HallL", wx, Y_HALL + PART / 2, 5.45, Y_HALL + PART / 2 + t),
        ("HallR", 6.25, Y_HALL + PART / 2, X_STUDY - PART / 2, Y_HALL + PART / 2 + t),
    ):
        box(f"Tiles_{name}", x0, y0, 0, x1, y1, top, "tile_bath", c, bevel=0)

    # ---- kitchen-living room
    kitchen("Kitchen", W, 0.45, "-x", c, 2.75, sink_at=0.5, hob_at=1.75)
    tall_units("Kitchen_Tall", W, Y_FRONT - PART / 2, "-y", c, 1.25)
    table("Dining", 7.6, 0.8, "+y", c, w=0.9, d=2.0, top="oak", legs="black")
    for i, y in enumerate((1.2, 1.8, 2.4)):
        chair(f"Dining_W{i}", 7.15, y + 0.22, "+x", c)
        chair(f"Dining_E{i}", 8.95, y - 0.22, "-x", c)
    picture("Pic_Dining", 8.6, Y_FRONT - PART / 2, "-y", c, 0.8, 0.6, 1.25,
            art=("sage", "linen"))

    rug("Rug", 4.35, 0.75, 6.35, 3.25, c)
    sofa("Sofa", 6.5, 0.8, "-x", c, w=2.3, d=0.95, accent="terracotta")
    box("Coffee", 4.65, 1.55, 0, 5.2, 2.45, 0.38, "oak", c, bevel=0.01)
    prop("ceramic_vase_01", "Vase_Coffee", 4.92, 2.2, 0.38, 0.24, c)
    prop("wooden_bowl_02", "Bowl_Coffee", 4.9, 1.8, 0.38, 0.08, c)
    box("TV_Unit", wx, 1.0, 0.18, wx + 0.42, 3.0, 0.55, "oak", c, bevel=0.008)
    box("TV", wx, 1.4, 0.95, wx + 0.04, 2.6, 1.62, "screen", c, bevel=0.005)
    prop("ceramic_vase_03", "Vase_TV", wx + 0.2, 2.8, 0.55, 0.32, c)
    floor_lamp("Lamp_Living", 6.3, 0.45, c)
    plant("Plant_Living", 3.98, 0.42, c, height=1.35, big=True)
    plant("Plant_Kitchen", 10.5, 0.75, c, height=0.4, z=0.9)
    prop("wooden_bowl_02", "Bowl_Dining", 8.05, 1.8, 0.75, 0.09, c)
    # LED strip under the upper cabinets — the portfolio kitchens all have one.
    box("Kitchen_LED", W - 0.33, 0.5, 1.435, W - 0.3, 3.15, 1.445, "led", c, bevel=0)
    area_light("Kitchen_LED_light", W - 0.3, 1.83, 1.42, 0.08, 2.6, 30, c)

    # ---- bedroom
    bed("Bed", 0, 2.95, "+x", c, throw="sage")
    box("Night_L", 0, 0.85, 0, 0.45, 1.3, 0.5, "oak", c)
    box("Night_R", 0, 3.0, 0, 0.45, 3.45, 0.5, "oak", c)
    table_lamp("Lamp_Bed_L", 0.22, 1.07, 0.5, c)
    table_lamp("Lamp_Bed_R", 0.22, 3.22, 0.5, c)
    wardrobe("Wardrobe", X_BEAR - BEAR / 2, 0.25, "-x", c, 2.2)
    rug("Rug_Bed", 1.3, 0.9, 2.7, 3.4, c)
    picture("Pic_Bed", 0, 2.7, "+x", c, 1.1, 0.55, 1.3, art=("terracotta", "linen"))
    plant("Plant_Bed", 0.4, 0.4, c, height=0.75)

    # ---- bathroom: bath on the bearing wall, walk-in shower, vanity
    box("Bath", wx + 0.02, 5.25, 0, wx + 0.77, 6.95, 0.55, "white", c, bevel=0.04)
    box("Bath_in", wx + 0.08, 5.31, 0.35, wx + 0.71, 6.89, 0.555, "tile_bath", c,
        bevel=0.02)
    box("Bath_tap", wx + 0.02, 6.05, 0.55, wx + 0.1, 6.12, 0.7, "chrome", c, bevel=0)
    box("Shower_Glass", 5.35, 7.0, 0.0, 5.37, D, 2.0, "glass", c, bevel=0)
    box("Shower_Head", X_STUDY - PART / 2 - 0.15, 7.45, 1.85, X_STUDY - PART / 2,
        7.6, 1.9, "chrome", c, bevel=0)
    box("Vanity", 4.35, 7.48, 0.45, 5.25, D, 0.85, "oak", c, bevel=0.008)
    box("Basin", 4.45, 7.52, 0.85, 5.15, 7.95, 0.93, "white", c, bevel=0.02)
    box("Mirror", 4.4, D - 0.02, 1.1, 5.2, D, 1.85, "mirror", c, bevel=0)
    box("WC_Panel", X_STUDY - PART / 2 - 0.15, 5.9, 0, X_STUDY - PART / 2, 6.5,
        1.1, "tile_dark", c, bevel=0)
    box("WC", X_STUDY - PART / 2 - 0.55, 6.0, 0.3, X_STUDY - PART / 2 - 0.15, 6.4,
        0.45, "white", c, bevel=0.05, soft=True)
    box("Washer", 4.55, Y_HALL + PART / 2 + 0.02, 0, 5.15, Y_HALL + 0.67, 0.85,
        "white", c, bevel=0.02)
    plant("Plant_Bath", 5.1, 7.15, c, height=0.45)

    # ---- kids' room
    bed("Bed_Kid", 0, 6.2, "+x", c, w=0.9, l=2.0, cover="sage", head="oak",
        throw="mustard")
    table("Desk_Kid", 2.4, D, "-y", c, w=1.3, d=0.6, top="white", legs="oak")
    chair("Chair_Kid", 1.5, 6.9, "+y", c, m="navy")
    bookshelf("Shelf_Kid", X_BEAR - BEAR / 2, 6.3, "-x", c, 1.5, h=1.8, shelves=4)
    cylinder("Rug_Kid", 1.7, 6.75, 0.01, 0.022, 0.7, "rug", c, segments=40)
    box("Toys", 0.25, 7.3, 0, 0.75, 7.8, 0.4, "terracotta", c, bevel=0.02)
    table_lamp("Lamp_Kid", 2.2, 7.8, 0.75, c)
    curtain("Curtain_Kid_L", "x", D - 0.1, 0.55, 1.05, c)
    curtain("Curtain_Kid_R", "x", D - 0.1, 2.55, 3.05, c)

    # ---- study
    table("Desk", 9.7, D, "-y", c, w=2.0, d=0.65, top="oak", legs="black")
    box("Monitor", 8.5, 7.75, 1.0, 9.1, 7.78, 1.35, "screen", c, bevel=0.005)
    box("Monitor_foot", 8.75, 7.72, 0.75, 8.85, 7.8, 1.0, "black", c, bevel=0)
    office_chair("Chair_Office", 8.8, 7.0, c)
    bookshelf("Shelf_Study", X_STUDY + PART / 2, 7.85, "+x", c, 2.2, h=2.05)
    sofa("Armchair", W, 5.4, "-x", c, w=0.9, d=0.85, m="navy")
    floor_lamp("Lamp_Study", 10.45, 6.55, c)
    rug("Rug_Study", 7.6, 5.7, 9.9, 7.1, c)
    plant("Plant_Study", 7.3, 7.65, c, height=1.2, big=True)
    prop("ceramic_vase_01", "Vase_Desk", 9.5, 7.72, 0.75, 0.2, c)
    curtain("Curtain_Study", "y", W - 0.1, 7.25, 7.75, c)

    # ---- hallway
    wardrobe("Hall_Wardrobe", 2.45, Y_HALL - PART / 2, "-y", c, 1.6)
    picture("Pic_Hall", 8.9, Y_HALL - PART / 2, "-y", c, 0.9, 0.6, 1.25,
            art=("navy", "linen"))

    # ---- loggia
    chair("Loggia_Chair1", 5.4, -0.7, "+x", c, m="fabric")
    chair("Loggia_Chair2", 6.8, -1.14, "-x", c, m="fabric")
    cylinder("Loggia_Table", 6.1, -0.92, 0, 0.5, 0.25, "black", c)
    plant("Plant_Loggia1", 4.3, -1.2, c, height=0.85)
    plant("Plant_Loggia2", 7.0, -0.55, c, height=0.6)

    room_lights(c)


def room_lights(c, dim=1.0):
    """Soft ceiling light over each room, hidden from the camera."""
    for name, x, y, sx, sy, watts in (
        ("Living", 5.3, 1.9, 1.4, 1.4, 70), ("Dining", 8.4, 1.9, 1.2, 1.2, 55),
        ("Bedroom", 1.8, 1.9, 1.2, 1.2, 45), ("Kids", 1.8, 6.5, 1.1, 1.1, 40),
        ("Bath", 5.0, 6.5, 1.0, 1.0, 35), ("Study", 8.6, 6.5, 1.2, 1.2, 45),
        ("Hall", 5.4, 4.5, 3.0, 0.5, 30),
    ):
        light = area_light(f"Ceiling_{name}_{c}", x, y, H - 0.05, sx, sy, watts * dim * 0.6, c)
        light.visible_camera = False


# ---------------------------------------------------------------- underlay
# The drawing sheet under the model: grid axes with their bubbles, dimension
# lines in millimetres, and the faint outline of the neighbouring flat — the
# plan the renovation starts from.
Z_INK = -0.1795
INK = ("#B3ACA1", 1.0)
PALETTE["ink"] = INK


def ink_line(name, x0, y0, x1, y1, w=0.014):
    dx, dy = x1 - x0, y1 - y0
    n = math.hypot(dx, dy)
    ox, oy = -dy / n * w / 2, dx / n * w / 2
    verts = [(x0 + ox, y0 + oy, Z_INK), (x1 + ox, y1 + oy, Z_INK),
             (x1 - ox, y1 - oy, Z_INK), (x0 - ox, y0 - oy, Z_INK)]
    mesh = bpy.data.meshes.new(name)
    mesh.from_pydata(verts, [], [(0, 3, 2, 1)])
    return link(bpy.data.objects.new(name, mesh), "ink", "Underlay")


def dashed(name, x0, y0, x1, y1, dash=0.5, gap=0.15, dot=0.05):
    """Chain line, the way grid axes are drawn."""
    n = math.hypot(x1 - x0, y1 - y0)
    ux, uy = (x1 - x0) / n, (y1 - y0) / n
    s, i = 0.0, 0
    while s < n:
        e = min(n, s + dash)
        ink_line(f"{name}_{i}", x0 + ux * s, y0 + uy * s, x0 + ux * e, y0 + uy * e)
        d = e + gap
        if d + dot < n:
            ink_line(f"{name}_d{i}", x0 + ux * d, y0 + uy * d,
                     x0 + ux * (d + dot), y0 + uy * (d + dot))
        s = d + dot + gap
        i += 1


def ink_ring(name, x, y, r=0.32, w=0.014, segments=40):
    verts, faces = [], []
    for i in range(segments):
        a = 2 * math.pi * i / segments
        for rr in (r - w / 2, r + w / 2):
            verts.append((x + rr * math.cos(a), y + rr * math.sin(a), Z_INK))
    for i in range(segments):
        j = (i + 1) % segments
        faces.append((2 * i, 2 * j, 2 * j + 1, 2 * i + 1))
    mesh = bpy.data.meshes.new(name)
    mesh.from_pydata(verts, [], faces)
    return link(bpy.data.objects.new(name, mesh), "ink", "Underlay")


def ink_text(name, body, x, y, size=0.3, rot=0.0):
    curve = bpy.data.curves.new(name, "FONT")
    curve.body = body
    curve.size = size
    curve.align_x = "CENTER"
    curve.align_y = "CENTER"
    tmp = bpy.data.objects.new(f"{name}_tmp", curve)
    bpy.context.scene.collection.objects.link(tmp)
    mesh = evaluated_mesh(tmp)
    bpy.data.objects.remove(tmp, do_unlink=True)
    obj = bpy.data.objects.new(name, mesh)
    obj.location = (x, y, Z_INK)
    obj.rotation_euler = (0, 0, rot)
    return link(obj, "ink", "Underlay")


def dimension(name, axis, at, stops):
    """A dimension chain: line, 45° ticks at each stop, lengths in mm."""
    for i, (a, b) in enumerate(zip(stops, stops[1:])):
        mid = (a + b) / 2
        label = f"{round((b - a) * 1000):,}".replace(",", " ")
        if axis == "x":
            ink_line(f"{name}_l{i}", a, at, b, at)
            ink_text(f"{name}_t{i}", label, mid, at + 0.25, size=0.26)
        else:
            ink_line(f"{name}_l{i}", at, a, at, b)
            ink_text(f"{name}_t{i}", label, at - 0.25, mid, size=0.26, rot=math.pi / 2)
    for i, s in enumerate(stops):
        if axis == "x":
            ink_line(f"{name}_k{i}", s - 0.1, at - 0.1, s + 0.1, at + 0.1, w=0.02)
            ink_line(f"{name}_e{i}", s, at - 0.25, s, at + 0.25)
        else:
            ink_line(f"{name}_k{i}", at - 0.1, s - 0.1, at + 0.1, s + 0.1, w=0.02)
            ink_line(f"{name}_e{i}", at - 0.25, s, at + 0.25, s)


def build_underlay():
    cols = {"A": -EXT / 2, "B": X_BEAR, "C": X_STUDY, "D": W + EXT / 2}
    rows = {"1": -EXT / 2, "2": Y_FRONT, "3": Y_HALL, "4": D + EXT / 2}
    y_lo, y_hi = -5.2, D + 3.2
    x_lo, x_hi = -4.2, W + 3.2
    for label, x in cols.items():
        dashed(f"Axis_{label}", x, y_lo + 0.4, x, y_hi)
        ink_ring(f"Axis_{label}_ring", x, y_lo)
        ink_text(f"Axis_{label}_txt", label, x, y_lo, size=0.34)
    for label, y in rows.items():
        dashed(f"Axis_{label}", x_lo + 0.4, y, x_hi, y)
        ink_ring(f"Axis_{label}_ring", x_lo, y)
        ink_text(f"Axis_{label}_txt", label, x_lo, y, size=0.34)

    # Chains along the front and the staircase side.
    dimension("Dim_Front_total", "x", -3.9, [-EXT, W + EXT])
    dimension("Dim_Front", "x", -3.2, [-EXT, X_BEAR, X_KITCHEN, W + EXT])
    dimension("Dim_Side_total", "y", -2.9, [-EXT, D + EXT])
    dimension("Dim_Side", "y", -2.2, [-EXT, Y_FRONT, Y_HALL, D + EXT])

    # Neighbouring flat across the staircase, drawn as a ghost.
    for i, (x0, y0, x1, y1) in enumerate((
        (-9.0, -EXT, -1.6, -EXT), (-9.0, D + EXT, -1.6, D + EXT),
        (-5.4, -EXT, -5.4, 3.0), (-9.0, Y_FRONT, -1.6, Y_FRONT),
        (-7.2, Y_HALL, -7.2, D + EXT), (W + EXT, D + 1.4, W + 2.6, D + 1.4),
    )):
        ink_line(f"Ghost_{i}", x0, y0, x1, y1)
    ink_text("Sheet_title", "BYT 4+kk  —  NÁVRH DISPOZICE  1:50", W - 1.2, -5.0,
             size=0.3)


# ---------------------------------------------------------------- stage
def build_stage():
    c = "Stage"
    box("Ground", -30, -30, -0.2, 40, 40, -0.18, "ground", c, bevel=0)

    sun = bpy.data.lights.new("Sun", "SUN")
    sun.energy = 6.0
    sun.angle = math.radians(3)
    sun.color = (1.0, 0.94, 0.86)  # late-afternoon warmth
    sun_obj = bpy.data.objects.new("Sun", sun)
    # Low afternoon sun: it slants in through the facade windows and lays
    # bright patches on the floors instead of lighting every room from above.
    sun_obj.rotation_euler = (math.radians(58), 0, math.radians(-28))
    coll(c).objects.link(sun_obj)

    world = bpy.data.worlds.new("World")
    world.use_nodes = True
    bg = world.node_tree.nodes["Background"]
    bg.inputs["Color"].default_value = (0.86, 0.88, 0.9, 1)
    bg.inputs["Strength"].default_value = 0.7
    bpy.context.scene.world = world

    target = bpy.data.objects.new("Target", None)
    target.location = (W / 2, D / 2 - 0.3, 0.0)
    coll(c).objects.link(target)

    cam = bpy.data.cameras.new("Camera")
    cam.lens = 50
    cam_obj = bpy.data.objects.new("Camera", cam)
    direction = (-0.45, -1.0, 1.55)
    n = math.sqrt(sum(v * v for v in direction))
    dist = 28.5
    cam_obj.location = tuple(t + v / n * dist for t, v in
                             zip(target.location, direction))
    track = cam_obj.constraints.new("TRACK_TO")
    track.target = target
    coll(c).objects.link(cam_obj)
    bpy.context.scene.camera = cam_obj


def use_gpu():
    """OptiX/CUDA when there is an NVIDIA card; stays on CPU otherwise."""
    prefs = bpy.context.preferences.addons["cycles"].preferences
    for kind in ("OPTIX", "CUDA", "HIP", "ONEAPI"):
        try:
            prefs.compute_device_type = kind
        except TypeError:
            continue
        prefs.get_devices()
        gpus = [d for d in prefs.devices if d.type == kind]
        if gpus:
            for d in prefs.devices:
                d.use = d.type == kind
            bpy.context.scene.cycles.device = "GPU"
            return kind
    return "CPU"


def render(state, path):
    scene = bpy.context.scene
    coll("Before").hide_render = state != "before"
    coll("After").hide_render = state != "after"
    scene.render.engine = "CYCLES"
    use_gpu()
    scene.cycles.samples = 96
    scene.cycles.use_denoising = True
    scene.cycles.max_bounces = 4
    try:
        scene.view_settings.look = "AgX - Medium High Contrast"
    except TypeError:
        pass
    scene.render.resolution_x = 1600
    scene.render.resolution_y = 1000
    scene.render.filepath = path
    bpy.ops.render.render(write_still=True)


def main():
    reset()
    build_shell()
    build_before()
    build_after()
    build_underlay()
    build_stage()
    # Open on the renovated flat; "before" is one click away in the outliner.
    bpy.context.view_layer.layer_collection.children["Before"].hide_viewport = True
    os.makedirs(OUT, exist_ok=True)
    if "--render" in ARGS:
        render("after", os.path.join(OUT, "preview_after.png"))
        render("before", os.path.join(OUT, "preview_before.png"))
    if "--blend" in ARGS:
        coll("Before").hide_render = True
        coll("After").hide_render = False
        bpy.ops.wm.save_as_mainfile(filepath=os.path.join(OUT, "apartment.blend"))


main()
