package com.vikadata.api.enterprise.social.service.impl;

import java.util.List;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;

import com.vikadata.api.enterprise.social.mapper.SocialWecomPermitOrderMapper;
import com.vikadata.api.enterprise.social.service.ISocialWecomPermitOrderService;
import com.vikadata.entity.SocialWecomPermitOrderEntity;

import org.springframework.stereotype.Service;

/**
 * <p>
 * WeCom Service Provider Interface License Ordering Information
 * </p>
 */
@Service
public class SocialWecomPermitOrderServiceImpl extends ServiceImpl<SocialWecomPermitOrderMapper, SocialWecomPermitOrderEntity> implements ISocialWecomPermitOrderService {

    @Override
    public SocialWecomPermitOrderEntity getByOrderId(String orderId) {
        return getBaseMapper().selectByOrderId(orderId);
    }

    @Override
    public List<SocialWecomPermitOrderEntity> getByOrderStatuses(String suiteId, String authCorpId, List<Integer> orderStatuses) {
        return getBaseMapper().selectByOrderStatuses(suiteId, authCorpId, orderStatuses);
    }

}
