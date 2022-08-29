package com.vikadata.api.modular.integral.enums;

import lombok.AllArgsConstructor;
import lombok.Getter;

/**
 * <p>
 * 积分变更类型
 * </p>
 *
 * @author Shawn Deng
 * @date 2020/9/16 11:45
 */
@Getter
@AllArgsConstructor
public enum IntegralAlterType {

    /**
     * 收入
     */
    INCOME(0),

    /**
     * 支出
     */
    EXPENSES(1);

    private final Integer state;
}
