package com.vikadata.api.component.vika;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.apitable.starter.vika.core.VikaOperations;
import com.apitable.starter.vika.core.model.DingTalkSubscriptionInfo;
import com.vikadata.api.config.properties.ConstProperties;
import com.vikadata.core.util.SpringContextHolder;

@Deprecated
public class VikaFactory {

    private static final Logger LOGGER = LoggerFactory.getLogger(VikaFactory.class);

    public static void saveDingTalkSubscriptionInfo(DingTalkSubscriptionInfo subscriptionInfo) {
        ConstProperties properties = SpringContextHolder.getBean(ConstProperties.class);
        if (properties.getDingTalkOrderDatasheet() == null) {
            return;
        }
        SpringContextHolder.getBean(VikaOperations.class).saveDingTalkSubscriptionInfo(properties.getDingTalkOrderDatasheet(), subscriptionInfo);
    }
}
