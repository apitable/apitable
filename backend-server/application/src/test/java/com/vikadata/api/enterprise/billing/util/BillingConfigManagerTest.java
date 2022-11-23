package com.vikadata.api.enterprise.billing.util;

import java.time.LocalDate;
import java.util.Collections;
import java.util.List;
import java.util.Map;

import cn.hutool.core.map.MapUtil;
import cn.hutool.core.util.ArrayUtil;
import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.Test;

import com.vikadata.api.enterprise.billing.enums.ProductChannel;
import com.vikadata.api.enterprise.billing.enums.ProductEnum;
import com.vikadata.api.interfaces.billing.model.SubscriptionFeature;
import com.vikadata.api.shared.sysconfig.billing.Event;
import com.vikadata.api.shared.sysconfig.billing.Plan;
import com.vikadata.api.shared.sysconfig.billing.Price;
import com.vikadata.api.shared.sysconfig.billing.PriceList;
import com.vikadata.api.shared.sysconfig.billing.Product;

import static com.vikadata.api.enterprise.billing.util.BillingConfigManager.buildPlanFeature;
import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.util.Arrays.array;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;


public class BillingConfigManagerTest {

    /**
     * Product Channel - Proprietary Cloud Billing: Flagship Product
     */
    @Test
    public void testGetFreeProductByPrivateChannel() {
        Product privateFreeProduct = BillingConfigManager.getCurrentFreeProduct(ProductChannel.PRIVATE);
        assertNotNull(privateFreeProduct);
        assertEquals(privateFreeProduct.getId(), ProductEnum.PRIVATE_CLOUD.getName());
        Map<String, Plan> planMap = MapUtil.getAny(BillingConfigManager.getBillingConfig().getPlans(), ArrayUtil.toArray(privateFreeProduct.getPlans(), String.class));
        Assertions.assertThat(planMap).isNotEmpty().hasSize(1);
        Plan freePlan = planMap.get(planMap.keySet().stream().findFirst().get());
        SubscriptionFeature planFeature = buildPlanFeature(freePlan, Collections.emptyList());
        Assertions.assertThat(planFeature.getSeat().getValue()).isEqualTo(-1);
        Assertions.assertThat(planFeature.getSheetNums().getValue()).isEqualTo(-1);
        Assertions.assertThat(planFeature.getApiCallNums().getValue()).isEqualTo(-1);
        Assertions.assertThat(planFeature.getGanttViews().getValue()).isEqualTo(-1);
        Assertions.assertThat(planFeature.getCalendarViews().getValue()).isEqualTo(-1);
        Assertions.assertThat(planFeature.getFormViews().getValue()).isEqualTo(-1);
        Assertions.assertThat(planFeature.getCapacitySize().getValue()).isEqualTo(-1);
        Assertions.assertThat(planFeature.getAdminNums().getValue()).isEqualTo(-1);
        Assertions.assertThat(planFeature.getGalleryViews().getValue()).isEqualTo(-1);
        Assertions.assertThat(planFeature.getNodePermissionNums().getValue()).isEqualTo(-1);
        Assertions.assertThat(planFeature.getFieldPermissionNums().getValue()).isEqualTo(-1);
        Assertions.assertThat(planFeature.getKanbanViews().getValue()).isEqualTo(-1);
        Assertions.assertThat(planFeature.getRemainTimeMachineDays().getValue()).isEqualTo(730);
        Assertions.assertThat(planFeature.getRemainTrashDays().getValue()).isEqualTo(730);
        Assertions.assertThat(planFeature.getRowNums().getValue()).isEqualTo(500000000);
        Assertions.assertThat(planFeature.getRowsPerSheet().getValue()).isEqualTo(50000);
        Assertions.assertThat(planFeature.getSocialConnect().getValue()).isTrue();
        Assertions.assertThat(planFeature.getRainbowLabel().getValue()).isTrue();
        Assertions.assertThat(planFeature.getWatermark().getValue()).isTrue();
    }

