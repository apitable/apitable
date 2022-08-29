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
 * Vika strings.json 处理方法集合
 * </p>
 *
 * @author Pengap
 * @date 2021/12/29 17:36:47
 */
public class VikaStrings {

    /**
     * 多语言获取strings文案
     *
     * @param stringsKey    strings.json key
     * @param lang          语言，当前支持语言 {@link LanguageConstants#SUPPORTED_LANGUAGE}、{@link I18nTypes#isSupport()}
     * @param defaultStr    如果解析字符串是{@code null}或者&quot;&quot;或者空白，则返回指定默认字符串
     *
     * @author Pengap
     * @date 2021/12/29 17:55:42
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
     * 默认使用本地语言，转换T函数 </br>
     * 本地语言表示：当前登陆人的语言，根据cookie解析，如果无法解析使用LocaleContextHolder#defaultLocale
     *
     * @param stringsKey    strings.json key
     * @param defaultStr    如果解析字符串是{@code null}或者&quot;&quot;或者空白，则返回指定默认字符串
     * @author Pengap
     * @date 2021/12/29 18:01:03
     */
    public static String t(String stringsKey, String defaultStr) {
        // 获取当前的语言环境
        Locale currentLang = LocaleContextHolder.getLocale();
        return t(stringsKey, currentLang, defaultStr);
    }

    /**
     * 多语言获取strings文案
     *
     * @param stringsKey    strings.json key
     * @param lang          语言，当前支持语言
     * @author Pengap
     * @date 2021/12/29 18:14:19
     */
    public static String t(String stringsKey, @NotNull Locale lang) {
        return t(stringsKey, lang, StrUtil.EMPTY);
    }

    /**
     * 执行T函数，转换为空默认返回{@link StrUtil#EMPTY}
     *
     * @param stringsKey    strings.json key
     * @author Pengap
     * @date 2021/12/29 18:10:42
     */
    public static String t(String stringsKey) {
        return t(stringsKey, StrUtil.EMPTY);
    }

}
