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
public class UnitValidator implements ConstraintValidator<UnitMatch, Long> {

    @Override
    public boolean isValid(Long unitId, ConstraintValidatorContext context) {
        log.info("校验组织单元「{}」是否存在", unitId);
        return true;
    }
}
