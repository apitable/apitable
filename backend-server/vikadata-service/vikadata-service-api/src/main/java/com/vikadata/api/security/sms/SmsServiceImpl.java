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
 * SMS Service Implement
 * </p>
 *
 * @author Shawn Deng
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
            log.warn("sms service is disabled");
            connectorTemplate.sendSms(target.getTarget(), code);
            return;
        }
        SmsMessage smsMessage = new SmsMessage();
        smsMessage.setAreaCode(target.getAreaCode());
        smsMessage.setMobile(target.getTarget());
        // International SMS
        if (!smsSenderTemplate.getLocalAreaCode().equals(smsMessage.getAreaCode())) {
            smsMessage.setText(StrUtil.format(YunpianTemplate.INTERNATION_GENERAL.getContent(), code));
            smsSenderTemplate.send(smsMessage);
            return;
        }
        // Chinese SMS
        smsMessage.setParams(new String[] { code });
        String smsTemplateCode = type.getTemplate().getTemplateCode();
        if (!TencentConstants.SmsTemplate.isSmsTemplate(smsTemplateCode)) {
            throw new BusinessException("Without SMS template");
        }
        smsMessage.setTemplateCode(smsTemplateCode);
        smsSenderTemplate.send(smsMessage);
    }

    @Override
    public void sendMessage(ValidateTarget target, TencentConstants.SmsTemplate type) {
        if (smsSenderTemplate == null) {
            log.warn("sms service is disabled");
            return;
        }
        SmsMessage smsMessage = new SmsMessage();
        smsMessage.setMobile(target.getTarget());
        smsMessage.setAreaCode(target.getAreaCode());
        // International SMS
        if (!smsSenderTemplate.getLocalAreaCode().equals(smsMessage.getAreaCode())) {
            smsMessage.setText(YunpianTemplate.UPDATE_PASSWORD_SUCCESS_NOTICE.getContent());
            smsSenderTemplate.send(smsMessage);
            return;
        }
        // Chinese SMS
        smsMessage.setTemplateCode(type.getTemplateCode());
        smsMessage.setParams(new String[0]);
        smsSenderTemplate.send(smsMessage);
    }
}
