package com.vikadata.api.enums.exception;


import lombok.AllArgsConstructor;
import lombok.Getter;

import com.vikadata.core.exception.BaseException;

@Getter
@AllArgsConstructor
public enum CoreException implements BaseException {

    EXCEED_MAX_UPLOAD_SIZE(9900, "file too large");

    private final Integer code;

    private final String message;
}
