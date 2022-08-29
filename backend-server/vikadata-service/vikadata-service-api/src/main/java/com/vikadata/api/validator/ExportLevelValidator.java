package com.vikadata.api.validator;

import java.util.Arrays;

import javax.validation.ConstraintValidator;
import javax.validation.ConstraintValidatorContext;

import cn.hutool.core.util.ObjectUtil;
import lombok.extern.slf4j.Slf4j;

import com.vikadata.api.enums.lang.ExportLevelEnum;

/**
 * @author tao
 */
@Slf4j
public class ExportLevelValidator implements ConstraintValidator<ExportLevelMatch, Integer> {

    @Override
    public boolean isValid(Integer exportLevel, ConstraintValidatorContext context) {
        log.info("校验安全设置-导出权限成员等级参数「{}」是否正确", exportLevel);

        if (ObjectUtil.isNull(exportLevel)) {
            return true;
        }

        return Arrays.stream(ExportLevelEnum.values())
                .anyMatch(value -> value.getValue().equals(exportLevel));
    }

}
