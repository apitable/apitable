package com.vikadata.api.enums.action;

import lombok.AllArgsConstructor;
import lombok.Getter;

import com.vikadata.api.constants.MailPropConstants;
import com.vikadata.core.support.serializer.IBaseEnum;

/**
 * <p>
 * 邮件验证码业务类型
 * </p>
 *
 * @author Chambers
 * @date 2019/12/27
 */
@Getter
@AllArgsConstructor
public enum EmailCodeType implements IBaseEnum {

    /**
     * 邮箱绑定
     */
    BOUND_EMAIL(1, MailPropConstants.SUBJECT_VERIFY_CODE),

    /**
     * 邮箱注册
     */
    REGISTER_EMAIL(2, MailPropConstants.SUBJECT_REGISTER),

    /**
     * 通用校验
     */
    COMMON_VERIFICATION(3, MailPropConstants.SUBJECT_VERIFY_CODE);

    private final Integer value;

    private final String subject;

    public static EmailCodeType ofName(String name) {
        for (EmailCodeType type : EmailCodeType.values()) {
            if (name.equalsIgnoreCase(type.name())) {
                return type;
            }
        }
        throw new IllegalArgumentException("未知的邮件类型");
    }

    public static EmailCodeType fromName(Integer name) {
        for (EmailCodeType type : EmailCodeType.values()) {
            if (type.getValue().equals(name)) {
                return type;
            }
        }
        throw new IllegalArgumentException("未知的邮件类型");
    }
}
