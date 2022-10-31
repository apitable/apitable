package com.vikadata.api.modular.social.service.impl;

import java.util.List;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;

import com.vikadata.api.modular.social.mapper.SocialWecomPermitOrderAccountBindMapper;
import com.vikadata.api.modular.social.service.IsocialWecomPermitOrderAccountBindService;
import com.vikadata.entity.SocialWecomPermitOrderAccountBindEntity;

import org.springframework.stereotype.Service;

/**
 * <p>
 * WeCom service provider interface license account binding information
 * </p>
 */
@Service
public class SocialWecomPermitOrderAccountBindServiceImpl extends ServiceImpl<SocialWecomPermitOrderAccountBindMapper, SocialWecomPermitOrderAccountBindEntity> implements IsocialWecomPermitOrderAccountBindService {

    @Override
    public List<String> getActiveCodesByOrderId(String orderId) {
        return getBaseMapper().selectActiveCodesByOrderId(orderId);
    }

    @Override
    public int getCountByOrderId(String orderId) {
        return getBaseMapper().selectCountByOrderId(orderId);
    }

}
