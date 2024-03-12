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

package com.apitable.shared.component.scanner.annotation;

import java.lang.annotation.Documented;
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;
import org.springframework.core.annotation.AliasFor;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

/**
 * <p>
 * resource with get method.
 * </p>
 *
 * @author Shawn Deng
 */
@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
@Documented
@RequestMapping(method = RequestMethod.GET)
public @interface GetResource {

    /**
     * <pre>
     * unique resource code.
     * description: This annotation attribute can be left blank, default controller name + $ + method name
     * </pre>
     */
    String code() default "";

    /**
     * resource name.
     */
    @AliasFor(annotation = RequestMapping.class, attribute = "name")
    String name() default "";

    /**
     * resource description.
     */
    String description() default "";

    /**
     * need validate whether to login.
     */
    boolean requiredLogin() default true;

    /**
     * whether to validate permission.
     */
    boolean requiredPermission() default true;

    /**
     * alias requestMapping path.
     */
    @AliasFor(annotation = RequestMapping.class, attribute = "value")
    String[] value() default {};

    /**
     * request path.
     */
    @AliasFor(annotation = RequestMapping.class, attribute = "path")
    String[] path() default {};

    /**
     * request method.
     */
    @AliasFor(annotation = RequestMapping.class)
    RequestMethod[] method() default RequestMethod.GET;

    /**
     * permission tags.
     */
    String[] tags() default {};

    /**
     * whether to validate domain.
     */
    boolean requiredAccessDomain() default false;

    /**
     * whether ignore this.
     */
    boolean ignore() default false;

    /**
     * See Also:
     * org.springframework.http.MediaType.
     */
    @AliasFor(annotation = RequestMapping.class)
    String[] produces() default {};
}
