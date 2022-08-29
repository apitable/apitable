package com.vikadata.api.control.role;

/**
 * 默认工作台角色-可管理
 * @author Shawn Deng
 * @date 2021-03-18 16:42:50
 */
public class DefaultWorkbenchRole extends NodeManagerRole {

    public DefaultWorkbenchRole() {
        super(true);
    }

    @Override
    public boolean canAssignable() {
        return false;
    }
}
