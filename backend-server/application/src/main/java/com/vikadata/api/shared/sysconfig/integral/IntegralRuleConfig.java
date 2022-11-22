package com.vikadata.api.shared.sysconfig.integral;

import java.util.Map;

import lombok.Data;

/**
 * <p>
 * Integral Rule Config
 * </p>
 */
@Data
public class IntegralRuleConfig {

    private Map<String, IntegralRule> rule;
}
