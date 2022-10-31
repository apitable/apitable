package com.vikadata.api.modular.finance.service.impl;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Collectors;

import javax.annotation.Resource;

import cn.hutool.core.bean.BeanUtil;
import cn.hutool.core.collection.CollUtil;
import cn.hutool.core.util.BooleanUtil;
import cn.hutool.core.util.ObjectUtil;
import cn.hutool.core.util.StrUtil;
import cn.hutool.json.JSONObject;
import cn.hutool.json.JSONUtil;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import lombok.extern.slf4j.Slf4j;

import com.vikadata.api.component.clock.ClockManager;
import com.vikadata.api.config.properties.BillingProperties;
import com.vikadata.api.config.properties.ConstProperties;
import com.vikadata.api.config.properties.SelfHostProperties;
import com.vikadata.api.constants.DateFormatConstants;
import com.vikadata.api.enums.exception.BillingException;
import com.vikadata.api.enums.finance.BundleState;
import com.vikadata.api.enums.finance.CapacityType;
import com.vikadata.api.enums.finance.SubscriptionPhase;
import com.vikadata.api.enums.finance.SubscriptionState;
import com.vikadata.api.enums.social.SocialPlatformType;
import com.vikadata.api.enums.space.SpaceCertification;
import com.vikadata.api.lang.SpaceGlobalFeature;
import com.vikadata.api.modular.finance.core.Bundle;
import com.vikadata.api.modular.finance.core.Subscription;
import com.vikadata.api.modular.finance.mapper.SubscriptionMapper;
import com.vikadata.api.modular.finance.service.IBundleService;
import com.vikadata.api.modular.finance.service.ISpaceSubscriptionService;
import com.vikadata.api.modular.finance.service.ISubscriptionService;
import com.vikadata.api.modular.internal.model.InternalSpaceSubscriptionVo;
import com.vikadata.api.modular.social.enums.SocialAppType;
import com.vikadata.api.modular.social.service.ISocialTenantBindService;
import com.vikadata.api.modular.social.service.ISocialTenantService;
import com.vikadata.api.modular.space.model.InviteUserInfo;
import com.vikadata.api.modular.space.model.SpaceSubscriptionDto;
import com.vikadata.api.modular.space.model.vo.SpaceCapacityPageVO;
import com.vikadata.api.modular.space.model.vo.SpaceSubscribeVo;
import com.vikadata.api.modular.space.service.ISpaceService;
import com.vikadata.api.modular.user.mapper.UserMapper;
import com.vikadata.api.util.billing.BillingConfigManager;
import com.vikadata.api.util.billing.model.BillingPlanFeature;
import com.vikadata.api.util.billing.model.ProductCategory;
import com.vikadata.api.util.billing.model.ProductChannel;
import com.vikadata.api.util.billing.model.SubscribePlanInfo;
import com.vikadata.core.util.ExceptionUtil;
import com.vikadata.entity.BundleEntity;
import com.vikadata.entity.SubscriptionEntity;
import com.vikadata.system.config.BillingWhiteListConfig;
import com.vikadata.system.config.BillingWhiteListConfigManager;
import com.vikadata.system.config.FeatureSetting;
import com.vikadata.system.config.billing.Feature;
import com.vikadata.system.config.billing.Plan;
import com.vikadata.system.config.billing.Product;

import org.springframework.stereotype.Service;

import static com.vikadata.api.util.billing.BillingConfigManager.buildPlanFeature;
import static com.vikadata.api.util.billing.BillingConfigManager.getBillingConfig;
import static com.vikadata.api.util.billing.BillingConfigManager.getFreePlan;
import static com.vikadata.api.util.billing.BillingUtil.channelDefaultSubscription;
import static com.vikadata.api.util.billing.BillingUtil.legacyPlanId;
import static com.vikadata.api.util.billing.model.BillingConstants.CATALOG_VERSION;

/**
 * <p>
 * Space Subscription Service Implement Class
 * </p>
 */
@Service
@Slf4j
public class SpaceSubscriptionServiceImpl implements ISpaceSubscriptionService {

    @Resource
    private ISocialTenantService iSocialTenantService;

    @Resource
    private ISocialTenantBindService iSocialTenantBindService;

    @Resource
    private ISpaceService iSpaceService;

    @Resource
    private SelfHostProperties selfHostProperties;

    @Resource
    private ConstProperties constProperties;

    @Resource
    private IBundleService iBundleService;

    @Resource
    private ISubscriptionService iSubscriptionService;

