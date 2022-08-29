package com.vikadata.boot.autoconfigure.social.feishu.annotation;

import java.lang.annotation.Documented;
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/**
 * <p>
 * 事件处理 注解
 * </p>
 *
 * @author Shawn Deng
 * @date 2020/11/23 19:46
 */
@Target({ElementType.METHOD})
@Retention(RetentionPolicy.RUNTIME)
@Documented
public @interface FeishuEventListener {
}
