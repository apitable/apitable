package com.vikadata.system.config.wecom;

import java.util.Map;

import lombok.Getter;
import lombok.Setter;

/**
 * <p>
 * 企业微信配置
 * </p>
 * @author 刘斌华
 * @date 2022-04-29 18:55:29
 */
@Setter
@Getter
public class WeComConfig {

    private Map<String, WeComPlan> plans;

}