    @Resource
    private SubscriptionMapper subscriptionMapper;

    @Resource
    private UserMapper userMapper;

    @Resource
    private BillingProperties billingProperties;

    @Override
    public Map<String, BillingPlanFeature> getSubscriptionFeatureBySpaceIds(List<String> spaceIds) {
        List<Bundle> bundles = iBundleService.getActivatedBundlesBySpaceId(spaceIds);
        Map<String, List<Bundle>> bundleMap = bundles.stream()
                .collect(Collectors.groupingBy(Bundle::getSpaceId));
        Map<String, BillingPlanFeature> planFeatureMap = new HashMap<>(spaceIds.size());
        for (String spaceId : spaceIds) {
            if (bundleMap.containsKey(spaceId)) {
                Subscription baseSubscription = bundleMap.get(spaceId).iterator().next().getBaseSubscription();
                Plan basePlan = getBillingConfig().getPlans().get(legacyPlanId(baseSubscription.getPlanId()));
                BillingPlanFeature freePlanFeature = buildPlanFeature(basePlan, Collections.emptyList());
                planFeatureMap.put(spaceId, freePlanFeature);
            }
            else {
                SubscribePlanInfo freePlanInfo = channelDefaultSubscription(ProductChannel.VIKA);
                BillingPlanFeature freePlanFeature = buildPlanFeature(freePlanInfo.getBasePlan(), freePlanInfo.getAddOnPlans());
                planFeatureMap.put(spaceId, freePlanFeature);
            }
        }
        return planFeatureMap;
    }

    @Override
    public SubscribePlanInfo getPlanInfoBySpaceId(String spaceId) {
        log.info("Get a subscription plan for space「{}」", spaceId);
        // Proprietary cloud version is open, all spaces are flagship version
        if (BooleanUtil.isTrue(selfHostProperties.getEnabled())) {
            SubscribePlanInfo planInfo = Optional.ofNullable(channelDefaultSubscription(ProductChannel.PRIVATE))
                    .orElse(channelDefaultSubscription(ProductChannel.VIKA));
            if (StrUtil.isBlank(selfHostProperties.getExpiredAt())) {
                return planInfo;
            }
            LocalDate expiredAt = LocalDate.parse(selfHostProperties.getExpiredAt());
            planInfo.setDeadline(expiredAt);
            return planInfo;
        }
        Bundle bundle = iBundleService.getPossibleBundleBySpaceId(spaceId);
        if (bundle == null) {
            // Return to default free subscription plan
            return defaultPlanInfo(spaceId);
        }
        // Basic subscription
        Subscription baseSubscription = bundle.getBaseSubscription();
        LocalDate baseExpireDate = baseSubscription.getExpireDate().toLocalDate();
        LocalDate now = ClockManager.me().getLocalDateNow();
        boolean isBaseEntitlementExpire = bundle.isBaseForFree() || now.compareTo(baseExpireDate) > 0;
        // The value-added plan does not currently support third-party integration spaces
        Plan basePlan = isBaseEntitlementExpire ? getFreePlan(billingProperties.getChannel()) : getBillingConfig().getPlans().get(legacyPlanId(baseSubscription.getPlanId()));
        Product baseProduct = getBillingConfig().getProducts().get(basePlan.getProduct());
        LocalDate deadline = isBaseEntitlementExpire ? null : baseExpireDate;
        // Add-on subscription
        List<Subscription> addOnSubscription = bundle.getAddOnSubscription();
        List<Plan> addOnPlans = addOnSubscription.stream()
                .filter(subscription -> {
                    LocalDate today = ClockManager.me().getLocalDateNow();
                    LocalDate startDate = subscription.getStartDate().toLocalDate();
                    LocalDate expireDate = subscription.getExpireDate().toLocalDate();
                    return today.compareTo(startDate) >= 0 && today.compareTo(expireDate) <= 0;
                })
                .map(subscription -> getBillingConfig().getPlans().get(subscription.getPlanId()))
                .collect(Collectors.toList());
        return SubscribePlanInfo.builder()
                .version(CATALOG_VERSION).product(basePlan.getProduct())
                .free(baseProduct.isFree())
                .startDate(bundle.getBundleStartDate().toLocalDate())
                .deadline(deadline)
                .onTrial(SubscriptionPhase.TRIAL.equals(baseSubscription.getPhase()))
                .basePlan(basePlan).addOnPlans(addOnPlans).build();
    }

