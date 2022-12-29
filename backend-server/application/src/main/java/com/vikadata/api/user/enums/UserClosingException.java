package com.vikadata.api.user.enums;

import lombok.AllArgsConstructor;
import lombok.Getter;

import com.vikadata.core.exception.BaseException;

@Getter
@AllArgsConstructor
public enum UserClosingException implements BaseException {

    USER_APPLIED_FOR_CLOSING(960, "User has applied for account cancellation"),

    USER_CANCELED_CLOSING(961, "The user has withdrawn the cancellation request"),

    USER_NOT_ALLOWED_TO_CLOSE(962, "If the logout conditions are not met, the user is not allowed to logout"),

    USER_NOT_ALLOWED_CANCEL_CLOSING(963, "Cancellation cannot be cancelled if no cancellation application has been initiated"),

    USER_HISTORY_RECORD_ISSUE(964, "The user has applied for cancellation, but the operation data is abnormal and the official cancellation date cannot be calculated");

    private final Integer code;

    private final String message;
}
