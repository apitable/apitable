package com.vikadata.api.modular.finance.service.impl;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import lombok.extern.slf4j.Slf4j;

import com.vikadata.api.component.clock.ClockManager;
import com.vikadata.api.modular.finance.model.ProductPriceVo;
import com.vikadata.api.modular.finance.service.IShopService;
import com.vikadata.api.util.billing.model.BillingPlanPrice;
import com.vikadata.api.util.billing.model.ProductEnum;
import com.vikadata.system.config.billing.Price;

import org.springframework.stereotype.Service;

import static com.vikadata.api.util.billing.BillingConfigManager.getPriceList;

/**
 * 商店产品服务实现类
 *
 * @author Shawn Deng
 */
@Service
@Slf4j
public class ShopServiceImpl implements IShopService {

    @Override
    public List<ProductPriceVo> getPricesByProduct(String productName) {
        ProductEnum product = ProductEnum.valueOf(productName);
        List<Price> prices = getPriceList(product);
        List<ProductPriceVo> planPriceVos = new ArrayList<>(prices.size());
        LocalDate nowDate = ClockManager.me().getLocalDateNow();
        prices.forEach(price -> planPriceVos.add(ProductPriceVo.fromPrice(BillingPlanPrice.of(price, nowDate))));
        return planPriceVos;
    }
}
