package com.vikadata.api.enums.base;

import lombok.AllArgsConstructor;
import lombok.Getter;

/**
 * 系统配置表 配置类型
 * @author tao
 */
@Getter
@AllArgsConstructor
public enum SystemConfigType {

    /**
     * 0:引导配置
     */
    WIZARD_CONFIG(0),
    /**
     * 1:模板中心热门推荐
     */
    RECOMMEND_CONFIG(1),
    /**
     * 2:GM权限配置
     */
    GM_PERMISSION_CONFIG(2),

    ;

    private final int type;
}
