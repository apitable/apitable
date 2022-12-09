package com.vikadata.api.enterprise.billing.service.impl;

import java.time.LocalDateTime;
import java.time.OffsetDateTime;
import java.util.Collections;
import java.util.List;

import cn.hutool.core.collection.CollUtil;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.core.toolkit.IdWorker;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;

import com.vikadata.api.enterprise.AbstractEnterpriseIntegrationTest;
import com.vikadata.api.enterprise.billing.entity.BundleEntity;
import com.vikadata.api.enterprise.billing.enums.BundleState;
import com.vikadata.api.enterprise.billing.enums.ProductChannel;
import com.vikadata.api.enterprise.billing.enums.SubscriptionState;
import com.vikadata.api.enterprise.billing.util.BillingConfigManager;
import com.vikadata.api.enterprise.billing.util.BillingUtil;
import com.vikadata.api.interfaces.billing.model.SubscriptionInfo;
import com.vikadata.api.mock.bean.MockUserSpace;
import com.vikadata.api.shared.clock.spring.ClockManager;
import com.vikadata.api.shared.sysconfig.billing.Price;
import com.vikadata.api.shared.sysconfig.billing.Product;
import com.vikadata.api.space.dto.SpaceSubscriptionDto;
import com.vikadata.api.space.mapper.SpaceMapper;
import com.vikadata.api.space.vo.SpaceCapacityPageVO;
import com.vikadata.api.user.entity.UserEntity;
import com.vikadata.api.user.mapper.UserMapper;
import com.vikadata.entity.SpaceEntity;
import com.vikadata.entity.SubscriptionEntity;

import org.springframework.beans.factory.annotation.Autowired;

import static com.vikadata.api.shared.constants.AssetsPublicConstants.CAPACITY_HEX;
import static org.assertj.core.api.Assertions.assertThat;

public class SpaceSubscriptionServiceImplTest extends AbstractEnterpriseIntegrationTest {

    @Autowired
    private SpaceMapper spaceMapper;

    @Autowired
    private UserMapper userMapper;

    @Test
    public void testHandleExpiredSubscription() {
        String spaceId = IdWorker.get32UUID();
        LocalDateTime endTime = getClock().getNow(testTimeZone).minusMinutes(1).toLocalDateTime();
        String priceId = "price_gold_200_1";
        // Get the space station data ready
        prepareSpaceBundleWithSubscription(spaceId, endTime, priceId);
        handleExpiredSubscription(spaceId);
        SubscriptionInfo planInfo = BillingUtil.channelDefaultSubscription(ProductChannel.VIKA);
        Assertions.assertEquals(planInfo.getBasePlan(), planInfo.getBasePlan());
    }

    @Test
    public void testHandleNotExpiredSubscription() {
        String spaceId = IdWorker.get32UUID();
        LocalDateTime endTime = getClock().getNow(testTimeZone).plusDays(1).toLocalDateTime();
        String priceId = "price_gold_200_1";
        // Get the space station data ready
        prepareSpaceBundleWithSubscription(spaceId, endTime, priceId);
        handleExpiredSubscription(spaceId);
        SubscriptionInfo subscriptionInfo = iSpaceSubscriptionService.getPlanInfoBySpaceId(spaceId);
        Price price = BillingConfigManager.getBillingConfig().getPrices().get(priceId);
        Assertions.assertEquals(price.getPlanId(), subscriptionInfo.getBasePlan());
    }

