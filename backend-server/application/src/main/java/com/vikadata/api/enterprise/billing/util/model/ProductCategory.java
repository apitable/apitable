package com.vikadata.api.enterprise.billing.util.model;

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
