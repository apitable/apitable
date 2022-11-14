package com.vikadata.api.enterprise.control.infrastructure;

/**
 * Principal Type
 * @author Shawn Deng
 */
public enum PrincipalType {

    UNIT_ID(0),
    MEMBER_ID(1),
    TEAM_ID(2),
    ROLE_ID(3);

    private final int val;

    PrincipalType(int val) {
        this.val = val;
    }

    public int getVal() {
        return val;
    }
}