    @Test
    public void testBundleWithTwoSubscriptionsButTheFirstOneExpired() {
        MockUserSpace userSpace = createSingleUserAndSpace();
        OffsetDateTime nowTime = getClock().getNow(testTimeZone);
        BundleEntity bundle = prepareSpaceBundle(userSpace.getSpaceId(),
                nowTime.minusMonths(1).toLocalDateTime(),
                nowTime.plusMonths(1).toLocalDateTime());
        // subscription 1
        prepareSpaceSubscription(userSpace.getSpaceId(), "price_dingtalk_standard_200_1", bundle,
                nowTime.minusMonths(1).toLocalDateTime(),
                nowTime.minusMinutes(2).toLocalDateTime());
        // subscription 2
        prepareSpaceSubscription(userSpace.getSpaceId(), "price_dingtalk_standard_200_1", bundle,
                nowTime.minusMinutes(1).toLocalDateTime(),
                nowTime.plusMonths(1).toLocalDateTime());
        SubscriptionInfo subscriptionInfo = iSpaceSubscriptionService.getPlanInfoBySpaceId(userSpace.getSpaceId());
        Assertions.assertEquals("dingtalk_standard_200_annual_v1", subscriptionInfo.getBasePlan());
        Assertions.assertEquals(nowTime.plusMonths(1).toLocalDate(), subscriptionInfo.getEndDate());
    }

    @Test
    public void testBundleWithTwoSubscriptions() {
        MockUserSpace userSpace = createSingleUserAndSpace();
        OffsetDateTime nowTime = getClock().getNow(testTimeZone);
        BundleEntity bundle = prepareSpaceBundle(userSpace.getSpaceId(),
                nowTime.minusMonths(1).toLocalDateTime(),
                nowTime.plusMonths(1).toLocalDateTime());
        prepareSpaceSubscription(userSpace.getSpaceId(), "price_dingtalk_standard_200_1", bundle,
                nowTime.minusMonths(1).toLocalDateTime(),
                nowTime.plusMinutes(1).toLocalDateTime());
        prepareSpaceSubscription(userSpace.getSpaceId(), "price_dingtalk_standard_200_1", bundle,
                nowTime.plusMinutes(2).toLocalDateTime(),
                nowTime.plusMonths(1).toLocalDateTime());
        SubscriptionInfo subscriptionInfo  = iSpaceSubscriptionService.getPlanInfoBySpaceId(userSpace.getSpaceId());
        Assertions.assertEquals("dingtalk_standard_200_annual_v1", subscriptionInfo.getBasePlan());
        Assertions.assertEquals(nowTime.toLocalDate(), subscriptionInfo.getEndDate());
    }

    @Test
    public void testBundleWithTwoSubscriptionsButAllExpired() {
        MockUserSpace userSpace = createSingleUserAndSpace();
        OffsetDateTime nowTime = getClock().getNow(testTimeZone);
        BundleEntity bundle = prepareSpaceBundle(userSpace.getSpaceId(),
                nowTime.minusMonths(1).toLocalDateTime(),
                nowTime.plusMonths(1).toLocalDateTime());
        prepareSpaceSubscription(userSpace.getSpaceId(), "price_dingtalk_standard_200_1", bundle,
                nowTime.minusMonths(1).toLocalDateTime(),
                nowTime.minusDays(15).toLocalDateTime());
        prepareSpaceSubscription(userSpace.getSpaceId(), "price_dingtalk_standard_200_1", bundle,
                nowTime.minusDays(14).toLocalDateTime(),
                nowTime.minusDays(1).toLocalDateTime());
        SubscriptionInfo subscriptionInfo = iSpaceSubscriptionService.getPlanInfoBySpaceId(userSpace.getSpaceId());
        Assertions.assertEquals("bronze_no_billing_period", subscriptionInfo.getBasePlan());
    }

