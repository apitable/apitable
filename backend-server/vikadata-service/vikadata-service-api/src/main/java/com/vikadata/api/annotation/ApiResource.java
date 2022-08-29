package com.vikadata.api.annotation;

import org.springframework.core.annotation.AliasFor;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import java.lang.annotation.*;

/**
 * <p>
 * 资源标识
 * </p>
 *
 * @author Shawn Deng
 * @date 2018/11/5 16:32
 */
@Target({ElementType.METHOD, ElementType.TYPE})
@Retention(RetentionPolicy.RUNTIME)
@Documented
@RequestMapping(method = RequestMethod.POST)
public @interface ApiResource {

	/**
	 * <pre>
	 * 资源编码唯一标识.
	 *
	 * 说明:
	 *     1.可不填写此注解属性.
	 *     2.若不填写,则默认生成的编码标识为: 控制器类名称 + 分隔符$ + 方法名称.
	 *     3.若编码存在重复则系统启动异常
	 *
	 * </pre>
	 */
	String code() default "";

	/**
	 * 资源名称(必填项)
	 */
	String name() default "";

	/**
	 * 请求路径(同RequestMapping)
	 */
	@AliasFor(annotation = RequestMapping.class)
	String[] path() default {};

	/**
	 * 请求的http方法(同RequestMapping)
	 */
	@AliasFor(annotation = RequestMapping.class)
	RequestMethod[] method() default {};

	/**
	 * 是否不理会
	 */
	boolean ignore() default false;

}
