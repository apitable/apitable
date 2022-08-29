package com.vikadata.api.component.notification.observer;

import java.util.List;

import javax.annotation.Resource;

import lombok.extern.slf4j.Slf4j;
import me.chanjar.weixin.cp.bean.message.WxCpMessage;

import com.vikadata.api.component.notification.subject.SocialNotifyContext;
import com.vikadata.api.enums.social.SocialPlatformType;
import com.vikadata.api.model.ro.player.NotificationCreateRo;
import com.vikadata.api.modular.social.enums.SocialAppType;
import com.vikadata.api.modular.social.service.IWeComService;

import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Component;

/**
 * <p>
 * 通知观察者--钉钉自建应用
 * </p>
 * @author zoe zheng
 * @date 2022/3/15 18:30
 */
@Component
@Slf4j
@ConditionalOnProperty(value = "vikadata-starter.social.wecom.enabled", havingValue = "true")
public class WecomNotifyObserver extends AbstractWecomNotifyObserver {

    @Resource
    private IWeComService iWeComService;

    @Override
    public boolean isNotify(SocialNotifyContext context) {
        return SocialAppType.INTERNAL.equals(context.getAppType()) && SocialPlatformType.WECOM.equals(context.getPlatform());
    }

    @Override
    public void notify(SocialNotifyContext context, NotificationCreateRo ro) {
        WxCpMessage wxCpMessage = renderTemplate(context, ro);
        if (wxCpMessage == null) {
            log.warn("自建企业微信通知模版未配置:{}", ro.getTemplateId());
            return;
        }
        List<String> toUsers = toUser(ro);
        if (toUsers.isEmpty()) {
            log.warn("自建企业微信通知用户为空,userId:{},memberId:{},unitId:{}", ro.getToUserId(), ro.getToMemberId(), ro.getToUnitId());
            return;
        }
        iWeComService.sendMessageToUserPrivate(context.getTenantId(), Integer.valueOf(context.getAppId()), ro.getSpaceId(), toUsers, wxCpMessage);
    }
}
