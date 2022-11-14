package com.vikadata.api.enterprise.social.service.impl;

import java.util.List;

import javax.annotation.Resource;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.baomidou.mybatisplus.extension.toolkit.SqlHelper;
import lombok.extern.slf4j.Slf4j;

import com.vikadata.api.enterprise.social.mapper.SocialTenantOrderMapper;
import com.vikadata.api.enterprise.social.enums.SocialPlatformType;
import com.vikadata.api.enterprise.social.service.ISocialTenantOrderService;
import com.vikadata.entity.SocialTenantOrderEntity;

import org.springframework.stereotype.Service;

/**
 * <p>
 * Third party platform integration - enterprise tenant order service interface implementation
 * </p>
 */
@Service
@Slf4j
public class SocialTenantOrderServiceImpl extends ServiceImpl<SocialTenantOrderMapper, SocialTenantOrderEntity> implements ISocialTenantOrderService {

    @Resource
    private SocialTenantOrderMapper socialTenantOrderMapper;


    @Override
    public Boolean tenantOrderExisted(String channelOrderId, String tenantId, String appId, SocialPlatformType platformType) {
        return SqlHelper.retBool(socialTenantOrderMapper.selectCountByChannelOrderId(channelOrderId, tenantId, appId,
                platformType));
    }

    @Override
    public Boolean createTenantOrder(String orderId, String tenantId, String appId, SocialPlatformType platformType, String orderData) {
        SocialTenantOrderEntity entity = new SocialTenantOrderEntity();
        entity.setChannelOrderId(orderId);
        entity.setTenantId(tenantId);
        entity.setAppId(appId);
        entity.setPlatform(platformType.getValue());
        entity.setOrderData(orderData);
        return SqlHelper.retBool(socialTenantOrderMapper.insert(entity));
    }

    @Override
    public List<String> getOrderDataByTenantIdAndAppId(String tenantId, String appId, SocialPlatformType platformType) {
        return socialTenantOrderMapper.selectOrderDataByTenantIdAndAppId(tenantId, appId, platformType);
    }
}
