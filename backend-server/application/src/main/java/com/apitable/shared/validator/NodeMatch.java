/*
 * APITable <https://github.com/apitable/apitable>
 * Copyright (C) 2022 APITable Ltd. <https://apitable.com>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

package com.apitable.shared.validator;

import static java.lang.annotation.ElementType.FIELD;
import static java.lang.annotation.ElementType.PARAMETER;
import static java.lang.annotation.ElementType.TYPE;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;
import java.lang.annotation.Documented;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/**
 * node match.
 */
@Documented
@Constraint(validatedBy = NodeValidator.class)
@Target({FIELD, TYPE, PARAMETER})
@Retention(RetentionPolicy.RUNTIME)
public @interface NodeMatch {

    /**
     * validate error alert message.
     *
     * @return message
     */
    String message() default "node does not exist";

    /**
     * default empty.
     *
     * @return empty
     */
    Class<?>[] groups() default {};

    /**
     * default empty.
     *
     * @return empty
     */
    Class<? extends Payload>[] payload() default {};
}
