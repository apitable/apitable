package com.vikadata.api.shared.listener;

import java.util.ArrayList;
import java.util.List;
import java.util.Map.Entry;

import cn.hutool.core.util.ArrayUtil;

import com.vikadata.system.config.SystemConfigManager;
import com.vikadata.system.config.marketplace.App;
import com.vikadata.system.config.marketplace.MarketPlaceConfig;

import org.springframework.context.EnvironmentAware;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Component;

@Component
public class MarketPlaceInitEnvironment implements EnvironmentAware, OnReadyListener {

    private Environment environment;

    @Override
    public void init() {
        MarketPlaceConfig marketPlaceConfig = SystemConfigManager.getConfig().getMarketplace();
        String[] profiles = environment.getActiveProfiles();
        String[] defaultProfiles = new String[] { "integration", "staging", "production" };
        String profile = "";
        if (ArrayUtil.containsAny(defaultProfiles, profiles)) {
            for (String appProfile : defaultProfiles) {
                if (ArrayUtil.contains(profiles, appProfile)) {
                    profile = appProfile;
                    break;
                }
            }
        }
        else {
            profile = "integration";
        }
        List<String> removedKeys = new ArrayList<>();
        for (Entry<String, App> entry : marketPlaceConfig.entrySet()) {
            if (entry.getValue().getEnv().contains(profile)) {
                continue;
            }
            removedKeys.add(entry.getKey());
        }
        if (!removedKeys.isEmpty()) {
            removedKeys.forEach(marketPlaceConfig::remove);
        }
    }

    @Override
    public void setEnvironment(Environment environment) {
        this.environment = environment;
    }
}
