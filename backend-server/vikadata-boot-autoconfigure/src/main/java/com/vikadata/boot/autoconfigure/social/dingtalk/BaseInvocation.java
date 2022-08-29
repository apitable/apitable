package com.vikadata.boot.autoconfigure.social.dingtalk;

import java.lang.reflect.Method;

import com.vikadata.boot.autoconfigure.social.dingtalk.annotation.DingTalkEventHandler;

/**
 * <p> 
 * 注解抽象基础类
 * 提供 {@code DingTalkEventHandler} 的整合
 * 继承的子类都拥有必须的基础注解
 * </p> 
 * @author zoe zheng 
 * @date 2021/5/13 2:20 下午
 */
public abstract class BaseInvocation {

    private Method method;

    private Object object;

    private DingTalkEventHandler handlerAnnotation;

    public BaseInvocation(Method method, Object object) {
        this.method = method;
        this.object = object;
        this.handlerAnnotation = object.getClass().getAnnotation(DingTalkEventHandler.class);
    }

    public Method getMethod() {
        return method;
    }

    public Object getObject() {
        return object;
    }
}
