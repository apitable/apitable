package com.vikadata.api.modular.finance.service.impl;

import cn.hutool.json.JSONUtil;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import lombok.extern.slf4j.Slf4j;

import com.vikadata.api.modular.finance.mapper.SocialDingTalkRefundMapper;
import com.vikadata.api.modular.finance.service.ISocialDingTalkRefundService;
import com.vikadata.entity.SocialDingtalkRefundEntity;
import com.vikadata.social.dingtalk.event.order.SyncHttpMarketServiceCloseEvent;

import org.springframework.stereotype.Service;

@Service
@Slf4j
public class SocialDingTalkRefundServiceImpl extends ServiceImpl<SocialDingTalkRefundMapper,
        SocialDingtalkRefundEntity> implements ISocialDingTalkRefundService {

    @Override
    public Integer getStatusByOrderId(String tenantId, String appId, String orderId) {
        return baseMapper.selectStatusByOrderId(orderId, tenantId, appId);
    }

    @Override
    public void createRefund(SyncHttpMarketServiceCloseEvent event) {
        SocialDingtalkRefundEntity entity = SocialDingtalkRefundEntity.builder()
                .tenantId(event.getCorpId())
                .orderId(event.getOrderId())
                .appId(event.getSuiteId())
                .itemCode(event.getItemCode())
                .refundData(JSONUtil.toJsonStr(event))
                .createdBy(-1L)
                .updatedBy(-1L)
                .build();
        baseMapper.insert(entity);
    }

    @Override
    public void updateTenantRefundStatusByOrderId(String tenantId, String appId, String orderId, Integer status) {
        baseMapper.updateStatusByTenantIdAndAppIdAndOrderId(tenantId, appId, orderId, 1);
    }
}
