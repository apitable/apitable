package com.vikadata.api.control.role;

/**
 * Default Workbench Role
 * @author Shawn Deng
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
