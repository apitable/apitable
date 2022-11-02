package com.vikadata.system.config.app;

import java.util.HashMap;

/**
 * <p>
 * App Store Config
 * </p>
 */
public class AppStoreConfig extends HashMap<String, AppStore> {

    public AppStore ofType(String type) {
        for (AppStore value : this.values()) {
            if (value.getType().equals(type)) {
                return value;
            }
        }
        return null;
    }
}
