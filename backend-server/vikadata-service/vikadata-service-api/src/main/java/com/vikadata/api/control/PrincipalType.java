package com.vikadata.api.control;

/**
 * 权限资源控制单位类型
 * @author Shawn Deng
 * @date 2021-03-17 18:58:39
 */
public enum PrincipalType {

    UNIT_ID(0),
    MEMBER_ID(1),
    TEAM_ID(2),
    TAG_ID(3);

    private int val;

    PrincipalType(int val) {
        this.val = val;
    }

    public int getVal() {
        return val;
    }
}