    /**
     * Product Channels - Alibaba Cloud Computing Nest Billing: Free Products
     */
    @Test
    public void testGetFreeProductByAliyunChannel() {
        Product privateFreeProduct = BillingConfigManager.getCurrentFreeProduct(ProductChannel.ALIYUN);
        assertNotNull(privateFreeProduct);
        assertEquals(privateFreeProduct.getId(), ProductEnum.ATLAS.getName());
        Map<String, Plan> planMap = MapUtil.getAny(BillingConfigManager.getBillingConfig().getPlans(), ArrayUtil.toArray(privateFreeProduct.getPlans(), String.class));
        Assertions.assertThat(planMap).isNotEmpty().hasSize(1);
        Plan freePlan = planMap.get(planMap.keySet().stream().findFirst().get());
        SubscriptionFeature planFeature = buildPlanFeature(freePlan, Collections.emptyList());
        Assertions.assertThat(planFeature.getSeat().getValue()).isEqualTo(-1);
        Assertions.assertThat(planFeature.getSheetNums().getValue()).isEqualTo(-1);
        Assertions.assertThat(planFeature.getApiCallNums().getValue()).isEqualTo(-1L);
        Assertions.assertThat(planFeature.getGanttViews().getValue()).isEqualTo(-1);
        Assertions.assertThat(planFeature.getCalendarViews().getValue()).isEqualTo(-1);
        Assertions.assertThat(planFeature.getFormViews().getValue()).isEqualTo(-1);
        Assertions.assertThat(planFeature.getCapacitySize().getValue()).isEqualTo(-1);
        Assertions.assertThat(planFeature.getAdminNums().getValue()).isEqualTo(-1);
        Assertions.assertThat(planFeature.getGalleryViews().getValue()).isEqualTo(-1);
        Assertions.assertThat(planFeature.getNodePermissionNums().getValue()).isEqualTo(-1);
        Assertions.assertThat(planFeature.getFieldPermissionNums().getValue()).isEqualTo(-1);
        Assertions.assertThat(planFeature.getKanbanViews().getValue()).isEqualTo(-1);
        Assertions.assertThat(planFeature.getRemainTimeMachineDays().getValue()).isEqualTo(730);
        Assertions.assertThat(planFeature.getRemainTrashDays().getValue()).isEqualTo(730);
        Assertions.assertThat(planFeature.getRowNums().getValue()).isEqualTo(20000000);
        Assertions.assertThat(planFeature.getRowsPerSheet().getValue()).isEqualTo(50000);
        Assertions.assertThat(planFeature.getSocialConnect().getValue()).isFalse();
        Assertions.assertThat(planFeature.getRainbowLabel().getValue()).isTrue();
        Assertions.assertThat(planFeature.getWatermark().getValue()).isFalse();
    }