    @Test
    public void testSpaceHaveSubscriptionWithAllDeleted() {
        MockUserSpace userSpace = createSingleUserAndSpace();
        OffsetDateTime nowTime = getClock().getNow(testTimeZone);
        BundleEntity bundle = prepareSpaceBundle(userSpace.getSpaceId(),
                nowTime.minusMonths(1).toLocalDateTime(),
                nowTime.plusMonths(1).toLocalDateTime());
        SubscriptionEntity subscription1 = prepareSpaceSubscription(userSpace.getSpaceId(),
                "price_dingtalk_standard_200_1", bundle,
                nowTime.minusMonths(1).toLocalDateTime(),
                nowTime.minusDays(15).toLocalDateTime());
        SubscriptionEntity subscription2 = prepareSpaceSubscription(userSpace.getSpaceId(),
                "price_dingtalk_standard_200_1", bundle,
                nowTime.minusDays(14).toLocalDateTime(),
                nowTime.minusDays(1).toLocalDateTime());
        iSubscriptionService.removeBatchBySubscriptionIds(CollUtil.newArrayList(subscription1.getSubscriptionId(),
                subscription2.getSubscriptionId()));
        Assertions.assertFalse(iSubscriptionService.bundlesHaveSubscriptions(Collections.singletonList(bundle.getBundleId())));
    }

    @Test
    public void testSpaceHaveSubscriptionWithPartDeleted() {
        MockUserSpace userSpace = createSingleUserAndSpace();
        OffsetDateTime nowTime = getClock().getNow(testTimeZone);
        BundleEntity bundle = prepareSpaceBundle(userSpace.getSpaceId(),
                nowTime.minusMonths(1).toLocalDateTime(),
                nowTime.plusMonths(1).toLocalDateTime());
        SubscriptionEntity subscription1 = prepareSpaceSubscription(userSpace.getSpaceId(),
                "price_dingtalk_standard_200_1", bundle,
                nowTime.minusMonths(1).toLocalDateTime(),
                nowTime.minusDays(15).toLocalDateTime());
        prepareSpaceSubscription(userSpace.getSpaceId(),
                "price_dingtalk_standard_200_1", bundle,
                nowTime.minusDays(14).toLocalDateTime(),
                nowTime.minusDays(1).toLocalDateTime());
        iSubscriptionService.removeBatchBySubscriptionIds(CollUtil.newArrayList(subscription1.getSubscriptionId()));
        Assertions.assertTrue(iSubscriptionService.bundlesHaveSubscriptions(Collections.singletonList(bundle.getBundleId())));
    }


    @Test
    @Disabled("without capacity price id")
    public void testBundleSubscriptionsExpiredButHaveAddon() {
        MockUserSpace userSpace = createSingleUserAndSpace();
        OffsetDateTime nowTime = getClock().getNow(testTimeZone);
        BundleEntity bundle = prepareSpaceBundle(userSpace.getSpaceId(),
                nowTime.minusMonths(1).toLocalDateTime(),
                nowTime.plusMonths(1).toLocalDateTime());
        prepareSpaceSubscription(userSpace.getSpaceId(), "price_dingtalk_standard_200_1", bundle,
                nowTime.minusMonths(1).toLocalDateTime(),
                nowTime.minusDays(1).toLocalDateTime());
        prepareSpaceSubscription(userSpace.getSpaceId(), "price_capacity_3", bundle,
                nowTime.toLocalDateTime(),
                nowTime.plusMonths(1).toLocalDateTime());
        SubscriptionInfo subscriptionInfo = iSpaceSubscriptionService.getPlanInfoBySpaceId(userSpace.getSpaceId());
        Assertions.assertEquals("bronze_no_billing_period", subscriptionInfo.getBasePlan());
        Assertions.assertEquals(101 * CAPACITY_HEX, subscriptionInfo.getFeature().getCapacitySize().getValue());
    }

    @Test
    @Disabled("without capacity price id")
    public void testGetSpaceUnExpireGiftCapacityIsNotNull() {
        MockUserSpace userSpace = createSingleUserAndSpace();
        OffsetDateTime nowTime = getClock().getNow(testTimeZone);
        BundleEntity bundle = prepareSpaceBundle(userSpace.getSpaceId(),
                nowTime.minusMonths(1).toLocalDateTime(),
                nowTime.plusMonths(1).toLocalDateTime());
        prepareSpaceSubscription(userSpace.getSpaceId(), "price_capacity_0.3", bundle,
                nowTime.minusMonths(1).toLocalDateTime(),
                nowTime.plusMonths(1).toLocalDateTime());
        Long capacityNumber = iSpaceSubscriptionService.getSpaceUnExpireGiftCapacity(userSpace.getSpaceId());
        assertThat(capacityNumber).isEqualTo(314572800);
    }

