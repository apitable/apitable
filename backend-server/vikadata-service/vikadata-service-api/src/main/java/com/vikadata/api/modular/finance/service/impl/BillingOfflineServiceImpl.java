package com.vikadata.api.modular.finance.service.impl;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import javax.annotation.Resource;

import cn.hutool.json.JSONObject;
import lombok.extern.slf4j.Slf4j;

import com.vikadata.api.context.ClockManager;
import com.vikadata.api.enums.finance.BundleState;
import com.vikadata.api.enums.finance.CapacityType;
import com.vikadata.api.enums.finance.Currency;
import com.vikadata.api.enums.finance.OrderChannel;
import com.vikadata.api.enums.finance.OrderStatus;
import com.vikadata.api.enums.finance.OrderType;
import com.vikadata.api.enums.finance.SubscriptionState;
import com.vikadata.api.modular.developer.model.CreateBusinessOrderRo;
import com.vikadata.api.modular.developer.model.CreateEntitlementWithAddOn;
import com.vikadata.api.modular.finance.core.Bundle;
import com.vikadata.api.modular.finance.core.Subscription;
import com.vikadata.api.modular.finance.model.OfflineOrderInfo;
import com.vikadata.api.modular.finance.model.SpaceSubscriptionVo;
import com.vikadata.api.modular.finance.service.IBillingOfflineService;
import com.vikadata.api.modular.finance.service.IBundleService;
import com.vikadata.api.modular.finance.service.IOrderItemService;
import com.vikadata.api.modular.finance.service.IOrderV2Service;
import com.vikadata.api.modular.finance.service.ISpaceSubscriptionService;
import com.vikadata.api.modular.finance.service.ISubscriptionService;
import com.vikadata.api.modular.social.enums.SocialAppType;
import com.vikadata.api.modular.social.model.TenantBindDTO;
import com.vikadata.api.modular.social.service.ISocialTenantBindService;
import com.vikadata.api.modular.social.service.ISocialTenantService;
import com.vikadata.api.modular.space.service.ISpaceService;
import com.vikadata.api.util.billing.BillingConfigManager;
import com.vikadata.api.util.billing.OrderUtil;
import com.vikadata.api.util.billing.model.ProductChannel;
import com.vikadata.api.util.billing.model.SubscribePlanInfo;
import com.vikadata.entity.BundleEntity;
import com.vikadata.entity.OrderEntity;
import com.vikadata.entity.OrderItemEntity;
import com.vikadata.entity.SocialTenantEntity;
import com.vikadata.entity.SpaceEntity;
import com.vikadata.entity.SubscriptionEntity;
import com.vikadata.social.feishu.card.Card;
import com.vikadata.social.feishu.card.CardComponent;
import com.vikadata.social.feishu.card.CardMessage;
import com.vikadata.social.feishu.card.Config;
import com.vikadata.social.feishu.card.Header;
import com.vikadata.social.feishu.card.Message;
import com.vikadata.social.feishu.card.TemplateColor;
import com.vikadata.social.feishu.card.module.Div;
import com.vikadata.social.feishu.card.module.Hr;
import com.vikadata.social.feishu.card.module.Module;
import com.vikadata.social.feishu.card.module.Note;
import com.vikadata.social.feishu.card.objects.Text;
import com.vikadata.social.feishu.card.objects.Text.Mode;
import com.vikadata.system.config.billing.Plan;
import com.vikadata.system.config.billing.Product;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import static com.vikadata.api.enums.finance.BundleState.ACTIVATED;
import static com.vikadata.api.util.AssertUtil.verifyNonNullOrEmpty;
import static com.vikadata.api.util.billing.BillingConfigManager.getBillingConfig;
import static com.vikadata.api.util.billing.BillingConfigManager.getFreePlan;
import static com.vikadata.api.util.billing.BillingUtil.legacyPlanId;

/**
 * 财务服务实现
 *
 * @author Shawn Deng
 */
@Service
@Slf4j
public class BillingOfflineServiceImpl implements IBillingOfflineService {

    @Resource
    private ISpaceService iSpaceService;

    @Resource
    private IOrderV2Service iOrderV2Service;

