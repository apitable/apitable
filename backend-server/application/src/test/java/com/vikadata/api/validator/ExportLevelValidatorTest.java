package com.vikadata.api.validator;

import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * @author tao
 */
public class ExportLevelValidatorTest {


    @Test
    void givenNullExportLevelWhenVerifySpaceSecuritySettingRoThenReturnTrue() {
        ExportLevelValidator exportLevelValidator = new ExportLevelValidator();
        boolean isValid = exportLevelValidator.isValid(null, null);
        assertThat(isValid).isTrue();
    }

    @Test
    void givenLegalExportLevelWhenVerifySpaceSecuritySettingRoThenReturnTrue() {
        ExportLevelValidator exportLevelValidator = new ExportLevelValidator();
        boolean isValid = exportLevelValidator.isValid(0, null);
        assertThat(isValid).isTrue();
    }

    @Test
    void givenIllegalExportLevelWhenVerifySpaceSecuritySettingRoThenReturnFalse() {
        ExportLevelValidator exportLevelValidator = new ExportLevelValidator();
        boolean isValid = exportLevelValidator.isValid(5, null);
        assertThat(isValid).isFalse();
    }
}
