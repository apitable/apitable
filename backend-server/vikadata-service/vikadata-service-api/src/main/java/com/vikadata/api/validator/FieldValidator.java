package com.vikadata.api.validator;

import javax.validation.ConstraintValidator;
import javax.validation.ConstraintValidatorContext;

import lombok.extern.slf4j.Slf4j;

/**
 * 数表字段校验入口
 * @author Shawn Deng
 * @date 2021-04-07 11:49:43
 */
@Slf4j
public class FieldValidator implements ConstraintValidator<FieldMatch, String> {

    @Override
    public boolean isValid(String fieldId, ConstraintValidatorContext context) {
        log.info("校验字段「{}」是否存在", fieldId);
        // TODO 缺少数表ID，无法校验字段是否存在
        return true;
    }
}
