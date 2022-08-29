package com.vikadata.system.config.app;

import java.util.HashMap;

/**
 * <p> 
 * 应用商店配置
 * </p> 
 * @author Shawn Deng 
 * @date 2022/1/12 16:20
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
