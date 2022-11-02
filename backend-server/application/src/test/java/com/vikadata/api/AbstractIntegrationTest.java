package com.vikadata.api;

import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.Collections;
import java.util.List;

import cn.hutool.core.collection.CollUtil;
import cn.hutool.core.util.RandomUtil;
import cn.hutool.json.JSONUtil;
import com.baomidou.mybatisplus.core.toolkit.IdWorker;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;

import com.vikadata.api.component.clock.ClockManager;
import com.vikadata.api.enums.finance.OrderChannel;
import com.vikadata.api.enums.finance.OrderPhase;
import com.vikadata.api.enums.finance.OrderStatus;
import com.vikadata.api.enums.finance.OrderType;
import com.vikadata.api.enums.finance.PayChannel;
import com.vikadata.api.enums.social.SocialPlatformType;
import com.vikadata.api.holder.UserHolder;
import com.vikadata.api.mock.bean.MockInvitation;
import com.vikadata.api.mock.bean.MockUserSpace;
import com.vikadata.api.model.ro.organization.RoleMemberUnitRo;
import com.vikadata.api.modular.appstore.enums.AppType;
import com.vikadata.api.modular.appstore.service.IAppInstanceService;
import com.vikadata.api.modular.base.service.IAuthService;
import com.vikadata.api.modular.client.service.IClientReleaseVersionService;
import com.vikadata.api.modular.developer.service.IGmService;
import com.vikadata.api.modular.finance.core.Bundle;
import com.vikadata.api.modular.finance.core.OrderArguments;
import com.vikadata.api.modular.finance.core.OrderPrice;
import com.vikadata.api.modular.finance.model.OrderPaymentVo;
import com.vikadata.api.modular.finance.model.PingChargeSuccess;
import com.vikadata.api.modular.finance.service.IBillingOfflineService;
import com.vikadata.api.modular.finance.service.IBundleService;
import com.vikadata.api.modular.finance.service.IOrderPaymentService;
import com.vikadata.api.modular.finance.service.IOrderV2Service;
import com.vikadata.api.modular.finance.service.IShopService;
import com.vikadata.api.modular.finance.service.ISpaceSubscriptionService;
import com.vikadata.api.modular.finance.service.ISubscriptionService;
import com.vikadata.api.modular.finance.util.EntitlementChecker;
import com.vikadata.api.modular.finance.util.OrderChecker;
import com.vikadata.api.modular.finance.util.OrderChecker.ExpectedOrderCheck;
import com.vikadata.api.modular.integral.service.IIntegralService;
import com.vikadata.api.modular.internal.service.IFieldService;
import com.vikadata.api.modular.organization.service.IMemberService;
import com.vikadata.api.modular.organization.service.IRoleMemberService;
import com.vikadata.api.modular.organization.service.IRoleService;
import com.vikadata.api.modular.organization.service.ITeamMemberRelService;
import com.vikadata.api.modular.organization.service.ITeamService;
import com.vikadata.api.modular.social.enums.SocialAppType;
import com.vikadata.api.modular.social.enums.SocialTenantAuthMode;
import com.vikadata.api.modular.social.service.ISocialTenantBindService;
import com.vikadata.api.modular.social.service.ISocialTenantService;
import com.vikadata.api.modular.space.service.IInvitationService;
import com.vikadata.api.modular.space.service.ISpaceService;
import com.vikadata.api.modular.user.service.IUserService;
import com.vikadata.api.modular.vcode.service.IVCodeService;
import com.vikadata.api.modular.workspace.model.CreateNodeDto;
import com.vikadata.api.modular.workspace.service.INodeService;
import com.vikadata.api.util.IdUtil;
import com.vikadata.api.util.billing.OrderUtil;
import com.vikadata.api.util.billing.model.BillingPlanPrice;
import com.vikadata.clock.MockClock;
import com.vikadata.api.enums.node.NodeType;
import com.vikadata.entity.EconomicOrderEntity;
import com.vikadata.entity.EconomicOrderMetadataEntity;
import com.vikadata.entity.OrderPaymentEntity;
import com.vikadata.entity.SocialTenantEntity;
import com.vikadata.entity.SocialWecomOrderEntity;
import com.vikadata.entity.SpaceEntity;
import com.vikadata.entity.UserEntity;
import com.vikadata.system.config.billing.Price;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.TestPropertySource;

import static com.vikadata.api.util.billing.OrderUtil.yuanToCents;
import static java.time.temporal.ChronoUnit.SECONDS;


