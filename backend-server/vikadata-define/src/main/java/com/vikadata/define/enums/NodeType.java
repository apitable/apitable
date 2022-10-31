package com.vikadata.define.enums;

/**
 * node type
 *
 */
public enum NodeType {

    /**
     * root node
     */
    ROOT(0),

    /**
     * folder
     */
    FOLDER(1),

    /**
     * datasheet
     */
    DATASHEET(2),

    /**
     * form
     */
    FORM(3),

    /**
     * dashboard
     */
    DASHBOARD(4),

    /**
     * mirror
     */
    MIRROR(5),

    /**
     * dataPage, Page design based on VIKA
     */
    DATAPAGE(6),

    /**
     * canvas
     */
    CANVAS(7),

    /**
     * editor documents
     */
    WORD_DOC(8),

    /**
     * static resource file
     */
    ASSET_FILE(98),

    /**
     * dataDoc
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
        throw new RuntimeException("unknown node type");
    }

    /**
     * exclude root and folder type
     */
    public boolean isFileNode() {
        return nodeType > 1;
    }
}
