package com.vikadata.api.modular.eco.service;

import java.util.List;

import com.baomidou.mybatisplus.extension.service.IService;

import com.vikadata.entity.EconomicOrderEntity;

/**
 *
 * @author Shawn Deng
 * @date 2021-11-01 10:28:13
 */
@Deprecated
public interface IEconomicOrderService extends IService<EconomicOrderEntity> {

    /**
     * 根据订单号查询
     * @param orderNo 订单号
     * @return EconomicOrderEntity
     */
    EconomicOrderEntity getByOrderNo(String orderNo);

    /**
     * 根据空间ID获取
     * @param spaceId 空间ID
     * @return EconomicOrderEntity
     */
    List<EconomicOrderEntity> getBySpaceId(String spaceId);

    /**
     * 获取空间的活跃中的订单
     * @param spaceId 空间ID
     * @return EconomicOrderEntity
     */
    EconomicOrderEntity getActiveOrderBySpaceId(String spaceId);

    /**
     * 检查第三方订单是否存在
     *
     * @param spaceId 空间ID
     * @param channelOrderNo 渠道订单号
     * @return Boolean
     * @author zoe zheng
     * @date 2022/2/27 16:32
     */
    Boolean orderExistedBySpaceIdAndChannelOrderId(String spaceId, String channelOrderNo);

    /**
     * 根据渠道订单号，获取订单信息
     *
     * @param spaceId 空间ID
     * @param channelOrderId 渠道订单号
     * @return EconomicOrderEntity
     * @author zoe zheng
     * @date 2022/3/10 18:10
     */
    EconomicOrderEntity getBySpaceIdAndChannelOrderId(String spaceId, String channelOrderId);
}
