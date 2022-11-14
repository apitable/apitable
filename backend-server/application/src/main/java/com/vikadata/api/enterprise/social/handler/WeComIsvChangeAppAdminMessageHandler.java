package com.vikadata.api.enterprise.social.handler;

import java.util.Map;

import javax.annotation.Resource;

import cn.hutool.json.JSONUtil;
import me.chanjar.weixin.common.session.WxSessionManager;
import me.chanjar.weixin.cp.bean.message.WxCpTpXmlMessage;
import me.chanjar.weixin.cp.bean.message.WxCpXmlOutMessage;
import me.chanjar.weixin.cp.tp.service.WxCpTpService;

import com.vikadata.api.enterprise.social.enums.SocialCpIsvMessageProcessStatus;
import com.vikadata.api.enterprise.social.service.ISocialCpIsvMessageService;
import com.vikadata.entity.SocialCpIsvMessageEntity;
import com.vikadata.social.wecom.constants.WeComIsvMessageType;
import com.vikadata.social.wecom.constants.WeComIsvMsgType;
import com.vikadata.social.wecom.handler.WeComIsvMessageHandler;

import org.springframework.stereotype.Component;

/**
 * <p>
 * The third party service provider initiates a change from the We Com application market Application Manager Notification
 * </p>
 */
@Component
public class WeComIsvChangeAppAdminMessageHandler implements WeComIsvMessageHandler {

    @Resource
    private ISocialCpIsvMessageService socialCpIsvMessageService;

    @Override
    public WeComIsvMsgType msgType() {

        return WeComIsvMsgType.EVENT;

    }

    @Override
    public WeComIsvMessageType messageType() {

        return WeComIsvMessageType.CHANGE_APP_ADMIN;

    }

    @Override
    public WxCpXmlOutMessage handle(WxCpTpXmlMessage wxMessage, Map<String, Object> context,
            WxCpTpService wxCpService, WxSessionManager sessionManager) {

        SocialCpIsvMessageEntity entity = SocialCpIsvMessageEntity.builder()
                .type(WeComIsvMessageType.CHANGE_APP_ADMIN.getType())
                .suiteId(wxMessage.getSuiteId())
                .infoType(WeComIsvMessageType.CHANGE_APP_ADMIN.getInfoType())
                .authCorpId(wxMessage.getToUserName())
                .timestamp(wxMessage.getCreateTime())
                .message(JSONUtil.toJsonStr(wxMessage))
                .processStatus(SocialCpIsvMessageProcessStatus.PENDING.getValue())
                .build();
        socialCpIsvMessageService.save(entity);

        socialCpIsvMessageService.sendToMq(entity.getId(), entity.getInfoType(), entity.getAuthCorpId(), entity.getSuiteId());

        return null;

    }

}
