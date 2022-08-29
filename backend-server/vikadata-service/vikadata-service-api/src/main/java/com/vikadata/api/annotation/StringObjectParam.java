package com.vikadata.api.annotation;

import java.lang.annotation.*;

/**
 * <p>
 * 字符串对象参数注解
 * </p>
 *
 * @author Shawn Deng
 * @date 2020/10/16 11:08
 */
@Target(ElementType.PARAMETER)
@Retention(RetentionPolicy.RUNTIME)
@Documented
public @interface StringObjectParam {

    String name() default "stringObjectParams";

    boolean required() default true;
}
