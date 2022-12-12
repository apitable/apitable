package com.vikadata.api.enterprise;

import java.time.OffsetDateTime;

import cn.hutool.json.JSONUtil;

import com.vikadata.api.AbstractIntegrationTest;
import com.vikadata.api.enterprise.appstore.enums.AppType;
import com.vikadata.api.enterprise.appstore.service.IAppInstanceService;
import com.vikadata.api.enterprise.billing.core.Bundle;
import com.vikadata.api.enterprise.billing.core.OrderArguments;
import com.vikadata.api.enterprise.billing.core.OrderPrice;
import com.vikadata.api.enterprise.billing.entity.OrderPaymentEntity;
import com.vikadata.api.enterprise.billing.entity.SocialWecomOrderEntity;
import com.vikadata.api.enterprise.billing.enums.OrderChannel;
import com.vikadata.api.enterprise.billing.enums.OrderPhase;
import com.vikadata.api.enterprise.billing.enums.OrderStatus;
import com.vikadata.api.enterprise.billing.enums.OrderType;
import com.vikadata.api.enterprise.billing.enums.PayChannel;
import com.vikadata.api.enterprise.billing.model.OrderPaymentVo;
import com.vikadata.api.enterprise.billing.model.PingChargeSuccess;
import com.vikadata.api.enterprise.billing.service.IBillingCapacityService;
import com.vikadata.api.enterprise.billing.service.IBillingOfflineService;
import com.vikadata.api.enterprise.billing.service.IBundleService;
import com.vikadata.api.enterprise.billing.service.IOrderPaymentService;
import com.vikadata.api.enterprise.billing.service.IOrderV2Service;
import com.vikadata.api.enterprise.billing.service.IShopService;
import com.vikadata.api.enterprise.billing.service.ISpaceSubscriptionService;
import com.vikadata.api.enterprise.billing.service.ISubscriptionService;
import com.vikadata.api.enterprise.billing.util.EntitlementChecker;
import com.vikadata.api.enterprise.billing.util.OrderChecker;
import com.vikadata.api.enterprise.billing.util.OrderChecker.ExpectedOrderCheck;
import com.vikadata.api.enterprise.billing.util.OrderUtil;
import com.vikadata.api.enterprise.billing.util.model.BillingPlanPrice;
import com.vikadata.api.enterprise.gm.service.IGmService;
import com.vikadata.api.enterprise.integral.service.IIntegralService;
import com.vikadata.api.enterprise.social.entity.SocialTenantEntity;
import com.vikadata.api.enterprise.social.enums.SocialAppType;
import com.vikadata.api.enterprise.social.enums.SocialPlatformType;
import com.vikadata.api.enterprise.social.enums.SocialTenantAuthMode;
import com.vikadata.api.enterprise.social.service.ISocialCpIsvService;
import com.vikadata.api.enterprise.social.service.ISocialTenantBindService;
import com.vikadata.api.enterprise.social.service.ISocialTenantService;
import com.vikadata.api.enterprise.vcode.service.IVCodeService;
import com.vikadata.api.enterprise.widget.service.IWidgetPackageService;
import com.vikadata.api.enterprise.widget.service.IWidgetUploadService;
import com.vikadata.api.shared.clock.spring.ClockManager;
import com.vikadata.api.shared.sysconfig.billing.Price;
import com.vikadata.api.shared.util.IdUtil;
import com.vikadata.api.workspace.dto.CreateNodeDto;
import com.vikadata.api.workspace.enums.NodeType;
import com.vikadata.entity.EconomicOrderEntity;
import com.vikadata.entity.EconomicOrderMetadataEntity;
import com.vikadata.entity.SpaceEntity;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Import;

import static com.vikadata.api.enterprise.billing.util.OrderUtil.yuanToCents;
import static java.time.temporal.ChronoUnit.SECONDS;

@Import(TestContextConfiguration.class)
public class AbstractEnterpriseIntegrationTest extends AbstractIntegrationTest {

    @Autowired
    protected IVCodeService ivCodeService;

    @Autowired
    protected IIntegralService iIntegralService;

    @Autowired
    protected ISocialTenantBindService iSocialTenantBindService;

    @Autowired
    protected IShopService isShopService;

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
    protected IBillingCapacityService iBillingCapacityService;

    @Autowired
    protected ISpaceSubscriptionService iSpaceSubscriptionService;

    @Autowired
    protected ISocialTenantService iSocialTenantService;

    @Autowired
    protected IAppInstanceService iAppInstanceService;

    @Autowired
    protected ISubscriptionService iSubscriptionService;

    @Autowired
    protected ISocialCpIsvService iSocialCpIsvService;

    @Autowired
    protected IWidgetUploadService iWidgetUploadService;

    @Autowired
    protected IWidgetPackageService iWidgetPackageService;

    @Autowired
    protected EntitlementChecker entitlementChecker;

    @Autowired
    protected OrderChecker orderChecker;

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
        SpaceEntity spaceEntity = iSocialCpIsvService.createWeComIsvSpaceWithoutUser(String.format("%s'Space", authCorpName));
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
}