    @Resource
    private IOrderItemService iOrderItemService;

    @Resource
    private IBundleService iBundleService;

    @Resource
    private ISubscriptionService iSubscriptionService;

    @Resource
    private ISpaceSubscriptionService iSpaceSubscriptionService;

    @Resource
    private ISocialTenantBindService iSocialTenantBindService;

    @Resource
    private ISocialTenantService iSocialTenantService;

    @Override
    public SpaceSubscriptionVo getSpaceSubscription(String spaceId) {
        SubscribePlanInfo planInfo = iSpaceSubscriptionService.getPlanInfoBySpaceId(spaceId);
        SpaceSubscriptionVo vo = new SpaceSubscriptionVo();
        vo.setSpaceId(spaceId);
        vo.setProduct(planInfo.getProduct());
        vo.setSeats(planInfo.getBasePlan().getSeats());
        vo.setStartDate(planInfo.getStartDate());
        vo.setEndDate(planInfo.getDeadline());
        return vo;
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public OfflineOrderInfo createBusinessOrder(CreateBusinessOrderRo data) {
        String spaceId = data.getSpaceId();
        // 检查空间是否存在
        SpaceEntity spaceEntity = iSpaceService.getBySpaceId(spaceId);
        // 根据订单类型校验空间的订单
        OrderType orderType = OrderType.of(data.getType());
        if (orderType == null) {
            throw new IllegalArgumentException("订单类型不正确");
        }
        if (orderType == OrderType.BUY || orderType == OrderType.UPGRADE) {
            verifyNonNullOrEmpty(data.getProduct(), "product should be specified");
            verifyNonNullOrEmpty(data.getSeat(), "seat should be specified");
        }
        // 查询空间的订阅状态
        Bundle activeBundle = iBundleService.getActivatedBundleBySpaceId(spaceId);
        // 检查空间是否存在自营
        if (orderType == OrderType.BUY) {
            // 新购订单重复，不允许操作
            if (activeBundle != null && !activeBundle.isBaseForFree()) {
                throw new IllegalArgumentException("无法下单，空间站已经有订阅，也许你需要续订和升级");
            }
        }
        else if (orderType == OrderType.RENEW) {
            if (activeBundle == null) {
                throw new IllegalArgumentException("无法续订，空间站没有订阅");
            }
        }
        else if (orderType == OrderType.UPGRADE) {
            if (activeBundle == null) {
                throw new IllegalArgumentException("无法升级，空间站没有订阅");
            }
        }
        String inputDate = data.getStartDate();
        LocalDateTime startDate = inputDate == null || inputDate.isEmpty() ?
                ClockManager.me().getLocalDateTimeNow() :
                LocalDate.parse(inputDate, DateTimeFormatter.ofPattern("yyyy-MM-dd")).atStartOfDay();

        OfflineOrderInfo message;
        switch (orderType) {
            case BUY:
                message = createNewBuyOrder(spaceEntity, data.getProduct(), data.getSeat(), startDate, data.getMonths(), data.getRemark());
                break;
            case RENEW:
                message = createRenewOrder(spaceEntity, activeBundle, data.getMonths(), data.getRemark());
                break;
            case UPGRADE:
                message = createUpgradeOrder(spaceEntity, activeBundle, data.getProduct(), data.getSeat(), startDate, data.getMonths(), data.getRemark());
                break;
            default:
                throw new RuntimeException("unknown order type");
        }
        return message;
    }

    private OfflineOrderInfo createNewBuyOrder(SpaceEntity space, String product, int seat, LocalDateTime startDate, int months, String remark) {
        Plan plan = BillingConfigManager.getPlan(product, seat);
        LocalDateTime endDate = startDate.plusMonths(months);
        String subscriptionId = createSubscription(space.getSpaceId(), plan, startDate, endDate);
        String orderId = createOrder(space.getSpaceId(), OrderType.BUY, plan, months, subscriptionId, startDate, endDate);
        Message message = buildNewBuyCard(space.getSpaceId(), space.getName(), plan.getProduct(), plan.getSeats(), months, startDate.toLocalDate()
                , endDate.toLocalDate(), remark);
        return OfflineOrderInfo.builder().orderId(orderId).message(message).build();
    }

    private OfflineOrderInfo createRenewOrder(SpaceEntity space, Bundle bundle, int months, String remark) {
        // 开始时间
        LocalDateTime startDate = bundle.getBaseSubscription().getExpireDate();
        // 过期时间
        LocalDateTime endDate = startDate.plusMonths(months);
        // 更新订阅集合包
        BundleEntity updateBundle = BundleEntity.builder().endDate(endDate).updatedBy(-1L).build();
        iBundleService.updateByBundleId(bundle.getBundleId(), updateBundle);
        // 更新订阅
        Subscription subscription = bundle.getBaseSubscription();
        String subscriptionId = subscription.getSubscriptionId();
        SubscriptionEntity updateSubscription = SubscriptionEntity.builder().expireDate(endDate).updatedBy(-1L).build();
        iSubscriptionService.updateBySubscriptionId(subscriptionId, updateSubscription);
        Plan plan = getBillingConfig().getPlans().get(legacyPlanId(subscription.getPlanId()));
        String orderId = createOrder(space.getSpaceId(), OrderType.RENEW, plan, months, subscriptionId, startDate, endDate);
        Message message = buildRenewCard(space.getSpaceId(), space.getName(), plan.getProduct(), plan.getSeats(), months, startDate.toLocalDate()
                , endDate.toLocalDate(), remark);
        return OfflineOrderInfo.builder().orderId(orderId).message(message).build();
    }

    private OfflineOrderInfo createUpgradeOrder(SpaceEntity space, Bundle bundle, String product, int seat, LocalDateTime startDate, int months, String remark) {
        // 过期时间
        LocalDateTime endDate = startDate.plusMonths(months);
        // 更新订阅集合包
        BundleEntity updateBundle = BundleEntity.builder().startDate(startDate).endDate(endDate).updatedBy(-1L).build();
        iBundleService.updateByBundleId(bundle.getBundleId(), updateBundle);
        // 更新订阅
        Subscription subscription = bundle.getBaseSubscription();
        String subscriptionId = subscription.getSubscriptionId();
        Plan plan = BillingConfigManager.getPlan(product, seat);
        SubscriptionEntity updateSubscription = SubscriptionEntity.builder()
                .productName(plan.getProduct())
                .productCategory(plan.getProductCategory()).planId(plan.getId())
                .bundleStartDate(startDate).startDate(startDate).expireDate(endDate).updatedBy(-1L)
                .build();
        iSubscriptionService.updateBySubscriptionId(subscriptionId, updateSubscription);
        String orderId = createOrder(space.getSpaceId(), OrderType.UPGRADE, plan, months, subscriptionId, startDate, endDate);
        Message message = buildUpgradeCard(space.getSpaceId(), space.getName(), subscription.getProductName(), plan.getProduct(), plan.getSeats(), months, startDate.toLocalDate()
                , endDate.toLocalDate(), remark);
        return OfflineOrderInfo.builder().orderId(orderId).message(message).build();
    }

    public String createSubscription(String spaceId, Plan plan, LocalDateTime startDate, LocalDateTime endDate) {
        // 创建空间站订阅集合包
        BundleEntity bundleEntity = createBundle(spaceId, startDate, endDate);

        List<SubscriptionEntity> subscriptionEntities = new ArrayList<>();
        // 创建基础类型订阅
        String subscriptionId = UUID.randomUUID().toString();
        SubscriptionEntity baseSubscription = new SubscriptionEntity();
        baseSubscription.setSpaceId(spaceId);
        baseSubscription.setBundleId(bundleEntity.getBundleId());
        baseSubscription.setSubscriptionId(subscriptionId);
        baseSubscription.setProductName(plan.getProduct());
        Product product = getBillingConfig().getProducts().get(plan.getProduct());
        baseSubscription.setProductCategory(product.getCategory());
        baseSubscription.setPlanId(plan.getId());
        baseSubscription.setState(SubscriptionState.ACTIVATED.name());
        baseSubscription.setBundleStartDate(startDate);
        baseSubscription.setStartDate(startDate);
        baseSubscription.setExpireDate(endDate);
        baseSubscription.setCreatedBy(-1L);
        baseSubscription.setUpdatedBy(-1L);
        subscriptionEntities.add(baseSubscription);

        // 新购之前也许已经有(免费订阅+附加订阅)
        Bundle activatedBundle = iBundleService.getActivatedBundleBySpaceId(spaceId);
        if (activatedBundle != null) {
            activatedBundle.getAddOnSubscription()
                    .stream()
                    .filter(subscription -> {
                        // 过滤出未过期的附加订阅
                        LocalDate today = ClockManager.me().getLocalDateNow();
                        LocalDate expireDate = subscription.getExpireDate().toLocalDate();
                        return today.compareTo(expireDate) <= 0;
                    })
                    .forEach(addOnSub -> {
                        // 转移未失效的附加计划订阅到新的订阅
                        SubscriptionEntity addOn = new SubscriptionEntity();
                        addOn.setSpaceId(spaceId);
                        addOn.setBundleId(bundleEntity.getBundleId());
                        addOn.setSubscriptionId(addOnSub.getSubscriptionId());
                        addOn.setProductName(addOnSub.getProductName());
                        addOn.setProductCategory(addOnSub.getProductCategory().name());
                        addOn.setPlanId(addOnSub.getPlanId());
                        addOn.setState(SubscriptionState.ACTIVATED.name());
                        addOn.setBundleStartDate(addOnSub.getStartDate());
                        addOn.setStartDate(addOnSub.getStartDate());
                        addOn.setExpireDate(addOnSub.getExpireDate());
                        subscriptionEntities.add(addOn);
                    });
            // 让之前的订阅过期
            BundleEntity updateBundle = new BundleEntity();
            updateBundle.setState(BundleState.EXPIRED.name());
            iBundleService.updateByBundleId(activatedBundle.getBundleId(), updateBundle);
        }
        iBundleService.create(bundleEntity);
        iSubscriptionService.createBatch(subscriptionEntities);

        return subscriptionId;
    }

    private String createOrder(String spaceId, OrderType orderType, Plan plan, int months, String subscriptionId, LocalDateTime startDate, LocalDateTime endDate) {
        // 创建订单
        String orderId = OrderUtil.createOrderId();
        OrderEntity orderEntity = new OrderEntity();
        orderEntity.setSpaceId(spaceId);
        orderEntity.setOrderId(orderId);
        orderEntity.setOrderChannel(OrderChannel.OFFLINE.getName());
        orderEntity.setOrderType(orderType.name());
        orderEntity.setCurrency(Currency.CNY.name());
        orderEntity.setOriginalAmount(0);
        orderEntity.setDiscountAmount(0);
        orderEntity.setAmount(0);
        orderEntity.setState(OrderStatus.FINISHED.getName());
        LocalDateTime time = ClockManager.me().getLocalDateTimeNow();
        orderEntity.setCreatedTime(time);
        orderEntity.setIsPaid(true);
        orderEntity.setPaidTime(time);
        orderEntity.setCreatedBy(-1L);
        orderEntity.setUpdatedBy(-1L);
        iOrderV2Service.save(orderEntity);

        OrderItemEntity orderItemEntity = new OrderItemEntity();
        orderItemEntity.setSpaceId(spaceId);
        orderItemEntity.setOrderId(orderId);
        orderItemEntity.setAmount(0);
        orderItemEntity.setProductName(plan.getProduct());
        Product product = getBillingConfig().getProducts().get(plan.getProduct());
        orderItemEntity.setProductCategory(product.getCategory());
        // 线下订单没有固定付费方案，比较灵活的计划组合
        orderItemEntity.setPlanId(plan.getId());
        orderItemEntity.setSeat(plan.getSeats());
        orderItemEntity.setMonths(months);
        orderItemEntity.setCurrency(Currency.CNY.name());
        orderItemEntity.setAmount(0);
        orderItemEntity.setSubscriptionId(subscriptionId);
        orderItemEntity.setStartDate(startDate);
        orderItemEntity.setEndDate(endDate);
        orderItemEntity.setCreatedBy(-1L);
        orderItemEntity.setUpdatedBy(-1L);
        iOrderItemService.save(orderItemEntity);

        return orderEntity.getOrderId();
    }

    private Message buildNewBuyCard(String spaceId, String spaceName, String productName, int seat, int months, LocalDate startDate, LocalDate endDate, String remark) {
        Header header = new Header(new Text(Mode.PLAIN_TEXT, "新订单通知", null), TemplateColor.GREEN);
        Card card = new Card(new Config(true), header);
        List<Module> divList = new LinkedList<>();
        divList.add(new Div(new Text(Text.Mode.LARK_MD, "**【订单类型】** 新购", null)));
        divList.add(new Div(new Text(Text.Mode.LARK_MD, "**【客户空间标识】** " + spaceId, null)));
        divList.add(new Div(new Text(Text.Mode.LARK_MD, "**【客户空间名称】** " + spaceName, null)));
        divList.add(new Div(new Text(Text.Mode.LARK_MD, "**【产品等级】** " + productName, null)));
        divList.add(new Div(new Text(Text.Mode.LARK_MD, String.format("**【席位】** %d人", seat), null)));
        divList.add(new Div(new Text(Text.Mode.LARK_MD, String.format("**【购买月数】** %d个月", months), null)));
        divList.add(new Div(new Text(Text.Mode.LARK_MD, String.format("**【生效日期】** %s", startDate.toString()), null)));
        divList.add(new Div(new Text(Text.Mode.LARK_MD, String.format("**【到期日期】** %s", endDate.toString()), null)));
        divList.add(new Div(new Text(Text.Mode.LARK_MD, String.format("**【备注】** %s", remark), null)));
        divList.add(new Hr());
        List<CardComponent> elements = new ArrayList<>();
        elements.add(new Text(Text.Mode.LARK_MD, "[查看订单](https://vika.cn/workbench/dstK19iRDHJXbcdGH2/viwGztsufm2BB)", null));
        divList.add(new Note(elements));
        // 设置内容元素
        card.setModules(divList);
        return new CardMessage(card.toObj());
    }

    private Message buildRenewCard(String spaceId, String spaceName, String productName, int seat, int months, LocalDate startDate, LocalDate endDate, String remark) {
        Header header = new Header(new Text(Mode.PLAIN_TEXT, "续费订单通知", null), TemplateColor.GREEN);
        Card card = new Card(new Config(true), header);
        List<Module> divList = new LinkedList<>();
        divList.add(new Div(new Text(Text.Mode.LARK_MD, "**【订单类型】** 续订", null)));
        divList.add(new Div(new Text(Text.Mode.LARK_MD, "**【客户空间标识】** " + spaceId, null)));
        divList.add(new Div(new Text(Text.Mode.LARK_MD, "**【客户空间名称】** " + spaceName, null)));
        divList.add(new Div(new Text(Text.Mode.LARK_MD, "**【续订产品等级】** " + productName, null)));
        divList.add(new Div(new Text(Text.Mode.LARK_MD, String.format("**【续订席位】** %d人", seat), null)));
        divList.add(new Div(new Text(Text.Mode.LARK_MD, String.format("**【续订购买月数】** %d个月", months), null)));
        divList.add(new Div(new Text(Text.Mode.LARK_MD, String.format("**【原生效日期】** %s", startDate.toString()), null)));
        divList.add(new Div(new Text(Text.Mode.LARK_MD, String.format("**【续订后到期日期】** %s", endDate.toString()), null)));
        divList.add(new Div(new Text(Text.Mode.LARK_MD, String.format("**【备注】** %s", remark), null)));
        divList.add(new Hr());
        List<CardComponent> elements = new ArrayList<>();
        elements.add(new Text(Text.Mode.LARK_MD, "[查看订单](https://vika.cn/workbench/dstK19iRDHJXbcdGH2/viwGztsufm2BB)", null));
        divList.add(new Note(elements));
        // 设置内容元素
        card.setModules(divList);
        return new CardMessage(card.toObj());
    }

    private Message buildUpgradeCard(String spaceId, String spaceName, String oldProductName, String newProductName, int seat, int months, LocalDate startDate, LocalDate endDate, String remark) {
        Header header = new Header(new Text(Mode.PLAIN_TEXT, "升级订单通知", null), TemplateColor.GREEN);
        Card card = new Card(new Config(true), header);
        List<Module> divList = new LinkedList<>();
        divList.add(new Div(new Text(Text.Mode.LARK_MD, "**【订单类型】** 升级", null)));
        divList.add(new Div(new Text(Text.Mode.LARK_MD, "**【客户空间标识】** " + spaceId, null)));
        divList.add(new Div(new Text(Text.Mode.LARK_MD, "**【客户空间名称】** " + spaceName, null)));
        divList.add(new Div(new Text(Text.Mode.LARK_MD, "**【原产品】** " + oldProductName, null)));
        divList.add(new Div(new Text(Text.Mode.LARK_MD, "**【升级产品】** " + newProductName, null)));
        divList.add(new Div(new Text(Text.Mode.LARK_MD, String.format("**【升级席位】** %d人", seat), null)));
        divList.add(new Div(new Text(Text.Mode.LARK_MD, String.format("**【购买月数】** %d个月", months), null)));
        divList.add(new Div(new Text(Text.Mode.LARK_MD, String.format("**【生效日期】** %s", startDate.toString()), null)));
        divList.add(new Div(new Text(Text.Mode.LARK_MD, String.format("**【到期日期】** %s", endDate.toString()), null)));
        divList.add(new Div(new Text(Text.Mode.LARK_MD, String.format("**【备注】** %s", remark), null)));
        divList.add(new Hr());
        List<CardComponent> elements = new ArrayList<>();
        elements.add(new Text(Text.Mode.LARK_MD, "[查看订单](https://vika.cn/workbench/dstK19iRDHJXbcdGH2/viwGztsufm2BB)", null));
        divList.add(new Note(elements));
        // 设置内容元素
        card.setModules(divList);
        return new CardMessage(card.toObj());
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void createSubscriptionWithAddOn(CreateEntitlementWithAddOn data) {
        // 检查参数
        Plan plan = BillingConfigManager.getBillingConfig().getPlans().get(data.getPlanId());
        verifyNonNullOrEmpty(plan, "附加计划不存在");
        String spaceId = data.getSpaceId();
        // 检查空间是否存在
        iSpaceService.checkExist(spaceId);
        if (isSocialBind(spaceId)) {
            throw new IllegalArgumentException("不允许赠送第三方绑定集成的空间站");
        }
        String inputDate = data.getStartDate();
        LocalDateTime startDate = inputDate == null || inputDate.isEmpty() ?
                ClockManager.me().getLocalDateTimeNow() :
                LocalDate.parse(inputDate, DateTimeFormatter.ofPattern("yyyy-MM-dd")).atStartOfDay();
        LocalDateTime endDate = startDate.plusMonths(data.getMonths());
        // 查询空间的订阅状态
        Bundle activeBundle = iBundleService.getActivatedBundleBySpaceId(spaceId);
        if (activeBundle == null) {
            // 不存在存在订阅，创建附加产品类型
            BundleEntity bundleEntity = createBundle(spaceId, startDate, endDate);
            iBundleService.create(bundleEntity);

            List<SubscriptionEntity> entities = new ArrayList<>();
            // 创建基础类型订阅
            String subscriptionId = UUID.randomUUID().toString();
            SubscriptionEntity baseSubscription = new SubscriptionEntity();
            baseSubscription.setSpaceId(spaceId);
            baseSubscription.setBundleId(bundleEntity.getBundleId());
            baseSubscription.setSubscriptionId(subscriptionId);
            Plan freePlan = getFreePlan(ProductChannel.VIKA);
            baseSubscription.setProductName(freePlan.getProduct());
            baseSubscription.setProductCategory(freePlan.getProductCategory());
            baseSubscription.setPlanId(freePlan.getId());
            baseSubscription.setState(SubscriptionState.ACTIVATED.name());
            baseSubscription.setBundleStartDate(startDate);
            baseSubscription.setStartDate(startDate);
            baseSubscription.setExpireDate(endDate);
            baseSubscription.setCreatedBy(-1L);
            baseSubscription.setUpdatedBy(-1L);
            entities.add(baseSubscription);

            // 附加类型订阅
            SubscriptionEntity addSubscription = new SubscriptionEntity();
            addSubscription.setSpaceId(spaceId);
            addSubscription.setBundleId(bundleEntity.getBundleId());
            addSubscription.setSubscriptionId(UUID.randomUUID().toString());
            addSubscription.setProductName(plan.getProduct());
            addSubscription.setProductCategory(plan.getProductCategory());
            addSubscription.setPlanId(plan.getId());
            addSubscription.setMetadata(data.getRemark());
            addSubscription.setState(SubscriptionState.ACTIVATED.name());
            addSubscription.setBundleStartDate(startDate);
            addSubscription.setStartDate(startDate);
            addSubscription.setExpireDate(endDate);
            addSubscription.setCreatedBy(-1L);
            addSubscription.setUpdatedBy(-1L);
            entities.add(addSubscription);

            iSubscriptionService.createBatch(entities);
            return;
        }
        SubscriptionEntity subscription = new SubscriptionEntity();
        subscription.setSpaceId(spaceId);
        subscription.setBundleId(activeBundle.getBundleId());
        subscription.setSubscriptionId(UUID.randomUUID().toString());
        subscription.setProductName(plan.getProduct());
        Product product = getBillingConfig().getProducts().get(plan.getProduct());
        subscription.setProductCategory(product.getCategory());
        subscription.setPlanId(plan.getId());
        subscription.setMetadata(data.getRemark());
        subscription.setState(SubscriptionState.ACTIVATED.name());
        subscription.setBundleStartDate(activeBundle.getBundleStartDate());
        subscription.setStartDate(startDate);
        subscription.setExpireDate(endDate);
        subscription.setCreatedBy(-1L);
        subscription.setUpdatedBy(-1L);
        iSubscriptionService.create(subscription);
    }

    @Override
    public void createGiftCapacityOrder(Long userId, String userName, String spaceId) {
        log.info("下单300MB附加订阅计划，用于邀请用户增容附件容量");
        CreateEntitlementWithAddOn createEntitlementWithAddOn = new CreateEntitlementWithAddOn();
        createEntitlementWithAddOn.setSpaceId(spaceId);
        createEntitlementWithAddOn.setPlanId("capacity_300_MB");
        createEntitlementWithAddOn.setStartDate(LocalDate.now().toString());
        createEntitlementWithAddOn.setMonths(12);
        // 构建请求体中remark备注信息，包括userId、userName、capacityType
        Map<String, Object> remarkMap = new HashMap<>();
        remarkMap.put("userId", userId);
        remarkMap.put("userName", userName);
        remarkMap.put("capacityType", CapacityType.PARTICIPATION_CAPACITY.getName());
        String remark = new JSONObject(remarkMap).toString();
        createEntitlementWithAddOn.setRemark(remark);
        // 附件订阅计划下单
        this.createSubscriptionWithAddOn(createEntitlementWithAddOn);
    }

    private BundleEntity createBundle(String spaceId, LocalDateTime startDate, LocalDateTime endDate) {
        BundleEntity bundleEntity = new BundleEntity();
        bundleEntity.setBundleId(UUID.randomUUID().toString());
        bundleEntity.setSpaceId(spaceId);
        bundleEntity.setState(ACTIVATED.name());
        bundleEntity.setStartDate(startDate);
        bundleEntity.setEndDate(endDate);
        bundleEntity.setCreatedBy(-1L);
        bundleEntity.setUpdatedBy(-1L);
        return bundleEntity;
    }

    private boolean isSocialBind(String spaceId) {
        TenantBindDTO bindDTO = iSocialTenantBindService.getTenantBindInfoBySpaceId(spaceId);
        if (bindDTO == null) {
            return false;
        }
        SocialTenantEntity tenant = iSocialTenantService.getByAppIdAndTenantId(bindDTO.getAppId(), bindDTO.getTenantId());
        if (tenant == null) {
            return false;
        }
        return Boolean.TRUE.equals(tenant.getStatus()) && SocialAppType.ISV.getType() == tenant.getAppType();
    }
}
