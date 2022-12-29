package com.vikadata.api.workspace.enums;

/**
 * <p>
 * cell type
 * </p>
 *
 * @author Benson Cheung
 */
public enum CellType {

    NOT_SUPPORT(0),

    TEXT(1);

    private final int type;

    CellType(int type) {
        this.type = type;
    }

    public int getType() {
        return type;
    }
}
