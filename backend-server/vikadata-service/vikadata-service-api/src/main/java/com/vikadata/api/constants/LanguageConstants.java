package com.vikadata.api.constants;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Locale;
import java.util.Locale.LanguageRange;
import java.util.stream.Collectors;

/**
 * <p>
 * 国际化语言支持常量
 * </p>
 *
 * @author Pengap
 * @date 2021/11/17 19:24:14
 */
public class LanguageConstants {

    // 默认的语言 zh-CN
    public static final Locale DEFAULT_LANGUAGE = Locale.SIMPLIFIED_CHINESE;

    // 支持的语言列表
    public static final List<Locale> SUPPORTED_LANGUAGE = Arrays.asList(
            // 简体中文
            Locale.SIMPLIFIED_CHINESE,
            // US
            Locale.US
    );

    // 支持的语言范围
    private static final List<LanguageRange> SUPPORTED_LANGUAGE_RANGES;

    static {
        SUPPORTED_LANGUAGE_RANGES = LanguageRange.parse(SUPPORTED_LANGUAGE.stream().map(Locale::toLanguageTag).collect(Collectors.joining(",")));
    }

    /**
     * 判断传入语言系统是否支持
     *
     * @param languageTag 语言标签
     */
    public static boolean isLanguagesSupported(String languageTag) {
        return isLanguagesSupported(Locale.forLanguageTag(languageTag));
    }

    /**
     * 判断传入语言系统是否支持
     *
     * @param locale 语言
     */
    public static boolean isLanguagesSupported(Locale locale) {
        return !Locale.filter(SUPPORTED_LANGUAGE_RANGES, Collections.singletonList(locale)).isEmpty();
    }

}
