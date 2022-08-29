package com.vikadata.api.modular.eco.mapper;

import java.util.List;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Param;

import com.vikadata.entity.EconomicOrderEntity;

/**
 * 经济模块-订单表 实现
 * @author Shawn Deng
 * @date 2021-11-01 10:23:46
 */
public interface EconomicOrderMapper extends BaseMapper<EconomicOrderEntity> {

    /**
     * 根据订单号查询
     * @param orderNo 订单号
     * @return EconomicOrderEntity
     */
    EconomicOrderEntity selectByOrderNo(@Param("orderNo") String orderNo);

    /**
     * 根据空间ID查询
     * @param spaceId 空间ID
     * @return EconomicOrderEntity List
     */
    List<EconomicOrderEntity> selectBySpaceId(@Param("spaceId") String spaceId);

    /**
     * 查询渠道订单号是否存在
     *
     * @param spaceId 空间ID
     * @param channelOrderId 渠道订单号
     * @return Integer
     * @author zoe zheng
     * @date 2022/2/27 16:34
     */
    Integer selectCountBySpaceIdChannelOrderId(@Param("spaceId") String spaceId,
            @Param("channelOrderId") String channelOrderId);

    /**
     * 根据渠道订单号查询订单
     *
     * @param spaceId 空间ID
     * @param channelOrderId 渠道订单号
     * @return EconomicOrderEntity
     * @author zoe zheng
     * @date 2022/3/10 18:12
     */
    EconomicOrderEntity selectBySpaceIdChannelOrderId(@Param("spaceId") String spaceId,
            @Param("channelOrderId") String channelOrderId);


    List<EconomicOrderEntity> selectAll();
}
