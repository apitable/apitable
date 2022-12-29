package com.vikadata.api.shared.sysconfig.marketplace;

import java.util.HashMap;

/**
 * <p>
 * Marketplace Config
 * </p>
 */
public class MarketPlaceConfig extends HashMap<String, App> {

    public App ofAppType(String appType) {
        for (App value : this.values()) {
            if (value.getAppType().equals(appType)) {
                return value;
            }
        }
        return null;
    }
}
