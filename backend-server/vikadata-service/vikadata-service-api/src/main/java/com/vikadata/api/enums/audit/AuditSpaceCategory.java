package com.vikadata.api.enums.audit;

import lombok.AllArgsConstructor;
import lombok.Getter;

/**
 * <p>
 * audit category in space
 * </p>
 *
 * @author Chambers
 */
@Getter
@AllArgsConstructor
public enum AuditSpaceCategory {

    /**
     * space change event
     */
    SPACE_CHANGE_EVENT,

    /**
     * work catalog change event
     */
    WORK_CATALOG_CHANGE_EVENT,

    /**
     * work catalog share event
     */
    WORK_CATALOG_SHARE_EVENT,

    /**
     * work catalog permission change event
     */
    WORK_CATALOG_PERMISSION_CHANGE_EVENT,

    /**
     * space template event
     */
    SPACE_TEMPLATE_EVENT,

    ;

    public static AuditSpaceCategory toEnum(String name) {
        for (AuditSpaceCategory value : AuditSpaceCategory.values()) {
            if (value.name().toLowerCase().equals(name)) {
                return value;
            }
        }
        throw new IllegalArgumentException("unknown audit category type.");
    }
}
