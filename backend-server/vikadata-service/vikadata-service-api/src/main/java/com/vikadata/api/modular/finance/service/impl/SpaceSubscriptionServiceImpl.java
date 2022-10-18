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
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;

import javax.annotation.Resource;

import cn.hutool.core.bean.BeanUtil;
import cn.hutool.core.collection.CollUtil;
import cn.hutool.core.io.FileUtil;
import cn.hutool.core.lang.Dict;
import cn.hutool.core.util.BooleanUtil;
import cn.hutool.core.util.ObjectUtil;
import cn.hutool.core.util.StrUtil;
import cn.hutool.json.JSONObject;
import cn.hutool.json.JSONUtil;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import lombok.extern.slf4j.Slf4j;

import com.vikadata.api.cache.service.SpaceCapacityCacheService;
import com.vikadata.api.component.TaskManager;
import com.vikadata.api.component.notification.NotificationManager;
import com.vikadata.api.component.notification.NotificationTemplateId;
import com.vikadata.api.config.properties.BillingProperties;
import com.vikadata.api.config.properties.ConstProperties;
import com.vikadata.api.config.properties.SelfHostProperties;
import com.vikadata.api.constants.DateFormatConstants;
import com.vikadata.api.constants.MailPropConstants;
import com.vikadata.api.context.ClockManager;
import com.vikadata.api.enums.exception.BillingException;
import com.vikadata.api.enums.exception.SubscribeFunctionException;
import com.vikadata.api.enums.finance.BundleState;
import com.vikadata.api.enums.finance.CapacityType;
import com.vikadata.api.enums.finance.SubscriptionPhase;
import com.vikadata.api.enums.finance.SubscriptionState;
import com.vikadata.api.enums.social.SocialPlatformType;
import com.vikadata.api.enums.space.SpaceCertification;
import com.vikadata.api.factory.NotifyMailFactory;
import com.vikadata.api.factory.NotifyMailFactory.MailWithLang;
import com.vikadata.api.lang.SpaceGlobalFeature;
import com.vikadata.api.modular.finance.core.Bundle;
import com.vikadata.api.modular.finance.core.Subscription;
import com.vikadata.api.modular.finance.mapper.SubscriptionMapper;
import com.vikadata.api.modular.finance.service.IBundleService;
import com.vikadata.api.modular.finance.service.ISpaceSubscriptionService;
import com.vikadata.api.modular.finance.service.ISubscriptionService;
import com.vikadata.api.modular.internal.model.InternalSpaceSubscriptionVo;
import com.vikadata.api.modular.organization.mapper.MemberMapper;
import com.vikadata.api.modular.social.enums.SocialAppType;
import com.vikadata.api.modular.social.service.ISocialTenantBindService;
import com.vikadata.api.modular.social.service.ISocialTenantService;
import com.vikadata.api.modular.space.mapper.SpaceAssetMapper;
import com.vikadata.api.modular.space.mapper.SpaceMapper;
import com.vikadata.api.modular.space.model.InviteUserInfo;
import com.vikadata.api.modular.space.model.SpaceSubscriptionDto;
import com.vikadata.api.modular.space.model.vo.SpaceCapacityPageVO;
import com.vikadata.api.modular.space.model.vo.SpaceSubscribeVo;
import com.vikadata.api.modular.space.service.ISpaceService;
import com.vikadata.api.modular.statics.model.NodeStaticsVO;
import com.vikadata.api.modular.statics.service.IStaticsService;
import com.vikadata.api.modular.user.mapper.UserMapper;
import com.vikadata.api.modular.user.model.UserLangDTO;
import com.vikadata.api.modular.user.service.IUserService;
import com.vikadata.api.util.billing.BillingConfigManager;
import com.vikadata.api.util.billing.model.BillingPlanFeature;
import com.vikadata.api.util.billing.model.ProductCategory;
import com.vikadata.api.util.billing.model.ProductChannel;
import com.vikadata.api.util.billing.model.SubscribePlanInfo;
import com.vikadata.core.exception.BusinessException;
import com.vikadata.core.util.ExceptionUtil;
import com.vikadata.core.util.SqlTool;
import com.vikadata.entity.BundleEntity;
import com.vikadata.entity.SubscriptionEntity;
import com.vikadata.system.config.BillingWhiteListConfig;
import com.vikadata.system.config.BillingWhiteListConfigManager;
import com.vikadata.system.config.FeatureSetting;
import com.vikadata.system.config.billing.Feature;
import com.vikadata.system.config.billing.Plan;
import com.vikadata.system.config.billing.Product;

