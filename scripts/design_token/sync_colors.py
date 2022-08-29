import os

from vika import Vika
from re import sub

def camel(s):
  s = sub(r"(_|-)+", " ", s).title().replace(" ", "")
  return ''.join([s[0].lower(), s[1:]])

vika = Vika("uskbjQCFxC20nhd9jK8H4uC")
vika.request.verify = False
vika.set_api_base("https://integration.vika.ltd")
color_dst = vika.datasheet("dstV60KrXm1GY0eKWu")

# 全部颜色视图
all_colors = color_dst.records.all(viewId="viw9LTozrPiiu")
all_theme_fields = color_dst.fields.all()

themes = set()
for theme_field in all_theme_fields:
    if theme_field.name.startswith('theme'):
        theme_name = theme_field.name.split('_')[1]
        themes.add(theme_name)

print(themes)

palette_colors = all_colors.filter(type="调色板")
rainbow_colors = all_colors.filter(type="彩虹色")
font_colors = all_colors.filter(type="FC")
dark_colors = all_colors.filter(type="DC")

color_colors = all_colors.filter(type="Color")
effect_colors = all_colors.filter(type="Effect")

camel_colors = [i for i in color_colors] + [i for i in effect_colors]


all_hues = set([color.hue for color in palette_colors])
all_hues = list(all_hues)
all_hues.sort()


def hex2rgb(hex):
    if hex.startswith('#'):
        hex = hex[1:]
    if len(hex) == 3:
        hex = ''.join([x * 2 for x in hex])
    return ", ".join([str(int(hex[i:i + 2], 16)) for i in (0, 2, 4)])


# 生成 ts 的色板引用关系
def make_color_ref():
    """
    font color 到调色板的映射关系。fc => 调色板。
    fc 是设计常用的颜色，业务代码中可以不使用语义化的命名，和设计保持同步。看到设计稿上是啥颜色，直接用即可，无须再命名。
    1. 获取 font color 的 real_token
    2. font_color.real_token ==  palette_color.token => palette
    3. 生成 fc 对 palette 的引用
    """
    palette_token_color_map = {
        color.token[0]: color
        for color in palette_colors
    }
    # print(palette_token_color_map)
    imported_hue = set()
    import_str = ""
    for theme in themes:
        export_str = ""

        for rc in rainbow_colors:
            if getattr(rc, f"theme_{theme}_value"):
                value = getattr(rc, f"theme_{theme}_value")[0]
                export_str += f"export const {rc.name} = '{value}';\n"

        for c in camel_colors:
            theme_value = getattr(c, f"{theme}ThemeFinalValue")
            if theme_value is not None:
                value = theme_value[0] if isinstance(theme_value, list) else theme_value
                export_str += f"export const {camel(c.name)} = '{value}';\n"

        for fc in font_colors:
            if getattr(fc, f"theme_{theme}_value"):
                theme_theme = getattr(fc, f"theme_{theme}")
                theme_theme_value = getattr(fc, f"theme_{theme}_value")
                value = theme_theme[0] if theme_theme is not None else theme_theme_value[0] if isinstance(theme_theme_value, list) else theme_theme_value
                if value.startswith('rec'):
                    palette_color = palette_token_color_map[value]
                    if palette_color.hue not in imported_hue:
                        import_str += f"import {{ {palette_color.hue} }} from './base/{palette_color.hue}';\n"
                        imported_hue.add(palette_color.hue)
                    color_value = f"{palette_color.hue}[{palette_color.shade}]"
                    export_str += f'export const {fc.name} = {color_value};\n'
                    # color_ref
                    if fc.alias:
                        for each_alias in fc.alias:
                            export_str += f'export const {each_alias} = {color_value};\n'
                else:
                    export_str += f"export const {fc.name} = '{value}';\n"
                    # color_ref
                    if fc.alias:
                        for each_alias in fc.alias:
                            export_str += f"export const {each_alias} = '{value}';\n"

        color_ref_str = import_str + '\n' + export_str
        color_ref_path = os.path.normpath(
            os.path.join(
                os.getcwd(),
                f"./packages/components/src/colors/{theme}.ts",
            ))
        with open(color_ref_path, 'w') as f:
            f.write(color_ref_str)


def get_hue_shade_value(hue, shade):
    color = palette_colors.get(hue=hue, shade=str(shade))
    return color.value[0]


def sync_components_color():
    """
    1. 同步基础色板 packages/components/src/colors/base
    2. 同步主题色板 packages/components/src/colors/<theme>.ts
    """
    print("开始同步颜色到 components 中")

    export_index = ""
    for hue in all_hues:
        color_file_content = f"""
export const {hue} = {{
  50: '{get_hue_shade_value(hue,50)}',
  100: '{get_hue_shade_value(hue,100)}',
  200: '{get_hue_shade_value(hue,200)}',
  300: '{get_hue_shade_value(hue,300)}',
  400: '{get_hue_shade_value(hue,400)}',
  500: '{get_hue_shade_value(hue,500)}',
  600: '{get_hue_shade_value(hue,600)}',
  700: '{get_hue_shade_value(hue,700)}',
  800: '{get_hue_shade_value(hue,800)}',
  900: '{get_hue_shade_value(hue,900)}',
  1000: '{get_hue_shade_value(hue,1000)}',
}};

"""
        export_index += f"export * from './{hue}';\n"
        color_path = os.path.normpath(
            os.path.join(os.getcwd(), "./packages/components/src/colors/base",
                         f"{hue}.ts"))
        with open(color_path, 'w') as f:
            f.write(color_file_content)
            print("done🎉", color_path)
    base_color_index_path = os.path.normpath(
        os.path.join(os.getcwd(),
                     "./packages/components/src/colors/base/index.ts"))
    with open(base_color_index_path, 'w') as f:
        f.write(export_index)
    make_color_ref()
    print("同步颜色到 components 完毕")


