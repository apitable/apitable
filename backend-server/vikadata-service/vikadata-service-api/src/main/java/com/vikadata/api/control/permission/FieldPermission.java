package com.vikadata.api.control.permission;

import lombok.AllArgsConstructor;
import lombok.Getter;

/**
 * 列权限最小单位
 * @author Shawn Deng
 * @date 2021-03-18 15:20:23
 */
@Getter
@AllArgsConstructor
public enum FieldPermission implements PermissionDefinition {

    /**
     * 读取列数据
     */
    READ_FIELD_DATA(2, "readable", 1L),

    /**
     * 编辑列数据
     */
    EDIT_FIELD_DATA(2, "editable", 1L << 1);

    /**
     * 权限位，分组的概念，long型最大容纳31个权限位，超过31个则group+1
     */
    private final int group;

    /**
     * 同一组下唯一权限代号，不能重复
     */
    private final String code;

    /**
     * 权限码，Long型空间的位置,从0开始
     */
    private final long value;
}
