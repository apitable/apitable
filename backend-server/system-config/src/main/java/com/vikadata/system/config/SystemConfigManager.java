package com.vikadata.system.config;

import java.io.IOException;
import java.io.InputStream;

/**
 * System Config Manager
 *
 * @author Shawn Deng
 */
public class SystemConfigManager {

    public static SystemConfig getConfig() {
        return Singleton.INSTANCE.getSingleton();
    }

    private enum Singleton {
        INSTANCE;

        private final SystemConfig singleton;

        Singleton() {
            try {
                InputStream resourceAsStream = SystemConfigManager.class.getResourceAsStream("/system_config.auto.json");
                if (resourceAsStream == null) {
                    throw new IOException("config file not found");
                }
                singleton = Converter.getObjectMapper().readValue(resourceAsStream, SystemConfig.class);
            }
            catch (IOException e) {
                throw new RuntimeException("failed to load system configuration", e);
            }
        }

        public SystemConfig getSingleton() {
            return singleton;
        }
    }
}
