package com.vikadata.api.modular.finance.strategy.impl;

import java.util.List;
import java.util.stream.Collectors;

import javax.annotation.Resource;

import cn.hutool.core.collection.ListUtil;
import cn.hutool.core.date.DateUtil;
import cn.hutool.core.util.ObjectUtil;
import cn.hutool.core.util.StrUtil;
import cn.hutool.json.JSONUtil;
import com.baomidou.mybatisplus.extension.toolkit.SqlHelper;
import lombok.extern.slf4j.Slf4j;

import com.vikadata.api.enums.finance.OrderChannel;
import com.vikadata.api.enums.finance.OrderType;
import com.vikadata.api.enums.finance.SubscriptionPhase;
import com.vikadata.api.enums.social.SocialPlatformType;
import com.vikadata.api.event.SyncOrderEvent;
import com.vikadata.api.modular.finance.model.SocialOrderContext;
import com.vikadata.api.modular.finance.service.IBundleService;
import com.vikadata.api.modular.finance.service.IOrderItemService;
import com.vikadata.api.modular.finance.service.IOrderV2Service;
import com.vikadata.api.modular.finance.service.ISocialDingTalkOrderService;
import com.vikadata.api.modular.finance.service.ISocialDingTalkRefundService;
import com.vikadata.api.modular.finance.service.ISubscriptionService;
import com.vikadata.api.modular.finance.strategy.AbstractSocialOrderService;
import com.vikadata.api.modular.finance.strategy.SocialOrderStrategyFactory;
import com.vikadata.api.modular.social.model.TenantBindDTO;
import com.vikadata.api.modular.social.service.IDingTalkInternalIsvService;
import com.vikadata.api.modular.social.service.ISocialTenantBindService;
import com.vikadata.api.util.billing.BillingConfigManager;
import com.vikadata.api.util.billing.DingTalkPlanConfigManager;
import com.vikadata.api.util.billing.model.ProductChannel;
import com.vikadata.boot.autoconfigure.spring.SpringContextHolder;
import com.vikadata.clock.ClockUtil;
import com.vikadata.entity.SubscriptionEntity;
import com.vikadata.integration.grpc.CorpBizDataDto;
import com.vikadata.social.dingtalk.enums.DingTalkBizType;
import com.vikadata.social.dingtalk.enums.DingTalkOrderChargeType;
import com.vikadata.social.dingtalk.enums.DingTalkOrderType;
import com.vikadata.social.dingtalk.event.order.SyncHttpMarketOrderEvent;
import com.vikadata.social.dingtalk.event.order.SyncHttpMarketServiceCloseEvent;
import com.vikadata.system.config.billing.Price;
import com.vikadata.system.config.billing.Product;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import static com.vikadata.api.constants.TimeZoneConstants.DEFAULT_TIME_ZONE;

/**
 * <p>
 * ding talk orders service implements
 * handle ding talk order event
 * </p>
 * @author zoe zheng
 * @date 2022/5/18 18:34
 */
@Service
@Slf4j
public class DingTalkOrderServiceImpl extends AbstractSocialOrderService<SyncHttpMarketOrderEvent, SyncHttpMarketServiceCloseEvent> {
    @Resource
    private ISocialTenantBindService iSocialTenantBindService;

    @Resource
    private ISocialDingTalkOrderService iSocialDingTalkOrderService;

    @Resource
    private ISocialDingTalkRefundService iSocialDingTalkRefundService;

    @Resource
    private IBundleService iBundleService;

    @Resource
    private IOrderV2Service iOrderV2Service;

    @Resource
    private IOrderItemService iOrderItemService;

    @Resource
    private ISubscriptionService iSubscriptionService;

    @Resource
    private IDingTalkInternalIsvService iDingTalkInternalIsvService;