@SpringBootTest(classes = { Application.class })
@AutoConfigureMockMvc
@ExtendWith({ MockitoExtension.class })
@TestPropertySource(value = {
        "classpath:test.properties",
}, properties = { "vikadata.test.test-mode=true" })
@Import(TestContextConfiguration.class)
public abstract class AbstractIntegrationTest extends TestSuiteWithDB {

    /**
     * using east 8 timezone for testing
     */
    protected static final ZoneOffset testTimeZone = ZoneOffset.ofHours(8);

    @Autowired
    protected JdbcTemplate jdbcTemplate;

    @Autowired
    protected RedisTemplate<String, Object> redisTemplate;

    @Autowired
    protected IAuthService iAuthService;

    @Autowired
    protected IUserService iUserService;

    @Autowired
    protected ISpaceService iSpaceService;

    @Autowired
    protected ITeamService iTeamService;

    @Autowired
    protected IMemberService iMemberService;

    @Autowired
    protected ITeamMemberRelService iTeamMemberRelService;

    @Autowired
    protected IVCodeService ivCodeService;

    @Autowired
    protected IIntegralService iIntegralService;

    @Autowired
    protected IClientReleaseVersionService iClientReleaseVersionService;

    @Autowired
    protected ISocialTenantBindService iSocialTenantBindService;

    @Autowired
    protected IShopService isShopService;

    @Autowired
    protected INodeService iNodeService;

    @Autowired
    protected IOrderV2Service iOrderV2Service;

    @Autowired
    protected IOrderPaymentService iOrderPaymentService;

    @Autowired
    protected IGmService iGmService;

    @Autowired
    protected IBillingOfflineService iBillingOfflineService;

    @Autowired
    protected IBundleService iBundleService;

    @Autowired
    protected ISpaceSubscriptionService iSpaceSubscriptionService;

    @Autowired
    protected PasswordEncoder passwordEncoder;

    @Autowired
    protected IFieldService fieldService;

    @Autowired
    protected EntitlementChecker entitlementChecker;

    @Autowired
    protected OrderChecker orderChecker;

    @Autowired
    protected IInvitationService invitationService;

    @Autowired
    protected IRoleService iRoleService;

    @Autowired
    protected IRoleMemberService iRoleMemberService;

    @Autowired
    protected ISocialTenantService iSocialTenantService;

    @Autowired
    protected IAppInstanceService iAppInstanceService;

    @Autowired
    protected ISubscriptionService iSubscriptionService;

    @Value("#{'${exclude}'.split(',')}")
    private List<String> excludeTables;

    @BeforeEach
    public void beforeMethod() {
        // db suite prepare before method
        super.beforeMethod();
        // reset clock
        getClock().resetDeltaFromReality();
    }

    @Override
    protected List<String> configureExcludeTables() {
        return Collections.unmodifiableList(excludeTables);
    }

    @Override
    protected JdbcTemplate configureJdbcTemplate() {
        return this.jdbcTemplate;
    }

    @Override
    protected RedisTemplate<String, Object> configureRedisTemplate() {
        return this.redisTemplate;
    }

    protected MockClock getClock() {
        return ClockManager.me().getMockClock();
    }

    protected UserEntity createUserRandom() {
        return createUserWithEmail(IdWorker.getIdStr() + "@vikadata.com");
    }

    protected UserEntity createUserWithEmail(String email) {
        return iUserService.createUserByCli(email, "123456", RandomUtil.randomNumbers(11));
    }

    protected String createSpaceWithoutName(UserEntity user) {
        return createSpaceWithName(user, "test space");
    }

    protected String createSpaceWithName(UserEntity user, String name) {
        return iSpaceService.createSpace(user, name);
    }

    protected Long createMember(Long userId, String spaceId) {
        Long rootTeamId = iTeamService.getRootTeamId(spaceId);
        return createMember(userId, spaceId, rootTeamId);
    }

    protected Long createMember(Long userId, String spaceId, Long teamId) {
        return iMemberService.createMember(userId, spaceId, teamId);
    }

    protected MockUserSpace createSingleUserAndSpace() {
        UserEntity user = createUserRandom();
        String spaceId = createSpaceWithoutName(user);

        // init context
        initCallContext(user.getId());

        return new MockUserSpace(user.getId(), spaceId);
    }

    protected void initCallContext(Long userId) {
        UserHolder.init();
        UserHolder.set(userId);
    }

