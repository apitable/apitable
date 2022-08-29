package com.vikadata.system.config;

import java.io.IOException;
import java.io.InputStream;

import com.vikadata.system.config.i18n.I18nStrings;
import com.vikadata.system.config.i18n.I18nTypes;

/**
 * <p>
 * 多语言配置管理器
 * </p>
 * @author Shawn Deng
 */
public class I18nConfigManager {

    public static I18nConfig getConfig() {
        return I18nConfigManager.Singleton.INSTANCE.getSingleton();
    }

    private enum Singleton {
        INSTANCE;

        private final I18nConfig singleton;

        // JVM保证这个方法绝对只调用一次
        Singleton() {
            try {
                InputStream resourceAsStream = SystemConfigManager.class.getResourceAsStream("/strings.auto.json");
                if (resourceAsStream == null) {
                    throw new IOException("多语言文件未找到");
                }
                singleton = Converter.getObjectMapper().readValue(resourceAsStream, I18nConfig.class);
            }
            catch (IOException e) {
                throw new RuntimeException("加载多语言配置失败");
            }
        }

        public I18nConfig getSingleton() {
            return singleton;
        }
    }

    public static String getText(I18nStrings key, I18nTypes lang) {
        switch (lang) {
            case EN_US:
                return key.getEnUS();
            case ZH_HK:
                return key.getZhHK();
            default:
                return key.getZhCN();
        }
    }

}
