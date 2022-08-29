package com.vikadata.social.feishu.annotation;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/**
 * <p>
 * 机器人接收消息事件注解
 * </p>
 *
 * @author Shawn Deng
 * @date 2020/11/23 19:00
 */
@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
public @interface FeishuMessageEvent {

    String value();
}
