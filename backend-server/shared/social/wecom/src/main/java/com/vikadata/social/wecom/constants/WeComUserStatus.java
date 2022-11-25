package com.vikadata.social.wecom.constants;

import lombok.AllArgsConstructor;
import lombok.Getter;

import com.vikadata.social.wecom.exception.WeComApiException;

/**
 * Enterprise WeChat Member Activation Status.
 * 1=activated, 2=disabled, 4=inactive, 5=exited from the enterprise.
 */
@AllArgsConstructor
@Getter
public enum WeComUserStatus {

    ACTIVE(1),

    DISABLED(2),

    NOT_ACTIVE(4),

    EXITED(5),
    ;

    private Integer code;

    public static WeComUserStatus of(Integer code) {
        for (WeComUserStatus e : WeComUserStatus.values()) {
            if (e.getCode().equals(code)) {
                return e;
            }
        }
        throw new WeComApiException("WeCom get user status error");
    }

}
