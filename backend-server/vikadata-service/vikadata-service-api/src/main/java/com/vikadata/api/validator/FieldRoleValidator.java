package com.vikadata.api.validator;

import java.util.Arrays;
import java.util.List;

import javax.validation.ConstraintValidator;
import javax.validation.ConstraintValidatorContext;

import lombok.extern.slf4j.Slf4j;

import com.vikadata.api.control.role.RoleConstants.Field;

/**
 *
 * @author Shawn Deng
 * @date 2021-04-07 11:09:34
 */
@Slf4j
public class FieldRoleValidator implements ConstraintValidator<FieldRoleMatch, String> {

    private static final List<String> ROLES = Arrays.asList(Field.EDITOR, Field.READER);

    @Override
    public boolean isValid(String roleCode, ConstraintValidatorContext context) {
        log.info("校验数表列角色参数「{}」是否正确", roleCode);
        return ROLES.contains(roleCode);
    }
}
