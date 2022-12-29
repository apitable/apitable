package com.vikadata.api.space.enums;

import lombok.AllArgsConstructor;
import lombok.Getter;

import com.vikadata.core.exception.BaseException;

/**
 * status code range（450-）
 *
 * @author Chambers
 */
@Getter
@AllArgsConstructor
public enum SpaceApplyException implements BaseException {

    APPLY_NOT_EXIST(450, "application does not exist"),

    APPLY_EXPIRED_OR_PROCESSED(451, "application has expired or has been processed"),

    EXIST_MEMBER(452, "You are already in this space, the request is invalid"),

    APPLY_SWITCH_CLOSE(453, "This space is not allowed to join the application, the application failed"),

    APPLY_DUPLICATE(454, "You have submitted an application, pending approval by the administrator"),

    APPLY_NOTIFICATION_ERROR(455, "application message is incorrect");

    private final Integer code;

    private final String message;
}
