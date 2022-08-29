package com.vikadata.api.validator;

import java.lang.annotation.Documented;
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

import javax.validation.Constraint;
import javax.validation.Payload;

/**
 *
 * @author Shawn Deng
 * @date 2021-04-07 11:45:02
 */
@Documented
@Constraint(validatedBy = UnitValidator.class)
@Target({ ElementType.FIELD })
@Retention(RetentionPolicy.RUNTIME)
public @interface UnitsMatch {

    String message() default "unit no exist in space";

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};
}
