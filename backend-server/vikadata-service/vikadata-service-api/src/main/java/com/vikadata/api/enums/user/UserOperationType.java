package com.vikadata.api.enums.user;

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
public enum UserOperationType {

    /**
     * 申请注销
     * */
    APPLY_FOR_CLOSING(1),

    /**
     * 撤销注销
     * */
    CANCEL_CLOSING(2),

    /**
     * 完成注销
     * */
    COMPLETE_CLOSING(3);

    private final int statusCode;
}
