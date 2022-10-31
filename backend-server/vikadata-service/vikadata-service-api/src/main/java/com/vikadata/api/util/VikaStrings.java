package com.vikadata.api.util;

import java.util.Locale;

import javax.validation.constraints.NotNull;

import cn.hutool.core.util.StrUtil;

import com.vikadata.api.constants.LanguageConstants;
import com.vikadata.system.config.I18nConfigManager;
import com.vikadata.system.config.i18n.I18nTypes;

import org.springframework.context.i18n.LocaleContextHolder;

/**
 * <p>
 * strings.json collection of processing methods
 * </p>
 *
 * @author Pengap
 */
public class VikaStrings {

    /**
     * get strings text in multiple languages
     *
     * @param stringsKey    strings.json key
     * @param lang          language currently supported languages {@link LanguageConstants#SUPPORTED_LANGUAGE}、{@link I18nTypes#isSupport()}
     * @param defaultStr    if str is {@code null} or &quot;&quot;or empty，returns the specified default string
     * @return String
     */
    public static String t(String stringsKey, @NotNull Locale lang, String defaultStr) {
        if (StrUtil.isNotBlank(stringsKey)) {
            I18nTypes i18nTypes = I18nTypes.aliasOf(lang.toLanguageTag()).isBackoff();
            String text = I18nConfigManager.getText(I18nConfigManager.getConfig().getStrings().get(stringsKey), i18nTypes);
            return StrUtil.blankToDefault(text, defaultStr);
        }
        return StrUtil.EMPTY;
    }

    /**
     * Use the local language by default, convert the T function
     * </br>
     * Local language representation: the language of the currently logged in person, parsed according to the cookie
     * use LocaleContextHolder#defaultLocale if you can not parse
     *
     * @param stringsKey    strings.json key
     * @param defaultStr    f str is {@code null} or &quot;&quot;or empty，returns the specified default string
     */
    public static String t(String stringsKey, String defaultStr) {
        // get the current locale
        Locale currentLang = LocaleContextHolder.getLocale();
        return t(stringsKey, currentLang, defaultStr);
    }

    /**
     * get strings text in multiple languages
     *
     * @param stringsKey    strings.json key
     * @param lang          language, currently supported languages
     */
    public static String t(String stringsKey, @NotNull Locale lang) {
        return t(stringsKey, lang, StrUtil.EMPTY);
    }

    /**
     * Execute the T function, convert to null and return {@link StrUtil#EMPTY}
     *
     * @param stringsKey    strings.json key
     */
    public static String t(String stringsKey) {
        return t(stringsKey, StrUtil.EMPTY);
    }

}
