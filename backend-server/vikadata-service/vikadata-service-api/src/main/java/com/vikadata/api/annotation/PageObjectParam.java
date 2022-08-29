package com.vikadata.api.annotation;

import java.lang.annotation.*;

import static com.vikadata.api.constants.PageConstants.PAGE_PARAM;

/**
 * <p>
 * 字符串 转 分页查询参数对象
 * </p>
 *
 * @author Shawn Deng
 * @date 2019/11/25 12:59
 */
@Target(ElementType.PARAMETER)
@Retention(RetentionPolicy.RUNTIME)
@Documented
public @interface PageObjectParam {

    String name() default PAGE_PARAM;

    boolean required() default true;
}
