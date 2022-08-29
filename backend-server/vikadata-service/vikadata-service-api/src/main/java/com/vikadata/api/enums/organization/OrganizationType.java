package com.vikadata.api.enums.organization;

/**
 * 组织类型
 *
 * @author Chambers
 * @since 2019/10/15
 */
public enum OrganizationType {

    /**
     * 根组织
     * */
    root(0),

    /**
     * 部门
     * */
    department(1);

    private int type;

    OrganizationType(int groupType) {
        this.type = groupType;
    }

    public int getType() {
        return type;
    }

    public void setType(int groupType) {
        this.type = groupType;
    }
}