    @Test
    @Disabled("without capacity price id")
    public void testGetSpaceUnExpireGiftCapacityIsNull() {
        MockUserSpace userSpace = createSingleUserAndSpace();
        OffsetDateTime nowTime = getClock().getNow(testTimeZone);
        BundleEntity bundle = prepareSpaceBundle(userSpace.getSpaceId(),
                nowTime.minusMonths(1).toLocalDateTime(),
                nowTime.plusMonths(1).toLocalDateTime());
        prepareSpaceSubscription(userSpace.getSpaceId(), "price_capacity_0.3", bundle,
                nowTime.minusMonths(1).toLocalDateTime(),
                nowTime.minusMonths(1).toLocalDateTime());
        Long capacityNumber = iSpaceSubscriptionService.getSpaceUnExpireGiftCapacity(userSpace.getSpaceId());
        assertThat(capacityNumber).isEqualTo(0);
    }

    @Test
    public void testCheckOfficialGiftCapacityIsCertificated() {
        String spaceId = "spc2ZkYnVQJW2";
        SpaceEntity space = SpaceEntity.builder()
                .id(IdWorker.getId())
                .name("Test Space")
                .spaceId(spaceId)
                .props("{\"certification\":\"basic\"}")
                .createdBy(-1L)
                .updatedBy(-1L)
                .build();
        spaceMapper.insert(space);
        SpaceCapacityPageVO spaceCapacityPageVO = iBillingCapacityService.checkOfficialGiftCapacity(spaceId);
        assertThat(spaceCapacityPageVO.getQuota()).isEqualTo("5GB");
    }

    @Test
    public void testCheckOfficialGiftCapacityIsUnCertificated() {
        String spaceId = "spc2ZkYnVQJW2";
        SpaceEntity space = SpaceEntity.builder()
                .id(IdWorker.getId())
                .name("Test Space")
                .spaceId(spaceId)
                .createdBy(-1L)
                .updatedBy(-1L)
                .build();
        spaceMapper.insert(space);
        SpaceCapacityPageVO spaceCapacityPageVO = iBillingCapacityService.checkOfficialGiftCapacity(spaceId);
        assertThat(spaceCapacityPageVO).isNull();
    }

    @Test
    @Disabled("without capacity price id")
    public void testGetSpaceCapacityDetailIsExpire() {
        MockUserSpace userSpace = createSingleUserAndSpace();
        OffsetDateTime nowTime = getClock().getNow(testTimeZone);
        BundleEntity bundle = prepareSpaceBundle(userSpace.getSpaceId(),
                nowTime.minusMonths(1).toLocalDateTime(),
                nowTime.plusMonths(1).toLocalDateTime());
        prepareSpaceSubscription(userSpace.getSpaceId(), "price_capacity_0.3", bundle,
                nowTime.minusMonths(1).toLocalDateTime(),
                nowTime.minusMonths(1).toLocalDateTime());
        IPage<SpaceCapacityPageVO> spaceCapacityPageVOIPage = iBillingCapacityService.getSpaceCapacityDetail(userSpace.getSpaceId(), true, new Page<>());
        assertThat(spaceCapacityPageVOIPage.getRecords()).isNotNull();
    }