    private SubscribePlanInfo defaultPlanInfo(String spaceId) {
        // If a third party is bound, isv returns the corresponding base version
        // No equity, return to default configuration
        return Optional.ofNullable(iSocialTenantBindService.getTenantBindInfoBySpaceId(spaceId))
                .map(bind -> iSocialTenantService.getByAppIdAndTenantId(bind.getAppId(), bind.getTenantId()))
                .map(tenant -> {
                    if (Boolean.TRUE.equals(tenant.getStatus()) && SocialAppType.ISV.getType() == tenant.getAppType()) {
                        if (SocialPlatformType.WECOM.getValue().equals(tenant.getPlatform())) {
                            return channelDefaultSubscription(ProductChannel.WECOM);
                        }
                        if (SocialPlatformType.DINGTALK.getValue().equals(tenant.getPlatform())) {
                            return channelDefaultSubscription(ProductChannel.DINGTALK);
                        }
                        if (SocialPlatformType.FEISHU.getValue().equals(tenant.getPlatform())) {
                            return channelDefaultSubscription(ProductChannel.LARK);
                        }
                    }
                    return channelDefaultSubscription(billingProperties.getChannel());
                })
                .orElse(channelDefaultSubscription(billingProperties.getChannel()));
    }

    @Override
    public SpaceSubscribeVo getSpaceSubscription(String spaceId) {
        SpaceGlobalFeature spaceGlobalFeature = iSpaceService.getSpaceGlobalFeature(spaceId);
        SpaceSubscribeVo result = new SpaceSubscribeVo();
        SubscribePlanInfo planInfo = getPlanInfoBySpaceId(spaceId);
        result.setVersion(planInfo.getVersion());
        result.setProduct(planInfo.getProduct());
        result.setPlan(planInfo.getBasePlan().getId());
        result.setOnTrial(planInfo.isOnTrial());
        result.setDeadline(planInfo.getDeadline());
        if (CollUtil.isNotEmpty(planInfo.getAddOnPlans())) {
            result.setAddOnPlans(planInfo.getAddOnPlans().stream().map(Plan::getId).collect(Collectors.toList()));
        }
        BillingPlanFeature planFeature = buildPlanFeature(planInfo.getBasePlan(), planInfo.getAddOnPlans());
        wrapperPlanFeature(spaceId, planFeature);
        BeanUtil.copyProperties(planFeature, result);

        boolean blackSpace = planInfo.isFree() ? ObjectUtil.defaultIfNull(spaceGlobalFeature.getBlackSpace(), Boolean.FALSE) : Boolean.FALSE;
        result.setBlackSpace(blackSpace);
        // todo Temporary plan, removed from new subscriptions
        if (SpaceCertification.BASIC.getLevel().equals(spaceGlobalFeature.getCertification())) {
            result.setMaxCapacitySizeInBytes(constProperties.getSpaceBasicCertificationCapacity() * 1024 * 1024 * 1024L + result.getMaxCapacitySizeInBytes());
        }
        if (SpaceCertification.SENIOR.getLevel().equals(spaceGlobalFeature.getCertification())) {
            result.setMaxCapacitySizeInBytes(constProperties.getSpaceSeniorCertificationCapacity() * 1024 * 1024 * 1024L + result.getMaxCapacitySizeInBytes());
        }
        // Complimentary accessory capacity
        Long unExpireGiftCapacity = this.getSpaceUnExpireGiftCapacity(spaceId);
        result.setUnExpireGiftCapacity(unExpireGiftCapacity);
        if (unExpireGiftCapacity != 0) {
            // subscription capacity
            Long subscriptionCapacity = result.getMaxCapacitySizeInBytes() - unExpireGiftCapacity;
            result.setSubscriptionCapacity(subscriptionCapacity);
        }
        else {
            result.setSubscriptionCapacity(result.getMaxCapacitySizeInBytes());
        }
        return result;
    }

    private BillingPlanFeature getPlanFeature(String spaceId) {
        SubscribePlanInfo planInfo = getPlanInfoBySpaceId(spaceId);
        BillingPlanFeature planFeature = buildPlanFeature(planInfo.getBasePlan(), planInfo.getAddOnPlans());
        wrapperPlanFeature(spaceId, planFeature);
        return planFeature;
    }

