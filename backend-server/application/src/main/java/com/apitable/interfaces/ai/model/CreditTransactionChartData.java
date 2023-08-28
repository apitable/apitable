package com.apitable.interfaces.ai.model;

import java.math.BigDecimal;
import lombok.Data;

/**
 * credit consume chart data.
 *
 * @author Shawn Deng
 */
@Data
public class CreditTransactionChartData {

    private String dateline;

    private BigDecimal totalCount;
}
