package com.vikadata.api.modular.finance.service.impl;

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

import com.vikadata.api.AbstractIntegrationTest;
import com.vikadata.api.enums.finance.BundleState;
import com.vikadata.api.enums.finance.SubscriptionState;
import com.vikadata.api.mock.bean.MockUserSpace;
import com.vikadata.api.modular.space.mapper.SpaceMapper;
import com.vikadata.api.modular.space.model.SpaceSubscriptionDto;
import com.vikadata.api.modular.space.model.vo.SpaceCapacityPageVO;
import com.vikadata.api.modular.space.model.vo.SpaceSubscribeVo;
import com.vikadata.api.modular.user.mapper.UserMapper;
import com.vikadata.api.util.billing.BillingConfigManager;
import com.vikadata.api.util.billing.BillingUtil;
import com.vikadata.api.util.billing.model.ProductChannel;
import com.vikadata.api.util.billing.model.SubscribePlanInfo;
import com.vikadata.entity.BundleEntity;
import com.vikadata.entity.SpaceEntity;
import com.vikadata.entity.SubscriptionEntity;
import com.vikadata.entity.UserEntity;
import com.vikadata.system.config.billing.Price;
import com.vikadata.system.config.billing.Product;

import org.springframework.beans.factory.annotation.Autowired;

import static com.vikadata.api.constants.AssetsPublicConstants.CAPACITY_HEX;
import static org.assertj.core.api.Assertions.assertThat;

public class SpaceSubscriptionServiceImplTest extends AbstractIntegrationTest {

    @Autowired
    private SpaceMapper spaceMapper;

    @Autowired
    private UserMapper userMapper;

    @Test
    public void testHandleExpiredSubscription() {
        String spaceId = IdWorker.get32UUID();
        LocalDateTime endTime = getClock().getNow(testTimeZone).minusMinutes(1).toLocalDateTime();
        String priceId = "price_gold_200_1";
        // 准备好空间站数据
        prepareSpaceBundleWithSubscription(spaceId, endTime, priceId);
        iSpaceSubscriptionService.handleExpiredSubscription(spaceId);
        SpaceSubscribeVo vo = iSpaceSubscriptionService.getSpaceSubscription(spaceId);
        SubscribePlanInfo planInfo = BillingUtil.channelDefaultSubscription(ProductChannel.VIKA);
        Assertions.assertEquals(planInfo.getBasePlan().getId(), vo.getPlan());
    }

    @Test
    public void testHandleNotExpiredSubscription() {
        String spaceId = IdWorker.get32UUID();
        LocalDateTime endTime = getClock().getNow(testTimeZone).plusDays(1).toLocalDateTime();
        String priceId = "price_gold_200_1";
        // 准备好空间站数据
        prepareSpaceBundleWithSubscription(spaceId, endTime, priceId);
        iSpaceSubscriptionService.handleExpiredSubscription(spaceId);
        SpaceSubscribeVo vo = iSpaceSubscriptionService.getSpaceSubscription(spaceId);
        Price price = BillingConfigManager.getBillingConfig().getPrices().get(priceId);
        Assertions.assertEquals(price.getPlanId(), vo.getPlan());
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
        SpaceSubscribeVo vo = iSpaceSubscriptionService.getSpaceSubscription(userSpace.getSpaceId());
        Assertions.assertEquals("dingtalk_standard_200_annual_v1", vo.getPlan());
        Assertions.assertEquals(nowTime.plusMonths(1).toLocalDate(), vo.getDeadline());
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
        SpaceSubscribeVo vo = iSpaceSubscriptionService.getSpaceSubscription(userSpace.getSpaceId());
        Assertions.assertEquals("dingtalk_standard_200_annual_v1", vo.getPlan());
        Assertions.assertEquals(nowTime.toLocalDate(), vo.getDeadline());
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
        SpaceSubscribeVo vo = iSpaceSubscriptionService.getSpaceSubscription(userSpace.getSpaceId());
        Assertions.assertEquals("bronze_no_billing_period", vo.getPlan());
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
        SubscriptionEntity subscription2 = prepareSpaceSubscription(userSpace.getSpaceId(),
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
        SpaceSubscribeVo vo = iSpaceSubscriptionService.getSpaceSubscription(userSpace.getSpaceId());
        Assertions.assertEquals("bronze_no_billing_period", vo.getPlan());
        Assertions.assertEquals(101 * CAPACITY_HEX, vo.getMaxCapacitySizeInBytes());
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
                .name("测试空间站")
                .spaceId(spaceId)
                .props("{\"certification\":\"basic\"}")
                .createdBy(-1L)
                .updatedBy(-1L)
                .build();
        spaceMapper.insert(space);
        SpaceCapacityPageVO spaceCapacityPageVO = iSpaceSubscriptionService.checkOfficialGiftCapacity(spaceId);
        assertThat(spaceCapacityPageVO.getQuota()).isEqualTo("5GB");
    }

    @Test
    public void testCheckOfficialGiftCapacityIsUnCertificated() {
        String spaceId = "spc2ZkYnVQJW2";
        SpaceEntity space = SpaceEntity.builder()
                .id(IdWorker.getId())
                .name("测试空间站")
                .spaceId(spaceId)
                .createdBy(-1L)
                .updatedBy(-1L)
                .build();
        spaceMapper.insert(space);
        SpaceCapacityPageVO spaceCapacityPageVO = iSpaceSubscriptionService.checkOfficialGiftCapacity(spaceId);
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
        IPage<SpaceCapacityPageVO> spaceCapacityPageVOIPage = iSpaceSubscriptionService.getSpaceCapacityDetail(userSpace.getSpaceId(), true, new Page<>());
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
        IPage<SpaceCapacityPageVO> spaceCapacityPageVOIPage = iSpaceSubscriptionService.getSpaceCapacityDetail(userSpace.getSpaceId(), false, new Page<>());
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
        IPage<SpaceCapacityPageVO> spaceCapacityPageVOIPage = iSpaceSubscriptionService.getSpaceCapacityDetail(userSpace.getSpaceId(), false, new Page<>());
        assertThat(spaceCapacityPageVOIPage.getRecords().get(0).getQuota()).isEqualTo("1GB");
    }

    @Test
    public void testGetSpaceCapacityDetailIsCertificatedSpace() {
        String spaceId = "spc2ZkYnVQJW2";
        SpaceEntity space = SpaceEntity.builder()
                .id(IdWorker.getId())
                .name("测试空间站")
                .spaceId(spaceId)
                .props("{\"certification\":\"basic\"}")
                .createdBy(-1L)
                .updatedBy(-1L)
                .build();
        spaceMapper.insert(space);
        IPage<SpaceCapacityPageVO> spaceCapacityPageVOIPage = iSpaceSubscriptionService.getSpaceCapacityDetail(spaceId, false, new Page<>());
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
                .avatar("测试头像")
                .build();
        userMapper.insert(user);
        IPage<SpaceCapacityPageVO> spaceCapacityPageVOIPage = iSpaceSubscriptionService.handleCapacitySubscription(spaceSubscriptionDtoIPage, new Page<>());
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
        IPage<SpaceCapacityPageVO> spaceCapacityPageVOIPage = iSpaceSubscriptionService.handleCapacitySubscription(spaceSubscriptionDtoIPage, new Page<>());
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
        // 初始化空间信息
        SpaceEntity spaceEntity = SpaceEntity.builder().spaceId(spaceId).name("测试空间站").build();
        iSpaceService.save(spaceEntity);
    }

}
