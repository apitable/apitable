package com.vikadata.system.config.billing;

import java.math.BigDecimal;

import lombok.Data;

@Data
public class PriceList {

    private String id;

    private String event;

    private BigDecimal discountAmount;
}