import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.data.redis.core.BoundValueOperations;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import static com.vikadata.api.enums.exception.SubscribeFunctionException.NODE_LIMIT;
import static com.vikadata.api.util.billing.BillingConfigManager.buildPlanFeature;
import static com.vikadata.api.util.billing.BillingConfigManager.getBillingConfig;
import static com.vikadata.api.util.billing.BillingConfigManager.getFreePlan;
import static com.vikadata.api.util.billing.BillingUtil.channelDefaultSubscription;
import static com.vikadata.api.util.billing.BillingUtil.legacyPlanId;
import static com.vikadata.api.util.billing.model.BillingConstants.CATALOG_VERSION;
import static com.vikadata.define.constants.RedisConstants.GENERAL_LOCKED;

/**
 * <p>
 * 空间站订阅 服务接口实现
 * </p>
 *
 * @author Shawn Deng
 */
@Service
@Slf4j
public class SpaceSubscriptionServiceImpl implements ISpaceSubscriptionService {

    @Resource
    private RedisTemplate<String, Object> redisTemplate;

    @Resource
    private SpaceCapacityCacheService spaceCapacityCacheService;

    @Resource
    private SpaceAssetMapper spaceAssetMapper;

    @Resource
    private SpaceMapper spaceMapper;

    @Resource
    private MemberMapper memberMapper;

    @Resource
    private IStaticsService iStaticsService;

    @Resource
    private ISocialTenantService iSocialTenantService;

    @Resource
    private ISocialTenantBindService iSocialTenantBindService;

    @Resource
    private ISpaceService iSpaceService;

    @Resource
    private IUserService userService;

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
        log.info("获取空间的订阅计划");
        if (BooleanUtil.isTrue(selfHostProperties.getEnabled())) {
            // 专有云版本开启，所有空间都是旗舰版
            SubscribePlanInfo planInfo = Optional.ofNullable(channelDefaultSubscription(ProductChannel.PRIVATE))
                    .orElse(channelDefaultSubscription(ProductChannel.VIKA));
            if (StrUtil.isBlank(selfHostProperties.getExpiredAt())) {
                return planInfo;
            }
            LocalDate expiredAt = LocalDate.parse(selfHostProperties.getExpiredAt());
            planInfo.setDeadline(expiredAt);
            return planInfo;
        }
        Bundle bundle = filterBundle(iBundleService.getBundlesBySpaceId(spaceId));
        if (bundle == null) {
            // 返回默认的免费订阅方案
            return defaultPlanInfo(spaceId);
        }
        // 基础订阅
        Subscription baseSubscription = bundle.getBaseSubscription();
        LocalDate baseExpireDate = baseSubscription.getExpireDate().toLocalDate();
        boolean isBaseEntitlementExpire = bundle.isBaseForFree() || ClockManager.me().getLocalDateNow().compareTo(baseExpireDate) > 0;
        // 增值计划暂不支持第三方集成空间
        Plan basePlan = isBaseEntitlementExpire ? getFreePlan(billingProperties.getChannel()) : getBillingConfig().getPlans().get(legacyPlanId(baseSubscription.getPlanId()));
        Product baseProduct = getBillingConfig().getProducts().get(basePlan.getProduct());
        LocalDate deadline = isBaseEntitlementExpire ? null : baseExpireDate;
        // 附加订阅
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

