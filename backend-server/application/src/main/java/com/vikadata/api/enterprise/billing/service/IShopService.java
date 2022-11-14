package com.vikadata.api.enterprise.billing.service;

import java.util.List;

import com.vikadata.api.enterprise.billing.model.ProductPriceVo;

/**
 * <p>
 * Shop Service
 * </p>
 */
public interface IShopService {

    /**
     * Get a price list for a product
     *
     * @param productName production name
     * @return ProductPriceVo List
     */
    List<ProductPriceVo> getPricesByProduct(String productName);
}