    @Override
    public String retrieveOrderPaidEvent(SyncHttpMarketOrderEvent event) {
        SocialOrderContext context = buildSocialOrderContext(event);
        if (null == context) {
            return null;
        }
        // 创建订单
        String orderId = createOrder(context);
        // 创建订单元数据
        createOrderMetaData(orderId, OrderChannel.DINGTALK, event);
        // 升级、续费、新购、续费升级、试用
        String subscriptionId;
        if (DingTalkOrderType.BUY.getValue().equals(event.getOrderType()) && null == context.getActivatedBundle()) {
            // 创建订阅集合
            String bundleId = createBundle(context);
            subscriptionId = createSubscription(bundleId, context);
        }
        else if (DingTalkOrderType.RENEW.getValue().equals(event.getOrderType())) {
            subscriptionId = renewSubscription(context);
        }
        else {
            subscriptionId = upgradeSubscription(context);
        }
        // 创建订单项目
        createOrderItem(orderId, subscriptionId, context);
        // 标记钉订单已经处理完成
        iSocialDingTalkOrderService.updateTenantOrderStatusByOrderId(event.getCorpId(), event.getSuiteId(),
                event.getOrderId(), 1);
        // 同步订单事件
        SpringContextHolder.getApplicationContext().publishEvent(new SyncOrderEvent(this, orderId));
        return orderId;
    }

