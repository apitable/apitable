package com.vikadata.api.enums.vcode;

import lombok.AllArgsConstructor;
import lombok.Getter;

/**
 * <p>
 * V码使用类型
 * </p>
 *
 * @author Chambers
 * @date 2020/8/19
 */
@Getter
@AllArgsConstructor
public enum VCodeUsageType {

    /**
     * 领取
     */
    ACQUIRE(0),

    /**
     * 使用
     */
    USE(1);

    private int type;
}
