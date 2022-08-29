package com.vikadata.api.security.sms;

import com.vikadata.api.enums.action.SmsCodeType;
import com.vikadata.api.security.ValidateTarget;

/**
 * <p>
 * SMS服务接口
 * </p>
 *
 * @author Shawn Deng
 * @date 2019/12/25 17:17
 */
public interface ISmsService {

    /**
     * 发送短信验证码
     *
     * @param target 验证目标
     * @param code   验证码
     * @param type   短信业务类型
     * @author Shawn Deng
     * @date 2019/12/25 18:31
     * @see SmsCodeType
     */
    void sendValidateCode(ValidateTarget target, String code, SmsCodeType type);

    /**
     * 发送通知短信
     *
     * @param target 验证目标
     * @param type   短信业务类型
     * @author Chambers
     * @date 2019/12/27
     */
    void sendMessage(ValidateTarget target, TencentConstants.SmsTemplate type);
}
