package com.vikadata.api.enterprise.social.handler;

import java.util.Map;

import javax.annotation.Resource;

import cn.hutool.json.JSONUtil;
import me.chanjar.weixin.common.session.WxSessionManager;
import me.chanjar.weixin.cp.bean.message.WxCpTpXmlMessage;
import me.chanjar.weixin.cp.bean.message.WxCpXmlOutMessage;
import me.chanjar.weixin.cp.config.WxCpTpConfigStorage;
import me.chanjar.weixin.cp.tp.service.WxCpTpService;

import com.vikadata.api.enterprise.social.enums.SocialCpIsvMessageProcessStatus;
import com.vikadata.api.enterprise.social.service.ISocialCpIsvMessageService;
import com.vikadata.entity.SocialCpIsvMessageEntity;
import com.vikadata.social.wecom.WeComTemplate;
import com.vikadata.social.wecom.constants.WeComIsvMessageType;
import com.vikadata.social.wecom.handler.WeComIsvMessageHandler;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

/**
 * <p>
 * The third-party service provider sends a notice of authorization cancellation from the We Com application market
 * </p>
 */
@Component
public class WeComIsvAuthCancelMessageHandler implements WeComIsvMessageHandler {

    @Autowired(required = false)
    private WeComTemplate weComTemplate;

    @Resource
    private ISocialCpIsvMessageService socialCpIsvMessageService;

    @Override
    public WeComIsvMessageType messageType() {

        return WeComIsvMessageType.AUTH_CANCEL;

    }

    @Override
    public WxCpXmlOutMessage handle(WxCpTpXmlMessage wxMessage, Map<String, Object> context,
            WxCpTpService wxCpService, WxSessionManager sessionManager) {

        // Set the access of the enterprise_ Token expired
        WxCpTpService wxCpTpService = weComTemplate.isvService(wxMessage.getSuiteId());
        @SuppressWarnings("deprecation") //  need to use this object to refresh access_ token
        WxCpTpConfigStorage wxCpTpConfigStorage = wxCpTpService.getWxCpTpConfigStorage();
        wxCpTpConfigStorage.expireAccessToken(wxMessage.getAuthCorpId());
        // The response must be completed within 1000ms, so only the relevant information is recorded in the current event, and then the business is processed later
        SocialCpIsvMessageEntity entity = SocialCpIsvMessageEntity.builder()
                .type(WeComIsvMessageType.AUTH_CANCEL.getType())
                .suiteId(wxMessage.getSuiteId())
                .infoType(WeComIsvMessageType.AUTH_CANCEL.getInfoType())
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
