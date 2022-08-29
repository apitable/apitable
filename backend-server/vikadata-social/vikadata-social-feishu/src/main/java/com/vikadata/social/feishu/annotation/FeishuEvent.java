package com.vikadata.social.feishu.annotation;

import java.lang.annotation.Documented;
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/**
 * <p>
 * 事件订阅注解
 * </p>
 *
 * @author Shawn Deng
 * @date 2020/11/23 18:59
 */
@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
@Documented
public @interface FeishuEvent {

    String value();
}
