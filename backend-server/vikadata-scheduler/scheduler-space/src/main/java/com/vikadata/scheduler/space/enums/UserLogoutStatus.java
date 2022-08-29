package com.vikadata.scheduler.space.enums;

import java.util.Objects;

import lombok.AllArgsConstructor;
import lombok.Getter;

/**
 * <p>
 * 用户注销状态
 * </p>
 *
 * @author 胡海平(Humphrey Hu)
 * @date 2021/12/24 17:33:56
 */
@AllArgsConstructor
@Getter
public enum UserLogoutStatus {

    /**
     * 申请注销
     * */
    APPLY_LOGOUT(1),

    /**
     * 撤销注销
     * */
    CANCEL_LOGOUT(2),

    /**
     * 完成注销
     * */
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
