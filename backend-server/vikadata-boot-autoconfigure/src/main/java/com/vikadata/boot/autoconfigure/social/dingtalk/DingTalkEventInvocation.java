package com.vikadata.boot.autoconfigure.social.dingtalk;

import java.lang.reflect.Method;

import com.vikadata.boot.autoconfigure.social.dingtalk.annotation.DingTalkEventListener;


/** 
* <p> 
* wrapper class of event listener
* </p> 
* @author zoe zheng 
*/
public class DingTalkEventInvocation extends BaseInvocation {

    private DingTalkEventListener eventListenerAnnotation;

    private Class<?> eventType;


    public DingTalkEventInvocation(Method method, Object o, Class<?> eventType) {
        super(method, o);
        this.eventType = eventType;
        this.eventListenerAnnotation = method.getAnnotation(DingTalkEventListener.class);
    }

    public Class<?> getEventType() {
        return eventType;
    }
}