    /**
     * Product channel - self-operated billing: bronze-level product
     */
    @Test
    public void testGetFreeProductByVikaChannel() {
        Product freeProduct = BillingConfigManager.getCurrentFreeProduct(ProductChannel.VIKA);
        assertNotNull(freeProduct);
        assertEquals(freeProduct.getId(), ProductEnum.BRONZE.getName());
        Map<String, Plan> planMap = MapUtil.getAny(BillingConfigManager.getBillingConfig().getPlans(), ArrayUtil.toArray(freeProduct.getPlans(), String.class));
        Assertions.assertThat(planMap).isNotEmpty().hasSize(1);
        Plan freePlan = planMap.get(planMap.keySet().stream().findFirst().get());
        SubscriptionFeature planFeature = buildPlanFeature(freePlan, Collections.emptyList());
        Assertions.assertThat(planFeature.getSeat().getValue()).isEqualTo(-1);
        Assertions.assertThat(planFeature.getSheetNums().getValue()).isEqualTo(30);
        Assertions.assertThat(planFeature.getApiCallNums().getValue()).isEqualTo(10000);
        Assertions.assertThat(planFeature.getGanttViews().getValue()).isEqualTo(10);
        Assertions.assertThat(planFeature.getCalendarViews().getValue()).isEqualTo(5);
        Assertions.assertThat(planFeature.getFormViews().getValue()).isEqualTo(20);
        Assertions.assertThat(planFeature.getCapacitySize().getValue()).isEqualTo(1024 * 1024 * 1024);
        Assertions.assertThat(planFeature.getAdminNums().getValue()).isEqualTo(3);
        Assertions.assertThat(planFeature.getGalleryViews().getValue()).isEqualTo(-1);
        Assertions.assertThat(planFeature.getNodePermissionNums().getValue()).isEqualTo(10);
        Assertions.assertThat(planFeature.getFieldPermissionNums().getValue()).isEqualTo(10);
        Assertions.assertThat(planFeature.getKanbanViews().getValue()).isEqualTo(-1);
        Assertions.assertThat(planFeature.getRemainTimeMachineDays().getValue()).isEqualTo(14);
        Assertions.assertThat(planFeature.getRemainTrashDays().getValue()).isEqualTo(14);
        Assertions.assertThat(planFeature.getRowNums().getValue()).isEqualTo(20000);
        Assertions.assertThat(planFeature.getRowsPerSheet().getValue()).isEqualTo(5000);
        Assertions.assertThat(planFeature.getSocialConnect().getValue()).isFalse();
        Assertions.assertThat(planFeature.getRainbowLabel().getValue()).isFalse();
        Assertions.assertThat(planFeature.getWatermark().getValue()).isFalse();
    }

    @Test
    public void testSilverProductPlanFeture() {
        Plan silverPlan = BillingConfigManager.getPlan(ProductEnum.SILVER, 10);
        Plan addOnPlan = BillingConfigManager.getBillingConfig().getPlans().get("capacity_300_MB");
        SubscriptionFeature planFeature = buildPlanFeature(silverPlan, Collections.singletonList(addOnPlan));
        Assertions.assertThat(planFeature.getSeat().getValue()).isEqualTo(10);
        Assertions.assertThat(planFeature.getSheetNums().getValue()).isEqualTo(300);
        Assertions.assertThat(planFeature.getApiCallNums().getValue()).isEqualTo(100000);
        Assertions.assertThat(planFeature.getGanttViews().getValue()).isEqualTo(50);
        Assertions.assertThat(planFeature.getCalendarViews().getValue()).isEqualTo(50);
        Assertions.assertThat(planFeature.getFormViews().getValue()).isEqualTo(100);
        Assertions.assertThat(planFeature.getCapacitySize().getValue()).isEqualTo((50 * 1024 * 1024 * 1024L) + (300 * 1024 * 1024L));
        Assertions.assertThat(planFeature.getAdminNums().getValue()).isEqualTo(5);
        Assertions.assertThat(planFeature.getGalleryViews().getValue()).isEqualTo(-1);
        Assertions.assertThat(planFeature.getNodePermissionNums().getValue()).isEqualTo(50);
        Assertions.assertThat(planFeature.getFieldPermissionNums().getValue()).isEqualTo(50);
        Assertions.assertThat(planFeature.getKanbanViews().getValue()).isEqualTo(-1);
        Assertions.assertThat(planFeature.getRemainTimeMachineDays().getValue()).isEqualTo(90);
        Assertions.assertThat(planFeature.getRemainTrashDays().getValue()).isEqualTo(90);
        Assertions.assertThat(planFeature.getRowNums().getValue()).isEqualTo(3000000);
        Assertions.assertThat(planFeature.getRowsPerSheet().getValue()).isEqualTo(10000);
        Assertions.assertThat(planFeature.getSocialConnect().getValue()).isFalse();
        Assertions.assertThat(planFeature.getRainbowLabel().getValue()).isTrue();
        Assertions.assertThat(planFeature.getWatermark().getValue()).isFalse();
    }

