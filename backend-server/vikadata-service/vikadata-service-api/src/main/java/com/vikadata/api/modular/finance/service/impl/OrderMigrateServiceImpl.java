package com.vikadata.api.modular.finance.service.impl;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
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
import com.vikadata.api.modular.finance.model.CustomerOrder;
import com.vikadata.api.modular.finance.service.IBundleService;
import com.vikadata.api.modular.finance.service.IOrderItemService;
import com.vikadata.api.modular.finance.service.IOrderMetadataService;
import com.vikadata.api.modular.finance.service.IOrderMigrateService;
import com.vikadata.api.modular.finance.service.IOrderV2Service;
import com.vikadata.api.modular.finance.service.ISubscriptionService;
import com.vikadata.api.util.billing.BillingConfigManager;
import com.vikadata.api.util.billing.OrderUtil;
import com.vikadata.api.util.billing.model.ProductEnum;
import com.vikadata.clock.ClockUtil;
import com.vikadata.entity.BundleEntity;
import com.vikadata.entity.OrderEntity;
import com.vikadata.entity.OrderItemEntity;
import com.vikadata.entity.OrderMetadataEntity;
import com.vikadata.entity.SubscriptionEntity;
import com.vikadata.integration.vika.VikaTemplate;
import com.vikadata.system.config.billing.Plan;
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

    private final Long systemUser = -1L;

    @Resource
    private IOrderV2Service iOrderV2Service;

    @Resource
    private IOrderItemService iOrderItemService;

    @Resource
    private IOrderMetadataService ioOrderMetadataService;

    @Resource
    private IBundleService iBundleService;

    @Resource
    private ISubscriptionService iSubscriptionService;

    @Autowired(required = false)
    private VikaTemplate vikaTemplate;

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
