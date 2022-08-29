package com.vikadata.boot.autoconfigure.social.feishu;

import java.lang.reflect.Method;

import com.vikadata.boot.autoconfigure.social.feishu.annotation.FeishuEventHandler;

/**
 * 注解抽象基础类
 * 提供 {@code FeishuEventHandler} 的整合
 * 继承的子类都拥有必须的基础注解
 *
 * @author Shawn Deng
 * @date 2020-11-24 10:23:19
 */
public abstract class BaseInvocation {

    private final Method method;

    private final Object object;

    private final FeishuEventHandler handlerAnnotation;

    public BaseInvocation(Method method, Object object) {
        this.method = method;
        this.object = object;
        this.handlerAnnotation = object.getClass().getAnnotation(FeishuEventHandler.class);
    }

    public Method getMethod() {
        return method;
    }

    public Object getObject() {
        return object;
    }
}
