package com.apitable.interfaces.ai.model;

import static java.math.RoundingMode.HALF_UP;

import java.math.BigDecimal;
import lombok.Data;

/**
 * credit usage.
 */
@Data
public class CreditInfo {

    private boolean allowOverLimit;

    private Long maxMessageCredits;

    private BigDecimal usedCredit;

    public CreditInfo(boolean allowOverLimit, Long maxMessageCredits, BigDecimal usedCredit) {
        this.allowOverLimit = allowOverLimit;
        this.maxMessageCredits = maxMessageCredits;
        this.usedCredit = usedCredit;
    }

    public BigDecimal remainCredit() {
        if (BigDecimal.ZERO.equals(usedCredit)) {
            return BigDecimal.valueOf(maxMessageCredits).setScale(4, HALF_UP);
        }
        return BigDecimal.valueOf(maxMessageCredits).subtract(usedCredit).setScale(4, HALF_UP);
    }
}
