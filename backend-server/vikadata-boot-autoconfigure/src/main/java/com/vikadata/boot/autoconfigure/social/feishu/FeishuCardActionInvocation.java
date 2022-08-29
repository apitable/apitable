package com.vikadata.boot.autoconfigure.social.feishu;

import java.lang.reflect.Method;

import com.vikadata.boot.autoconfigure.social.feishu.annotation.FeishuCardActionListener;

/**
 * 消息卡片交互 注解调用类
 *
 * @author Shawn Deng
 * @date 2020-11-24 10:30:54
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
