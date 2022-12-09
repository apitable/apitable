package com.vikadata.api.shared.validator;

import java.util.Arrays;

import javax.validation.ConstraintValidator;
import javax.validation.ConstraintValidatorContext;

import cn.hutool.core.util.ObjectUtil;
import lombok.extern.slf4j.Slf4j;

import com.vikadata.api.control.infrastructure.ExportLevelEnum;

@Slf4j
public class ExportLevelValidator implements ConstraintValidator<ExportLevelMatch, Integer> {

    @Override
    public boolean isValid(Integer exportLevel, ConstraintValidatorContext context) {
        if (ObjectUtil.isNull(exportLevel)) {
            return true;
        }

        return Arrays.stream(ExportLevelEnum.values())
                .anyMatch(value -> value.getValue().equals(exportLevel));
    }

}
