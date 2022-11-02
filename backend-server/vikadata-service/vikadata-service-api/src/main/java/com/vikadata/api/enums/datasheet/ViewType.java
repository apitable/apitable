package com.vikadata.api.enums.datasheet;

/**
 * <p>
 * view type
 * </p>
 *
 * @author Benson Cheung
 */
public enum ViewType {

    NOT_SUPPORT(0),

    GRID(1),

    KANBAN(2),

    GALLERY(3),

    FORM(4),

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
