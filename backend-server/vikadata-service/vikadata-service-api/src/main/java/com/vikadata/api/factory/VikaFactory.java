package com.vikadata.api.factory;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.vikadata.api.config.properties.ConstProperties;
import com.vikadata.boot.autoconfigure.spring.SpringContextHolder;
import com.vikadata.integration.vika.VikaOperations;
import com.vikadata.integration.vika.model.DingTalkSubscriptionInfo;

/**
 * <p>
 * 维格表处理工厂类
 * </p>
 *
 * @author Chambers
 * @date 2021/7/5
 */
public class VikaFactory {

    private static final Logger LOGGER = LoggerFactory.getLogger(VikaFactory.class);

    public static void saveDingTalkSubscriptionInfo(DingTalkSubscriptionInfo subscriptionInfo) {
        // 保存到维格表
        ConstProperties properties = SpringContextHolder.getBean(ConstProperties.class);
        if (properties.getDingTalkOrderDatasheet() == null) {
            LOGGER.warn("保存钉钉订阅信息的维格表ID 尚未配置");
            return;
        }
        SpringContextHolder.getBean(VikaOperations.class).saveDingTalkSubscriptionInfo(properties.getDingTalkOrderDatasheet(), subscriptionInfo);
    }
}
