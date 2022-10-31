package com.vikadata.api.modular.finance.service;

import java.util.List;

import com.vikadata.api.modular.finance.model.ProductPriceVo;

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
