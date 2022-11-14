package com.vikadata.api.enterprise.billing.service.impl;

import java.util.List;

import cn.hutool.json.JSONUtil;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import lombok.extern.slf4j.Slf4j;

import com.vikadata.api.enterprise.billing.mapper.SocialFeishuOrderMapper;
import com.vikadata.api.enterprise.billing.service.ISocialFeishuOrderService;
import com.vikadata.entity.SocialFeishuOrderEntity;
import com.vikadata.social.feishu.event.app.OrderPaidEvent;

import org.springframework.stereotype.Service;

@Service
@Slf4j
public class SocialFeishuOrderServiceImpl extends ServiceImpl<SocialFeishuOrderMapper, SocialFeishuOrderEntity> implements ISocialFeishuOrderService {

    @Override
    public Integer getStatusByOrderId(String tenantId, String appId, String orderId) {
        return baseMapper.selectStatusByOrderId(orderId, tenantId, appId);
    }

    @Override
    public void createOrder(OrderPaidEvent event) {
        SocialFeishuOrderEntity entity = SocialFeishuOrderEntity.builder()
                .tenantId(event.getTenantKey())
                .orderId(event.getOrderId())
                .appId(event.getAppId())
                .orderData(JSONUtil.toJsonStr(event))
                .createdBy(-1L)
                .updatedBy(-1L)
                .build();
        baseMapper.insert(entity);
    }

    @Override
    public void updateTenantOrderStatusByOrderId(String tenantId, String appId, String orderId, Integer status) {
        baseMapper.updateStatusByTenantIdAndAppIdAndOrderId(tenantId, appId, orderId, 1);
    }

    @Override
    public List<String> getOrdersByTenantIdAndAppId(String tenantId, String appId) {
        return baseMapper.selectOrderDataByTenantIdAndAppId(tenantId, appId);
    }
}
