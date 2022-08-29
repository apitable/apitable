package com.vikadata.api.modular.user.strategey;

import java.util.Map;
import java.util.Optional;

import javax.annotation.Resource;

import cn.hutool.core.map.MapUtil;

import com.vikadata.api.enums.social.SocialPlatformType;
import com.vikadata.core.exception.BusinessException;

import org.springframework.beans.factory.InitializingBean;
import org.springframework.stereotype.Component;

/**
 * <p>
 * 创建SocialUser简单的工厂
 * </p>
 *
 * @author Pengap
 * @date 2021/8/23 11:30:15
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
     * 根据类型获取处理策略
     *
     * @param socialPlatformType    第三方社交软件平台类型
     * @author Pengap
     * @date 2021/8/23 11:41:41
     */
    public CreateSocialUserStrategey getStrategy(Integer socialPlatformType) {
        CreateSocialUserStrategey strategy = CREATE_SOCIAL_USER_STRATEGY_MAP.get(socialPlatformType);
        return Optional.ofNullable(strategy).orElseThrow(() -> new BusinessException("未知的第三方帐号类型"));
    }

}
