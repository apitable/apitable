package com.vikadata.api.control.permission;

import lombok.AllArgsConstructor;
import lombok.Getter;

/**
 * Field Permission Definition
 * @author Shawn Deng
 */
@Getter
@AllArgsConstructor
public enum FieldPermission implements PermissionDefinition {

    READ_FIELD_DATA(2, "readable", 1L),

    EDIT_FIELD_DATA(2, "editable", 1L << 1);

    /**
     * permission group
     */
    private final int group;

    private final String code;

    private final long value;
}
