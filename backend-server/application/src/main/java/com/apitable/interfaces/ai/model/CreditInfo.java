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

    /**
     * constructor.
     *
     * @param allowOverLimit    allow over limit
     * @param maxMessageCredits max message credits
     * @param usedCredit        used credit
     */
    public CreditInfo(boolean allowOverLimit, Long maxMessageCredits, BigDecimal usedCredit) {
        this.allowOverLimit = allowOverLimit;
        this.maxMessageCredits = maxMessageCredits;
        this.usedCredit = usedCredit;
    }

    /**
     * remain credit.
     *
     * @return remain credit
     */
    public BigDecimal remainCredit() {
        if (BigDecimal.ZERO.equals(usedCredit)) {
            return BigDecimal.valueOf(maxMessageCredits).setScale(4, HALF_UP);
        }
        if (usedCredit.longValue() > maxMessageCredits) {
            // may exceed used credit in a trial period
            return BigDecimal.ZERO;
        }
        return BigDecimal.valueOf(maxMessageCredits).subtract(usedCredit).setScale(4, HALF_UP);
    }

    /**
     * can consume.
     *
     * @param consumedCredit consumed credit
     * @return boolean
     */
    public boolean canConsume(BigDecimal consumedCredit) {
        if (this.allowOverLimit) {
            return true;
        }
        return this.remainCredit().compareTo(consumedCredit) >= 0;
    }
}