    private Bundle filterBundle(List<Bundle> bundles) {
        return bundles.stream().filter(bundle -> {
                    if (bundle.getState() != BundleState.ACTIVATED) {
                        return false;
                    }
                    LocalDate today = ClockManager.me().getLocalDateNow();
                    Subscription base = bundle.getBaseSubscription();
                    boolean found = today.compareTo(base.getStartDate().toLocalDate()) >= 0
                            && today.compareTo(base.getExpireDate().toLocalDate()) <= 0;
                    if (!found) {
                        // 基础订阅过期，但附加订阅未过期，继续查找
                        found = bundle.getAddOnSubscription().stream().anyMatch(subscription ->
                                today.compareTo(subscription.getStartDate().toLocalDate()) >= 0
                                        && today.compareTo(subscription.getExpireDate().toLocalDate()) <= 0);
                    }
                    return found;
                })
                .findFirst().orElse(null);
    }

    private SubscribePlanInfo defaultPlanInfo(String spaceId) {
        // 如果如果绑定了第三方，isv返回对应的基础版本
        // 没有权益，返回默认配置
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
        // todo 临时方案，新的订阅中删除
        if (SpaceCertification.BASIC.getLevel().equals(spaceGlobalFeature.getCertification())) {
            result.setMaxCapacitySizeInBytes(constProperties.getSpaceBasicCertificationCapacity() * 1024 * 1024 * 1024L + result.getMaxCapacitySizeInBytes());
        }
        if (SpaceCertification.SENIOR.getLevel().equals(spaceGlobalFeature.getCertification())) {
            result.setMaxCapacitySizeInBytes(constProperties.getSpaceSeniorCertificationCapacity() * 1024 * 1024 * 1024L + result.getMaxCapacitySizeInBytes());
        }
        // 赠送的附件容量
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
    public void checkCapacity(String spaceId, long fileSize, String checksum) {
        log.info("检查空间附件容量");
        long maxCapacity = getPlanMaxCapacity(spaceId);
        if (maxCapacity == -1) {
            log.info("白名单，无限容量");
            return;
        }
        long currentCapacity = spaceCapacityCacheService.getSpaceCapacity(spaceId);
        ExceptionUtil.isTrue(currentCapacity < maxCapacity, SubscribeFunctionException.CAPACITY_LIMIT);
        if (currentCapacity + fileSize >= maxCapacity) {
            // 判断附件是否存在空间中，已存在的附件不计入容量，故只有未上传过的附件会触发通知
            boolean exist = SqlTool.retCount(spaceAssetMapper.countBySpaceIdAndAssetChecksum(spaceId, checksum)) > 0;
            if (exist) {
                return;
            }
            // 触发通知后，避免并发请求造成多次通知
            String lockKey = StrUtil.format(GENERAL_LOCKED, "notify:capacity", spaceId);
            BoundValueOperations<String, Object> ops = redisTemplate.boundValueOps(lockKey);
            Boolean result = ops.setIfAbsent(fileSize, 10, TimeUnit.SECONDS);
            if (BooleanUtil.isFalse(result)) {
                // 第一次超限发送通知，其余并发请求限制上传
                throw new BusinessException(SubscribeFunctionException.CAPACITY_LIMIT);
            }
            TaskManager.me().execute(() -> NotificationManager.me().playerNotify(NotificationTemplateId.CAPACITY_LIMIT, null, 0L, spaceId, null));
            String spaceName = spaceMapper.selectSpaceNameBySpaceId(spaceId);
            String capacity = FileUtil.readableFileSize(currentCapacity + fileSize);
            List<String> allEmails = memberMapper.selectActiveEmailBySpaceId(spaceId);
            if (allEmails.isEmpty()) {
                return;
            }
            Dict dict = Dict.create();
            dict.set("SPACE_NAME", spaceName);
            dict.set("CAPACITY_VALUE", capacity);
            dict.set("MAX_CAPACITY", FileUtil.readableFileSize(maxCapacity));
            dict.set("YEARS", LocalDate.now().getYear());
            final String defaultLang = LocaleContextHolder.getLocale().toLanguageTag();
            List<UserLangDTO> emailsWithLang = userService.getLangByEmails(defaultLang, allEmails);
            final List<MailWithLang> tos = emailsWithLang.stream()
                    .map(emailWithLang -> new MailWithLang(emailWithLang.getLocale(), emailWithLang.getEmail()))
                    .collect(Collectors.toList());
            TaskManager.me().execute(() -> NotifyMailFactory.me().sendMail(MailPropConstants.SUBJECT_CAPACITY_FULL, dict, tos));
        }
    }

    @Override
    public long getPlanMaxSheetNums(String spaceId) {
        BillingPlanFeature planFeature = getPlanFeature(spaceId);
        long value = planFeature.getMaxSheetNums();
        ExceptionUtil.isFalse(value == 0L, BillingException.ACCOUNT_BUNDLE_ERROR);
        return value;
    }

    @Override
    public void checkSheetNums(String spaceId, int createSum) {
        long maxSheetNumber = getPlanMaxSheetNums(spaceId);
        if (maxSheetNumber == -1) {
            log.info("白名单，无限成员数量");
            return;
        }
        NodeStaticsVO nodeStaticsVO = iStaticsService.getNodeStaticsBySpaceId(spaceId);
        long currentNodeCount = nodeStaticsVO.getFileCount();
        if (currentNodeCount + createSum > maxSheetNumber) {
            TaskManager.me().execute(() -> NotificationManager.me().playerNotify(NotificationTemplateId.DATASHEET_LIMITED, null, 0L, spaceId, null));
        }
        ExceptionUtil.isTrue(currentNodeCount + createSum <= maxSheetNumber, NODE_LIMIT);
    }

    @Override
    public long getPlanSeats(String spaceId) {
        BillingPlanFeature planFeature = getPlanFeature(spaceId);
        long value = planFeature.getMaxSeats();
        ExceptionUtil.isFalse(value == 0L, BillingException.ACCOUNT_BUNDLE_ERROR);
        return value;
    }

    @Override
    public void checkSeat(String spaceId) {
        log.info("检查成员数量上限");
        long maxSeatNumber = getPlanSeats(spaceId);
        if (maxSeatNumber == -1) {
            log.info("白名单，无限成员数量");
            return;
        }
        long currentSeatNumber = iStaticsService.getMemberTotalCountBySpaceId(spaceId);
        ExceptionUtil.isTrue(currentSeatNumber < maxSeatNumber, SubscribeFunctionException.MEMBER_LIMIT);
    }

    @Override
    public long getPlanMaxSubAdmins(String spaceId) {
        BillingPlanFeature planFeature = getPlanFeature(spaceId);
        long value = planFeature.getMaxAdminNums();
        ExceptionUtil.isFalse(value == 0L, BillingException.ACCOUNT_BUNDLE_ERROR);
        return value;
    }

    @Override
    public void checkSubAdmins(String spaceId) {
        log.info("检查管理员数量上限");
        long maxSubAdminNumber = getPlanMaxSubAdmins(spaceId);
        if (maxSubAdminNumber == -1) {
            log.info("白名单，无限成员数量");
            return;
        }
        long currentNumber = iStaticsService.getAdminTotalCountBySpaceId(spaceId);
        ExceptionUtil.isTrue(currentNumber < maxSubAdminNumber, SubscribeFunctionException.ADMIN_LIMIT);
    }

    @Override
    public long getPlanMaxRows(String spaceId) {
        BillingPlanFeature planFeature = getPlanFeature(spaceId);
        long value = planFeature.getMaxRowsInSpace();
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
            // 结束时间在当前时间之后，标记为过期
            if (bundle.getEndDate().isBefore(nowTime)) {
                BundleEntity updatedBundle =
                        BundleEntity.builder().state(BundleState.EXPIRED.name()).updatedBy(bundle.getUpdatedBy()).build();
                iBundleService.updateByBundleId(bundle.getBundleId(), updatedBundle);
            }
            // 查询订阅
            List<SubscriptionEntity> subscriptions =
                    iSubscriptionService.getByBundleIdAndState(bundle.getBundleId(), SubscriptionState.ACTIVATED);
            subscriptions.forEach(subscription -> {
                // 处理过期的订阅
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
            // 追加增值计划
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
        log.info("获取空间赠送的未过期附件容量");
        // 赠送附件容量planId
        String planId = "capacity_300_MB";
        // 获取赠送附件容量的附加订阅计划数量
        Integer planCount = subscriptionMapper.selectUnExpireGiftCapacityBySpaceId(spaceId, planId, SubscriptionState.ACTIVATED);
        // 获取方案套餐特性
        Plan plan = BillingConfigManager.getBillingConfig().getPlans().get(planId);
        Feature feature = BillingConfigManager.getBillingConfig().getFeatures().get(plan.getFeatures().stream().filter(e -> e.contains("capacity")).findFirst().get());
        // 返回赠送的未过期附件容量大小
        return planCount * 1024L * 1024 * feature.getSpecification();
    }

    @Override
    public IPage<SpaceCapacityPageVO> getSpaceCapacityDetail(String spaceId, Boolean isExpire, Page page) {
        log.info("查询附件容量明细信息");
        // 查询已过期的附件容量
        if (isExpire) {
            // 查询已过期附件容量订单信息
            IPage<SpaceSubscriptionDto> expireList = subscriptionMapper.selectExpireCapacityBySpaceId(spaceId, page);
            // 返回处理后的视图信息
            return this.handleCapacitySubscription(expireList, page);
        }
        // 查询未过期附件容量订单信息
        IPage<SpaceSubscriptionDto> unExpirePage = subscriptionMapper.selectUnExpireCapacityBySpaceId(spaceId, page, SubscriptionState.ACTIVATED);
        IPage<SpaceCapacityPageVO> spaceCapacityPageVOIPage = this.handleCapacitySubscription(unExpirePage, page);
        // 处理官方赠送的附件容量记录，空间基础、高级认证分别获赠5GB、10GB附件容量
        if(this.checkOfficialGiftCapacity(spaceId) != null){
            spaceCapacityPageVOIPage.getRecords().add(this.checkOfficialGiftCapacity(spaceId));
            spaceCapacityPageVOIPage.setTotal(spaceCapacityPageVOIPage.getTotal() + 1);
        }
        // 处理免费订阅计划空间站的附件容量记录,铜级空间站默认1GB附件容量
        Integer number = subscriptionMapper.selectUnExpireBaseProductBySpaceId(spaceId, SubscriptionState.ACTIVATED, ProductCategory.BASE);
        if ( number == 0) {
            SpaceCapacityPageVO freeCapacity = new SpaceCapacityPageVO();
            freeCapacity.setQuota("1GB");
            freeCapacity.setQuotaSource(CapacityType.SUBSCRIPTION_PACKAGE_CAPACITY.getName());
            freeCapacity.setExpireDate("-1");
            spaceCapacityPageVOIPage.getRecords().add(freeCapacity);
            spaceCapacityPageVOIPage.setTotal(spaceCapacityPageVOIPage.getTotal() + 1);
        }
        // 返回处理后的视图信息
        return spaceCapacityPageVOIPage;
    }

    @Override
    public IPage<SpaceCapacityPageVO> handleCapacitySubscription(IPage<SpaceSubscriptionDto> spaceSubscriptionDtoIPage, Page page) {
        log.info("处理附件容量订单信息");
        String giftSubscriptionPlanId = "capacity_300_MB";
        // 构建附件容量明细对象集合
        List<SpaceCapacityPageVO> spaceCapacityPageVos = new ArrayList<>();
        for (SpaceSubscriptionDto spaceSubscriptionDto : spaceSubscriptionDtoIPage.getRecords()) {
            if(giftSubscriptionPlanId.equals(spaceSubscriptionDto.getPlanId()) && StrUtil.isEmpty(spaceSubscriptionDto.getMetadata())){
                continue;
            }
            // 对planId进行处理，去除_monthly、_biannual、_annual、_v1
            List<String> removeStrings= CollUtil.newArrayList("_monthly", "_biannual", "_annual", "_v1");
            String planId = spaceSubscriptionDto.getPlanId();
            for (String removeString : removeStrings){
                if (planId.contains(removeString)){
                    planId = StrUtil.removeAll(planId, removeString);
                }
            }
            // 获取方案套餐特性
            String finalPlanId = planId;
            Plan plan = BillingConfigManager.getBillingConfig().getPlans().values().stream().filter(e -> e.getId().contains(finalPlanId)).findFirst().get();
            Feature feature = BillingConfigManager.getBillingConfig().getFeatures().get(plan.getFeatures().stream().filter(e -> e.contains("capacity")).findFirst().get());
            // 构建附件容量明细记录
            SpaceCapacityPageVO spaceCapacityPageVO = new SpaceCapacityPageVO();
            // 附件容量额度
            if (feature.getSpecification() == -1) {
                spaceCapacityPageVO.setQuota("-1");
            } else if (Objects.equals(feature.getSpecification(), getBillingConfig().getFeatures().get("storage_capacity_300_mb").getSpecification())) {
                spaceCapacityPageVO.setQuota(StrUtil.format("{}MB", feature.getSpecification()));
            } else {
                spaceCapacityPageVO.setQuota(StrUtil.format("{}GB", feature.getSpecification()));
            }
            // 附件容量额度来源
            if(StrUtil.isNotEmpty(spaceSubscriptionDto.getMetadata())){
                // 解析metadata信息,包含新用户ID、新用户名称、附件容量类型
                JSONObject metadata = JSONUtil.parseObj(spaceSubscriptionDto.getMetadata());
                String capacityType = metadata.getStr("capacityType");
                // 判断附件容量是否是邀请新用户加入空间站所获得的奖励
                if(CapacityType.PARTICIPATION_CAPACITY.getName().equals(capacityType)){
                    // 通过用户Id获取邀请用户信息，包括用户Id、用户头像
                    Long userId = Long.valueOf(metadata.getStr("userId"));
                    InviteUserInfo inviteUserInfo = userMapper.selectInviteUserInfoByUserId(userId);
                    spaceCapacityPageVO.setQuotaSource(CapacityType.PARTICIPATION_CAPACITY.getName());
                    // 参与邀请用户赠送附件容量活动，额外返回邀请成员信息
                    spaceCapacityPageVO.setInviteUserInfo(inviteUserInfo);
                }
            }
            // 订阅套餐附件容量额度来源
            if (ProductCategory.BASE.name().equals(spaceSubscriptionDto.getProductCategory())) {
                spaceCapacityPageVO.setQuotaSource(CapacityType.SUBSCRIPTION_PACKAGE_CAPACITY.getName());
            }
            // 商务下单附件容量额度来源
            if(ProductCategory.ADD_ON.name().equals(spaceSubscriptionDto.getProductCategory()) && StrUtil.isEmpty(spaceSubscriptionDto.getMetadata())){
                spaceCapacityPageVO.setQuotaSource(CapacityType.PURCHASE_CAPACITY.getName());
            }
            // 附件容量过期时间
            spaceCapacityPageVO.setExpireDate(spaceSubscriptionDto.getExpireTime().format(DateTimeFormatter.ofPattern(DateFormatConstants.TIME_SIMPLE_PATTERN)));
            spaceCapacityPageVos.add(spaceCapacityPageVO);
        }
        // 构建分页返回对象
        IPage<SpaceCapacityPageVO> spaceCapacityPageVOIPage = new Page<>();
        spaceCapacityPageVOIPage.setRecords(spaceCapacityPageVos);
        spaceCapacityPageVOIPage.setCurrent(page.getCurrent());
        spaceCapacityPageVOIPage.setSize(page.getSize());
        spaceCapacityPageVOIPage.setTotal(page.getTotal());
        return spaceCapacityPageVOIPage;
    }

    @Override
    public SpaceCapacityPageVO checkOfficialGiftCapacity(String spaceId) {
        log.info("检验空间站是否认证获得官方附件容量奖励");
        SpaceGlobalFeature spaceGlobalFeature = iSpaceService.getSpaceGlobalFeature(spaceId);
        if(spaceGlobalFeature.getCertification() != null){
            // 构建官方赠送附件容量信息
            SpaceCapacityPageVO officialGiftCapacity = new SpaceCapacityPageVO();
            // 基础认证5GB容量
            if (SpaceCertification.BASIC.getLevel().equals(spaceGlobalFeature.getCertification())) {
                officialGiftCapacity.setQuota(StrUtil.format("{}GB", constProperties.getSpaceBasicCertificationCapacity()));
                officialGiftCapacity.setQuotaSource(CapacityType.OFFICIAL_GIFT_CAPACITY.getName());
                officialGiftCapacity.setExpireDate("-1");
            }
            // 高级认证10GB容量
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
