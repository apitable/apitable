package com.vikadata.system.config;

import java.util.Map;

import lombok.Data;

import com.vikadata.system.config.i18n.I18nStrings;

/**
 * <p>
 * I18n Configuration
 * </p>
 */
@Data
public class I18nConfig {

    private Map<String, I18nStrings> strings;
}
