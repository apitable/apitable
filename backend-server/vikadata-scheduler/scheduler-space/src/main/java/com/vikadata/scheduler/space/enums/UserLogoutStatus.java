package com.vikadata.scheduler.space.enums;

import java.util.Objects;

import lombok.AllArgsConstructor;
import lombok.Getter;

/**
 * <p>
 * User Logout Status
 * </p>
 */
@AllArgsConstructor
@Getter
public enum UserLogoutStatus {

    APPLY_LOGOUT(1),

    CANCEL_LOGOUT(2),

    COMPLETE_LOGOUT(3);

    private int statusCode;

    public static UserLogoutStatus ofLogoutStatus(Integer inputLogoutStatus) {
        for (UserLogoutStatus userLogoutStatus : UserLogoutStatus.values()) {
            if (Objects.equals(userLogoutStatus.getStatusCode(), inputLogoutStatus)) {
                return userLogoutStatus;
            }
        }
        return null;
    }
}
