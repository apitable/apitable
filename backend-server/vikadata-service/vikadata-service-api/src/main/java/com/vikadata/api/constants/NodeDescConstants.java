package com.vikadata.api.constants;

/**
 * <p>
 * 节点描述常量
 * </p>
 *
 * @author zoe zheng
 * @date 2020/5/19 4:14 下午
 */
public class NodeDescConstants {
    /**
     * 描述里面的数据
     */
    public static final String DESC_JSON_DATA_PREFIX = "data.ops";

    /**
     * 描述里面的数据(node的描述）
     */
    public static final String DESC_JSON_RENDER_PREFIX = "render.ops";

    /**
     * 描述里面的数据(node的描述）
     */
    public static final String DESC_JSON_DATA_NEW_PREFIX = "data";

    /**
     * 文件夹描述，描述里面的数据(node的描述）
     */
    public static final String DESC_JSON_DATA_NEW_FOD_PREFIX = "slateData.document";

    /**
     * 描述里面的内容
     */
    public static final String DESC_JSON_DATA_TEXT_PREFIX = "insert";

    /**
     * 描述里面的内容
     */
    public static final String DESC_JSON_DATA_TEXT_CHILDREN_PREFIX = "children.text";

    /**
     * 描述里面的图片
     */
    public static final String DESC_JSON_DATA_IMAGE_URL_PREFIX = "data.url";

    /**
     * 描述里面的图片
     */
    public static final String DESC_JSON_DATA_IMAGE_PREFIX = "image";

    /**
     * 需要去除文本的转义字符
     */
    public static final String DESC_JSON_DATA_ESCAPE_RE = "\\s{2,}|\t|\r|\n";

    public static final Integer DESC_TEXT_META_LENGTH = 57;

    /**
     * 表单描述路径
     */
    public static final String FORM_DESC_DESCRIPTION_PREFIX = "description";

    /**
     * 表单描述里面数组路径
     */
    public static final String FORM_DESC_DESCRIPTION_CHILDREN_PREFIX = "children";

    /**
     * 表单描述里面的文本内容
     */
    public static final String FORM_DESC_DESCRIPTION_CHILDREN_TEXT_PREFIX = "text";

    /**
     * 表单描述里面的超链接
     */
    public static final String FORM_DESC_DESCRIPTION_CHILDREN_RAW_PREFIX = "data.raw";
}
