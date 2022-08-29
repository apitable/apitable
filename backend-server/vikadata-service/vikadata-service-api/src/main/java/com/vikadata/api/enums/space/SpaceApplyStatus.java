package com.vikadata.api.enums.space;

import lombok.AllArgsConstructor;
import lombok.Getter;

/**
 * <p>
 * 空间加入申请状态
 * </p>
 *
 * @author Chambers
 * @date 2020/10/29
 */
@Getter
@AllArgsConstructor
public enum SpaceApplyStatus {

    /**
     * 待审核
     */
    PENDING(0),

    /**
     * 同意
     */
    APPROVE(1),

    /**
     * 拒绝
     */
    REFUSE(2),

    /**
     * 失效
     */
    INVALIDATION(3);

    private final Integer status;
}