    /**
     * Product Channel - DingTalk Billing: DingTalk Basic Edition Products
     */
    @Test
    public void testGetFreeProductByDingtalkChannel() {
        Product freeProduct = BillingConfigManager.getCurrentFreeProduct(ProductChannel.DINGTALK);
        assertThat(freeProduct).isNotNull();
        assertThat(ProductEnum.DINGTALK_BASE.getName()).isEqualTo(freeProduct.getId());
        Map<String, Plan> planMap = MapUtil.getAny(BillingConfigManager.getBillingConfig().getPlans(), ArrayUtil.toArray(freeProduct.getPlans(), String.class));
        Assertions.assertThat(planMap).isNotEmpty().hasSize(1);
        Plan freePlan = planMap.get(planMap.keySet().stream().findFirst().get());
        SubscriptionFeature planFeature = buildPlanFeature(freePlan, Collections.emptyList());
        Assertions.assertThat(planFeature.getSeat().getValue()).isEqualTo(-1);
        Assertions.assertThat(planFeature.getSheetNums().getValue()).isEqualTo(30);
        Assertions.assertThat(planFeature.getApiCallNums().getValue()).isEqualTo(10000);
        Assertions.assertThat(planFeature.getGanttViews().getValue()).isEqualTo(10);
        Assertions.assertThat(planFeature.getCalendarViews().getValue()).isEqualTo(5);
        Assertions.assertThat(planFeature.getFormViews().getValue()).isEqualTo(20);
        Assertions.assertThat(planFeature.getCapacitySize().getValue()).isEqualTo(1024 * 1024 * 1024);
        Assertions.assertThat(planFeature.getAdminNums().getValue()).isEqualTo(3);
        Assertions.assertThat(planFeature.getGalleryViews().getValue()).isEqualTo(-1);
        Assertions.assertThat(planFeature.getNodePermissionNums().getValue()).isEqualTo(10);
        Assertions.assertThat(planFeature.getFieldPermissionNums().getValue()).isEqualTo(10);
        Assertions.assertThat(planFeature.getKanbanViews().getValue()).isEqualTo(-1);
        Assertions.assertThat(planFeature.getRemainTimeMachineDays().getValue()).isEqualTo(14);
        Assertions.assertThat(planFeature.getRemainTrashDays().getValue()).isEqualTo(14);
        Assertions.assertThat(planFeature.getRowNums().getValue()).isEqualTo(20000);
        Assertions.assertThat(planFeature.getRowsPerSheet().getValue()).isEqualTo(5000);
        Assertions.assertThat(planFeature.getRainbowLabel().getValue()).isFalse();
        Assertions.assertThat(planFeature.getWatermark().getValue()).isFalse();
    }

    /**
     * Product Channels - Feishu Billing: Feishu Basic Edition Products
     */
    @Test
    public void testGetFreeProductByFeishuChannel() {
        Product freeProduct = BillingConfigManager.getCurrentFreeProduct(ProductChannel.LARK);
        assertNotNull(freeProduct);
        assertEquals(freeProduct.getId(), ProductEnum.FEISHU_BASE.getName());
        Map<String, Plan> planMap = MapUtil.getAny(BillingConfigManager.getBillingConfig().getPlans(), ArrayUtil.toArray(freeProduct.getPlans(), String.class));
        Assertions.assertThat(planMap).isNotEmpty().hasSize(1);
        Plan freePlan = planMap.get(planMap.keySet().stream().findFirst().get());
        SubscriptionFeature planFeature = buildPlanFeature(freePlan, Collections.emptyList());
        Assertions.assertThat(planFeature.getSeat().getValue()).isEqualTo(-1);
        Assertions.assertThat(planFeature.getSheetNums().getValue()).isEqualTo(30);
        Assertions.assertThat(planFeature.getApiCallNums().getValue()).isEqualTo(10000);
        Assertions.assertThat(planFeature.getGanttViews().getValue()).isEqualTo(10);
        Assertions.assertThat(planFeature.getCalendarViews().getValue()).isEqualTo(5);
        Assertions.assertThat(planFeature.getFormViews().getValue()).isEqualTo(20);
        Assertions.assertThat(planFeature.getCapacitySize().getValue()).isEqualTo(1024 * 1024 * 1024);
        Assertions.assertThat(planFeature.getAdminNums().getValue()).isEqualTo(3);
        Assertions.assertThat(planFeature.getGalleryViews().getValue()).isEqualTo(-1);
        Assertions.assertThat(planFeature.getNodePermissionNums().getValue()).isEqualTo(10);
        Assertions.assertThat(planFeature.getFieldPermissionNums().getValue()).isEqualTo(10);
        Assertions.assertThat(planFeature.getKanbanViews().getValue()).isEqualTo(-1);
        Assertions.assertThat(planFeature.getRemainTimeMachineDays().getValue()).isEqualTo(14);
        Assertions.assertThat(planFeature.getRemainTrashDays().getValue()).isEqualTo(14);
        Assertions.assertThat(planFeature.getRowNums().getValue()).isEqualTo(20000);
        Assertions.assertThat(planFeature.getRowsPerSheet().getValue()).isEqualTo(5000);
        Assertions.assertThat(planFeature.getRainbowLabel().getValue()).isFalse();
        Assertions.assertThat(planFeature.getWatermark().getValue()).isFalse();
    }

