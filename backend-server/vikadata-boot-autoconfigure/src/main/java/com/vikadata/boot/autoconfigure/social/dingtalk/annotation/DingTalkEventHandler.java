package com.vikadata.boot.autoconfigure.social.dingtalk.annotation;

import java.lang.annotation.Documented;
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

import org.springframework.stereotype.Component;

/**
 * <p>
 * Represents a event component of dingtalk
 * if the method in each class is marked with {@link DingTalkEventListener},
 * </p>
 * @author zoe zheng
 */
@Target({ ElementType.TYPE })
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Component
public @interface DingTalkEventHandler {
}
