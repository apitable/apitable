import os
import re
import shutil
from xml.dom import Node, minidom

from vika import Vika

from const import ICON_DATASHEET_ID, INTEGRATION_API_TOKEN

debug = False
icons_pkg_path = os.path.normpath(
    os.path.join(os.getcwd(), './packages/icons'))
output_dir = os.path.join(icons_pkg_path, 'src/components')
output_hide_doc_dir = os.path.join(icons_pkg_path, 'src/doc_hide_components')


# 0. 获取基础属性
# 1. 清理不必要的属性
# 2. 收集颜色
# 3. 转换成 string，替换颜色。

def covert_name(snake_name: str) -> str:
    return "".join([i.title() for i in snake_name.split("_")])


# def handle_part_svg_color(doc, shape, colors):
#     res = ""
#     for shape in doc.getElementsByTagName(shape):
#         for attr in ['stroke','fill']:
#           color = shape.getAttribute(attr)
#           if color:
#             color_index = colors.index(color)
#             shape.setAttribute(attr, f"{{ colors[{color_index}] }}")
#         if shape.hasAttribute("class"):
#             shape.removeAttribute("class")
#         res += shape.toprettyxml(indent=" "*2)
#     res = re.sub(r'fill="{ colors\[(\d+)\] }"',r'fill={ colors[\1] }',res)
#     res = re.sub(r'stroke="{ colors\[(\d+)\] }"',r'stroke={ colors[\1] }',res)
#     return res


def collect_svg_part_color(doc, shape, colors):
    for shape in doc.getElementsByTagName(shape):
        fill_color = shape.getAttribute('fill')
        stroke_color = shape.getAttribute('stroke')
        if fill_color:
            colors.add(fill_color)
        if stroke_color:
            colors.add(stroke_color)


def get_svg_base_attrs(svg):
    res = ''
    size = svg.getAttribute('viewBox').split(' ')[-1]
    res += f"width: '{size}',\n"
    res += f"  height: '{size}',\n"
    res += f"  viewBox: '0 0 {size} {size}',"
    return res


def parse_svg(svg_content: str) -> str:
    colors = set()
    res = ""
    doc = minidom.parseString(svg_content)
    svg = doc.getElementsByTagName('svg')[0]
    # 获取基础属性
    base_attrs = get_svg_base_attrs(svg)
    # 收集颜色
    right_shape = ["path", "rect", "circle",
                   "ellipse", "line", "polyline", "polygon", "mask"]
    for shape in right_shape:
        collect_svg_part_color(doc, shape, colors)

    colors = list(colors)
    colors.sort()
    all_path_data = []

    # 递归处理
    def handle_node(node):
        if node.nodeType == Node.TEXT_NODE:
            return
        if node.tagName == 'path':
            all_path_data.append(node.getAttribute('d'))
        for k, v in node.attributes.items():
            if '-' in k and k != 'mask-type':
                node.removeAttribute(k)
                names = k.split('-')
                new_key = names[0] + \
                    "".join([name.title() for name in names[1:]])
                node.setAttribute(new_key, v)

        if node.hasAttribute("class"):
            node.removeAttribute("class")
        for attr in ['stroke', 'fill']:
            color = node.getAttribute(attr)
            if color and color != 'none':
                color_index = colors.index(color)
                node.setAttribute(attr, f"{{ colors[{color_index}] }}")

    def visit_child_nodes(node):
        handle_node(node)
        if node.hasChildNodes():
            for node in node.childNodes:
                handle_node(node)

    visit_child_nodes(svg)

    for node in svg.childNodes:
        if node.nodeType != Node.TEXT_NODE:
            res += node.toprettyxml()

    res = re.sub(r'fill="{ colors\[(\d+)\] }"', r'fill={ colors[\1] }', res)
    res = re.sub(r'stroke="{ colors\[(\d+)\] }"',
                 r'stroke={ colors[\1] }', res)
    return [res, all_path_data, colors, base_attrs]


def svg2react_component(icon, hide_doc=False):
    # svg_filename = os.path.basename(svg_filepath)
    # svg_name = svg_filename.split(".svg")[0]
    component_name = covert_name(icon.component_name)
    [svg_path, all_path_data, colors, base_attrs] = parse_svg(icon.svg_content)
    is_colorful = len(colors) > 1

    svg_component_text = f"""
/* eslint-disable max-len */
import React from 'react';
import {{ makeIcon, IIconProps }} from '../utils/icon';

export const {component_name}: React.FC<IIconProps> = makeIcon({{
    Path: ({{ colors }}) => <>
    {svg_path}
  </>,
  name: '{icon.component_name}',
  defaultColors: {str(colors)},
  colorful: {'true' if is_colorful else 'false'},
  allPathData: {str(all_path_data)},
  {base_attrs}
}});
"""

    if hide_doc == True:
        output_path = os.path.join(output_hide_doc_dir, f'{icon.component_name}.tsx')
    else:
        output_path = os.path.join(output_dir, f'{icon.component_name}.tsx')
    if not debug:
        with open(output_path, 'w') as f:
            f.write(svg_component_text)
            print(f"🎉 {icon.component_name} make done")


if __name__ == "__main__":
    if not os.path.exists(output_dir):
        os.mkdir(output_dir)
    shutil.rmtree(output_dir)
    os.mkdir(output_dir)

    if not os.path.exists(output_hide_doc_dir):
        os.mkdir(output_hide_doc_dir)
    shutil.rmtree(output_hide_doc_dir)
    os.mkdir(output_hide_doc_dir)

    vika = Vika(INTEGRATION_API_TOKEN)
    vika.set_api_base("https://integration.vika.ltd")
    icons = vika.datasheet(ICON_DATASHEET_ID)

    export_text = ""
    export_path = os.path.join(output_dir, 'index.ts')
    export_doc_hide_text = ""
    export_doc_hide_path = os.path.join(output_hide_doc_dir, 'index.ts')
    all_icons = icons.records.all(viewId="viwALdHKj4MyQ")

    for icon in all_icons:
        try:
            is_doc_hide = icon.json().get('is_doc_hide', False)
            if icon.svg_content:
                component_name = covert_name(icon.component_name)
                if is_doc_hide:
                    svg2react_component(icon, True)
                    export_doc_hide_text += f"export {{ {component_name} }} from './{icon.component_name}';\n"
                else:
                    svg2react_component(icon, False)
                    export_text += f"export {{ {component_name} }} from './{icon.component_name}';\n"
        except Exception as e:
            print(icon.component_name, e)
    if not debug:
        with open(export_doc_hide_path, 'w') as f:
            f.write(export_doc_hide_text)
        with open(export_path, 'w') as f:
            f.write(export_text)
