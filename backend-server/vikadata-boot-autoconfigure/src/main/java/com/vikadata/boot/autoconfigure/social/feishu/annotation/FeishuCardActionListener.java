package com.vikadata.boot.autoconfigure.social.feishu.annotation;

import java.lang.annotation.Documented;
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/**
 * <p>
 * 消息卡片交互事件
 * </p>
 *
 * @author Shawn Deng
 * @date 2020/11/23 19:44
 */
@Target({ElementType.METHOD})
@Retention(RetentionPolicy.RUNTIME)
@Documented
public @interface FeishuCardActionListener {

    String methodName();
}
