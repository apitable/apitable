package com.vikadata.api.shared.validator;

import java.util.Arrays;
import java.util.List;

import javax.validation.ConstraintValidator;
import javax.validation.ConstraintValidatorContext;

import lombok.extern.slf4j.Slf4j;

import com.vikadata.api.enterprise.control.infrastructure.role.RoleConstants.Field;

@Slf4j
public class FieldRoleValidator implements ConstraintValidator<FieldRoleMatch, String> {

    private static final List<String> ROLES = Arrays.asList(Field.EDITOR, Field.READER);

    @Override
    public boolean isValid(String roleCode, ConstraintValidatorContext context) {
        return ROLES.contains(roleCode);
    }
}
