package com.vikadata.api.control.infrastructure.role;

import com.vikadata.api.control.infrastructure.permission.FieldPermission;
import com.vikadata.api.control.infrastructure.role.RoleConstants.Field;

/**
 * <p>
 * Editor Role of Field
 * </p>
 *
 * @author Chambers
 */
public class FieldEditorRole extends FieldReaderRole {

    public FieldEditorRole() {
        this(false);
    }

    public FieldEditorRole(boolean inherit) {
        this(inherit, false);
    }

    public FieldEditorRole(boolean inherit, boolean isAdmin) {
        super(inherit, isAdmin);

        permissions.add(FieldPermission.EDIT_FIELD_DATA);
    }

    @Override
    public String getRoleTag() {
        return Field.EDITOR;
    }
}
