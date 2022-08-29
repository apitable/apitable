package com.vikadata.api.modular.social.service;

import java.util.List;

import com.baomidou.mybatisplus.extension.service.IService;

import com.vikadata.entity.SocialWecomPermitOrderEntity;

/**
 * <p>
 * 企微服务商接口许可下单信息
 * </p>
 * @author 刘斌华
 * @date 2022-06-23 18:33:40
 */
public interface ISocialWecomPermitOrderService extends IService<SocialWecomPermitOrderEntity> {

    /**
     * 根据订单号获取详情
     *
     * @param orderId 许可订单号
     * @return 订单详情
     * @author 刘斌华
     * @date 2022-06-27 17:55:42
     */
    SocialWecomPermitOrderEntity getByOrderId(String orderId);

    /**
     * 根据订单状态查询
     *
     * @param suiteId 应用套件 ID
     * @param authCorpId 授权的企业 ID
     * @param orderStatuses 查询的订单状态
     * @return 符合条件的订单列表
     * @author 刘斌华
     * @date 2022-07-29 18:45:00
     */
    List<SocialWecomPermitOrderEntity> getByOrderStatuses(String suiteId, String authCorpId, List<Integer> orderStatuses);

}
