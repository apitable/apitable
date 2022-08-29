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

/**
 *
 * @author Shawn Deng
 * @date 2021-04-07 11:48:17
 */
@Documented
@Constraint(validatedBy = NodeValidator.class)
@Target({ FIELD, TYPE, PARAMETER })
@Retention(RetentionPolicy.RUNTIME)
public @interface NodeMatch {

    String message() default "节点不存在";

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};
}