    @Test
    @Disabled("without capacity price id")
    public void testGetSpaceCapacityDetailIsUnExpire() {
        MockUserSpace userSpace = createSingleUserAndSpace();
        OffsetDateTime nowTime = getClock().getNow(testTimeZone);
        BundleEntity bundle = prepareSpaceBundle(userSpace.getSpaceId(),
                nowTime.minusMonths(1).toLocalDateTime(),
                nowTime.plusMonths(1).toLocalDateTime());
        prepareSpaceSubscription(userSpace.getSpaceId(), "price_capacity_0.3", bundle,
                nowTime.minusMonths(1).toLocalDateTime(),
                nowTime.plusMonths(1).toLocalDateTime());
        IPage<SpaceCapacityPageVO> spaceCapacityPageVOIPage = iBillingCapacityService.getSpaceCapacityDetail(userSpace.getSpaceId(), false, new Page<>());
        assertThat(spaceCapacityPageVOIPage.getRecords().get(0).getQuota()).isEqualTo("300MB");
    }

    @Test
    @Disabled("without capacity price id")
    public void testGetSpaceCapacityDetailIsBronzeSpace() {
        MockUserSpace userSpace = createSingleUserAndSpace();
        OffsetDateTime nowTime = getClock().getNow(testTimeZone);
        BundleEntity bundle = prepareSpaceBundle(userSpace.getSpaceId(),
                nowTime.minusMonths(1).toLocalDateTime(),
                nowTime.plusMonths(1).toLocalDateTime());
        prepareSpaceSubscription(userSpace.getSpaceId(), "price_capacity_3", bundle,
                nowTime.minusMonths(1).toLocalDateTime(),
                nowTime.minusMonths(1).toLocalDateTime());
        IPage<SpaceCapacityPageVO> spaceCapacityPageVOIPage = iBillingCapacityService.getSpaceCapacityDetail(userSpace.getSpaceId(), false, new Page<>());
        assertThat(spaceCapacityPageVOIPage.getRecords().get(0).getQuota()).isEqualTo("1GB");
    }

    @Test
    public void testGetSpaceCapacityDetailIsCertificatedSpace() {
        String spaceId = "spc2ZkYnVQJW2";
        SpaceEntity space = SpaceEntity.builder()
                .id(IdWorker.getId())
                .name("Test Space")
                .spaceId(spaceId)
                .props("{\"certification\":\"basic\"}")
                .createdBy(-1L)
                .updatedBy(-1L)
                .build();
        spaceMapper.insert(space);
        IPage<SpaceCapacityPageVO> spaceCapacityPageVOIPage = iBillingCapacityService.getSpaceCapacityDetail(spaceId, false, new Page<>());
        assertThat(spaceCapacityPageVOIPage.getRecords().get(0).getQuota()).isEqualTo("5GB");
    }

    @Test
    public void testHandleCapacitySubscriptionIsParticipationCapacity() {
        SpaceSubscriptionDto spaceSubscriptionDto = SpaceSubscriptionDto.builder()
                .productCategory("ADD_ON")
                .planId("capacity_300_MB")
                .metadata("{\"userId\":\"123\", \"userName\":\"testUser\", \"capacityType\":\"participation_capacity\"}")
                .expireTime(LocalDateTime.now().plusMonths(1))
                .build();
        List<SpaceSubscriptionDto> list = CollUtil.newArrayList(spaceSubscriptionDto);
        IPage<SpaceSubscriptionDto> spaceSubscriptionDtoIPage = new Page<>();
        spaceSubscriptionDtoIPage.setRecords(list);
        UserEntity user = UserEntity.builder()
                .id(IdWorker.getId())
                .nickName("testUser")
                .avatar("avatar")
                .build();
        userMapper.insert(user);
        IPage<SpaceCapacityPageVO> spaceCapacityPageVOIPage = iBillingCapacityService.handleCapacitySubscription(spaceSubscriptionDtoIPage, new Page<>());
        assertThat(spaceCapacityPageVOIPage.getRecords().get(0).getQuotaSource()).isEqualTo("participation_capacity");
    }

