package com.vikadata.system.config.billing;

import java.util.Map;

import lombok.Data;

/**
 * <p>
 * Billing Config
 * </p>
 */
@Data
public class BillingConfig {

    private Map<String, Product> products;

    private Map<String, Plan> plans;

    private Map<String, Feature> features;

    private Map<String, Function> functions;

    private Map<String, Price> prices;

    private Map<String, PriceList> pricelist;

    private Map<String, Event> events;
}
