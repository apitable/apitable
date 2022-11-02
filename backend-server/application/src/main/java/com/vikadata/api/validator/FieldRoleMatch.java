package com.vikadata.api.validator;

import java.lang.annotation.Documented;
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

import javax.validation.Constraint;
import javax.validation.Payload;

/**
 * field role validation annotation
 * @author Shawn Deng
 * @date 2021-04-07 11:08:33
 */
@Documented
@Constraint(validatedBy = FieldRoleValidator.class)
@Target({ ElementType.FIELD })
@Retention(RetentionPolicy.RUNTIME)
public @interface FieldRoleMatch {

    String message() default "role no exist";

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};
}
