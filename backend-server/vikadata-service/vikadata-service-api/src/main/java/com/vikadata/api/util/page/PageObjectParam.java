package com.vikadata.api.util.page;

import java.lang.annotation.*;

import static com.vikadata.api.constants.PageConstants.PAGE_PARAM;

/**
 * <p>
 * String transform Object
 * </p>
 *
 * @author Shawn Deng
 */
@Target(ElementType.PARAMETER)
@Retention(RetentionPolicy.RUNTIME)
@Documented
public @interface PageObjectParam {

    String name() default PAGE_PARAM;

    boolean required() default true;
}
