package com.vikadata.api.base.enums;

import lombok.AllArgsConstructor;
import lombok.Getter;

import com.vikadata.api.shared.security.sms.TencentConstants;
import com.vikadata.core.support.serializer.IBaseEnum;

/**
 * <p>
 * sms verification code type
 * </p>
 *
 * @author Shawn Deng
 */
@AllArgsConstructor
@Getter
public enum SmsCodeType implements IBaseEnum {

    REGISTER(1, TencentConstants.SmsTemplate.REGISTER),

    LOGIN(2, TencentConstants.SmsTemplate.LOGIN),

    UPDATE_PWD(3, TencentConstants.SmsTemplate.UPDATE_PASSWORD),

    BOUND_DINGTALK(4, TencentConstants.SmsTemplate.DING_TALK_BINDING),

    BOUND_MOBILE(5, TencentConstants.SmsTemplate.BIND_MOBILE_PHONE),

    UN_BOUND_MOBILE(6, TencentConstants.SmsTemplate.REMOVE_MOBILE_PHONE_BINDING),

    UPDATE_EMAIL(7, TencentConstants.SmsTemplate.UPDATE_EMAIL_BINDING),

    DEL_SPACE(8, TencentConstants.SmsTemplate.DELETE_SPACE),

    UPDATE_MAIN_ADMIN(9, TencentConstants.SmsTemplate.UPDATE_MAIN_ADMIN),

    GENERAL_VERIFICATION(10, TencentConstants.SmsTemplate.GENERAL_VERIFICATION),

    RESET_API_KEY(11, TencentConstants.SmsTemplate.RESET_API_KEY),

    SOCIAL_USER_BIND(12, TencentConstants.SmsTemplate.SOCIAL_USER_BIND);

    private final Integer value;

    private final TencentConstants.SmsTemplate template;

    public static SmsCodeType fromName(Integer name) {
        for (SmsCodeType type : SmsCodeType.values()) {
            if (type.getValue().equals(name)) {
                return type;
            }
        }
        throw new IllegalArgumentException("unknown sms code type");
    }

    public static SmsCodeType ofName(String name) {
        SmsCodeType type = null;
        for (SmsCodeType ele : SmsCodeType.values()) {
            if (name.equalsIgnoreCase(ele.name())) {
                type = ele;
                break;
            }
        }
        if (type == null) {
            throw new IllegalArgumentException("unknown sms code type");
        }
        return type;
    }
}
