package com.vikadata.api.annotation;

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
 * api resource
 * </p>
 *
 * @author Shawn Deng
 */
@Target({ ElementType.METHOD, ElementType.TYPE })
@Retention(RetentionPolicy.RUNTIME)
@Documented
@RequestMapping(method = RequestMethod.POST)
public @interface ApiResource {

    /**
     * <pre>
     * unique resource code
     * description: This annotation attribute can be left blank, default controller name + $ + method name
     * </pre>
     */
    String code() default "";

    /**
     * resource name
     */
    String name() default "";

    /**
     * alias requestMapping path
     */
    @AliasFor(annotation = RequestMapping.class)
    String[] path() default {};

    /**
     * alias requestMapping method
     */
    @AliasFor(annotation = RequestMapping.class)
    RequestMethod[] method() default {};

    /**
     * whether ignore this attribute, default false
     */
    boolean ignore() default false;

}
