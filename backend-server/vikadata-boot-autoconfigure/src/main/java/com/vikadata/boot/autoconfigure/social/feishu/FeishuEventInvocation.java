package com.vikadata.boot.autoconfigure.social.feishu;

import java.lang.reflect.Method;

import com.vikadata.boot.autoconfigure.social.feishu.annotation.FeishuEventListener;

/**
 * 事件监听器的调用包装类
 *
 * @author Shawn Deng
 * @date 2020-11-24 10:29:19
 */
public class FeishuEventInvocation extends BaseInvocation {

    private final FeishuEventListener eventListenerAnnotation;

    private final Class<?> eventType;

    public FeishuEventInvocation(Method method, Object o, Class<?> eventType) {
        super(method, o);
        this.eventType = eventType;
        this.eventListenerAnnotation = method.getAnnotation(FeishuEventListener.class);
    }

    public Class<?> getEventType() {
        return eventType;
    }
}
