package com.vikadata.api.component.audit;

import lombok.AllArgsConstructor;
import lombok.Getter;

/**
 * <p>
 * 审计类型
 * </p>
 *
 * @author Shawn Deng
 * @date 2020/4/22 19:29
 */
@Getter
@AllArgsConstructor
public enum AuditActionType {

    /**
     * 空间行为审计
     */
    SPACE_AUDIT("space"),

    /**
     * 系统行为审计
     */
    SYSTEM_AUDIT("system");

    private final String action;

    public static AuditActionType toEnum(String action) {
        AuditActionType actionType = null;
        for (AuditActionType value : AuditActionType.values()) {
            if (value.getAction().equals(action)) {
                actionType = value;
                break;
            }
        }
        return actionType;
    }
}
