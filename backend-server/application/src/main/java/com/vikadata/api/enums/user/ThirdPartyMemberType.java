package com.vikadata.api.enums.user;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum ThirdPartyMemberType {

    WECHAT_MINIAPP(0),

    WECHAT_PUBLIC_ACCOUNT(1),

    WECOM(2),

    TENCENT(3),

    DING_TALK(4),

    FEI_SHU(5);

    private int type;
}
