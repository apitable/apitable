package com.apitable.starter.social.feishu.autoconfigure;

import java.lang.reflect.Method;

import com.apitable.starter.social.feishu.autoconfigure.annotation.FeishuEventHandler;

/**
 * abstract annotation base class
 * deal with {@link FeishuEventHandler}
 *
 * @author Shawn Deng
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
