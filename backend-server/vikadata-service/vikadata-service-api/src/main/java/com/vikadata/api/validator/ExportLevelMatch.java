package com.vikadata.api.validator;

import java.lang.annotation.Documented;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

import javax.validation.Constraint;
import javax.validation.Payload;

import static java.lang.annotation.ElementType.FIELD;
import static java.lang.annotation.ElementType.METHOD;
import static java.lang.annotation.ElementType.PARAMETER;

/**
 * @author tao
 */
@Documented
@Target({ FIELD, METHOD, PARAMETER})
@Retention(RetentionPolicy.RUNTIME)
@Constraint(validatedBy = ExportLevelValidator.class)
public @interface ExportLevelMatch {

    String message() default "【Security Settings】- The node export permission is illegally set";

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};

}
