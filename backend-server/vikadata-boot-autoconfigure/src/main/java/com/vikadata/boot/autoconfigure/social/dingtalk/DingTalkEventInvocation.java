package com.vikadata.boot.autoconfigure.social.dingtalk;

import java.lang.reflect.Method;

import com.vikadata.boot.autoconfigure.social.dingtalk.annotation.DingTalkEventListener;


/** 
* <p> 
* 事件监听器的调用包装类
* </p> 
* @author zoe zheng 
* @date 2021/5/13 6:15 下午
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
