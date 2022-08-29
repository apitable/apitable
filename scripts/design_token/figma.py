import requests

from const import FIGMA_TOKEN


# 从 Figma API 读取 design token 同步到维格表
# REST API
class Figma:
    def __init__(self, token):
        self._token = token
        self.headers = {"X-FIGMA-TOKEN": FIGMA_TOKEN}

    def file_nodes(self, file_key: str, ids: str = ""):
        url = f"https://api.figma.com/v1/files/{file_key}"
        params = {}
        if ids:
            params["ids"] = ids
        r = requests.get(url, params=params, headers=self.headers).json()
        return r

    def file_styles(self, file_key: str):
        r = requests.get(
            f"https://api.figma.com/v1/files/{file_key}/styles", headers=self.headers
        ).json()
        if not r["error"]:
            return r["meta"]["styles"]
        else:
            print("获取失败")
        return []


# 工具类，将 Figma 的数据格式转化为 CSS
class FigmaHelper:
    @staticmethod
    def color2string(color, opacity=1.0):
        if opacity < 1:
            return FigmaHelper.color2rgba(color, opacity)
        return FigmaHelper.color2hex(color)

    @staticmethod
    def color2rgba(color, opacity):
        color_rgb = [
            round(255 * color["r"]),
            round(255 * color["g"]),
            round(255 * color["b"]),
            round(opacity or color['a'], 2),
        ]
        return "rgba({}, {}, {}, {})".format(*color_rgb)

    @staticmethod
    def color2hex(color):
        color_rgb = [
            round(255 * color["r"]),
            round(255 * color["g"]),
            round(255 * color["b"]),
        ]
        return "#{:02x}{:02x}{:02x}".format(*color_rgb).upper()

    @staticmethod
    def shadow_effect2box_shadow(shadow):
        rgba = FigmaHelper.color2rgba(shadow["color"], shadow["color"]['a'])
        inset = "inset" if shadow["type"] == "INNER_SHADOW" else ""
        offset_x = int(shadow["offset"]["x"])
        offset_y = int(shadow["offset"]["y"])
        blur_radius = int(shadow["radius"])
        spread_radius = int(shadow.get("spread", 0))
        return f"{inset} {offset_x}px {offset_y}px {blur_radius}px {spread_radius}px {rgba}"

    @staticmethod
    def blur_effect2backdrop_filter(blur):
        pass
