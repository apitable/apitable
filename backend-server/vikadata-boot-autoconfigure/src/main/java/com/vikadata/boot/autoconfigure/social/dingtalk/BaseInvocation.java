package com.vikadata.boot.autoconfigure.social.dingtalk;

import java.lang.reflect.Method;

import com.vikadata.boot.autoconfigure.social.dingtalk.annotation.DingTalkEventHandler;

/**
 * <p> 
 * Annotation abstract base class
 * Provide the integration of {@link DingTalkEventHandler}
 * All inherited subclasses have the necessary basic annotation
 * </p> 
 * @author zoe zheng 
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