    /**
     * Product Channel-Enterprise WeChat Billing: Enterprise WeChat Basic Edition Products
     */
    @Test
    public void testGetFreeProductByWecomChannel() {
        Product freeProduct = BillingConfigManager.getCurrentFreeProduct(ProductChannel.WECOM);
        assertNotNull(freeProduct);
        assertEquals(freeProduct.getId(), ProductEnum.WECOM_BASE.getName());
        Map<String, Plan> planMap = MapUtil.getAny(BillingConfigManager.getBillingConfig().getPlans(), ArrayUtil.toArray(freeProduct.getPlans(), String.class));
        Assertions.assertThat(planMap).isNotEmpty().hasSize(1);
        Plan freePlan = planMap.get(planMap.keySet().stream().findFirst().get());
        SubscriptionFeature planFeature = buildPlanFeature(freePlan, Collections.emptyList());
        Assertions.assertThat(planFeature.getSeat().getValue()).isEqualTo(-1);
        Assertions.assertThat(planFeature.getSheetNums().getValue()).isEqualTo(30);
        Assertions.assertThat(planFeature.getApiCallNums().getValue()).isEqualTo(10000);
        Assertions.assertThat(planFeature.getGanttViews().getValue()).isEqualTo(10);
        Assertions.assertThat(planFeature.getCalendarViews().getValue()).isEqualTo(5);
        Assertions.assertThat(planFeature.getFormViews().getValue()).isEqualTo(20);
        Assertions.assertThat(planFeature.getCapacitySize().getValue()).isEqualTo(1024 * 1024 * 1024);
        Assertions.assertThat(planFeature.getAdminNums().getValue()).isEqualTo(3);
        Assertions.assertThat(planFeature.getGalleryViews().getValue()).isEqualTo(-1);
        Assertions.assertThat(planFeature.getNodePermissionNums().getValue()).isEqualTo(10);
        Assertions.assertThat(planFeature.getFieldPermissionNums().getValue()).isEqualTo(10);
        Assertions.assertThat(planFeature.getKanbanViews().getValue()).isEqualTo(-1);
        Assertions.assertThat(planFeature.getRemainTimeMachineDays().getValue()).isEqualTo(14);
        Assertions.assertThat(planFeature.getRemainTrashDays().getValue()).isEqualTo(14);
        Assertions.assertThat(planFeature.getRowNums().getValue()).isEqualTo(20000);
        Assertions.assertThat(planFeature.getRowsPerSheet().getValue()).isEqualTo(5000);
        Assertions.assertThat(planFeature.getSocialConnect().getValue()).isFalse();
        Assertions.assertThat(planFeature.getRainbowLabel().getValue()).isFalse();
        Assertions.assertThat(planFeature.getWatermark().getValue()).isFalse();
    }

