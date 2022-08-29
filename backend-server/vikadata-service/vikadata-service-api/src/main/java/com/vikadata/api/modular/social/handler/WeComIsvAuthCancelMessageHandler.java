package com.vikadata.api.modular.social.handler;

import java.util.Map;

import javax.annotation.Resource;

import cn.hutool.json.JSONUtil;
import me.chanjar.weixin.common.session.WxSessionManager;
import me.chanjar.weixin.cp.bean.message.WxCpTpXmlMessage;
import me.chanjar.weixin.cp.bean.message.WxCpXmlOutMessage;
import me.chanjar.weixin.cp.config.WxCpTpConfigStorage;
import me.chanjar.weixin.cp.tp.service.WxCpTpService;

import com.vikadata.api.modular.social.enums.SocialCpIsvMessageProcessStatus;
import com.vikadata.social.wecom.WeComTemplate;
import com.vikadata.social.wecom.constants.WeComIsvMessageType;
import com.vikadata.api.modular.social.service.ISocialCpIsvMessageService;
import com.vikadata.entity.SocialCpIsvMessageEntity;
import com.vikadata.social.wecom.handler.WeComIsvMessageHandler;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

/**
 * <p>
 * 第三方服务商从企业微信应用市场发起取消授权通知
 * </p>
 * @author 刘斌华
 * @date 2022-01-05 15:31:04
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

        // 将该企业的 access_token 过期
        WxCpTpService wxCpTpService = weComTemplate.isvService(wxMessage.getSuiteId());
        @SuppressWarnings("deprecation") // 需要用该对象来刷新 access_token
        WxCpTpConfigStorage wxCpTpConfigStorage = wxCpTpService.getWxCpTpConfigStorage();
        wxCpTpConfigStorage.expireAccessToken(wxMessage.getAuthCorpId());
        // 响应必须在 1000ms 内完成，因此在当前事件中仅记录下相关信息，后续再处理业务
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

        socialCpIsvMessageService.sendToMq(entity.getId(), entity.getInfoType(), entity.getAuthCorpId());

        return null;

    }

}
