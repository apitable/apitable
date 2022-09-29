package com.vikadata.api.util.billing;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Map.Entry;
import java.util.stream.Collectors;

import cn.hutool.core.collection.CollUtil;
import lombok.extern.slf4j.Slf4j;

import com.vikadata.api.util.billing.model.BillingFunctionEnum;
import com.vikadata.api.util.billing.model.BillingFunctionType;
import com.vikadata.api.util.billing.model.BillingPlanFeature;
import com.vikadata.api.util.billing.model.ProductChannel;
import com.vikadata.api.util.billing.model.ProductEnum;
import com.vikadata.system.config.SystemConfigManager;
import com.vikadata.system.config.billing.BillingConfig;
import com.vikadata.system.config.billing.Event;
import com.vikadata.system.config.billing.Feature;
import com.vikadata.system.config.billing.Plan;
import com.vikadata.system.config.billing.Price;
import com.vikadata.system.config.billing.PriceList;
import com.vikadata.system.config.billing.Product;

import org.springframework.util.Assert;

/**
 * <p>
 * 计费工具类
 * </p>
 *
 * @author Shawn Deng
 */
@Slf4j
public class BillingConfigManager {

    private static final BillingConfig BILLING_CONFIG = SystemConfigManager.getConfig().getBilling();

    private BillingConfigManager() {
    }


    public static BillingConfig getBillingConfig() {
        return BILLING_CONFIG;
    }

    /**
     * 获取免费产品
     *
     * @return Product 产品
     */
    public static Product getCurrentFreeProduct(ProductChannel channel) {
        return BILLING_CONFIG.getProducts().entrySet().stream()
                .filter((entry) -> ProductChannel.of(entry.getValue().getChannel()) == channel && entry.getValue().isFree())
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Billing Error"))
                .getValue();
    }

    /**
     * 获取免费订阅产品的订阅方案名称
     * 来源于配置表
     *
     * @return 免费方案名称
     */
    private static String getFreePlanName(ProductChannel channel) {
        Product freeProduct = getCurrentFreeProduct(channel);
        String basePlanName = freeProduct.getPlans().stream()
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Billing Plan Error"));
        Assert.notNull(basePlanName, "Billing Plan Error");
        return basePlanName;
    }

    /**
     * 获取免费订阅产品的订阅方案
     *
     * @return Plan 订阅方案
     */
    public static Plan getFreePlan(ProductChannel channel) {
        String freePlanName = getFreePlanName(channel);
        return BILLING_CONFIG.getPlans().get(freePlanName);
    }

    public static Plan getPlan(String productName, int seat) {
        // product name is upper case
        ProductEnum product = ProductEnum.valueOf(productName.toUpperCase(Locale.ROOT));
        return getPlan(product, seat);
    }

    public static Plan getPlan(ProductEnum product, int seat) {
        return BILLING_CONFIG.getPlans().values().stream()
                .filter(plan -> plan.getProduct().equals(product.getName()) && plan.getSeats() == seat)
                .findFirst()
                .orElse(null);
    }

    public static List<Price> getPriceList(ProductEnum product) {
        // 获取产品类型下的指定席位
        List<String> priceIds = BILLING_CONFIG.getProducts().get(product.getName()).getPrices();
        List<Price> prices = new ArrayList<>();
        priceIds.forEach(priceId -> prices.add(BILLING_CONFIG.getPrices().get(priceId)));
        return prices.stream().filter(price -> price.getSeat() != 0 && price.isOnline())
                .sorted(Comparator.comparingInt(Price::getSeat).thenComparingInt(Price::getMonth))
                .collect(Collectors.toList());
    }

    public static Price getPriceBySeatAndMonth(String productName, int seat, int month) {
        ProductEnum product = ProductEnum.valueOf(productName);
        return getPriceBySeatAndMonths(product, seat, month);
    }