    protected void refreshCallContext(Long userId) {
        UserHolder.set(userId);
    }

    protected void autoOrderPayProcessor(Long userId, OrderArguments orderArguments, OffsetDateTime paidTime) {
        String orderId = iOrderV2Service.createOrder(orderArguments);
        // Check Order
        Price price = orderArguments.getPrice();
        Bundle actionBundle = iBundleService.getActivatedBundleBySpaceId(orderArguments.getSpaceId());
        OrderType orderType = iOrderV2Service.parseOrderType(actionBundle, price);
        BillingPlanPrice planPrice = BillingPlanPrice.of(price, ClockManager.me().getLocalDateNow());
        OrderPrice orderPrice = orderType == OrderType.UPGRADE ? iOrderV2Service.repairOrderPrice(actionBundle, price) :
                new OrderPrice(price.getOriginPrice(), planPrice.getDiscount(), planPrice.getDiscount(), planPrice.getActual());
        ExpectedOrderCheck expected = new ExpectedOrderCheck(null, yuanToCents(orderPrice.getPriceOrigin()),
                yuanToCents(orderPrice.getPriceDiscount()), yuanToCents(orderPrice.getPricePaid()),
                OrderStatus.UNPAID, false, null);
        orderChecker.check(orderId, expected);

        // create pay order for this
        OrderPaymentVo orderPaymentVo = iOrderV2Service
                .createOrderPayment(userId, orderId, PayChannel.WX_PUB_QR);

        // trigger pay success event notify without valid pingpp signature
        OrderPaymentEntity orderPayment = iOrderPaymentService.getByPayTransactionId(orderPaymentVo.getPayTransactionNo());
        PingChargeSuccess pingChargeSuccess = new PingChargeSuccess();
        pingChargeSuccess.setId(orderPayment.getPayChannelTransactionId());
        pingChargeSuccess.setOrderNo(orderPaymentVo.getPayTransactionNo());
        pingChargeSuccess.setTimePaid(paidTime.toEpochSecond());
        iOrderPaymentService.retrieveOrderPaidEvent(pingChargeSuccess);

        // check order paid
        expected = new ExpectedOrderCheck(null, yuanToCents(orderPrice.getPriceOrigin()),
                yuanToCents(orderPrice.getPriceDiscount()), yuanToCents(orderPrice.getPricePaid()),
                OrderStatus.FINISHED, true, paidTime.truncatedTo(SECONDS).toLocalDateTime());
        orderChecker.check(orderId, expected);
    }