def sync_color2dst():
    print("开始同步颜色到 datasheet 项目中")
    for theme in themes:
        ts_colors = [i for i in rainbow_colors] + [i for i in font_colors] + [i for i in dark_colors]

    def get_hue_shade_value(hue, shade):
        color = palette_colors.get(hue=hue, shade=str(shade))
        return color.value[0]

    less_colors = ""
    # shades = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 1000]
    # for hue in all_hues:
    #     for shade in shades:
    #         # less_colors_head += f"\n  --{hue}-{shade}: {get_hue_shade_value(hue,shade)};"
    #         less_colors += f"\n@{hue}_{shade}: {get_hue_shade_value(hue,shade)};"

    print(themes)
    print(f"开始同步 {theme} 主题的颜色")
    # 生成 lib_colors.css 文件
    less_base_colors_head = f':root {{'

    # 基础色板 TODO: 删除，这个是为了兼容旧代码。
    shades = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 1000]
    for hue in all_hues:
        for shade in shades:
            less_base_colors_head += f"\n  --{hue}_{shade}: {get_hue_shade_value(hue,shade)};"
    less_base_colors_head += "\n}\n"
    less_root_color = less_base_colors_head

    for theme in themes:
        less_colors_head = f':root[data-theme="{theme}"] {{'
        
        # 其他颜色
        for c in ts_colors:
            theme_value = getattr(c, f"theme_{theme}_value")
            if theme_value is not None:
                value = theme_value[0] if isinstance(theme_value, list) else theme_value
                name = c.name
                less_colors_head += f"\n  --{name}: {value};"
                if value.startswith("#"):
                    less_colors_head += f"\n  --{name}-rgb: {hex2rgb(value)};"

            # less_colors += f"\n@{name}: {value};"
        # fc 的别名也写进去
        for fc in font_colors:
            theme_value = getattr(fc, f"theme_{theme}_value")
            if fc.alias and theme_value is not None:
                value = theme_value[0] if isinstance(theme_value, list) else theme_value
                for each_alias in fc.alias:
                    less_colors_head += f"\n  --{each_alias}: {value};"
                    if value.startswith("#"):
                        less_colors_head += f"\n  --{each_alias}-rgb: {hex2rgb(value)};"
                    # less_colors += f"\n@{each_alias}: {value};"

        for c in camel_colors:
            theme_value = getattr(c, f"{theme}ThemeFinalValue")
            if theme_value is not None:
                value = theme_value[0] if isinstance(theme_value, list) else theme_value
                name = camel(c.name)
                less_colors_head += f"\n  --{name}: {value};"
                if value.startswith("#"):
                    less_colors_head += f"\n  --{name}-rgb: {hex2rgb(value)};"

        less_colors_head += "\n  --lightMaskColor: rgba(38,38,38,0.1);"
        less_colors_head += "\n}\n"
        less_root_color += less_colors_head
        # TODO: 删掉
        # less_colors_head += less_colors

    # less_colors_head 是 css 变量定义，暂时先不写了。取决于实现 less 主题的方案。
    color_path = os.path.normpath(
        os.path.join(os.getcwd(),
                     "./packages/datasheet/src/pc/styles/lib_colors.css"))
    with open(color_path, 'w') as f:
        f.write(less_colors + less_root_color)
        # f.write(less_colors)
    print("lib_colors.css 生成完毕")
    print("同步颜色到 datasheet 完毕")
    widget_stage_color_path = os.path.normpath(os.path.join(os.getcwd(),"./packages/widget-stage/src/styles/lib_colors.css"))
    with open(widget_stage_color_path,'w') as f:
        f.write(less_colors + less_root_color)
    print("lib_colors.css 生成完毕")
    print("同步颜色到 widget-stage 完毕")


def sync_color2core():
    """同步颜色到 core 中，现在 API 需要解析选项颜色值。 core 里面也要同步一份🌈色。
    """
    tmp = """
// WARN: 这份颜色文件是由脚本生成和同步的，不要手动修改!!!
export const COLOR_MAP = {"""
    for hue in all_hues:
        tmp += f"\n  {hue}: '{get_hue_shade_value(hue,500)}',"
    tmp += "\n};"
    color_path = os.path.normpath(
        os.path.join(os.getcwd(), "./packages/core/src/model/_colors.ts"))
    with open(color_path, 'w') as f:
        f.write(tmp)
    print("同步彩虹色到 core 中")


if __name__ == "__main__":
    sync_components_color()
    sync_color2dst()
    sync_color2core()
