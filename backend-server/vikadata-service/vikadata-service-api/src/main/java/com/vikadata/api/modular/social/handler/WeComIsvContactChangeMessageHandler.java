package com.vikadata.api.modular.social.handler;

import java.util.Map;

import javax.annotation.Resource;

import cn.hutool.json.JSONUtil;
import lombok.extern.slf4j.Slf4j;
import me.chanjar.weixin.common.session.WxSessionManager;
import me.chanjar.weixin.cp.bean.message.WxCpTpXmlMessage;
import me.chanjar.weixin.cp.bean.message.WxCpXmlOutMessage;
import me.chanjar.weixin.cp.tp.service.WxCpTpService;

import com.vikadata.api.modular.social.enums.SocialCpIsvMessageProcessStatus;
import com.vikadata.api.modular.social.service.ISocialCpIsvMessageService;
import com.vikadata.entity.SocialCpIsvMessageEntity;
import com.vikadata.social.wecom.constants.WeComIsvMessageType;
import com.vikadata.social.wecom.handler.WeComIsvMessageHandler;

import org.springframework.stereotype.Component;

/**
 * <p>
 * The third party service provider initiates the notice of address book change from the We Com application market
 * </p>
 */
@Component
@Slf4j
public class WeComIsvContactChangeMessageHandler implements WeComIsvMessageHandler {

    @Resource
    private ISocialCpIsvMessageService socialCpIsvMessageService;

    @Override
    public WeComIsvMessageType messageType() {

        return WeComIsvMessageType.CONTACT_CHANGE;

    }

    @Override
    public WxCpXmlOutMessage handle(WxCpTpXmlMessage wxMessage, Map<String, Object> context,
            WxCpTpService wxCpService, WxSessionManager sessionManager) {

        SocialCpIsvMessageEntity entity = SocialCpIsvMessageEntity.builder()
                .type(WeComIsvMessageType.CONTACT_CHANGE.getType())
                .suiteId(wxMessage.getSuiteId())
                .infoType(WeComIsvMessageType.CONTACT_CHANGE.getInfoType())
                .authCorpId(wxMessage.getAuthCorpId())
                .timestamp(Long.parseLong(wxMessage.getTimeStamp()))
                .message(JSONUtil.toJsonStr(wxMessage))
                .processStatus(SocialCpIsvMessageProcessStatus.PENDING.getValue())
                .build();
        socialCpIsvMessageService.save(entity);

        socialCpIsvMessageService.sendToMq(entity.getId(), entity.getInfoType(), entity.getAuthCorpId(), entity.getSuiteId());

        return null;

    }

}