    @Override
    public long getPlanMaxCapacity(String spaceId) {
        BillingPlanFeature planFeature = getPlanFeature(spaceId);
        long value = planFeature.getMaxCapacitySizeInBytes();
        SpaceGlobalFeature spaceGlobalFeature = iSpaceService.getSpaceGlobalFeature(spaceId);
        if (SpaceCertification.BASIC.getLevel().equals(spaceGlobalFeature.getCertification())) {
            value += constProperties.getSpaceBasicCertificationCapacity() * 1024 * 1024 * 1024L;
        }
        if (SpaceCertification.SENIOR.getLevel().equals(spaceGlobalFeature.getCertification())) {
            value += constProperties.getSpaceSeniorCertificationCapacity() * 1024 * 1024 * 1024L;
        }
        ExceptionUtil.isFalse(value == 0L, BillingException.ACCOUNT_BUNDLE_ERROR);
        return value;
    }

    @Override
    public long getPlanAuditQueryDays(String spaceId) {
        BillingPlanFeature planFeature = getPlanFeature(spaceId);
        Long value = planFeature.getMaxAuditQueryDays();
        ExceptionUtil.isTrue(value != null && value > 0L, BillingException.PLAN_FEATURE_NOT_SUPPORT);
        return value;
    }

    @Override
    public long getPlanTrashRemainDays(String spaceId) {
        BillingPlanFeature planFeature = getPlanFeature(spaceId);
        long value = planFeature.getMaxRemainTrashDays();
        ExceptionUtil.isFalse(value == 0L, BillingException.ACCOUNT_BUNDLE_ERROR);
        return value;
    }


    @Override
    public InternalSpaceSubscriptionVo getSpaceSubscriptionVo(String spaceId) {
        SubscribePlanInfo planInfo = getPlanInfoBySpaceId(spaceId);
        BillingPlanFeature planFeature = buildPlanFeature(planInfo.getBasePlan(), planInfo.getAddOnPlans());
        wrapperPlanFeature(spaceId, planFeature);
        InternalSpaceSubscriptionVo subscriptionVo = new InternalSpaceSubscriptionVo();
        BeanUtil.copyProperties(planFeature, subscriptionVo);
        return subscriptionVo;
    }

    @Override
    public void handleExpiredSubscription(String spaceId) {
        LocalDateTime nowTime = ClockManager.me().getLocalDateTimeNow();
        List<BundleEntity> bundles = iBundleService.getBySpaceIdAndState(spaceId, BundleState.ACTIVATED);
        bundles.forEach(bundle -> {
            // The end time is after the current time, marked as expired
            if (bundle.getEndDate().isBefore(nowTime)) {
                BundleEntity updatedBundle =
                        BundleEntity.builder().state(BundleState.EXPIRED.name()).updatedBy(bundle.getUpdatedBy()).build();
                iBundleService.updateByBundleId(bundle.getBundleId(), updatedBundle);
            }
            // Query subscription
            List<SubscriptionEntity> subscriptions =
                    iSubscriptionService.getByBundleIdAndState(bundle.getBundleId(), SubscriptionState.ACTIVATED);
            subscriptions.forEach(subscription -> {
                // Handling expired subscriptions
                if (subscription.getExpireDate().isBefore(nowTime)) {
                    SubscriptionEntity entity =
                            SubscriptionEntity.builder().state(SubscriptionState.EXPIRED.name()).updatedBy(subscription.getUpdatedBy()).build();
                    iSubscriptionService.updateBySubscriptionId(subscription.getSubscriptionId(), entity);
                }
            });
        });
    }

    private void wrapperPlanFeature(String spaceId, BillingPlanFeature planFeature) {
        BillingWhiteListConfig config = BillingWhiteListConfigManager.getConfig();
        if (!config.containsKey(spaceId)) {
            return;
        }
        FeatureSetting setting = config.get(spaceId);
        LocalDate whiteEndDate = setting.getEndDate();
        LocalDate today = ClockManager.me().getLocalDateNow();
        if (today.compareTo(whiteEndDate) <= 0) {
            // Additional value-added plan
            if (setting.getCapacity() != null) {
                Long increase = setting.getCapacity() * 1024 * 1024 * 1024L + planFeature.getMaxCapacitySizeInBytes();
                planFeature.setMaxCapacitySizeInBytes(increase);
            }
            if (setting.getNodes() != null) {
                Long increase = setting.getNodes() + planFeature.getMaxSheetNums();
                planFeature.setMaxSheetNums(increase);
            }
        }
    }

