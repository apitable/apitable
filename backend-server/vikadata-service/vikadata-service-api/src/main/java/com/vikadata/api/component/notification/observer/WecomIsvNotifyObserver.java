package com.vikadata.api.component.notification.observer;

import java.util.List;

import javax.annotation.Resource;

import lombok.extern.slf4j.Slf4j;
import me.chanjar.weixin.common.error.WxErrorException;
import me.chanjar.weixin.cp.bean.message.WxCpMessage;

import com.vikadata.api.component.notification.subject.SocialNotifyContext;
import com.vikadata.api.enums.social.SocialPlatformType;
import com.vikadata.api.model.ro.player.NotificationCreateRo;
import com.vikadata.api.modular.social.enums.SocialAppType;
import com.vikadata.api.modular.social.service.ISocialCpIsvService;
import com.vikadata.api.modular.social.service.ISocialTenantService;
import com.vikadata.entity.SocialTenantEntity;

import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Component;

/**
 * <p>
 * 通知观察者--飞书第三方应用
 * </p>
 * @author zoe zheng
 * @date 2022/3/15 18:30
 */
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
            log.warn("企业微信通知模版未配置:{}", ro.getTemplateId());
            return;
        }
        List<String> toUsers = toUser(ro);
        if (toUsers.isEmpty()) {
            log.warn("企业微信通知用户为空,userId:{},memberId:{},unitId:{}", ro.getToUserId(), ro.getToMemberId(),
                    ro.getToUnitId());
            return;
        }
        SocialTenantEntity tenantEntity = iSocialTenantService.getByAppIdAndTenantId(context.getAppId(), context.getTenantId());
        try {
            iSocialCpIsvService.sendMessageToUser(tenantEntity, ro.getSpaceId(), wxCpMessage, toUsers);
        }
        catch (WxErrorException ex) {
            log.error("企业微信第三方服务商消息发送失败", ex);
        }
    }
}
