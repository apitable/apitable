package com.vikadata.api.base.enums;

import lombok.AllArgsConstructor;
import lombok.Getter;

/**
 * system config type
 * @author tao
 */
@Getter
@AllArgsConstructor
public enum SystemConfigType {

    /**
     * 0:wizard
     */
    WIZARD_CONFIG(0),
    /**
     * 1:recommend
     */
    RECOMMEND_CONFIG(1),
    /**
     * 2:gm permission
     */
    GM_PERMISSION_CONFIG(2),

    ;

    private final int type;
}
