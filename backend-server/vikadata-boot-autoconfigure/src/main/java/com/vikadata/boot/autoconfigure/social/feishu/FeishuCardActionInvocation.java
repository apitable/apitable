package com.vikadata.boot.autoconfigure.social.feishu;

import java.lang.reflect.Method;

import com.vikadata.boot.autoconfigure.social.feishu.annotation.FeishuCardActionListener;

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
