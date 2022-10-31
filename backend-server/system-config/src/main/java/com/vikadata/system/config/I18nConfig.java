package com.vikadata.system.config;

import java.util.Map;

import lombok.Data;

import com.vikadata.system.config.i18n.I18nStrings;

/**
 * i18n configuration
 * @author Shawn Deng
 */
@Data
public class I18nConfig {

    private Map<String, I18nStrings> strings;
}
