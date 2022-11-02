package com.vikadata.api.enums.exception;

import lombok.AllArgsConstructor;
import lombok.Getter;

import com.vikadata.core.exception.BaseException;

/**
 * Marketplace Exception
 * statis code range（1301-1399）
 *
 * @author Benson Cheung
 */
@Getter
@AllArgsConstructor
@Deprecated
public enum MarketplaceException implements BaseException {

    APP_CREATE_ERROR(1301, "application failed to open"),

    APP_NOT_OPENED(256, "This space has not been opened on this space station and cannot be previewed, please try again");

    private final Integer code;

    private final String message;
}
