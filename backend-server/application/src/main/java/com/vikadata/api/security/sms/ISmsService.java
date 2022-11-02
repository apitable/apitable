package com.vikadata.api.security.sms;

import com.vikadata.api.enums.action.SmsCodeType;
import com.vikadata.api.security.ValidateTarget;

/**
 * <p>
 * sms service interface
 * </p>
 *
 * @author Shawn Deng
 */
public interface ISmsService {

    /**
     * send sms verification code
     *
     * @param target verification target
     * @param code   verification code
     * @param type   sms service type
     * @see SmsCodeType
     */
    void sendValidateCode(ValidateTarget target, String code, SmsCodeType type);

    /**
     * send notification sms
     *
     * @param target verification target
     * @param type   sms service type
     */
    void sendMessage(ValidateTarget target, TencentConstants.SmsTemplate type);
}
