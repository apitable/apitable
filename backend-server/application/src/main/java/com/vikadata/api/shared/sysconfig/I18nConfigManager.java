package com.vikadata.api.shared.sysconfig;

import java.io.IOException;
import java.io.InputStream;

import com.vikadata.api.shared.sysconfig.i18n.I18nStrings;
import com.vikadata.api.shared.sysconfig.i18n.I18nTypes;

/**
 * <p>
 * I18n Config Manager
 * </p>
 */
public class I18nConfigManager {

    public static I18nConfig getConfig() {
        return I18nConfigManager.Singleton.INSTANCE.getSingleton();
    }

    private enum Singleton {
        INSTANCE;

        private final I18nConfig singleton;

        // JVM guarantee this method is called absolutely only once
        Singleton() {
            try {
                InputStream resourceAsStream = SystemConfigManager.class.getResourceAsStream("/sysconfig/strings.auto.json");
                if (resourceAsStream == null) {
                    throw new IOException("I18n file not found!");
                }
                singleton = Converter.getObjectMapper().readValue(resourceAsStream, I18nConfig.class);
            }
            catch (IOException e) {
                throw new RuntimeException("Failed to load I18n!");
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
