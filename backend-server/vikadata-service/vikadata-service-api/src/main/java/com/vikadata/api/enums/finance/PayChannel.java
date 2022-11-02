package com.vikadata.api.enums.finance;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum PayChannel {

    ALIPAY_PC("alipay_pc_direct"),

    WX_PUB_QR("wx_pub_qr");

    private final String name;

    public static PayChannel of(String name) {
        for (PayChannel value : PayChannel.values()) {
            if (value.getName().equals(name)) {
                return value;
            }
        }
        return null;
    }
}