    @Override
    public Long getSpaceUnExpireGiftCapacity(String spaceId) {
        log.info("Get the capacity of unexpired attachments given by space");
        // Free attachment capacity planId
        String planId = "capacity_300_MB";
        // Get the number of add-on subscription plans that give away add-on capacity
        Integer planCount = subscriptionMapper.selectUnExpireGiftCapacityBySpaceId(spaceId, planId, SubscriptionState.ACTIVATED);
        // Get plan package features
        Plan plan = BillingConfigManager.getBillingConfig().getPlans().get(planId);
        Feature feature = BillingConfigManager.getBillingConfig().getFeatures().get(plan.getFeatures().stream().filter(e -> e.contains("capacity")).findFirst().get());
        // Returns the size of the gifted unexpired attachments
        return planCount * 1024L * 1024 * feature.getSpecification();
    }

    @Override
    public IPage<SpaceCapacityPageVO> getSpaceCapacityDetail(String spaceId, Boolean isExpire, Page page) {
        log.info("Query attachment capacity details");
        // Query expired attachment capacity
        if (isExpire) {
            // Query expired attachment capacity order information
            IPage<SpaceSubscriptionDto> expireList = subscriptionMapper.selectExpireCapacityBySpaceId(spaceId, page);
            return this.handleCapacitySubscription(expireList, page);
        }
        // Query unexpired attachment capacity order information
        IPage<SpaceSubscriptionDto> unExpirePage = subscriptionMapper.selectUnExpireCapacityBySpaceId(spaceId, page, SubscriptionState.ACTIVATED);
        IPage<SpaceCapacityPageVO> spaceCapacityPageVOIPage = this.handleCapacitySubscription(unExpirePage, page);
        // Handle the record of the attachment capacity given by the official,
        // and receive 5GB and 10GB attachment capacity respectively for basic space and advanced certification.
        if (this.checkOfficialGiftCapacity(spaceId) != null) {
            spaceCapacityPageVOIPage.getRecords().add(this.checkOfficialGiftCapacity(spaceId));
            spaceCapacityPageVOIPage.setTotal(spaceCapacityPageVOIPage.getTotal() + 1);
        }
        // Handle the attachment capacity record of the free subscription plan space station,
        // the default 1GB attachment capacity of the bronze-level space station
        Integer number = subscriptionMapper.selectUnExpireBaseProductBySpaceId(spaceId, SubscriptionState.ACTIVATED, ProductCategory.BASE);
        if (number == 0) {
            SpaceCapacityPageVO freeCapacity = new SpaceCapacityPageVO();
            freeCapacity.setQuota("1GB");
            freeCapacity.setQuotaSource(CapacityType.SUBSCRIPTION_PACKAGE_CAPACITY.getName());
            freeCapacity.setExpireDate("-1");
            spaceCapacityPageVOIPage.getRecords().add(freeCapacity);
            spaceCapacityPageVOIPage.setTotal(spaceCapacityPageVOIPage.getTotal() + 1);
        }
        return spaceCapacityPageVOIPage;
    }

