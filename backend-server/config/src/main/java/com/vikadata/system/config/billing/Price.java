package com.vikadata.system.config.billing;

import java.math.BigDecimal;

import lombok.Data;

/**
 * <p>
 * Billing Price
 * </p>
 */
@Data
public class Price {

    private String id;

    private String goodEnTitle;

    private String goodChTitle;

    private String planId;

    private Integer month;

    private String product;

    private Integer seat;

    private String seatDesc;

    private boolean online;

    private String priceListId;

    private BigDecimal originPrice;
}
