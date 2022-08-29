package com.vikadata.api.enums.action;

import com.vikadata.api.security.sms.TencentConstants;
import com.vikadata.core.support.serializer.IBaseEnum;
import lombok.AllArgsConstructor;
import lombok.Getter;

/**
 * <p>
 * 短信验证码业务类型
 * </p>
 *
 * @author Shawn Deng
 * @date 2019/12/25 10:39
 */
@AllArgsConstructor
@Getter
public enum SmsCodeType implements IBaseEnum {

    /**
     * 注册
     */
    REGISTER(1, TencentConstants.SmsTemplate.REGISTER),

    /**
     * 登录
     */
    LOGIN(2, TencentConstants.SmsTemplate.LOGIN),

    /**
     * 修改登录密码
     */
    UPDATE_PWD(3, TencentConstants.SmsTemplate.UPDATE_PASSWORD),

    /**
     * 钉钉绑定
     */
    BOUND_DINGTALK(4, TencentConstants.SmsTemplate.DING_TALK_BINDING),

    /**
     * 绑定手机
     */
    BOUND_MOBILE(5, TencentConstants.SmsTemplate.BIND_MOBILE_PHONE),

    /**
     * 解除手机绑定
     */
    UN_BOUND_MOBILE(6, TencentConstants.SmsTemplate.REMOVE_MOBILE_PHONE_BINDING),

    /**
     * 修改邮箱绑定
     */
    UPDATE_EMAIL(7, TencentConstants.SmsTemplate.UPDATE_EMAIL_BINDING),

    /**
     * 删除空间
     */
    DEL_SPACE(8, TencentConstants.SmsTemplate.DELETE_SPACE),

    /**
     * 更换主管理员
     */
    UPDATE_MAIN_ADMIN(9, TencentConstants.SmsTemplate.UPDATE_MAIN_ADMIN),

    /**
     * 普通验证
     */
    GENERAL_VERIFICATION(10, TencentConstants.SmsTemplate.GENERAL_VERIFICATION),

    /**
     * 更改开发者配置
     */
    RESET_API_KEY(11, TencentConstants.SmsTemplate.RESET_API_KEY),

    /**
     * 第三方平台用户绑定
     */
    SOCIAL_USER_BIND(12, TencentConstants.SmsTemplate.SOCIAL_USER_BIND);

    private final Integer value;

    private final TencentConstants.SmsTemplate template;

    public static SmsCodeType fromName(Integer name) {
        for (SmsCodeType type : SmsCodeType.values()) {
            if (type.getValue().equals(name)) {
                return type;
            }
        }
        throw new IllegalArgumentException("未知的短信类型");
    }

    /**
     * 根据名称查找
     */
    public static SmsCodeType ofName(String name) {
        SmsCodeType type = null;
        for (SmsCodeType ele : SmsCodeType.values()) {
            if (name.equalsIgnoreCase(ele.name())) {
                type = ele;
                break;
            }
        }
        if (type == null) {
            throw new IllegalArgumentException("未知的短信类型");
        }
        return type;
    }
}
