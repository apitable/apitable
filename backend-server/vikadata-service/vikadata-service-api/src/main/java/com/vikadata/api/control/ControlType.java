package com.vikadata.api.control;

/**
 * 权限资源控制类型
 * @author Shawn Deng
 * @date 2021-03-17 18:58:39
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
