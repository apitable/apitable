package com.vikadata.api.util.billing.model;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

/**
 * 产品类型
 * @author Shawn Deng
 * @date 2022-03-03 21:35:58
 */
@Getter
@RequiredArgsConstructor
public enum ProductCategory {

    /**
     * 基础类型
     */
    BASE,

    /**
     * 附加类型
     */
    ADD_ON;
}
