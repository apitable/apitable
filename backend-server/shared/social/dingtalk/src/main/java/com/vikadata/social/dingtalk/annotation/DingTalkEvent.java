package com.vikadata.social.dingtalk.annotation;

import java.lang.annotation.Documented;
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

import com.vikadata.social.dingtalk.enums.DingTalkEventTag;
import com.vikadata.social.dingtalk.enums.DingTalkSyncAction;

/**
 * event subscription annotation
 */
@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
@Documented
public @interface DingTalkEvent {

    DingTalkEventTag value();

    DingTalkSyncAction action() default DingTalkSyncAction.DEFAULT;
}
