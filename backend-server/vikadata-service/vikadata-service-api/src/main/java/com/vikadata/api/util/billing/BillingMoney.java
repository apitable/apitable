package com.vikadata.api.util.billing;

import java.math.RoundingMode;

/**
 * 计费费用定义
 * @author Shawn Deng
 * @date 2022-05-19 17:44:01
 */
public class BillingMoney {

    /**
     * 小数点后面位数
     */
    public static final int MAX_SCALE = 9;

    /**
     * BigDecimal 四舍五入模式
     */
    public static final RoundingMode ROUNDING_MODE = RoundingMode.HALF_UP;
}
