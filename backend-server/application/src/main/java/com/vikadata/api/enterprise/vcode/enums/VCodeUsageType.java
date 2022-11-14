package com.vikadata.api.enterprise.vcode.enums;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum VCodeUsageType {

    ACQUIRE(0),

    USE(1);

    private int type;
}
