package com.vikadata.api.modular.finance.service;

import java.util.List;

import com.vikadata.api.modular.finance.model.ProductPriceVo;

/**
 * 商店产品服务
 * @author Shawn Deng
 * @date 2022-05-13 18:07:45
 */
public interface IShopService {

    /**
     * 获取产品的价目表
     * @param productName 产品名称
     * @return 产品价目列表
     */
    List<ProductPriceVo> getPricesByProduct(String productName);
}
