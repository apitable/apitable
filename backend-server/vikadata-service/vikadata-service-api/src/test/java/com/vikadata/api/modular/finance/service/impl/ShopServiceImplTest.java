package com.vikadata.api.modular.finance.service.impl;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.List;

import org.junit.jupiter.api.Disabled;
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
        // 白银级有21个付费方案
        assertThat(productPriceVos).isNotEmpty().hasSize(21);
    }

    @Test
    @Disabled("Clock is not sync")
    public void testGetBeforeEventDiscountPriceOnSilver() {
        final OffsetDateTime nowTime = OffsetDateTime.of(2022, 8, 31, 17, 0, 0, 0, testTimeZone);
        getClock().setTime(nowTime);
        // 活动开始之前，优惠价格不存在
        List<ProductPriceVo> productPriceVos = isShopService.getPricesByProduct(ProductEnum.SILVER.name());
        productPriceVos.forEach(priceVo -> assertThat(priceVo.getPriceDiscount()).isEqualTo(toCurrencyUnit(BigDecimal.ZERO)));
    }

    @Test
    @Disabled("Clock is not sync")
    public void testGetExpireEventDiscountPriceOnSilver() {
        final OffsetDateTime nowTime = OffsetDateTime.of(2022, 10, 1, 0, 0, 0, 0, testTimeZone);
        getClock().setTime(nowTime);
        // 活动过期，优惠价格不存在
        List<ProductPriceVo> productPriceVos = isShopService.getPricesByProduct(ProductEnum.SILVER.name());
        productPriceVos.forEach(priceVo -> assertThat(priceVo.getPriceDiscount()).isEqualTo(toCurrencyUnit(BigDecimal.ZERO)));
    }

    @Test
    @Disabled("Clock is not sync")
    public void testGetLastEventDateDiscountPriceOnSilver() {
        final OffsetDateTime nowTime = OffsetDateTime.of(2022, 9, 30, 23, 23, 30, 0, testTimeZone);
        getClock().setTime(nowTime);
        // 活动过期，优惠价格不存在
        List<ProductPriceVo> productPriceVos = isShopService.getPricesByProduct(ProductEnum.SILVER.name());
        productPriceVos
                .stream().filter(p -> p.getSeat() != 2 && p.getMonth() != 1)
                .forEach(priceVo -> assertThat(priceVo.getPriceDiscount()).isNotEqualTo(BigDecimal.ZERO));
    }
}
