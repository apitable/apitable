package com.vikadata.api.modular.social.service.impl;

import java.util.List;

import javax.annotation.Resource;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.baomidou.mybatisplus.extension.toolkit.SqlHelper;
import lombok.extern.slf4j.Slf4j;

import com.vikadata.api.enums.social.SocialPlatformType;
import com.vikadata.api.modular.social.mapper.SocialTenantOrderMapper;
import com.vikadata.api.modular.social.service.ISocialTenantOrderService;
import com.vikadata.entity.SocialTenantOrderEntity;

import org.springframework.stereotype.Service;

/**
 * <p>
 * 第三方平台集成-企业租户订单 服务接口 实现
 * </p>
 * @author zoe zheng
 * @date 2022/2/28 18:50
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