    @Test
    public void testGetFreePlanByChannel() {
        // Sass: Bronze Edition
        Plan bronzePlan = BillingConfigManager.getFreePlan(ProductChannel.VIKA);
        assertNotNull(bronzePlan);
        assertTrue(bronzePlan.isOnline());
        assertEquals(bronzePlan.getProduct(), ProductEnum.BRONZE.getName());
        //DingTalk Billing: DingTalk Basic Edition
        Plan dingtalkBasePlan = BillingConfigManager.getFreePlan(ProductChannel.DINGTALK);
        assertNotNull(dingtalkBasePlan);
        assertTrue(dingtalkBasePlan.isOnline());
        assertEquals(dingtalkBasePlan.getProduct(), ProductEnum.DINGTALK_BASE.getName());
        // Feishu Billing: Feishu Basic Edition
        Plan feishuBasePlan = BillingConfigManager.getFreePlan(ProductChannel.LARK);
        assertNotNull(feishuBasePlan);
        assertTrue(feishuBasePlan.isOnline());
        assertEquals(feishuBasePlan.getProduct(), ProductEnum.FEISHU_BASE.getName());
        // Enterprise WeChat Billing: Enterprise WeChat Basic Edition
        Plan wecomBasePlan = BillingConfigManager.getFreePlan(ProductChannel.WECOM);
        assertNotNull(wecomBasePlan);
        assertTrue(wecomBasePlan.isOnline());
        assertEquals(wecomBasePlan.getProduct(), ProductEnum.WECOM_BASE.getName());
        // Proprietary Cloud Billing: Proprietary Cloud Ultimate
        Plan privateCloudPlan = BillingConfigManager.getFreePlan(ProductChannel.PRIVATE);
        assertNotNull(privateCloudPlan);
        assertEquals(privateCloudPlan.getProduct(), ProductEnum.PRIVATE_CLOUD.getName());
    }

    @Test
    public void testGetPriceBySeatAndMonth() {
        Price price = BillingConfigManager.getPriceBySeatAndMonths(ProductEnum.SILVER, 100, 1);
        assertNotNull(price);
        assertEquals(price.getSeat(), 100);
        assertEquals(price.getMonth(), 1);
    }

    @Test
    public void testSilverPriceList() {
        List<Price> priceList = BillingConfigManager.getPriceList(ProductEnum.SILVER);
        // What plans are must-haves for the silver package
        Integer[] months = array(1, 6, 12);
        Integer[] seats = array(2, 100);
        assertEquals(priceList.size(), months.length * seats.length);
    }

    @Test
    public void testGoldPriceList() {
        List<Price> priceList = BillingConfigManager.getPriceList(ProductEnum.GOLD);
        // What plans are must-haves for the silver package
        Integer[] months = array(1, 6, 12);
        Integer[] seats = array(200);
        assertEquals(priceList.size(), months.length * seats.length);
    }

    @Test
    public void testEventConfigIsNotNull() {
        Map<String, Event> eventConfig = BillingConfigManager.getBillingConfig().getEvents();
        assertNotNull(eventConfig);
    }

    @Test
    public void testPriceListConfigIsNotNull() {
        Map<String, PriceList> priceListConfig = BillingConfigManager.getBillingConfig().getPricelist();
        assertNotNull(priceListConfig);
    }

    @Test
    public void testGetEventOnEffectiveDate() {
        assertThat(BillingConfigManager.getEventOnEffectiveDate(LocalDate.of(2022, 10, 23))).isNull();
        assertThat(BillingConfigManager.getEventOnEffectiveDate(LocalDate.of(2022, 10, 24))).isNotNull();
        assertThat(BillingConfigManager.getEventOnEffectiveDate(LocalDate.of(2022, 11, 11))).isNotNull();
        assertThat(BillingConfigManager.getEventOnEffectiveDate(LocalDate.of(2022, 11, 12))).isNull();
    }
}
