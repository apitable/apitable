package com.apitable.starter.social.feishu.autoconfigure;

import java.lang.reflect.Method;

import com.apitable.starter.social.feishu.autoconfigure.annotation.FeishuCardActionListener;

/**
 * Message Card event call
 *
 * @author Shawn Deng
 */
public class FeishuCardActionInvocation extends BaseInvocation {

    private final FeishuCardActionListener cardActionAnnotation;

    public FeishuCardActionInvocation(Method method, Object o) {
        super(method, o);
        this.cardActionAnnotation = method.getAnnotation(FeishuCardActionListener.class);
    }

    public FeishuCardActionListener getCardActionAnnotation() {
        return cardActionAnnotation;
    }
}
