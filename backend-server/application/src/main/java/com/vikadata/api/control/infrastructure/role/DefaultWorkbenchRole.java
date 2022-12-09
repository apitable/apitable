package com.vikadata.api.control.infrastructure.role;

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
