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
 * Billing Config Manager
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
     * Get product by name
     *
     * @param productName product name
     * @return Product
     */
    public static Product getProductByName(String productName) {
        return BILLING_CONFIG.getProducts().get(productName);
    }

    /**
     * Get free products
     * @param channel product channel
     * @return Product
     */
    public static Product getCurrentFreeProduct(ProductChannel channel) {
        return BILLING_CONFIG.getProducts().entrySet().stream()
                .filter((entry) -> ProductChannel.of(entry.getValue().getChannel()) == channel && entry.getValue().isFree())
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Billing Error"))
                .getValue();
    }

    /**
     * get free plan name
     *
     * @return free name
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
     * get free plan on special channel
     *
     * @return Plan channel
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
                .filter(price -> price.getProduct().equals(product.getName())
                        && price.getSeat() == seat && price.getMonth() == month
                        && price.isOnline())
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
     * build plan feature
     *
     * @param basePlan base plan
     * @param addOnPlans list of add-on plan
     * @return BillingPlanFeature
     */
    public static BillingPlanFeature buildPlanFeature(Plan basePlan, List<Plan> addOnPlans) {
        BillingPlanFeature billingPlanFeature = new BillingPlanFeature();
        // Get the feature points that the basic subscription plan has
        Map<String, Feature> basePlanFeatureMap = BILLING_CONFIG.getFeatures().entrySet().stream()
                .filter(entry -> basePlan.getFeatures().contains(entry.getKey()))
                .collect(Collectors.toMap(Entry::getKey, Entry::getValue));
        // The add-on plan does not have the following attributes
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
        billingPlanFeature.setMaxMirrorNums(getPlanFeatureValue(basePlanFeatureMap, BillingFunctionEnum.MIRRORS, Long.class));
        // Stackable subscription plan limits
        Long baseCapacitySize = getPlanFeatureValue(basePlanFeatureMap, BillingFunctionEnum.CAPACITY, Long.class);
        if (baseCapacitySize != null) {
            billingPlanFeature.setMaxCapacitySizeInBytes(baseCapacitySize != -1 ? baseCapacitySize * 1024 * 1024 * 1024L : baseCapacitySize);
        }
        Long baseApiCalls = getPlanFeatureValue(basePlanFeatureMap, BillingFunctionEnum.API_CALL, Long.class);
        if (baseApiCalls != null) {
            billingPlanFeature.setMaxApiCall(baseApiCalls);
        }
        // Option to obtain add-on packages
        if (CollUtil.isNotEmpty(addOnPlans)) {
            // There is an add-on plan, and the value of the add-on plan is used
            addOnPlans.forEach(addOnPlan -> {
                List<Feature> features = BILLING_CONFIG.getFeatures().entrySet()
                        .stream()
                        .filter(entry -> addOnPlan.getFeatures().contains(entry.getKey()))
                        .map(Entry::getValue).collect(Collectors.toList());
                for (Feature feature : features) {
                    // Added capacity of accessories
                    if (feature.getFunction().equals(BillingFunctionEnum.CAPACITY.getCode())) {
                        long totalCapacity = billingPlanFeature.getMaxCapacitySizeInBytes() != null ?
                                billingPlanFeature.getMaxCapacitySizeInBytes() + getTrueSpecificationByUnit(feature.getSpecification(), feature.getUnit())
                                : feature.getSpecification();
                        billingPlanFeature.setMaxCapacitySizeInBytes(totalCapacity);
                        break;
                    }
                    // API Usage
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
     * get subscription specification value
     *
     * @param featureMap feature set
     * @param functionEnum function code
     * @param clzType feature value data type
     * @param <T> data type
     * @return specification value
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
     * Get the specified function point definition
     *
     * @param planFeatureMap Subscription plan feature set
     * @param functionId function identification
     * @return Feature
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
