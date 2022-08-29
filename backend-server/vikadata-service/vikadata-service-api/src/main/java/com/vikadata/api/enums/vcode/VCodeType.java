package com.vikadata.api.enums.vcode;

import lombok.AllArgsConstructor;
import lombok.Getter;

/**
 * <p>
 * V码类型
 * </p>
 *
 * @author Chambers
 * @date 2020/8/12
 */
@Getter
@AllArgsConstructor
public enum VCodeType {

    /**
     * 官方邀请码
     */
    OFFICIAL_INVITATION_CODE(0),

    /**
     * 个人邀请码
     */
    PERSONAL_INVITATION_CODE(1),

    /**
     * 兑换码
     */
    REDEMPTION_CODE(2);

    private final int type;
}