    public static Price getPriceBySeatAndMonths(ProductEnum product, int seat, int month) {
        if (seat == 0) {
            return null;
        }
        return BILLING_CONFIG.getPrices().values().stream()
                .filter(price -> price.getProduct().equals(product.getName()) && price.getSeat() == seat && price.getMonth() == month)
                .findFirst()
                .orElse(null);
    }

    public static Event getEventOnEffectiveDate(LocalDate now) {
        return getBillingConfig().getEvents().values().stream()
                .filter(event -> event.getStartDate().compareTo(now) <= 0 && event.getEndDate().compareTo(now) >= 0)
                .findFirst().orElse(null);
    }

    public static Event getByEventId(String eventId) {
        return BILLING_CONFIG.getEvents().get(eventId);
    }

    public static PriceList getByPriceListId(String priceListId) {
        return BILLING_CONFIG.getPricelist().get(priceListId);
    }

    /**
     * 构建方案属性
     *
     * @param basePlan 基础订阅方案（免费方案或付费方案）
     * @param addOnPlans 增值订阅方案（API用量或者容量增值方案）
     * @return BillingPlanFeature
     */
    public static BillingPlanFeature buildPlanFeature(Plan basePlan, List<Plan> addOnPlans) {
        log.info("计算构建订阅方案的总限制值");
        BillingPlanFeature billingPlanFeature = new BillingPlanFeature();
        // 获取基础订阅方案拥有的功能点
        Map<String, Feature> basePlanFeatureMap = BILLING_CONFIG.getFeatures().entrySet().stream()
                .filter(entry -> basePlan.getFeatures().contains(entry.getKey()))
                .collect(Collectors.toMap(Map.Entry::getKey, Map.Entry::getValue));
        // 增值包没有以下属性
        billingPlanFeature.setMaxSeats(getPlanFeatureValue(basePlanFeatureMap, BillingFunctionEnum.SEATS, Long.class));
        billingPlanFeature.setMaxSheetNums(getPlanFeatureValue(basePlanFeatureMap, BillingFunctionEnum.NODES, Long.class));
        billingPlanFeature.setMaxAdminNums(getPlanFeatureValue(basePlanFeatureMap, BillingFunctionEnum.ADMIN_NUM, Long.class));
        billingPlanFeature.setMaxRowsPerSheet(getPlanFeatureValue(basePlanFeatureMap, BillingFunctionEnum.ROWS_PER_SHEET, Long.class));
        billingPlanFeature.setMaxRowsInSpace(getPlanFeatureValue(basePlanFeatureMap, BillingFunctionEnum.TOTAL_SHEET_ROWS, Long.class));
        billingPlanFeature.setMaxRemainTrashDays(getPlanFeatureValue(basePlanFeatureMap, BillingFunctionEnum.TRASH, Long.class));
        billingPlanFeature.setMaxGalleryViewsInSpace(getPlanFeatureValue(basePlanFeatureMap, BillingFunctionEnum.GALLERY_VIEW, Long.class));
        billingPlanFeature.setMaxKanbanViewsInSpace(getPlanFeatureValue(basePlanFeatureMap, BillingFunctionEnum.KANBAN_VIEW, Long.class));
        billingPlanFeature.setMaxFormViewsInSpace(getPlanFeatureValue(basePlanFeatureMap, BillingFunctionEnum.FORM_VIEW, Long.class));
        billingPlanFeature.setMaxGanttViewsInSpace(getPlanFeatureValue(basePlanFeatureMap, BillingFunctionEnum.GANTT_VIEW, Long.class));
        billingPlanFeature.setMaxCalendarViewsInSpace(getPlanFeatureValue(basePlanFeatureMap, BillingFunctionEnum.CALENDAR_VIEW, Long.class));
        billingPlanFeature.setFieldPermissionNums(getPlanFeatureValue(basePlanFeatureMap, BillingFunctionEnum.FIELD_PERMISSION, Long.class));
        billingPlanFeature.setNodePermissionNums(getPlanFeatureValue(basePlanFeatureMap, BillingFunctionEnum.NODE_PERMISSIONS, Long.class));
        billingPlanFeature.setMaxRemainTimeMachineDays(getPlanFeatureValue(basePlanFeatureMap, BillingFunctionEnum.TIME_MACHINE, Long.class));
        billingPlanFeature.setRainbowLabel(defaultIfNull(getPlanFeatureValue(basePlanFeatureMap, BillingFunctionEnum.RAINBOW_LABEL, Boolean.class)));
        billingPlanFeature.setWatermark(defaultIfNull(getPlanFeatureValue(basePlanFeatureMap, BillingFunctionEnum.WATERMARK, Boolean.class)));
        billingPlanFeature.setIntegrationDingtalk(defaultIfNull(getPlanFeatureValue(basePlanFeatureMap, BillingFunctionEnum.INTEGRATION_DINGTALK, Boolean.class)));
        billingPlanFeature.setIntegrationFeishu(defaultIfNull(getPlanFeatureValue(basePlanFeatureMap, BillingFunctionEnum.INTEGRATION_FEISHU, Boolean.class)));
        billingPlanFeature.setIntegrationWeCom(defaultIfNull(getPlanFeatureValue(basePlanFeatureMap, BillingFunctionEnum.INTEGRATION_WECOM, Boolean.class)));
        billingPlanFeature.setIntegrationOfficePreview(defaultIfNull(getPlanFeatureValue(basePlanFeatureMap, BillingFunctionEnum.INTEGRATION_OFFICE_PREVIEW, Boolean.class)));
        billingPlanFeature.setMaxRemainRecordActivityDays(getPlanFeatureValue(basePlanFeatureMap, BillingFunctionEnum.RECORD_ACTIVITY, Long.class));
        billingPlanFeature.setSecuritySettingInviteMember(defaultIfNull(getPlanFeatureValue(basePlanFeatureMap, BillingFunctionEnum.SECURITY_SETTING_INVITE_MEMBER, Boolean.class)));
        billingPlanFeature.setSecuritySettingApplyJoinSpace(defaultIfNull(getPlanFeatureValue(basePlanFeatureMap, BillingFunctionEnum.SECURITY_SETTING_APPLY_JOIN_SPACE, Boolean.class)));
        billingPlanFeature.setSecuritySettingCopyCellData(defaultIfNull(getPlanFeatureValue(basePlanFeatureMap, BillingFunctionEnum.SECURITY_SETTING_COPY_CELL_DATA, Boolean.class)));
        billingPlanFeature.setSecuritySettingDownloadFile(defaultIfNull(getPlanFeatureValue(basePlanFeatureMap, BillingFunctionEnum.SECURITY_SETTING_DOWNLOAD_FILE, Boolean.class)));
        billingPlanFeature.setSecuritySettingExport(defaultIfNull(getPlanFeatureValue(basePlanFeatureMap, BillingFunctionEnum.SECURITY_SETTING_EXPORT, Boolean.class)));
        billingPlanFeature.setSecuritySettingShare(defaultIfNull(getPlanFeatureValue(basePlanFeatureMap, BillingFunctionEnum.SECURITY_SETTING_SHARE, Boolean.class)));
        billingPlanFeature.setSecuritySettingMobile(defaultIfNull(getPlanFeatureValue(basePlanFeatureMap, BillingFunctionEnum.SECURITY_SETTING_MOBILE, Boolean.class)));
        billingPlanFeature.setMaxAuditQueryDays(getPlanFeatureValue(basePlanFeatureMap, BillingFunctionEnum.AUDIT_QUERY, Long.class));
        billingPlanFeature.setSecuritySettingAddressListIsolation(getPlanFeatureValue(basePlanFeatureMap, BillingFunctionEnum.SECURITY_SETTING_ADDRESS_LIST_ISOLATION, Boolean.class));
        billingPlanFeature.setSecuritySettingCatalogManagement(getPlanFeatureValue(basePlanFeatureMap, BillingFunctionEnum.SECURITY_SETTING_CATALOG_MANAGEMENT, Boolean.class));
        // 可叠加订阅方案限制值
        Long baseCapacitySize = getPlanFeatureValue(basePlanFeatureMap, BillingFunctionEnum.CAPACITY, Long.class);
        if (baseCapacitySize != null) {
            billingPlanFeature.setMaxCapacitySizeInBytes(baseCapacitySize != -1 ? baseCapacitySize * 1024 * 1024 * 1024L : baseCapacitySize);
        }
        Long baseApiCalls = getPlanFeatureValue(basePlanFeatureMap, BillingFunctionEnum.API_CALL, Long.class);
        if (baseApiCalls != null) {
            billingPlanFeature.setMaxApiCall(baseApiCalls);
        }
        // 获取增值包的方案
        if (CollUtil.isNotEmpty(addOnPlans)) {
            // 有增值包方案存在，使用增值方案的值
            addOnPlans.forEach(addOnPlan -> {
                List<Feature> features = BILLING_CONFIG.getFeatures().entrySet()
                        .stream()
                        .filter(entry -> addOnPlan.getFeatures().contains(entry.getKey()))
                        .map(Map.Entry::getValue).collect(Collectors.toList());
                for (Feature feature : features) {
                    // 附件容量增值
                    if (feature.getFunction().equals(BillingFunctionEnum.CAPACITY.getCode())) {
                        // 增值方案叠加包
                        long totalCapacity = billingPlanFeature.getMaxCapacitySizeInBytes() != null ?
                                billingPlanFeature.getMaxCapacitySizeInBytes() + getTrueSpecificationByUnit(feature.getSpecification(), feature.getUnit())
                                : feature.getSpecification();
                        billingPlanFeature.setMaxCapacitySizeInBytes(totalCapacity);
                        break;
                    }
                    // API 用量增值
                    if (feature.getFunction().equals(BillingFunctionEnum.API_CALL.getCode())) {
                        billingPlanFeature.setMaxApiCall(feature.getSpecification());
                        break;
                    }
                }
            });
        }
        return billingPlanFeature;
    }