    protected String createWecomIsvTenant(String suiteId, String authCorpId, boolean isPaid) {
        String authCorpName = "test_corp";
        SocialTenantEntity tenantEntity = SocialTenantEntity.builder()
                .appId(suiteId)
                .appType(SocialAppType.ISV.getType())
                .tenantId(authCorpId)
                .contactAuthScope("{}")
                .authMode(SocialTenantAuthMode.ADMIN.getValue())
                .permanentCode("")
                .authInfo("{}")
                .platform(SocialPlatformType.WECOM.getValue())
                .status(true)
                .build();
        iSocialTenantService.createOrUpdateByTenantAndApp(tenantEntity);
        SpaceEntity spaceEntity = iSpaceService.createWeComIsvSpaceWithoutUser(String.format("%s'Space", authCorpName));
        String spaceId = spaceEntity.getSpaceId();
        iSocialTenantBindService.addTenantBind(tenantEntity.getAppId(), tenantEntity.getTenantId(), spaceId);
        String rootNodeId = iNodeService.createChildNode(-1L, CreateNodeDto.builder()
                .spaceId(spaceId)
                .newNodeId(IdUtil.createNodeId())
                .type(NodeType.ROOT.getNodeType())
                .build());
        iAppInstanceService.createInstanceByAppType(spaceId, AppType.WECOM_STORE.name());
        SocialWecomOrderEntity orderWeComEntity = SocialWecomOrderEntity.builder()
                .orderId("junitTestWecomOrderId")
                .orderStatus(1)
                .orderType(0)
                .paidCorpId(authCorpId)
                .operatorId("junitTestWecomOperatorId")
                .suiteId(suiteId)
                .editionId("junitTestWecomEditionId")
                .price(10000)
                .userCount(10L)
                .orderPeriod(365)
                .orderTime(getClock().getNow(testTimeZone).toLocalDateTime())
                .paidTime(getClock().getNow(testTimeZone).toLocalDateTime())
                .beginTime(getClock().getNow(testTimeZone).toLocalDateTime())
                .endTime(getClock().getNow(testTimeZone).toLocalDateTime().plusDays(365))
                .orderFrom(0)
                .serviceShareAmount(9000)
                .platformShareAmount(1000)
                .dealerShareAmount(0)
                .orderInfo("{}")
                .build();
        EconomicOrderEntity orderEntity = new EconomicOrderEntity();
        orderEntity.setSpaceId(spaceId);
        orderEntity.setOrderNo(OrderUtil.createOrderId());
        orderEntity.setOrderChannel(OrderChannel.WECOM.getName());
        orderEntity.setChannelOrderId(isPaid ? orderWeComEntity.getOrderId() : null);
        orderEntity.setProduct("Wecom_Standard");
        orderEntity.setSeat(10);
        orderEntity.setType(0);
        orderEntity.setMonth(isPaid ? 12 : 0);
        orderEntity.setCurrency("CNY");
        orderEntity.setAmount(isPaid ? orderWeComEntity.getPrice() : 0);
        orderEntity.setActualAmount(isPaid ? orderWeComEntity.getPrice() : 0);
        orderEntity.setStatus(OrderStatus.FINISHED.getName());
        orderEntity.setIsPaid(true);
        orderEntity.setPaidTime(orderWeComEntity.getPaidTime());
        orderEntity.setExpireTime(orderWeComEntity.getEndTime());
        orderEntity.setCreatedTime(orderWeComEntity.getOrderTime());
        if (!isPaid) {
            orderEntity.setOrderPhase(OrderPhase.TRIAL.getName());
        }
        else {
            orderEntity.setOrderPhase(OrderPhase.FIXEDTERM.getName());
        }
        EconomicOrderMetadataEntity orderMetadata = new EconomicOrderMetadataEntity();
        orderMetadata.setOrderNo(orderEntity.getOrderNo());
        orderMetadata.setMetadata(isPaid ? JSONUtil.toJsonStr(orderWeComEntity) : null);
        orderMetadata.setOrderChannel(OrderChannel.WECOM.getName());
        return spaceId;
    }

    protected MockInvitation prepareInvitationToken() {
        UserEntity user = createUserWithEmail(IdWorker.getIdStr() + "@test.com");
        String spaceId = createSpaceWithoutName(user);
        Long userId = user.getId();
        Long memberId = iMemberService.getMemberIdByUserIdAndSpaceId(userId, spaceId);
        String nodeId = iNodeService.createChildNode(userId, CreateNodeDto.builder()
                .spaceId(spaceId)
                .newNodeId(IdUtil.createDstId())
                .type(NodeType.DATASHEET.getNodeType())
                .build());
        String token = invitationService.createMemberInvitationTokenByNodeId(memberId, spaceId, nodeId);
        return MockInvitation.builder()
                .token(token)
                .nodeId(nodeId)
                .userId(userId)
                .spaceId(spaceId)
                .memberId(iMemberService.getMemberIdByUserIdAndSpaceId(userId, spaceId)).build();
    }

    protected Long addRoleMembers(MockUserSpace userSpace) {
        UserEntity user = iUserService.createUserByCli("vikaboy@vikadata.com", "123456789", "12345678910");
        Long rootTeamId = iTeamService.getRootTeamId(userSpace.getSpaceId());
        Long memberId = iMemberService.createMember(user.getId(), userSpace.getSpaceId(), rootTeamId);
        RoleMemberUnitRo rootTeamUnit = new RoleMemberUnitRo();
        RoleMemberUnitRo adminUnit = new RoleMemberUnitRo();
        RoleMemberUnitRo memberUnit = new RoleMemberUnitRo();
        rootTeamUnit.setId(rootTeamId);
        rootTeamUnit.setType(1);
        Long adminMemberId = iMemberService.getMemberIdByUserIdAndSpaceId(userSpace.getUserId(), userSpace.getSpaceId());
        adminUnit.setId(adminMemberId);
        adminUnit.setType(3);
        memberUnit.setId(memberId);
        memberUnit.setType(3);
        Long allPart = iRoleService.createRole(userSpace.getUserId(), userSpace.getSpaceId(), "vika boys");
        iRoleMemberService.addRoleMembers(allPart, CollUtil.newArrayList(rootTeamUnit, adminUnit, memberUnit));
        return allPart;
    }
}
