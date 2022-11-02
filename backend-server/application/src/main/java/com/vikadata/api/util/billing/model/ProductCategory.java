package com.vikadata.api.util.billing.model;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

/**
 * product category
 * @author Shawn Deng
 */
@Getter
@RequiredArgsConstructor
public enum ProductCategory {

    /**
     * base type
     */
    BASE,

    /**
     * add-on type
     */
    ADD_ON;
}
