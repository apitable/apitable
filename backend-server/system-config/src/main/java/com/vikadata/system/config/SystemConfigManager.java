package com.vikadata.system.config;

import java.io.IOException;
import java.io.InputStream;

/**
 * 系统配置管理器
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

        // JVM保证这个方法绝对只调用一次
        Singleton() {
            try {
                InputStream resourceAsStream = SystemConfigManager.class.getResourceAsStream("/system_config.auto.json");
                if (resourceAsStream == null) {
                    throw new IOException("配置文件未找到");
                }
                singleton = Converter.getObjectMapper().readValue(resourceAsStream, SystemConfig.class);
            }
            catch (IOException e) {
                throw new RuntimeException("加载系统配置失败", e);
            }
        }

        public SystemConfig getSingleton() {
            return singleton;
        }
    }
}
