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
 * Shop Service Implement Test
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
        // The discount price does not exist until the event starts
        List<ProductPriceVo> productPriceVos = isShopService.getPricesByProduct(ProductEnum.SILVER.name());
        productPriceVos.forEach(priceVo -> assertThat(priceVo.getPriceDiscount()).isEqualTo(toCurrencyUnit(BigDecimal.ZERO)));
    }

    @Test
    public void testGetExpireEventDiscountPriceOnSilver() {
        final OffsetDateTime nowTime = OffsetDateTime.of(2022, 11, 12, 0, 0, 0, 0, testTimeZone);
        getClock().setTime(nowTime);
        // The event has expired, and the discount price does not exist
        List<ProductPriceVo> productPriceVos = isShopService.getPricesByProduct(ProductEnum.SILVER.name());
        productPriceVos.forEach(priceVo -> assertThat(priceVo.getPriceDiscount()).isEqualTo(toCurrencyUnit(BigDecimal.ZERO)));
    }

    @Test
    public void testGetLastEventDateDiscountPriceOnSilver() {
        final OffsetDateTime nowTime = OffsetDateTime.of(2022, 11, 11, 23, 23, 30, 0, testTimeZone);
        getClock().setTime(nowTime);
        // The event has expired, and the discount price does not exist
        List<ProductPriceVo> productPriceVos = isShopService.getPricesByProduct(ProductEnum.SILVER.name());
        productPriceVos
                .stream().filter(p -> p.getSeat() != 2 && p.getMonth() != 1)
                .forEach(priceVo -> assertThat(priceVo.getPriceDiscount()).isNotEqualTo(BigDecimal.ZERO));
    }
}
