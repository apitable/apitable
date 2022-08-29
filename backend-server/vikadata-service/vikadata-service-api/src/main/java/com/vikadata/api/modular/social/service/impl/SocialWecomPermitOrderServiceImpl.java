package com.vikadata.api.modular.social.service.impl;

import java.util.List;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;

import com.vikadata.api.modular.social.mapper.SocialWecomPermitOrderMapper;
import com.vikadata.api.modular.social.service.ISocialWecomPermitOrderService;
import com.vikadata.entity.SocialWecomPermitOrderEntity;

import org.springframework.stereotype.Service;

/**
 * <p>
 * 企微服务商接口许可下单信息
 * </p>
 * @author 刘斌华
 * @date 2022-06-23 18:34:44
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
