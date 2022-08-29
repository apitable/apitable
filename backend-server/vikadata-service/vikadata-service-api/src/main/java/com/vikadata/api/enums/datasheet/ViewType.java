package com.vikadata.api.enums.datasheet;

/**
 * <p>
 * 视图类型
 * </p>
 *
 * @author Benson Cheung
 * @date 2019-09-17 00:26
 */
public enum ViewType {

    /**
     * 不支持该类型
     */
    NOTSUPPORT(0),

    /**
     * 表格视图
     */
    GRID(1),

    /**
     * 看板视图
     */
    KANBAN(2),

    /**
     * 相册视图
     */
    GALLERY(3),

    /**
     * 表单视图
     */
    FORM(4),

    /**
     * 日历视图
     */
    CALENDAR(5);

    private int type;

    ViewType(int type) {
        this.type = type;
    }

    public int getType() {
        return type;
    }

    public void setType(int type) {
        this.type = type;
    }


}
