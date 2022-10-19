package com.vikadata.api.modular.finance.service.impl;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.List;

import org.junit.jupiter.api.Test;

import com.vikadata.api.AbstractIntegrationTest;
import com.vikadata.api.modular.finance.model.ProductPriceVo;
import com.vikadata.api.util.billing.model.ProductEnum;

import static com.vikadata.api.util.billing.OrderUtil.toCurrencyUnit;
import static org.assertj.core.api.Assertions.assertThat;

/**
 * 商店服务测试
 *
 * @author Shawn Deng
 */
public class ShopServiceImplTest extends AbstractIntegrationTest {

    @Test
    public void testGetPricesByProductOnSilver() {
        List<ProductPriceVo> productPriceVos = isShopService.getPricesByProduct(ProductEnum.SILVER.name());
        // assert plan in silver product
        assertThat(productPriceVos).isNotEmpty();
    }

    @Test
    public void testGetPricesByProductOnGold() {
        List<ProductPriceVo> productPriceVos = isShopService.getPricesByProduct(ProductEnum.GOLD.name());
        // assert plan in gold product
        assertThat(productPriceVos).isNotEmpty();
    }

    @Test
    public void testGetBeforeEventDiscountPriceOnSilver() {
        final OffsetDateTime nowTime = OffsetDateTime.of(2022, 10, 23, 17, 0, 0, 0, testTimeZone);
        getClock().setTime(nowTime);
        // 活动开始之前，优惠价格不存在
        List<ProductPriceVo> productPriceVos = isShopService.getPricesByProduct(ProductEnum.SILVER.name());
        productPriceVos.forEach(priceVo -> assertThat(priceVo.getPriceDiscount()).isEqualTo(toCurrencyUnit(BigDecimal.ZERO)));
    }

    @Test
    public void testGetExpireEventDiscountPriceOnSilver() {
        final OffsetDateTime nowTime = OffsetDateTime.of(2022, 11, 12, 0, 0, 0, 0, testTimeZone);
        getClock().setTime(nowTime);
        // 活动过期，优惠价格不存在
        List<ProductPriceVo> productPriceVos = isShopService.getPricesByProduct(ProductEnum.SILVER.name());
        productPriceVos.forEach(priceVo -> assertThat(priceVo.getPriceDiscount()).isEqualTo(toCurrencyUnit(BigDecimal.ZERO)));
    }

    @Test
    public void testGetLastEventDateDiscountPriceOnSilver() {
        final OffsetDateTime nowTime = OffsetDateTime.of(2022, 11, 11, 23, 23, 30, 0, testTimeZone);
        getClock().setTime(nowTime);
        // 活动过期，优惠价格不存在
        List<ProductPriceVo> productPriceVos = isShopService.getPricesByProduct(ProductEnum.SILVER.name());
        productPriceVos
                .stream().filter(p -> p.getSeat() != 2 && p.getMonth() != 1)
                .forEach(priceVo -> assertThat(priceVo.getPriceDiscount()).isNotEqualTo(BigDecimal.ZERO));
    }
}