    @Override
    public IPage<SpaceCapacityPageVO> handleCapacitySubscription(IPage<SpaceSubscriptionDto> spaceSubscriptionDtoIPage, Page page) {
        log.info("Process attachment capacity order information");
        String giftSubscriptionPlanId = "capacity_300_MB";
        // Build a collection of attachment capacity detail objects
        List<SpaceCapacityPageVO> spaceCapacityPageVos = new ArrayList<>();
        for (SpaceSubscriptionDto spaceSubscriptionDto : spaceSubscriptionDtoIPage.getRecords()) {
            if (giftSubscriptionPlanId.equals(spaceSubscriptionDto.getPlanId()) && StrUtil.isEmpty(spaceSubscriptionDto.getMetadata())) {
                continue;
            }
            // Process planId, remove _monthly, _biannual, _annual, _v1
            List<String> removeStrings = CollUtil.newArrayList("_monthly", "_biannual", "_annual", "_v1");
            String planId = spaceSubscriptionDto.getPlanId();
            for (String removeString : removeStrings) {
                if (planId.contains(removeString)) {
                    planId = StrUtil.removeAll(planId, removeString);
                }
            }
            // Get plan package features
            String finalPlanId = planId;
            Plan plan = BillingConfigManager.getBillingConfig().getPlans().values().stream().filter(e -> e.getId().contains(finalPlanId)).findFirst().get();
            Feature feature = BillingConfigManager.getBillingConfig().getFeatures().get(plan.getFeatures().stream().filter(e -> e.contains("capacity")).findFirst().get());
            // Build Attachment Capacity Detail Record
            SpaceCapacityPageVO spaceCapacityPageVO = new SpaceCapacityPageVO();
            // Attachment capacity quota
            if (feature.getSpecification() == -1) {
                spaceCapacityPageVO.setQuota("-1");
            }
            else if (Objects.equals(feature.getSpecification(), getBillingConfig().getFeatures().get("storage_capacity_300_mb").getSpecification())) {
                spaceCapacityPageVO.setQuota(StrUtil.format("{}MB", feature.getSpecification()));
            }
            else {
                spaceCapacityPageVO.setQuota(StrUtil.format("{}GB", feature.getSpecification()));
            }
            // Accessory capacity quota source
            if (StrUtil.isNotEmpty(spaceSubscriptionDto.getMetadata())) {
                // Parse metadata information, including new user ID, new user name, attachment capacity type
                JSONObject metadata = JSONUtil.parseObj(spaceSubscriptionDto.getMetadata());
                String capacityType = metadata.getStr("capacityType");
                // Determine if attachment capacity is a reward for inviting new users to the space station
                if (CapacityType.PARTICIPATION_CAPACITY.getName().equals(capacityType)) {
                    // Obtain invited user information through user ID, including user ID, user avatar
                    Long userId = Long.valueOf(metadata.getStr("userId"));
                    InviteUserInfo inviteUserInfo = userMapper.selectInviteUserInfoByUserId(userId);
                    spaceCapacityPageVO.setQuotaSource(CapacityType.PARTICIPATION_CAPACITY.getName());
                    // Participate in the activity of inviting users to give away attachment capacity,
                    // and additionally return invited member information
                    spaceCapacityPageVO.setInviteUserInfo(inviteUserInfo);
                }
            }
            // Subscription package attachment capacity quota source
            if (ProductCategory.BASE.name().equals(spaceSubscriptionDto.getProductCategory())) {
                spaceCapacityPageVO.setQuotaSource(CapacityType.SUBSCRIPTION_PACKAGE_CAPACITY.getName());
            }
            // Business order attachment capacity quota source
            if (ProductCategory.ADD_ON.name().equals(spaceSubscriptionDto.getProductCategory()) && StrUtil.isEmpty(spaceSubscriptionDto.getMetadata())) {
                spaceCapacityPageVO.setQuotaSource(CapacityType.PURCHASE_CAPACITY.getName());
            }
            // Attachment capacity expiration time
            spaceCapacityPageVO.setExpireDate(spaceSubscriptionDto.getExpireTime().format(DateTimeFormatter.ofPattern(DateFormatConstants.TIME_SIMPLE_PATTERN)));
            spaceCapacityPageVos.add(spaceCapacityPageVO);
        }
        // Build pagination return objects
        IPage<SpaceCapacityPageVO> spaceCapacityPageVOIPage = new Page<>();
        spaceCapacityPageVOIPage.setRecords(spaceCapacityPageVos);
        spaceCapacityPageVOIPage.setCurrent(page.getCurrent());
        spaceCapacityPageVOIPage.setSize(page.getSize());
        spaceCapacityPageVOIPage.setTotal(page.getTotal());
        return spaceCapacityPageVOIPage;
    }

    @Override
    public SpaceCapacityPageVO checkOfficialGiftCapacity(String spaceId) {
        log.info("Check if the space station is certified to receive the official accessory capacity reward");
        SpaceGlobalFeature spaceGlobalFeature = iSpaceService.getSpaceGlobalFeature(spaceId);
        if (spaceGlobalFeature.getCertification() != null) {
            // Build official gift attachment capacity information
            SpaceCapacityPageVO officialGiftCapacity = new SpaceCapacityPageVO();
            // Basic certification 5GB capacity
            if (SpaceCertification.BASIC.getLevel().equals(spaceGlobalFeature.getCertification())) {
                officialGiftCapacity.setQuota(StrUtil.format("{}GB", constProperties.getSpaceBasicCertificationCapacity()));
                officialGiftCapacity.setQuotaSource(CapacityType.OFFICIAL_GIFT_CAPACITY.getName());
                officialGiftCapacity.setExpireDate("-1");
            }
            // Premium certified 10GB capacity
            if (SpaceCertification.SENIOR.getLevel().equals(spaceGlobalFeature.getCertification())) {
                officialGiftCapacity.setQuota(StrUtil.format("{}GB", constProperties.getSpaceSeniorCertificationCapacity()));
                officialGiftCapacity.setQuotaSource(CapacityType.OFFICIAL_GIFT_CAPACITY.getName());
                officialGiftCapacity.setExpireDate("-1");
            }
            return officialGiftCapacity;
        }
        return null;
    }
}
