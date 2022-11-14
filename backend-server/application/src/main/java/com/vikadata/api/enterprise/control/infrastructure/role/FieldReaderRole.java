package com.vikadata.api.enterprise.control.infrastructure.role;

import com.vikadata.api.enterprise.control.infrastructure.permission.FieldPermission;
import com.vikadata.api.enterprise.control.infrastructure.role.RoleConstants.Field;

/**
 * Reader role of field
 * @author Shawn Deng
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
