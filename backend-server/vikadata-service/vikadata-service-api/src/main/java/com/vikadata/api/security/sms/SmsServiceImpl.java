package com.vikadata.api.security.sms;

import javax.annotation.Resource;

import cn.hutool.core.util.StrUtil;
import lombok.extern.slf4j.Slf4j;

import com.vikadata.api.auth.ConnectorTemplate;
import com.vikadata.api.enums.action.SmsCodeType;
import com.vikadata.api.security.ValidateTarget;
import com.vikadata.core.exception.BusinessException;
import com.vikadata.integration.sms.SmsMessage;
import com.vikadata.integration.sms.SmsSenderTemplate;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 * <p>
 * SMS服务接口实现
 * </p>
 *
 * @author Shawn Deng
 * @date 2019/12/25 17:17
 */
@Service
@Slf4j
public class SmsServiceImpl implements ISmsService {

    @Resource
    private ConnectorTemplate connectorTemplate;

    @Autowired(required = false)
    private SmsSenderTemplate smsSenderTemplate;

    @Override
    public void sendValidateCode(ValidateTarget target, String code, SmsCodeType type) {
        if (smsSenderTemplate == null) {
            log.info("未开启短信服务");
            connectorTemplate.sendSms(target.getTarget(), code);
            return;
        }
        log.info("发送短信验证码");
        SmsMessage smsMessage = new SmsMessage();
        smsMessage.setAreaCode(target.getAreaCode());
        smsMessage.setMobile(target.getTarget());
        // 国际短信
        if (!smsSenderTemplate.getLocalAreaCode().equals(smsMessage.getAreaCode())) {
            smsMessage.setText(StrUtil.format(YunpianTemplate.INTERNATION_GENERAL.getContent(), code));
            smsSenderTemplate.send(smsMessage);
            return;
        }
        // 国内短信
        smsMessage.setParams(new String[] { code });
        String smsTemplateCode = type.getTemplate().getTemplateCode();
        if (!TencentConstants.SmsTemplate.isSmsTemplate(smsTemplateCode)) {
            throw new BusinessException("短信模板没有维护");
        }
        smsMessage.setTemplateCode(smsTemplateCode);
        smsSenderTemplate.send(smsMessage);
    }

    @Override
    public void sendMessage(ValidateTarget target, TencentConstants.SmsTemplate type) {
        if (smsSenderTemplate == null) {
            log.info("未开启通知的短信服务");
            return;
        }
        log.info("发送通知短信");
        SmsMessage smsMessage = new SmsMessage();
        smsMessage.setMobile(target.getTarget());
        smsMessage.setAreaCode(target.getAreaCode());
        // 国际短信
        if (!smsSenderTemplate.getLocalAreaCode().equals(smsMessage.getAreaCode())) {
            smsMessage.setText(YunpianTemplate.UPDATE_PASSWORD_SUCCESS_NOTICE.getContent());
            smsSenderTemplate.send(smsMessage);
            return;
        }
        // 国内短信
        smsMessage.setTemplateCode(type.getTemplateCode());
        smsMessage.setParams(new String[0]);
        smsSenderTemplate.send(smsMessage);
    }
}
