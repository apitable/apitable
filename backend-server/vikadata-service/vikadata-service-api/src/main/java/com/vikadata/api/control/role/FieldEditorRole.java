package com.vikadata.api.control.role;

import com.vikadata.api.control.permission.FieldPermission;
import com.vikadata.api.control.role.RoleConstants.Field;

/**
 * <p>
 * （数表字段）可编辑角色
 * </p>
 *
 * @author Chambers
 * @date 2021/3/22
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
