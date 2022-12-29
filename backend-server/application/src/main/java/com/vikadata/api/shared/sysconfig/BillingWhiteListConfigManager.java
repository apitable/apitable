package com.vikadata.api.shared.sysconfig;

import java.io.IOException;
import java.io.InputStream;

public class BillingWhiteListConfigManager {

    public static BillingWhiteListConfig getConfig() {
        return Singleton.INSTANCE.getSingleton();
    }

    private enum Singleton {
        INSTANCE;

        private final BillingWhiteListConfig singleton;

        Singleton() {
            try {
                InputStream resourceAsStream = BillingWhiteListConfigManager.class.getResourceAsStream("/sysconfig/billing_white_list.json");
                if (resourceAsStream == null) {
                    throw new IOException("config file not found");
                }
                singleton = Converter.getObjectMapper().readValue(resourceAsStream, BillingWhiteListConfig.class);
            }
            catch (IOException e) {
                throw new RuntimeException("failed to load system configuration");
            }
        }

        public BillingWhiteListConfig getSingleton() {
            return singleton;
        }
    }
}
