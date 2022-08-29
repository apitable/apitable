package com.vikadata.api.modular.finance.service.impl;

import java.util.List;

import cn.hutool.json.JSONUtil;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import lombok.extern.slf4j.Slf4j;

import com.vikadata.api.modular.finance.mapper.SocialDingTalkOrderMapper;
import com.vikadata.api.modular.finance.service.ISocialDingTalkOrderService;
import com.vikadata.entity.SocialDingtalkOrderEntity;
import com.vikadata.social.dingtalk.event.order.SyncHttpMarketOrderEvent;

import org.springframework.stereotype.Service;

@Service
@Slf4j
public class SocialDingTalkOrderServiceImpl extends ServiceImpl<SocialDingTalkOrderMapper,
        SocialDingtalkOrderEntity> implements ISocialDingTalkOrderService {

    @Override
    public Integer getStatusByOrderId(String tenantId, String appId, String orderId) {
        return baseMapper.selectStatusByOrderId(orderId, tenantId, appId);
    }

    @Override
    public void createOrder(SyncHttpMarketOrderEvent event) {
        SocialDingtalkOrderEntity entity = SocialDingtalkOrderEntity.builder()
                .tenantId(event.getCorpId())
                .orderId(event.getOrderId())
                .appId(event.getSuiteId())
                .itemCode(event.getItemCode())
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

    @Override
    public List<String> getOrderIdsByTenantIdAndAppIdAndItemCode(String tenantId, String appId, String itemCode) {
        return baseMapper.selectOrderIdByTenantIdAndAppIdAndItemCode(tenantId, appId, itemCode);
    }
}
