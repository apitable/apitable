package com.vikadata.api.enums.audit;

import lombok.AllArgsConstructor;
import lombok.Getter;

/**
 * <p>
 * 空间审计事件分类枚举
 * </p>
 *
 * @author Chambers
 * @date 2022/5/25
 */
@Getter
@AllArgsConstructor
public enum AuditSpaceCategory {

    /**
     * 空间站信息变更事件
     */
    SPACE_CHANGE_EVENT,

    /**
     * 工作目录信息变更事件
     */
    WORK_CATALOG_CHANGE_EVENT,

    /**
     * 工作目录分享事件
     */
    WORK_CATALOG_SHARE_EVENT,

    /**
     * 工作目录权限变更事件
     */
    WORK_CATALOG_PERMISSION_CHANGE_EVENT,

    /**
     * 空间站模板事件
     */
    SPACE_TEMPLATE_EVENT,

    ;

    public static AuditSpaceCategory toEnum(String name) {
        for (AuditSpaceCategory value : AuditSpaceCategory.values()) {
            if (value.name().toLowerCase().equals(name)) {
                return value;
            }
        }
        throw new IllegalArgumentException("Enum not exist.");
    }
}
