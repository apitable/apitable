package com.vikadata.api.shared.sysconfig.wecom;

import java.util.Map;

import lombok.Getter;
import lombok.Setter;

/**
 * <p>
 * WeCom Config
 * </p>
 */
@Setter
@Getter
public class WeComConfig {

    private Map<String, WeComPlan> plans;

}
