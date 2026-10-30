"""
Denoises one raw lightmap and writes it through the display transform.

    blender --background --factory-startup --python denoise.py -- in.exr out.png

Cycles has no denoiser for bakes, but the compositor's (Open Image Denoise)
works on any image. It runs in its own Blender process so the compositor
does not have to render the apartment scene along with it.
"""

import sys

import bpy

src, dst = sys.argv[sys.argv.index("--") + 1:][:2]

scene = bpy.context.scene
# An empty stage: the compositor reads the image node only, but a render
# still needs a camera — keep that, drop everything else, and let Workbench
# "render" the nothing in an instant.
for obj in list(scene.objects):
    if obj.type != "CAMERA":
        bpy.data.objects.remove(obj, do_unlink=True)
scene.render.engine = "BLENDER_WORKBENCH"

image = bpy.data.images.load(src)
width, height = image.size
scene.render.resolution_x = width
scene.render.resolution_y = height
scene.render.resolution_percentage = 100

tree = bpy.data.node_groups.new("Denoise", "CompositorNodeTree")
tree.interface.new_socket("Image", in_out="OUTPUT", socket_type="NodeSocketColor")
scene.compositing_node_group = tree
node_image = tree.nodes.new("CompositorNodeImage")
node_image.image = image
denoise = tree.nodes.new("CompositorNodeDenoise")
output = tree.nodes.new("NodeGroupOutput")
tree.links.new(node_image.outputs["Image"], denoise.inputs["Image"])
tree.links.new(denoise.outputs["Image"], output.inputs[0])
scene.render.use_compositing = True

# The same look as the preview renders, so page and render match.
scene.view_settings.view_transform = "AgX"
try:
    scene.view_settings.look = "AgX - Medium High Contrast"
except TypeError:
    pass

settings = scene.render.image_settings
settings.file_format = "PNG"
settings.color_mode = "RGB"
settings.color_depth = "8"
scene.render.filepath = dst
bpy.ops.render.render(write_still=True)
