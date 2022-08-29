import time
from vika import Vika
from vika.exceptions import RecordDoesNotExist
from datetime import datetime
from figma import Figma, FigmaHelper

file_key = "VjmhroWol6uCMqhDcJVrxV"
color_node_id = "18:11"
effect_node_id = "0:1"

vika = Vika("uskbjQCFxC20nhd9jK8H4uC")
vika.set_api_base("https://integration.vika.ltd")
design_tokens = vika.datasheet("dst1uWJuwDci5HEsTb", field_key="name").records.all()

node_styles = {}

figma = Figma("163193-f1e345cc-3c93-43cb-895e-7be9707797fb")

# colors = vika.datasheet("dstV60KrXm1GY0eKWu", field_key="name").records.all()
# token_colors = vika.datasheet("dst1uWJuwDci5HEsTb").records.all(viewId="viwKW102lIYTS")

# for token_color in token_colors:
#     name = token_color.name.split("/")[2]
#     first, *rest, shade = name.split(" ")
#     new_name_list = [first.lower()] + rest
#     new_name = "".join(new_name_list) + "/" + shade
#     color = colors.get(name=new_name)
#     color.token = [token_color._id]
#     time.sleep(1 / 5)


def collect_node_styles(node):
    if node.get("styles"):
        if node["styles"].get("fill") and node["fills"]:
            if node["fills"][0]["type"] == "SOLID":
                node_styles[node["styles"]["fill"]] = FigmaHelper.color2string(
                    node["fills"][0]["color"],
                    node["fills"][0].get('opacity',1.0)
                )
        if node["styles"].get("effect"):
            if node["effects"][0]["type"].endswith("SHADOW"):
                node_styles[
                    node["styles"]["effect"]
                ] = FigmaHelper.shadow_effect2box_shadow(node["effects"][0])
    if node.get("children"):
        for _node in node["children"]:
            collect_node_styles(_node)


def should_update_token(style, token_record):
    return True
    if style.get("updated_at"):
        last_token_updatetime = datetime.strptime(
            style["updated_at"], "%Y-%m-%dT%H:%M:%S.%fZ"
        )
        last_dst_record_updatetime = datetime.fromtimestamp(
            token_record.update_at / 1000
        )
        return last_dst_record_updatetime < last_token_updatetime
    return False


def get_record_data(data):
    return {
        "name": data["name"],
        "key": data["key"],
        "file_key": data["file_key"],
        "node_id": data["node_id"],
        "style_type": data["style_type"],
        "value"
        "description": data["description"],
    }


def sync_effect_token(styles_key_map):
    r = figma.file_nodes(file_key, effect_node_id)
    for node in r["document"]["children"]:
        collect_node_styles(node)


def sync_color_token(styles_key_map):
    r = figma.file_nodes(file_key, color_node_id)
    for node in r["document"]["children"]:
        collect_node_styles(node)


if __name__ == "__main__":
    print('开始同步设计资源到维格表')
    file_styles = figma.file_styles(file_key)
    # print(file_styles)
    # 真个设计组件库的所有样式索引
    styles_key_map = {}
    for item in file_styles:
        styles_key_map[item["key"]] = item
    # 从 figma 同步色板 style 到 维格表
    sync_color_token(styles_key_map)
    sync_effect_token(styles_key_map)
    token_dst = vika.datasheet("dst1uWJuwDci5HEsTb")
    tokens = token_dst.records.all(viewId="viwCFssU8Ajam")

    for key, style in styles_key_map.items():
        node_id = style["node_id"]
        if node_styles.get(node_id):
            node_fill_value = node_styles[node_id]
            try:
                token_record = tokens.get(key=key)
                update_data = {"value": node_fill_value, "name": style["name"]}
                record_content_changed = (
                    token_record.value != node_fill_value
                    or token_record.name != style["name"]
                )
                if record_content_changed:
                    token_record.update(update_data)
                    print(f"{style['name']} 更新成功✅")
                    time.sleep(1 / 5)
            except RecordDoesNotExist:
                new_record_data = get_record_data(style)
                new_record_data.update({"value":node_fill_value })
                print(new_record_data)
                new_token = token_dst.records.create(new_record_data)
                if new_token._id:
                    print(f"{style['name']} 创建成功✅")
            except:
                # FIXME: 分清错误类型
                print(f"{key} 不存在")