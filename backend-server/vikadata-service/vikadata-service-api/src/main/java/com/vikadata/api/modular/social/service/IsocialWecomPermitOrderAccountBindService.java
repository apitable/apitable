package com.vikadata.api.modular.social.service;

import java.util.List;

import com.baomidou.mybatisplus.extension.service.IService;

import com.vikadata.entity.SocialWecomPermitOrderAccountBindEntity;

/**
 * <p>
 * 企微服务商接口许可账号绑定信息
 * </p>
 * @author 刘斌华
 * @date 2022-07-01 10:38:12
 */
public interface IsocialWecomPermitOrderAccountBindService extends IService<SocialWecomPermitOrderAccountBindEntity> {

    /**
     * 查询激活码
     *
     * @param orderId 接口许可订单号
     * @return 激活码列表
     * @author 刘斌华
     * @date 2022-07-01 15:08:07
     */
    List<String> getActiveCodesByOrderId(String orderId);

    /**
     * 获取接口许可订单中的账号数量
     *
     * @param orderId 接口许可订单号
     * @return 账号数量
     * @author 刘斌华
     * @date 2022-06-28 10:30:00
     */
    int getCountByOrderId(String orderId);

}
