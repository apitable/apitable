package com.vikadata.api.util.billing;

import java.math.RoundingMode;

/**
 * Money Constants
 * @author Shawn Deng
 */
public class BillingMoney {

    /**
     * digits after decimal point
     */
    public static final int MAX_SCALE = 9;

    /**
     * BigDecimal rounding mode
     */
    public static final RoundingMode ROUNDING_MODE = RoundingMode.HALF_UP;
}
