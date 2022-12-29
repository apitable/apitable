package com.vikadata.api.control.infrastructure;

/**
 * Control Type
 * @author Shawn Deng
 */
public enum ControlType {

    NODE(0),
    DATASHEET_FIELD(1),
    DATASHEET_VIEW(2);

    private int val;

    ControlType(int val) {
        this.val = val;
    }

    public int getVal() {
        return val;
    }
}
