package com.vikadata.system.config;

import java.util.Map;

import lombok.Data;

import com.vikadata.system.config.i18n.I18nStrings;

/**
 * 多语言配置
 * @author Shawn Deng
 * @date 2021-11-11 15:51:45
 */
@Data
public class I18nConfig {

    private Map<String, I18nStrings> strings;
}
