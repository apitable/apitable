package com.vikadata.api.user.strategey;

import java.util.Map;
import java.util.Optional;

import javax.annotation.Resource;

import cn.hutool.core.map.MapUtil;

import com.vikadata.api.enterprise.social.enums.SocialPlatformType;
import com.vikadata.core.exception.BusinessException;

import org.springframework.beans.factory.InitializingBean;
import org.springframework.stereotype.Component;

/**
 * <p>
 * Create a simple social user factory
 * </p>
 */
@Component
public class CreateSocialUserSimpleFactory implements InitializingBean {

    private static Map<Integer, CreateSocialUserStrategey> CREATE_SOCIAL_USER_STRATEGY_MAP = MapUtil.newHashMap(2);

    @Resource
    private SocialFeishuUserStrategey socialFeishuUserStrategey;

    @Resource
    private SocialWeComUserStrategey socialWeComUserStrategey;

    @Resource
    private SocialDingTalkUserStrategey socialDingTalkUserStrategey;

    @Override
    public void afterPropertiesSet() throws Exception {
        CREATE_SOCIAL_USER_STRATEGY_MAP.put(SocialPlatformType.FEISHU.getValue(), socialFeishuUserStrategey);
        CREATE_SOCIAL_USER_STRATEGY_MAP.put(SocialPlatformType.WECOM.getValue(), socialWeComUserStrategey);
        CREATE_SOCIAL_USER_STRATEGY_MAP.put(SocialPlatformType.DINGTALK.getValue(), socialDingTalkUserStrategey);
    }

    /**
     * Get the processing policy according to the type
     *
     * @param socialPlatformType    Type of third-party social software platform
     */
    public CreateSocialUserStrategey getStrategy(Integer socialPlatformType) {
        CreateSocialUserStrategey strategy = CREATE_SOCIAL_USER_STRATEGY_MAP.get(socialPlatformType);
        return Optional.ofNullable(strategy).orElseThrow(() -> new BusinessException("Unknown third-party account type"));
    }

}
