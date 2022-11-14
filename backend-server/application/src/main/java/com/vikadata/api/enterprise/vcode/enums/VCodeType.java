package com.vikadata.api.enterprise.vcode.enums;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum VCodeType {

    OFFICIAL_INVITATION_CODE(0),

    PERSONAL_INVITATION_CODE(1),

    REDEMPTION_CODE(2);

    private final int type;
}
