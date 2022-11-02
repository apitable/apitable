package com.vikadata.api.enums.action;

import lombok.AllArgsConstructor;
import lombok.Getter;

import com.vikadata.api.constants.MailPropConstants;
import com.vikadata.core.support.serializer.IBaseEnum;

/**
 * <p>
 * email verification code type
 * </p>
 *
 * @author Chambers
 */
@Getter
@AllArgsConstructor
public enum EmailCodeType implements IBaseEnum {

    /**
     * email binding
     */
    BOUND_EMAIL(1, MailPropConstants.SUBJECT_VERIFY_CODE),

    /**
     * email registration
     */
    REGISTER_EMAIL(2, MailPropConstants.SUBJECT_REGISTER),

    /**
     * universal check
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
        throw new IllegalArgumentException("unknown email code type");
    }

    public static EmailCodeType fromName(Integer name) {
        for (EmailCodeType type : EmailCodeType.values()) {
            if (type.getValue().equals(name)) {
                return type;
            }
        }
        throw new IllegalArgumentException("unknown email code type");
    }
}
