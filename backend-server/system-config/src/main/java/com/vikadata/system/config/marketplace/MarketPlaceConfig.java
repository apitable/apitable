package com.vikadata.system.config.marketplace;

import java.util.HashMap;

/**
 * 应用市场配置
 * @author Shawn Deng
 * @date 2021-11-11 15:31:53
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
