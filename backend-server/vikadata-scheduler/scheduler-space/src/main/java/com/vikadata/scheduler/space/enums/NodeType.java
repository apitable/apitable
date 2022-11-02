package com.vikadata.scheduler.space.enums;

/**
 * 节点类型
 *
 * @author Chambers
 * @since 2019/10/12
 */
public enum NodeType {

    /**
     * 根节点
     */
    ROOT(0),

    /**
     * 文件夹
     */
    FOLDER(1),

    /**
     * 数表
     */
    DATASHEET(2),

    /**
     * 收集表
     */
    FORM(3),

    /**
     * 仪表盘
     */
    DASHBOARD(4),

    /**
     * 镜像方式
     */
    MIRROR(5),

    /**
     * 维格数页，基于维格表的页面设计
     */
    DATAPAGE(6),

    /**
     * 画布
     */
    CANVAS(7),

    /**
     * 普通编辑器文档
     */
    WORD_DOC(8),

    /**
     * 静态资源文件
     */
    ASSET_FILE(98),

    /**
     * 维格文
     */
    DATADOC(99);


    private int nodeType;

    NodeType(int nodeType) {
        this.nodeType = nodeType;
    }

    public int getNodeType() {
        return nodeType;
    }

    public void setNodeType(int nodeType) {
        this.nodeType = nodeType;
    }

    public static NodeType toEnum(int code) {
        for (NodeType e : NodeType.values()) {
            if (e.getNodeType() == code) {
                return e;
            }
        }
        throw new RuntimeException("未知的节点类型");
    }

    /**
     * exclude root and folder type
     */
    public boolean isFileNode() {
        return nodeType > 1;
    }
}
