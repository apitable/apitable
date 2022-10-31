package com.vikadata.system.config.wecom;

import java.util.Map;

import lombok.Getter;
import lombok.Setter;

/**
 * <p>
 * 企业微信配置
 * </p>
 */
@Setter
@Getter
public class WeComConfig {

    private Map<String, WeComPlan> plans;

}
