package com.vikadata.system.config.integral;

import java.util.Map;

import lombok.Data;

/**
 * <p>
 * 积分规则配置
 * </p>
 *
 * @author Shawn Deng
 * @date 2020/9/16 12:20
 */
@Data
public class IntegralRuleConfig {

    private Map<String, IntegralRule> rule;
}
