package com.vikadata.api.enums.social;

import lombok.AllArgsConstructor;
import lombok.Getter;

/**
 * <p>
 *
 * </p>
 *
 * @author Pengap
 * @date 2021/8/30 11:26:26
 */
@Getter
@AllArgsConstructor
public enum TenantDomainStatus {

    /**
     * 停用
     */
    DISABLED(0),

    /**
     * 启用
     */
    ENABLED(1),

    /**
     * 绑定中
     */
    WAIT_BIND(2);

    private final int code;

    /**
     * 可用状态
     */
    public static boolean available(int code) {
        return ENABLED.getCode() == code;
    }

}
