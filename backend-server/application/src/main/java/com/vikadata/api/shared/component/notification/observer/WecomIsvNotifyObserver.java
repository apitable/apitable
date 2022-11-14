package com.vikadata.api.shared.component.notification.observer;

import java.util.List;

import javax.annotation.Resource;

import lombok.extern.slf4j.Slf4j;
import me.chanjar.weixin.common.error.WxErrorException;
import me.chanjar.weixin.cp.bean.message.WxCpMessage;

import com.vikadata.api.shared.component.notification.subject.SocialNotifyContext;
import com.vikadata.api.enterprise.social.enums.SocialPlatformType;
import com.vikadata.api.player.ro.NotificationCreateRo;
import com.vikadata.api.enterprise.social.enums.SocialAppType;
import com.vikadata.api.enterprise.social.service.ISocialCpIsvService;
import com.vikadata.api.enterprise.social.service.ISocialTenantService;
import com.vikadata.entity.SocialTenantEntity;

import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Component;

@Component
@Slf4j
@ConditionalOnProperty(value = "vikadata-starter.social.wecom.enabled", havingValue = "true")
public class WecomIsvNotifyObserver extends AbstractWecomNotifyObserver {
    @Resource
    private ISocialCpIsvService iSocialCpIsvService;

    @Resource
    private ISocialTenantService iSocialTenantService;

    @Override
    public boolean isNotify(SocialNotifyContext context) {
        return SocialAppType.ISV.equals(context.getAppType()) && SocialPlatformType.WECOM.equals(context.getPlatform());
    }

    @Override
    public void notify(SocialNotifyContext context, NotificationCreateRo ro) {
        WxCpMessage wxCpMessage = renderTemplate(context, ro);
        if (wxCpMessage == null) {
            return;
        }
        List<String> toUsers = toUser(ro);
        if (toUsers.isEmpty()) {
            return;
        }
        SocialTenantEntity tenantEntity = iSocialTenantService.getByAppIdAndTenantId(context.getAppId(), context.getTenantId());
        try {
            iSocialCpIsvService.sendMessageToUser(tenantEntity, ro.getSpaceId(), wxCpMessage, toUsers);
        }
        catch (WxErrorException ex) {
            log.error("fail to send wecom isv card message", ex);
        }
    }
}
