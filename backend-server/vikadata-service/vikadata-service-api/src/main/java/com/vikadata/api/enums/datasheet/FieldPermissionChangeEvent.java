package com.vikadata.api.enums.datasheet;

/**
 * <p>
 * 字段权限变更事件
 * </p>
 *
 * @author Chambers
 * @date 2021/3/31
 */
public enum FieldPermissionChangeEvent {

    /**
     * 字段权限开启
     */
    FIELD_PERMISSION_ENABLE,

    /**
     * 字段权限变更
     */
    FIELD_PERMISSION_CHANGE,

    /**
     * 字段权限关闭
     */
    FIELD_PERMISSION_DISABLE,

    /**
     * 字段配置属性变更
     */
    FIELD_PERMISSION_SETTING_CHANGE
}
