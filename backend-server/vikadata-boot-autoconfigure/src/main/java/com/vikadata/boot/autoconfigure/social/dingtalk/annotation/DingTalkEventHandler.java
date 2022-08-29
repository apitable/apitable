package com.vikadata.boot.autoconfigure.social.dingtalk.annotation;

import java.lang.annotation.Documented;
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

import org.springframework.stereotype.Component;

/**
 * <p>
 * 标注这个注解，则代表是一个钉钉事件组件
 * 可注解多个类，每个类里存在的方法如果标注{@code @DingTalkEventListener} 是处理事件
 * </p>
 * @author zoe zheng
 * @date 2021/5/13 2:13 下午
 */
@Target({ ElementType.TYPE })
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Component
public @interface DingTalkEventHandler {
}
