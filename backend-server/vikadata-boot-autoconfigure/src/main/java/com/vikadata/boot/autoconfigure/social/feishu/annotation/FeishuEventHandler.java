package com.vikadata.boot.autoconfigure.social.feishu.annotation;

import java.lang.annotation.Documented;
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

import org.springframework.stereotype.Component;

/**
 * 标注这个注解，则代表是一个飞书事件组件
 * 可注解多个类，每个类里存在的方法如果标注{@code @FeishuEventListener} 或 {@code @FeishuCardActionListener都是处理事件
 *
 * @author Shawn Deng
 * @date 2020-11-23 19:06:18
 */
@Target({ElementType.TYPE})
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Component
public @interface FeishuEventHandler {
}
