package com.vikadata.api.modular.finance.service.impl;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import java.util.UUID;

import javax.annotation.Resource;

import cn.hutool.core.thread.ThreadUtil;
import cn.hutool.core.util.StrUtil;
import cn.hutool.json.JSONUtil;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.PropertyNamingStrategies;
import lombok.extern.slf4j.Slf4j;

import com.vikadata.api.enums.finance.BundleState;
import com.vikadata.api.enums.finance.Currency;
import com.vikadata.api.enums.finance.OrderChannel;
import com.vikadata.api.enums.finance.OrderPhase;
import com.vikadata.api.enums.finance.OrderStatus;
import com.vikadata.api.enums.finance.OrderType;
import com.vikadata.api.enums.finance.SubscriptionState;
import com.vikadata.api.modular.eco.mapper.EconomicOrderMapper;
import com.vikadata.api.modular.eco.mapper.EconomicOrderPaymentMapper;
import com.vikadata.api.modular.finance.model.CustomerOrder;
import com.vikadata.api.modular.finance.service.IBundleService;
import com.vikadata.api.modular.finance.service.IOrderItemService;
import com.vikadata.api.modular.finance.service.IOrderMetadataService;
import com.vikadata.api.modular.finance.service.IOrderMigrateService;
import com.vikadata.api.modular.finance.service.IOrderPaymentService;
import com.vikadata.api.modular.finance.service.IOrderV2Service;
import com.vikadata.api.modular.finance.service.ISubscriptionService;
import com.vikadata.api.util.billing.BillingConfigManager;
import com.vikadata.api.util.billing.OrderUtil;
import com.vikadata.api.util.billing.model.ProductEnum;
import com.vikadata.clock.ClockUtil;
import com.vikadata.entity.BundleEntity;
import com.vikadata.entity.EconomicOrderEntity;
import com.vikadata.entity.EconomicOrderPaymentEntity;
import com.vikadata.entity.OrderEntity;
import com.vikadata.entity.OrderItemEntity;
import com.vikadata.entity.OrderMetadataEntity;
import com.vikadata.entity.OrderPaymentEntity;
import com.vikadata.entity.SubscriptionEntity;
import com.vikadata.integration.vika.VikaTemplate;
import com.vikadata.system.config.billing.Plan;
import com.vikadata.system.config.billing.Price;
import com.vikadata.system.config.billing.Product;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import static com.vikadata.api.constants.TimeZoneConstants.DEFAULT_TIME_ZONE;
import static com.vikadata.api.util.billing.OrderUtil.yuanToCents;
import static java.util.stream.Collectors.groupingBy;

@Service
@Slf4j
public class OrderMigrateServiceImpl implements IOrderMigrateService {

    @Resource
    private EconomicOrderMapper economicOrderMapper;

    @Resource
    private EconomicOrderPaymentMapper economicOrderPaymentMapper;

    @Resource
    private IOrderV2Service iOrderV2Service;

    @Resource
    private IOrderItemService iOrderItemService;

    @Resource
    private IOrderMetadataService ioOrderMetadataService;

    @Resource
    private IOrderPaymentService iOrderPaymentService;

    @Resource
    private IBundleService iBundleService;

    @Resource
    private ISubscriptionService iSubscriptionService;

    @Autowired(required = false)
    private VikaTemplate vikaTemplate;

