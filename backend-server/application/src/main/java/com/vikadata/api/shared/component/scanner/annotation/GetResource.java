package com.vikadata.api.shared.component.scanner.annotation;

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
 * resource with get method
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
	 * resource description
	 */
	String description() default "";

	/**
	 * need validate whether to login
	 */
	boolean requiredLogin() default true;

	/**
	 * whether to validate permission
	 */
	boolean requiredPermission() default true;

	/**
	 * request path
	 */
	@AliasFor(annotation = RequestMapping.class)
	String[] path() default {};

	/**
	 * request method
	 */
	@AliasFor(annotation = RequestMapping.class)
	RequestMethod[] method() default RequestMethod.GET;

	/**
	 * permission tags
	 */
	String[] tags() default {};

    /**
     * whether to validate domain
     */
    boolean requiredAccessDomain() default false;

	/**
	 * whether ignore this
	 */
	boolean ignore() default false;

    /**
     * See Also:
     * org.springframework.http.MediaType
     */
    @AliasFor(annotation = RequestMapping.class)
    String[] produces() default {};
}
