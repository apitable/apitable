package com.vikadata.api.modular.social.handler;

import java.util.Map;

import javax.annotation.Resource;

import cn.hutool.json.JSONUtil;
import me.chanjar.weixin.common.session.WxSessionManager;
import me.chanjar.weixin.cp.bean.message.WxCpTpXmlMessage;
import me.chanjar.weixin.cp.bean.message.WxCpXmlOutMessage;
import me.chanjar.weixin.cp.tp.service.WxCpTpService;

import com.vikadata.api.modular.social.enums.SocialCpIsvMessageProcessStatus;
import com.vikadata.api.modular.social.service.ISocialCpIsvMessageService;
import com.vikadata.entity.SocialCpIsvMessageEntity;
import com.vikadata.social.wecom.constants.WeComIsvMessageType;
import com.vikadata.social.wecom.constants.WeComIsvMsgType;
import com.vikadata.social.wecom.handler.WeComIsvMessageHandler;

import org.springframework.stereotype.Component;

/**
 * <p>
 * 第三方服务商从企业微信应用市场发起成员关注通知
 * </p>
 * @author 刘斌华
 * @date 2022-01-20 17:27:01
 */
@Component
public class WeComIsvSubscribeMessageHandler implements WeComIsvMessageHandler {

    @Resource
    private ISocialCpIsvMessageService socialCpIsvMessageService;

    @Override
    public WeComIsvMsgType msgType() {

        return WeComIsvMsgType.EVENT;

    }

    @Override
    public WeComIsvMessageType messageType() {

        return WeComIsvMessageType.SUBSCRIBE;

    }

    @Override
    public WxCpXmlOutMessage handle(WxCpTpXmlMessage wxMessage, Map<String, Object> context,
            WxCpTpService wxCpService, WxSessionManager sessionManager) {

        SocialCpIsvMessageEntity entity = SocialCpIsvMessageEntity.builder()
                .type(WeComIsvMessageType.SUBSCRIBE.getType())
                .suiteId(wxMessage.getSuiteId())
                .infoType(WeComIsvMessageType.SUBSCRIBE.getInfoType())
                .authCorpId(wxMessage.getToUserName())
                .timestamp(wxMessage.getCreateTime())
                .message(JSONUtil.toJsonStr(wxMessage))
                .processStatus(SocialCpIsvMessageProcessStatus.PENDING.getValue())
                .build();
        socialCpIsvMessageService.save(entity);

        socialCpIsvMessageService.sendToMq(entity.getId(), entity.getInfoType(), entity.getAuthCorpId());

        return null;

    }

}
