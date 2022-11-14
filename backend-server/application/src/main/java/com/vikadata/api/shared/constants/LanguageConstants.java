package com.vikadata.api.shared.constants;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Locale;
import java.util.Locale.LanguageRange;
import java.util.stream.Collectors;

/**
 * <p>
 * locale constants
 * </p>
 *
 * @author Pengap
 */
public class LanguageConstants {

    public static final List<Locale> SUPPORTED_LANGUAGE = Arrays.asList(
            // Chinese
            Locale.SIMPLIFIED_CHINESE,
            // US
            Locale.US
    );

    private static final List<LanguageRange> SUPPORTED_LANGUAGE_RANGES;

    static {
        SUPPORTED_LANGUAGE_RANGES = LanguageRange.parse(SUPPORTED_LANGUAGE.stream().map(Locale::toLanguageTag).collect(Collectors.joining(",")));
    }

    /**
     * whether language supported
     *
     * @param languageTag language
     */
    public static boolean isLanguagesSupported(String languageTag) {
        return isLanguagesSupported(Locale.forLanguageTag(languageTag));
    }

    /**
     * whether language supported
     *
     * @param locale locale
     */
    public static boolean isLanguagesSupported(Locale locale) {
        return !Locale.filter(SUPPORTED_LANGUAGE_RANGES, Collections.singletonList(locale)).isEmpty();
    }

}
