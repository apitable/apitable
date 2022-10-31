package com.vikadata.api.component.notification.observer;

import javax.annotation.Resource;

import cn.hutool.core.util.StrUtil;
import lombok.extern.slf4j.Slf4j;

import com.vikadata.api.component.notification.subject.SocialNotifyContext;
import com.vikadata.api.enums.social.SocialPlatformType;
import com.vikadata.api.model.ro.player.NotificationCreateRo;
import com.vikadata.api.modular.appstore.enums.AppType;
import com.vikadata.api.modular.appstore.model.LarkInstanceConfig;
import com.vikadata.api.modular.appstore.model.LarkInstanceConfigProfile;
import com.vikadata.api.modular.appstore.service.IAppInstanceService;
import com.vikadata.api.modular.social.enums.SocialAppType;
import com.vikadata.api.modular.social.service.IFeishuService;
import com.vikadata.entity.AppInstanceEntity;
import com.vikadata.social.feishu.card.Message;
import com.vikadata.social.feishu.model.BatchSendChatMessageResult;

import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Component;

@Component
@Slf4j
@ConditionalOnProperty(value = "vikadata-starter.social.feishu.enabled", havingValue = "true")
public class LarkNotifyObserver extends AbstractLarkNotifyObserver {

    @Resource
    private IFeishuService iFeishuService;

    @Resource
    private IAppInstanceService iAppInstanceService;


    @Override
    public boolean isNotify(SocialNotifyContext context) {
        return SocialAppType.INTERNAL.equals(context.getAppType()) && SocialPlatformType.FEISHU.equals(context.getPlatform());
    }

    @Override
    public void notify(SocialNotifyContext context, NotificationCreateRo ro) {
        Message message = renderTemplate(context, ro);
        if (message == null) {
            return;
        }
        AppInstanceEntity instance = iAppInstanceService.getInstanceBySpaceIdAndAppType(ro.getSpaceId(), AppType.LARK);
        if (instance == null) {
            return;
        }
        LarkInstanceConfig instanceConfig = LarkInstanceConfig.fromJsonString(instance.getConfig());
        LarkInstanceConfigProfile profile = (LarkInstanceConfigProfile) instanceConfig.getProfile();
        if (StrUtil.isBlank(profile.getAppKey())) {
            return;
        }
        if (!profile.getAppKey().equals(context.getAppId())) {
            return;
        }
        // Switch Context
        iFeishuService.switchContextIfAbsent(profile.buildConfigStorage());
        try {
            BatchSendChatMessageResult result = iFeishuService.batchSendCardMessage(context.getTenantId(), toUser(ro),
                    message);
        }
        catch (Exception e) {
            log.error("fail to send car message", e);
        }
    }
}
