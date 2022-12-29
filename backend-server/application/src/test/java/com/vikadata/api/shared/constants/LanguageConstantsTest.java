package com.vikadata.api.shared.constants;

import java.util.List;
import java.util.stream.Collectors;

import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.Test;

import com.vikadata.api.shared.constants.LanguageConstants;
import com.vikadata.api.shared.sysconfig.i18n.I18nTypes;

/**
 *
 * @author Shawn Deng
 * @date 2022-03-18 15:31:23
 */
public class LanguageConstantsTest {

    @Test
    public void testStringI18nType() {
        List<I18nTypes> languages = LanguageConstants.SUPPORTED_LANGUAGE.stream()
                .map(locale -> I18nTypes.aliasOf(locale.toLanguageTag()))
                .collect(Collectors.toList());
        Assertions.assertThat(languages).isNotEmpty()
                .containsExactly(I18nTypes.ZH_CN, I18nTypes.EN_US);
    }
}
