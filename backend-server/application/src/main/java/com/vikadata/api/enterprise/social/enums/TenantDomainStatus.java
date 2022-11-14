package com.vikadata.api.enterprise.social.enums;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum TenantDomainStatus {

    DISABLED(0),

    ENABLED(1),

    WAIT_BIND(2);

    private final int code;

    public static boolean available(int code) {
        return ENABLED.getCode() == code;
    }

}