    private final Long systemUser = -1L;

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void migrateVikaOrder() {
        // 查询现有订单
        List<EconomicOrderEntity> allHistoryOrders = economicOrderMapper.selectAll();
        List<OrderEntity> orderEntities = new ArrayList<>();
        List<OrderItemEntity> orderItemEntities = new ArrayList<>();

        List<BundleEntity> bundleEntities = new ArrayList<>();
        List<SubscriptionEntity> subscriptionEntities = new ArrayList<>();

        Map<String, List<EconomicOrderEntity>> spaceOrderMap = allHistoryOrders.stream()
                .collect(groupingBy(EconomicOrderEntity::getSpaceId));

        Map<String, Price> spacePriceMap = new HashMap<>();

        List<String> migratedOrderIds = new ArrayList<>();

        for (Entry<String, List<EconomicOrderEntity>> entry : spaceOrderMap.entrySet()) {
            for (EconomicOrderEntity order : entry.getValue()) {
                boolean isMigrate = iOrderV2Service.getById(order.getId()) != null;
                if (isMigrate) {
                    migratedOrderIds.add(order.getOrderNo());
                    continue;
                }
                Price price = BillingConfigManager.getPriceBySeatAndMonths(ProductEnum.of(order.getProduct()), order.getSeat(), order.getMonth());
                spacePriceMap.put(order.getOrderNo(), price);
                Product product = BillingConfigManager.getBillingConfig().getProducts().get(price.getProduct());
                OrderStatus orderStatus = OrderStatus.of(order.getStatus());
                String subscriptionId = null;
                if (orderStatus == OrderStatus.FINISHED) {
                    BundleEntity bundleEntity = new BundleEntity();
                    bundleEntity.setSpaceId(order.getSpaceId());
                    bundleEntity.setBundleId(UUID.randomUUID().toString());
                    BundleState bundleState = LocalDate.now().isBefore(order.getExpireTime().toLocalDate()) ? BundleState.ACTIVATED : BundleState.EXPIRED;
                    bundleEntity.setState(bundleState.name());
                    bundleEntity.setStartDate(order.getPaidTime());
                    bundleEntity.setEndDate(order.getExpireTime());
                    bundleEntity.setCreatedBy(order.getCreatedBy());
                    bundleEntity.setCreatedAt(order.getCreatedAt());
                    bundleEntity.setUpdatedBy(order.getUpdatedBy());
                    bundleEntity.setUpdatedAt(order.getUpdatedAt());
                    bundleEntities.add(bundleEntity);

                    SubscriptionEntity subscriptionEntity = new SubscriptionEntity();
                    subscriptionEntity.setSpaceId(order.getSpaceId());
                    subscriptionEntity.setBundleId(bundleEntity.getBundleId());
                    subscriptionId = UUID.randomUUID().toString();
                    subscriptionEntity.setSubscriptionId(subscriptionId);
                    subscriptionEntity.setProductName(order.getProduct());
                    subscriptionEntity.setProductCategory(product.getCategory());
                    subscriptionEntity.setPlanId(price.getPlanId());
                    SubscriptionState subscriptionState = LocalDate.now().isBefore(order.getExpireTime().toLocalDate()) ? SubscriptionState.ACTIVATED : SubscriptionState.EXPIRED;
                    subscriptionEntity.setState(subscriptionState.name());
                    subscriptionEntity.setPhase(order.getOrderPhase());
                    subscriptionEntity.setBundleStartDate(order.getPaidTime());
                    subscriptionEntity.setStartDate(order.getPaidTime());
                    subscriptionEntity.setExpireDate(order.getExpireTime());
                    subscriptionEntity.setCreatedBy(order.getCreatedBy());
                    subscriptionEntity.setCreatedAt(order.getCreatedAt());
                    subscriptionEntity.setUpdatedBy(order.getUpdatedBy());
                    subscriptionEntity.setUpdatedAt(order.getUpdatedAt());
                    subscriptionEntities.add(subscriptionEntity);
                }

                OrderEntity orderEntity = new OrderEntity();
                orderEntity.setId(order.getId());
                orderEntity.setSpaceId(order.getSpaceId());
                orderEntity.setOrderId(order.getOrderNo());
                orderEntity.setOrderChannel(order.getOrderChannel());
                orderEntity.setOrderType(OrderType.ofType(order.getType()).name());
                orderEntity.setCurrency(order.getCurrency());
                orderEntity.setOriginalAmount(order.getAmount());
                orderEntity.setDiscountAmount(order.getCouponAmount());
                orderEntity.setAmount(order.getActualAmount());
                orderEntity.setState(order.getStatus());
                orderEntity.setCreatedTime(order.getCreatedTime());
                orderEntity.setCreatedTime(order.getCreatedTime());
                orderEntity.setIsPaid(order.getIsPaid());
                orderEntity.setPaidTime(order.getPaidTime());
                orderEntity.setIsDeleted(order.getIsDeleted());
                orderEntity.setCreatedBy(order.getCreatedBy());
                orderEntity.setCreatedAt(order.getCreatedAt());
                orderEntity.setUpdatedBy(order.getUpdatedBy());
                orderEntity.setUpdatedAt(order.getUpdatedAt());
                orderEntities.add(orderEntity);

                OrderItemEntity orderItemEntity = new OrderItemEntity();
                orderItemEntity.setSpaceId(order.getSpaceId());
                orderItemEntity.setOrderId(order.getOrderNo());
                orderItemEntity.setProductName(order.getProduct());
                orderItemEntity.setProductCategory(product.getCategory());
                orderItemEntity.setPlanId(price.getPlanId());
                orderItemEntity.setSeat(order.getSeat());
                orderItemEntity.setMonths(order.getMonth());
                orderItemEntity.setSubscriptionId(subscriptionId);
                orderItemEntity.setStartDate(order.getPaidTime());
                orderItemEntity.setEndDate(order.getExpireTime());
                orderItemEntity.setCurrency(order.getCurrency());
                orderItemEntity.setAmount(order.getActualAmount());
                orderItemEntity.setIsDeleted(order.getIsDeleted());
                orderItemEntity.setCreatedBy(order.getCreatedBy());
                orderItemEntity.setCreatedAt(order.getCreatedAt());
                orderItemEntity.setUpdatedBy(order.getUpdatedBy());
                orderItemEntity.setUpdatedAt(order.getUpdatedAt());
                orderItemEntities.add(orderItemEntity);
            }
        }

        List<OrderPaymentEntity> orderPaymentEntities = new ArrayList<>();
        List<EconomicOrderPaymentEntity> allHistoryPayments = economicOrderPaymentMapper.selectList(null);
        for (EconomicOrderPaymentEntity orderPayment : allHistoryPayments) {
            if (migratedOrderIds.contains(orderPayment.getOrderNo())) {
                continue;
            }
            OrderPaymentEntity orderPaymentEntity = new OrderPaymentEntity();
            orderPaymentEntity.setId(orderPayment.getId());
            orderPaymentEntity.setOrderId(orderPayment.getOrderNo());
            orderPaymentEntity.setPaymentTransactionId(orderPayment.getPaymentTransactionNo());
            orderPaymentEntity.setCurrency(orderPayment.getCurrency());
            orderPaymentEntity.setAmount(orderPayment.getAmount());
            orderPaymentEntity.setSubject(spacePriceMap.get(orderPayment.getOrderNo()).getGoodChTitle());
            orderPaymentEntity.setPayChannel(orderPayment.getPayChannel());
            orderPaymentEntity.setPayChannelTransactionId(orderPayment.getPayChannelTransactionId());
            orderPaymentEntity.setPaidTime(orderPayment.getPaymentDate());
            orderPaymentEntity.setPaymentSuccess(orderPayment.getPaymentSuccess());
            orderPaymentEntity.setIsDeleted(orderPayment.getIsDeleted());
            orderPaymentEntity.setCreatedBy(orderPayment.getCreatedBy());
            orderPaymentEntity.setCreatedAt(orderPayment.getCreatedAt());
            orderPaymentEntity.setUpdatedBy(orderPayment.getUpdatedBy());
            orderPaymentEntity.setUpdatedAt(orderPayment.getUpdatedAt());

            orderPaymentEntities.add(orderPaymentEntity);
        }

        iOrderV2Service.saveBatch(orderEntities);
        iOrderItemService.saveBatch(orderItemEntities);
        iOrderPaymentService.saveBatch(orderPaymentEntities);
        iBundleService.createBatch(bundleEntities);
        iSubscriptionService.createBatch(subscriptionEntities);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void migrateBusinessOrder() throws JsonProcessingException {
        // 分页查询客户订单
        List<Map<String, Object>> orders = vikaTemplate.fetchCustomerOrder("https://vika.cn",
                "uskkpOaoA8rVQ5uVuCYMSky", "dstK19iRDHJXbcdGH2", "{migrated}=FALSE()");
        log.info("未迁移的客户订单总数：{}", orders.size());
        if (orders.isEmpty()) {
            return;
        }
        ObjectMapper mapper = new ObjectMapper();
        mapper.setPropertyNamingStrategy(PropertyNamingStrategies.SNAKE_CASE);
        mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
        List<CustomerOrder> customerOrders = mapper.readValue(JSONUtil.toJsonStr(orders), new TypeReference<List<CustomerOrder>>() {});

        List<OrderEntity> orderEntities = new ArrayList<>();
        List<OrderMetadataEntity> orderMetadataEntities = new ArrayList<>();
        List<OrderItemEntity> orderItemEntities = new ArrayList<>();
        List<BundleEntity> bundleEntities = new ArrayList<>();
        List<SubscriptionEntity> subscriptionEntities = new ArrayList<>();

        Map<String, List<CustomerOrder>> spaceOrderMap = customerOrders.stream()
                .collect(groupingBy(CustomerOrder::getSpaceId));

        LocalDate now = LocalDate.now();
        for (Entry<String, List<CustomerOrder>> entry : spaceOrderMap.entrySet()) {
            for (CustomerOrder order : entry.getValue()) {
                if (order.isNoNeed()) {
                    continue;
                }
                if (StrUtil.isNotBlank(order.getType()) && "续费".equals(order.getType())) {
                    continue;
                }
                ProductEnum productEnum = convertProduct(order.getBillingProduct());
                if (order.getBillingSeat() == null) {
                    continue;
                }
                log.info("产品:{}, 席位:{}", productEnum.name(), order.getBillingSeat());
                Plan plan = BillingConfigManager.getPlan(productEnum, order.getBillingSeat());
                Product product = BillingConfigManager.getBillingConfig().getProducts().get(plan.getProduct());
                LocalDateTime createdTime = ClockUtil.milliToLocalDateTime(order.getCreatedTime(), DEFAULT_TIME_ZONE);
                LocalDate startDate = ClockUtil.milliToLocalDate(order.getStartDate(), DEFAULT_TIME_ZONE);
                LocalDate expireDate = startDate.plusMonths(order.getBillingDuration());
                boolean isExpire = now.isAfter(expireDate);

                BundleEntity bundleEntity = new BundleEntity();
                bundleEntity.setSpaceId(order.getSpaceId());
                bundleEntity.setBundleId(UUID.randomUUID().toString());
                BundleState bundleState = !isExpire ? BundleState.ACTIVATED : BundleState.EXPIRED;
                if (order.isFocusExpired()) {
                    bundleState = BundleState.EXPIRED;
                }
                bundleEntity.setState(bundleState.name());
                bundleEntity.setStartDate(startDate.atStartOfDay());
                bundleEntity.setEndDate(expireDate.atStartOfDay());
                bundleEntity.setCreatedBy(systemUser);
                bundleEntity.setCreatedAt(createdTime);
                bundleEntity.setUpdatedBy(systemUser);
                bundleEntity.setUpdatedAt(createdTime);
                bundleEntities.add(bundleEntity);

                SubscriptionEntity subscriptionEntity = new SubscriptionEntity();
                subscriptionEntity.setSpaceId(order.getSpaceId());
                subscriptionEntity.setBundleId(bundleEntity.getBundleId());
                subscriptionEntity.setSubscriptionId(UUID.randomUUID().toString());
                subscriptionEntity.setProductName(plan.getProduct());
                subscriptionEntity.setProductCategory(product.getCategory());
                subscriptionEntity.setPlanId(plan.getId());
                SubscriptionState subscriptionState = !isExpire ? SubscriptionState.ACTIVATED : SubscriptionState.EXPIRED;
                if (order.isFocusExpired()) {
                    subscriptionState = SubscriptionState.EXPIRED;
                }
                subscriptionEntity.setState(subscriptionState.name());
                // TODO 阶段类型(试用/固定)
                subscriptionEntity.setPhase(OrderPhase.FIXEDTERM.getName());
                subscriptionEntity.setBundleStartDate(startDate.atStartOfDay());
                subscriptionEntity.setStartDate(startDate.atStartOfDay());
                subscriptionEntity.setExpireDate(expireDate.atStartOfDay());
                subscriptionEntity.setCreatedBy(systemUser);
                subscriptionEntity.setCreatedAt(createdTime);
                subscriptionEntity.setUpdatedBy(systemUser);
                subscriptionEntity.setUpdatedAt(createdTime);
                subscriptionEntities.add(subscriptionEntity);

                ThreadUtil.safeSleep(10);

                OrderEntity orderEntity = new OrderEntity();
                orderEntity.setSpaceId(order.getSpaceId());
                orderEntity.setOrderId(OrderUtil.createOrderId());
                orderEntity.setOrderChannel(OrderChannel.OFFLINE.getName());
                // TODO 订单类型
                orderEntity.setOrderType(OrderType.BUY.name());
                orderEntity.setCurrency(Currency.CNY.name());
                orderEntity.setOriginalAmount(yuanToCents(order.getContractPrice()));
                orderEntity.setDiscountAmount(0);
                orderEntity.setAmount(yuanToCents(order.getContractPrice()));
                orderEntity.setState(OrderStatus.FINISHED.getName());
                orderEntity.setCreatedTime(createdTime);
                orderEntity.setIsPaid(true);
                orderEntity.setPaidTime(createdTime);
                orderEntity.setIsDeleted(false);
                orderEntity.setCreatedBy(systemUser);
                orderEntity.setCreatedAt(createdTime);
                orderEntity.setUpdatedBy(systemUser);
                orderEntity.setUpdatedAt(createdTime);
                orderEntities.add(orderEntity);

                OrderItemEntity orderItemEntity = new OrderItemEntity();
                orderItemEntity.setSpaceId(order.getSpaceId());
                orderItemEntity.setOrderId(orderEntity.getOrderId());
                orderItemEntity.setProductName(plan.getProduct());
                orderItemEntity.setProductCategory(product.getCategory());
                orderItemEntity.setPlanId(plan.getId());
                orderItemEntity.setSeat(order.getBillingSeat());
                orderItemEntity.setMonths(order.getBillingDuration());
                orderItemEntity.setSubscriptionId(subscriptionEntity.getSubscriptionId());
                orderItemEntity.setStartDate(startDate.atStartOfDay());
                orderItemEntity.setEndDate(expireDate.atStartOfDay());
                orderItemEntity.setCurrency(Currency.CNY.name());
                orderItemEntity.setAmount(yuanToCents(order.getContractPrice()));
                orderItemEntity.setIsDeleted(false);
                orderItemEntity.setCreatedBy(systemUser);
                orderItemEntity.setCreatedAt(createdTime);
                orderItemEntity.setUpdatedBy(systemUser);
                orderItemEntity.setUpdatedAt(createdTime);
                orderItemEntities.add(orderItemEntity);

                OrderMetadataEntity orderMetadataEntity = new OrderMetadataEntity();
                orderMetadataEntity.setOrderId(orderEntity.getOrderId());
                orderMetadataEntity.setOrderChannel(OrderChannel.OFFLINE.getName());
                orderMetadataEntity.setMetadata(mapper.writeValueAsString(order));
                orderMetadataEntity.setCreatedAt(createdTime);
                orderMetadataEntity.setUpdatedAt(createdTime);
                orderMetadataEntities.add(orderMetadataEntity);
            }
        }

        iOrderV2Service.saveBatch(orderEntities);
        iOrderItemService.saveBatch(orderItemEntities);
        ioOrderMetadataService.saveBatch(orderMetadataEntities);
        iBundleService.createBatch(bundleEntities);
        iSubscriptionService.createBatch(subscriptionEntities);
    }

    private ProductEnum convertProduct(String productName) {
        if ("白银级".equals(productName)) {
            return ProductEnum.SILVER;
        }
        else if ("企业级".equals(productName)) {
            return ProductEnum.ENTERPRISE;
        }
        else if ("企微标准版".equals(productName)) {
            return ProductEnum.WECOM_STANDARD;
        }
        else {
            throw new RuntimeException("产品类型无法识别");
        }
    }
}
