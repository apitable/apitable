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
 * post方式请求http的资源标识
 * </p>
 *
 * @author Shawn Deng
 * @date 2018/11/5 16:37
 */
@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
@Documented
@RequestMapping(method = RequestMethod.POST)
public @interface PostResource {

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
     * 资源描述
     */
    String description() default "";

    /**
     * 是否需要登录(true-需要,false-不需要)
     */
    boolean requiredLogin() default true;

    /**
     * 是否需要校验用户权限(true-需要,false-不需要)
     */
    boolean requiredPermission() default true;

    /**
     * 请求路径(同RequestMapping)
     */
    @AliasFor(annotation = RequestMapping.class)
    String[] path() default {};

    /**
     * 请求的http方法(同RequestMapping)
     */
    @AliasFor(annotation = RequestMapping.class)
    RequestMethod[] method() default RequestMethod.POST;

    /**
     * 父级，空则代表自身
     * operation = false 时必须填写
     */
    String[] tags() default {};

    /**
     * 是否需要校验域名(true-需要,false-不需要)
     */
    boolean requiredAccessDomain() default false;

    /**
     * 是否不理会，非资源标识
     */
    boolean ignore() default false;

    /**
     * See Also:
     * org.springframework.http.MediaType
     */
    @AliasFor(annotation = RequestMapping.class)
    String[] produces() default {};

}
