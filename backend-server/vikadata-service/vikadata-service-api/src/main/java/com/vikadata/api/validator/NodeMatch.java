package com.vikadata.api.validator;

import java.lang.annotation.Documented;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

import javax.validation.Constraint;
import javax.validation.Payload;

import static java.lang.annotation.ElementType.FIELD;
import static java.lang.annotation.ElementType.PARAMETER;
import static java.lang.annotation.ElementType.TYPE;

@Documented
@Constraint(validatedBy = NodeValidator.class)
@Target({ FIELD, TYPE, PARAMETER })
@Retention(RetentionPolicy.RUNTIME)
public @interface NodeMatch {

    String message() default "node does not exist";

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};
}