    @Override
    public void retrieveOrderRefundEvent(SyncHttpMarketServiceCloseEvent event) {
        // 查询订单号对应的订阅
        String spaceId = iSocialTenantBindService.getTenantDepartmentBindSpaceId(event.getSuiteId(), event.getCorpId());
        if (StrUtil.isBlank(spaceId)) {
            log.error("处理退款失败,钉钉企业还未绑定空间站:{}", event.getCorpId());
            return;
        }
        // 获取退款商品对应的订单ID 钉钉活动赠送的服务订单 也需要处理
        List<String> dingTalkOrderIds =
                iSocialDingTalkOrderService.getOrderIdsByTenantIdAndAppIdAndItemCode(event.getCorpId(),
                        event.getSuiteId(), event.getItemCode());
        dingTalkOrderIds.forEach(i -> {
            // 删除订单对应的订阅信息
            String orderId = iOrderV2Service.getOrderIdByChannelOrderId(spaceId, i);
            List<String> subscriptionIds =
                    iOrderItemService.getSubscriptionIdsByOrderId(orderId).stream().filter(StrUtil::isNotBlank).collect(Collectors.toList());
            List<String> bundleIds = subscriptionIds.stream().map(subscriptionId -> {
                SubscriptionEntity subscription = iSubscriptionService.getBySubscriptionId(subscriptionId);
                if (null != subscription) {
                    return subscription.getBundleId();
                }
                return null;
            }).filter(StrUtil::isNotBlank).collect(Collectors.toList());
            if (!subscriptionIds.isEmpty()) {
                iSubscriptionService.removeBatchBySubscriptionIds(subscriptionIds);
            }
            if (!bundleIds.isEmpty()) {
                iBundleService.removeBatchByBundleIds(bundleIds);
            }
        });
        // 退款处理完成
        iSocialDingTalkRefundService.updateTenantRefundStatusByOrderId(event.getCorpId(), event.getSuiteId(),
                event.getOrderId(), 1);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void migrateEvent(String spaceId) {
        // 读取绑定信息
        TenantBindDTO bindInfo = iSocialTenantBindService.getTenantBindInfoBySpaceId(spaceId);
        if (null == bindInfo) {
            log.warn("钉钉空间未绑定");
            return;
        }
        List<CorpBizDataDto> bizDataList = iDingTalkInternalIsvService.getCorpBizDataByBizTypes(bindInfo.getAppId(),
                bindInfo.getTenantId(),
                ListUtil.toList(DingTalkBizType.MARKET_ORDER, DingTalkBizType.SUBSCRIPTION_CLOSE));
        bizDataList.forEach(i -> {
            if (DingTalkBizType.MARKET_ORDER.getValue().equals(i.getBizType())) {
                // 是否已经处理
                SyncHttpMarketOrderEvent event = JSONUtil.toBean(i.getBizData(), SyncHttpMarketOrderEvent.class);
                Integer status = iSocialDingTalkOrderService.getStatusByOrderId(bindInfo.getTenantId(), bindInfo.getAppId(),
                        i.getBizId());
                if (null == status) {
                    iSocialDingTalkOrderService.createOrder(event);
                }
                // 未处理
                if (!SqlHelper.retBool(status)) {
                    retrieveOrderPaidEvent(event);
                }
            }
            if (DingTalkBizType.SUBSCRIPTION_CLOSE.getValue().equals(i.getBizType())) {
                SyncHttpMarketServiceCloseEvent event = JSONUtil.toBean(i.getBizData(),
                        SyncHttpMarketServiceCloseEvent.class);
                Integer status = iSocialDingTalkRefundService.getStatusByOrderId(bindInfo.getTenantId(),
                        bindInfo.getAppId(), event.getOrderId());
                if (null == status) {
                    iSocialDingTalkRefundService.createRefund(event);
                }
                // 未处理
                if (!SqlHelper.retBool(status)) {
                    retrieveOrderRefundEvent(JSONUtil.toBean(i.getBizData(), SyncHttpMarketServiceCloseEvent.class));
                }
            }
        });
    }

    @Override
    public SocialOrderContext buildSocialOrderContext(SyncHttpMarketOrderEvent event) {
        String spaceId = iSocialTenantBindService.getTenantDepartmentBindSpaceId(event.getSuiteId(), event.getCorpId());
        if (StrUtil.isBlank(spaceId)) {
            log.warn("钉钉企业还未收到开通应用事件:{}", event.getCorpId());
            return null;
        }
        // 订单购买的付费方案
        Price price = DingTalkPlanConfigManager.getPriceByItemCodeAndMonth(event.getItemCode(),
                (int) DateUtil.betweenMonth(DateUtil.date(event.getServiceStartTime()), DateUtil.date(event.getServiceStopTime()), false));
        // price是null的情况，那么购买的是钉钉基础版
        Product product = ObjectUtil.isNull(price) ? BillingConfigManager.getCurrentFreeProduct(ProductChannel.DINGTALK)
                : BillingConfigManager.getBillingConfig().getProducts().get(price.getProduct());
        SubscriptionPhase phase = DingTalkOrderChargeType.TRYOUT.getValue().equals(event.getOrderChargeType()) ?
                SubscriptionPhase.TRIAL : SubscriptionPhase.FIXEDTERM;
        SocialOrderContext orderContext = SocialOrderContext.builder()
                .productChannel(ProductChannel.DINGTALK)
                .socialOrderId(event.getOrderId())
                .amount(event.getPayFee())
                .price(price)
                .orderChannel(OrderChannel.DINGTALK)
                .product(product)
                .spaceId(spaceId)
                .orderType(OrderType.of(event.getOrderType()))
                .paidTime(ClockUtil.milliToLocalDateTime(event.getPaidtime(), DEFAULT_TIME_ZONE))
                .createdTime(ClockUtil.milliToLocalDateTime(event.getPaidtime(), DEFAULT_TIME_ZONE))
                .phase(phase)
                .serviceStartTime(ClockUtil.milliToLocalDateTime(event.getServiceStartTime(), DEFAULT_TIME_ZONE))
                .serviceStopTime(ClockUtil.milliToLocalDateTime(event.getServiceStopTime(), DEFAULT_TIME_ZONE))
                .build();
        if (null != event.getDiscountFee() && event.getDiscountFee() > 0) {
            orderContext.setDiscountAmount(event.getDiscountFee());
            orderContext.setOriginalAmount(event.getPayFee() + event.getDiscountFee());
        }
        // 统一为续费
        if (event.getOrderType().equals(DingTalkOrderType.RENEW_DEGRADE.getValue()) || event.getOrderType().equals(DingTalkOrderType.RENEW_UPGRADE.getValue())) {
            orderContext.setOrderType(OrderType.RENEW);
        }
        orderContext.setActivatedBundle(iBundleService.getActivatedBundleBySpaceId(spaceId));
        return orderContext;
    }

    @Override
    public void afterPropertiesSet() throws Exception {
        SocialOrderStrategyFactory.register(SocialPlatformType.DINGTALK, this);
    }
}
