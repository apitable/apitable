package com.apitable.space.model;

import java.math.BigDecimal;
import lombok.Data;

/**
 * credit usage in space.
 *
 * @author Shawn Deng
 */
@Data
public class CreditUsage {

    private String dateline;

    private BigDecimal count;
}