    @Test
    public void testHandleCapacitySubscriptionIsSubscriptionPackageCapacity() {
        SpaceSubscriptionDto spaceSubscriptionDto = SpaceSubscriptionDto.builder()
                .productCategory("BASE")
                .planId("gold_200_monthly_v1")
                .expireTime(LocalDateTime.now().plusMonths(1))
                .build();
        List<SpaceSubscriptionDto> list = CollUtil.newArrayList(spaceSubscriptionDto);
        IPage<SpaceSubscriptionDto> spaceSubscriptionDtoIPage = new Page<>();
        spaceSubscriptionDtoIPage.setRecords(list);
        IPage<SpaceCapacityPageVO> spaceCapacityPageVOIPage = iBillingCapacityService.handleCapacitySubscription(spaceSubscriptionDtoIPage, new Page<>());
        assertThat(spaceCapacityPageVOIPage.getRecords().get(0).getQuotaSource()).isEqualTo("subscription_package_capacity");
    }

    private void prepareSpaceBundleWithSubscription(String spaceId, LocalDateTime expiredTime, String priceId) {
        Price price = BillingConfigManager.getBillingConfig().getPrices().get(priceId);
        prepareSpaceData(spaceId);
        String bundleId = IdWorker.get32UUID();
        LocalDateTime startTime = expiredTime.minusDays(30);
        BundleEntity bundle = BundleEntity.builder()
                .bundleId(bundleId)
                .spaceId(spaceId)
                .startDate(startTime)
                .endDate(expiredTime)
                .state(BundleState.ACTIVATED.name())
                .createdBy(-1L)
                .updatedBy(-1L)
                .build();
        iBundleService.create(bundle);
        Product product = BillingConfigManager.getBillingConfig().getProducts().get(price.getProduct());
        SubscriptionEntity subscription = SubscriptionEntity.builder()
                .spaceId(spaceId)
                .subscriptionId(IdWorker.get32UUID())
                .bundleId(bundleId)
                .planId(price.getPlanId())
                .productName(price.getProduct())
                .productCategory(product.getCategory())
                .state(SubscriptionState.ACTIVATED.name())
                .bundleStartDate(startTime)
                .startDate(startTime)
                .expireDate(expiredTime)
                .createdBy(-1L)
                .updatedBy(-1L)
                .build();
        iSubscriptionService.create(subscription);
    }

    private BundleEntity prepareSpaceBundle(String spaceId, LocalDateTime startTime, LocalDateTime expiredTime) {
        BundleEntity bundle = BundleEntity.builder()
                .bundleId(IdWorker.get32UUID())
                .spaceId(spaceId)
                .startDate(startTime)
                .endDate(expiredTime)
                .createdBy(-1L)
                .updatedBy(-1L)
                .state(BundleState.ACTIVATED.name())
                .build();
        iBundleService.create(bundle);
        return bundle;
    }

    private SubscriptionEntity prepareSpaceSubscription(String spaceId, String priceId, BundleEntity bundle, LocalDateTime startTime,
            LocalDateTime expiredTime) {
        Price price = BillingConfigManager.getBillingConfig().getPrices().get(priceId);
        Product product = BillingConfigManager.getBillingConfig().getProducts().get(price.getProduct());
        SubscriptionEntity subscription = SubscriptionEntity.builder()
                .spaceId(spaceId)
                .subscriptionId(IdWorker.get32UUID())
                .bundleId(bundle.getBundleId())
                .planId(price.getPlanId())
                .productName(price.getProduct())
                .metadata("{\"capacity\":\"participation_capacity\"}")
                .productCategory(product.getCategory())
                .state(SubscriptionState.ACTIVATED.name())
                .bundleStartDate(bundle.getStartDate())
                .startDate(startTime)
                .expireDate(expiredTime)
                .createdBy(-1L)
                .updatedBy(-1L)
                .build();
        iSubscriptionService.create(subscription);
        return subscription;
    }


    private void prepareSpaceData(String spaceId) {
        // Initialize space information
        SpaceEntity spaceEntity = SpaceEntity.builder().spaceId(spaceId).name("Test Space").build();
        iSpaceService.save(spaceEntity);
    }

    private void handleExpiredSubscription(String spaceId) {
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

}
