package com.vikadata.boot.autoconfigure.social.dingtalk.annotation;

import java.lang.annotation.Documented;
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/** 
* <p> 
* 事件处理 注解
* </p> 
* @author zoe zheng 
* @date 2021/5/13 2:16 下午
*/
@Target({ElementType.METHOD})
@Retention(RetentionPolicy.RUNTIME)
@Documented
public @interface DingTalkEventListener {
}
