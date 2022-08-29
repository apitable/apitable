package com.vikadata.api.control.role;

import com.vikadata.api.control.permission.FieldPermission;
import com.vikadata.api.control.role.RoleConstants.Field;

/**
 * （数表字段）只读角色
 * @author Shawn Deng
 * @date 2021-03-18 17:34:31
 */
public class FieldReaderRole extends AbstractControlRole {

    private final boolean isAdmin;

    public FieldReaderRole() {
        this(false);
    }

    public FieldReaderRole(boolean inherit) {
        this(inherit, false);
    }

    public FieldReaderRole(boolean inherit, boolean isAdmin) {
        super(inherit);
        this.isAdmin = isAdmin;
        permissions.add(FieldPermission.READ_FIELD_DATA);
    }

    @Override
    public String getRoleTag() {
        return Field.READER;
    }

    @Override
    public boolean isAdmin() {
        return this.isAdmin;
    }
}
