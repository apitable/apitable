package com.vikadata.system.config.integral;

import lombok.Data;

/**
 * <p>
 * 积分规则
 * </p>
 *
 * @author Shawn Deng
 * @date 2020/9/16 12:18
 */
@Data
public class IntegralRule {

    private String id;

    private String actionCode;

    private String actionName;

    private int integralValue;

    private int dayMaxIntegralValue;

    private boolean online;

    private boolean notify;
}
