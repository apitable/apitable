package com.vikadata.api.context;

import java.util.Locale;

import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;

import com.vikadata.api.constants.LanguageConstants;

import static org.junit.jupiter.api.Assertions.assertEquals;

/**
 *
 * @author Shawn Deng
 * @date 2022-03-18 16:16:07
 */
@Disabled
public class I18nContextTest {

    @Test
    public void testTransform() {
        LanguageConstants.SUPPORTED_LANGUAGE.stream()
                .map(locale -> I18nContext.me().transform("SEND_CAPTCHA_TOO_MUSH", locale))
                .forEach(System.out::println);
    }

    @Test
    public void testChinese() {
        System.out.println(Locale.CHINESE);
        System.out.println(Locale.SIMPLIFIED_CHINESE);
        System.out.println(Locale.TRADITIONAL_CHINESE);

        assertEquals(Locale.CHINESE.getLanguage(), Locale.SIMPLIFIED_CHINESE.getLanguage());
        assertEquals(Locale.CHINESE.getLanguage(), Locale.TRADITIONAL_CHINESE.getLanguage());
    }

}
