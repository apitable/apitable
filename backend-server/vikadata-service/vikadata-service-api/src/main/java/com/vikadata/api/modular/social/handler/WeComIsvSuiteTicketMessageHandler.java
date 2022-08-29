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
import com.vikadata.social.wecom.WeComTemplate;
import com.vikadata.social.wecom.constants.WeComIsvMessageType;
import com.vikadata.social.wecom.handler.WeComIsvMessageHandler;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

/**
 * <p>
 * 第三方服务商 suite_ticket 定时推送
 * </p>
 * @author 刘斌华
 * @date 2022-01-05 18:21:39
 */
@Component
public class WeComIsvSuiteTicketMessageHandler implements WeComIsvMessageHandler {

    @Autowired(required = false)
    private WeComTemplate weComTemplate;

    @Resource
    private ISocialCpIsvMessageService socialCpIsvMessageService;

    @Override
    public WeComIsvMessageType messageType() {

        return WeComIsvMessageType.SUITE_TICKET;

    }

    @Override
    public WxCpXmlOutMessage handle(WxCpTpXmlMessage wxMessage, Map<String, Object> context,
            WxCpTpService wxCpService, WxSessionManager sessionManager) {

        SocialCpIsvMessageEntity entity = SocialCpIsvMessageEntity.builder()
                .type(WeComIsvMessageType.SUITE_TICKET.getType())
                .suiteId(wxMessage.getSuiteId())
                .infoType(WeComIsvMessageType.SUITE_TICKET.getInfoType())
                .timestamp(Long.parseLong(wxMessage.getTimeStamp()))
                .message(JSONUtil.toJsonStr(wxMessage))
                .build();
        try {
            weComTemplate.isvService(wxMessage.getSuiteId()).setSuiteTicket(wxMessage.getSuiteTicket());

            entity.setProcessStatus(SocialCpIsvMessageProcessStatus.SUCCESS.getValue());
            // 保存通知信息
            socialCpIsvMessageService.save(entity);
        } catch (Exception ex) {
            entity.setProcessStatus(SocialCpIsvMessageProcessStatus.REJECT_PERMANENTLY.getValue());
            // 保存通知信息
            socialCpIsvMessageService.save(entity);

            throw ex;
        }

        return null;

    }

}