    private static Long getTrueSpecificationByUnit(Long specification, String unit) {
        if ("g".equalsIgnoreCase(unit)) {
            return specification * 1024 * 1024 * 1024L;
        }
        else if ("mb".equalsIgnoreCase(unit)) {
            return specification * 1024 * 1024L;
        }
        else {
            throw new IllegalArgumentException("lost specification unit");
        }
    }

    /**
     * 获取订阅规格值
     *
     * @param featureMap 方案功能集合
     * @param functionEnum 功能点
     * @param clzType 功能点规格类型
     * @param <T> 规格类型
     * @return 规格值
     */
    public static <T> T getPlanFeatureValue(Map<String, Feature> featureMap, BillingFunctionEnum functionEnum, Class<T> clzType) {
        Feature feature = getPlanFeature(featureMap, functionEnum.getCode());
        if (feature == null) {
            return null;
        }
        BillingFunctionType functionType = BillingFunctionType.of(feature.getFunctionType());
        if (functionType != null) {
            if (functionType.isSubscribe()) {
                return clzType.cast(Boolean.TRUE);
            }
            return clzType.cast(feature.getSpecification());
        }
        return null;
    }

    private static Boolean defaultIfNull(Boolean bool) {
        if (bool == null) {
            return Boolean.FALSE;
        }
        return bool;
    }

    /**
     * 获取到指定功能点定义
     *
     * @param planFeatureMap 订阅方案功能集合
     * @param functionId 功能点标识
     * @return Feature 功能点对象
     */
    public static Feature getPlanFeature(Map<String, Feature> planFeatureMap, String functionId) {
        Feature feature = null;
        for (Entry<String, Feature> entry : planFeatureMap.entrySet()) {
            if (entry.getValue().getFunction().contentEquals(functionId)) {
                feature = entry.getValue();
                break;
            }
        }
        return feature;
    }
}
