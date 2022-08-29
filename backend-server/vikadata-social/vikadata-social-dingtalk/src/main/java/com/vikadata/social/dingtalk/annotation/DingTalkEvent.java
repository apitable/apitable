package com.vikadata.social.dingtalk.annotation;

import java.lang.annotation.Documented;
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

import com.vikadata.social.dingtalk.enums.DingTalkEventTag;
import com.vikadata.social.dingtalk.enums.DingTalkSyncAction;

/**
 * <p>
 * 事件订阅注解
 * </p>
 * @author zoe zheng
 * @date 2021/5/13 2:00 下午
 */
@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
@Documented
public @interface DingTalkEvent {

    DingTalkEventTag value();

    DingTalkSyncAction action() default DingTalkSyncAction.DEFAULT;
}
