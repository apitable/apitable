package com.vikadata.api.enums.user;

import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
@Getter
public enum UserOperationType {

    APPLY_FOR_CLOSING(1),

    CANCEL_CLOSING(2),

    COMPLETE_CLOSING(3);

    private final int statusCode;
}
