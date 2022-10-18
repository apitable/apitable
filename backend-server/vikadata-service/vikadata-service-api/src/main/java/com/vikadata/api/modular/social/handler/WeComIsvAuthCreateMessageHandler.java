package com.vikadata.api.modular.social.handler;

import java.util.Map;

import javax.annotation.Resource;

import cn.hutool.json.JSONUtil;
import lombok.extern.slf4j.Slf4j;
import me.chanjar.weixin.common.error.WxErrorException;
import me.chanjar.weixin.common.session.WxSessionManager;
import me.chanjar.weixin.cp.bean.WxCpTpPermanentCodeInfo.AuthCorpInfo;
import me.chanjar.weixin.cp.bean.message.WxCpTpXmlMessage;
import me.chanjar.weixin.cp.bean.message.WxCpXmlOutMessage;
import me.chanjar.weixin.cp.bean.message.WxCpXmlOutTextMessage;
import me.chanjar.weixin.cp.tp.service.WxCpTpService;

import com.vikadata.api.modular.social.enums.SocialCpIsvMessageProcessStatus;
import com.vikadata.api.modular.social.service.ISocialCpIsvMessageService;
import com.vikadata.entity.SocialCpIsvMessageEntity;
import com.vikadata.social.wecom.WeComTemplate;
import com.vikadata.social.wecom.WxCpIsvServiceImpl;
import com.vikadata.social.wecom.constants.WeComIsvMessageType;
import com.vikadata.social.wecom.handler.WeComIsvMessageHandler;
import com.vikadata.social.wecom.model.WxCpIsvPermanentCodeInfo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

/**
 * <p>
 * 第三方服务商从企业微信应用市场发起授权成功通知
 * </p>
 * @author 刘斌华
 * @date 2022-01-05 15:31:04
 */
@Component
@Slf4j
public class WeComIsvAuthCreateMessageHandler implements WeComIsvMessageHandler {

    @Autowired(required = false)
    private WeComTemplate weComTemplate;

    @Resource
    private ISocialCpIsvMessageService socialCpIsvMessageService;

    @Override
    public WeComIsvMessageType messageType() {

        return WeComIsvMessageType.AUTH_CREATE;

    }

    @Override
    public WxCpXmlOutMessage handle(WxCpTpXmlMessage wxMessage, Map<String, Object> context,
            WxCpTpService wxCpService, WxSessionManager sessionManager) {

        SocialCpIsvMessageEntity entity = SocialCpIsvMessageEntity.builder()
                .type(WeComIsvMessageType.AUTH_CREATE.getType())
                .suiteId(wxMessage.getSuiteId())
                .infoType(WeComIsvMessageType.AUTH_CREATE.getInfoType())
                .timestamp(Long.parseLong(wxMessage.getTimeStamp()))
                .build();
        try {
            WxCpIsvServiceImpl wxCpIsvService = (WxCpIsvServiceImpl) weComTemplate.isvService(wxMessage.getSuiteId());
            WxCpIsvPermanentCodeInfo permanentCodeInfo = wxCpIsvService.getPermanentCodeInfo(wxMessage.getAuthCode());
            AuthCorpInfo authCorpInfo = permanentCodeInfo.getAuthCorpInfo();

            entity.setAuthCorpId(authCorpInfo.getCorpId());
            // 这里并不保存回调通知的数据，而是保存获取企业永久授权码接口返回的信息
            entity.setMessage(JSONUtil.toJsonStr(permanentCodeInfo));
            entity.setProcessStatus(SocialCpIsvMessageProcessStatus.PENDING.getValue());
            // 保存通知信息
            socialCpIsvMessageService.save(entity);

            // 响应必须在 1000ms 内完成，因此在当前事件中仅记录下相关信息，后续再处理业务
            socialCpIsvMessageService.sendToMq(entity.getId(), entity.getInfoType(), entity.getAuthCorpId(),
                    entity.getSuiteId());
        }
        catch (WxErrorException ex) {
            log.warn("Exception occurred while getting permanent code.", ex);

            entity.setMessage(JSONUtil.toJsonStr(wxMessage));
            entity.setProcessStatus(SocialCpIsvMessageProcessStatus.REJECT_PERMANENTLY.getValue());
            // 保存通知信息
            socialCpIsvMessageService.save(entity);

            return new WxCpXmlOutTextMessage();
        }
        catch (Exception ex) {
            entity.setMessage(JSONUtil.toJsonStr(wxMessage));
            entity.setProcessStatus(SocialCpIsvMessageProcessStatus.REJECT_PERMANENTLY.getValue());
            // 保存通知信息
            socialCpIsvMessageService.save(entity);

            throw ex;
        }

        return null;

    }

}
