package com.vikadata.system.config;

import java.io.IOException;
import java.io.InputStream;

public class BillingWhiteListConfigManager {

    public static BillingWhiteListConfig getConfig() {
        return Singleton.INSTANCE.getSingleton();
    }

    private enum Singleton {
        INSTANCE;

        private final BillingWhiteListConfig singleton;

        // JVM保证这个方法绝对只调用一次
        Singleton() {
            try {
                InputStream resourceAsStream = BillingWhiteListConfigManager.class.getResourceAsStream("/billing_white_list.json");
                if (resourceAsStream == null) {
                    throw new IOException("配置文件未找到");
                }
                singleton = Converter.getObjectMapper().readValue(resourceAsStream, BillingWhiteListConfig.class);
            }
            catch (IOException e) {
                throw new RuntimeException("加载系统配置失败");
            }
        }

        public BillingWhiteListConfig getSingleton() {
            return singleton;
        }
    }
}
