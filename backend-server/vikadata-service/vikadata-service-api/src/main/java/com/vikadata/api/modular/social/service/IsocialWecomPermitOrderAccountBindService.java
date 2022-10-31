package com.vikadata.api.modular.social.service;

import java.util.List;

import com.baomidou.mybatisplus.extension.service.IService;

import com.vikadata.entity.SocialWecomPermitOrderAccountBindEntity;

/**
 * <p>
 * WeCom service provider interface license account binding information
 * </p>
 */
public interface IsocialWecomPermitOrderAccountBindService extends IService<SocialWecomPermitOrderAccountBindEntity> {

    /**
     * Query activation code
     *
     * @param orderId Interface license order number
     * @return Activation code list
     */
    List<String> getActiveCodesByOrderId(String orderId);

    /**
     * Obtain the number of accounts in the interface license order
     *
     * @param orderId Interface license order number
     * @return Number of accounts
     */
    int getCountByOrderId(String orderId);

}
