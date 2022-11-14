package com.vikadata.api.enterprise.integral.enums;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum IntegralAlterType {

    /**
     * income
     */
    INCOME(0),

    /**
     * expense
     */
    EXPENSES(1);

    private final Integer state;
}
