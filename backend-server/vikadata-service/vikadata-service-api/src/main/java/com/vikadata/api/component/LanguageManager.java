package com.vikadata.api.component;

import java.util.Locale;

import com.vikadata.api.config.properties.ConstProperties;
import com.vikadata.boot.autoconfigure.spring.SpringContextHolder;

import org.springframework.stereotype.Component;

/**
 * <p>
 * 国际化多语言管理器
 * </p>
 *
 * @author Chambers
 * @date 2022/4/28
 */
@Component
public class LanguageManager {

    public static LanguageManager me() {
        return SpringContextHolder.getBean(LanguageManager.class);
    }

    /**
     * 获取默认语言
     */
    public Locale getDefaultLanguage() {
        String languageTag = SpringContextHolder.getBean(ConstProperties.class).getLanguageTag();
        return Locale.forLanguageTag(languageTag);
    }

    public String getDefaultLanguageTag() {
        return SpringContextHolder.getBean(ConstProperties.class).getLanguageTag();
    }

    /**
     * 获取默认语言字符串Tag，连字符"-"转为下划线"_"
     * @return 带下划线的默认语言字符串
     */
    public String getDefaultLanguageTagWithUnderLine() {
        return getDefaultLanguageTag().replace("-", "_");
    }
}
