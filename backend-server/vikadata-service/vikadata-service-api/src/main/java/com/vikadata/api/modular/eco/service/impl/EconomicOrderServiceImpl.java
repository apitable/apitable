package com.vikadata.api.modular.eco.service.impl;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;

import javax.annotation.Resource;

import cn.hutool.core.util.BooleanUtil;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.baomidou.mybatisplus.extension.toolkit.SqlHelper;
import lombok.extern.slf4j.Slf4j;

import com.vikadata.api.enums.finance.OrderChannel;
import com.vikadata.api.enums.finance.OrderStatus;
import com.vikadata.api.modular.eco.mapper.EconomicOrderMapper;
import com.vikadata.api.modular.eco.service.IEconomicOrderService;
import com.vikadata.entity.EconomicOrderEntity;

import org.springframework.stereotype.Service;

/**
 * 订单表
 * @author Shawn Deng
 * @date 2021-11-01 10:28:33
 */
@Service
@Slf4j
@Deprecated
public class EconomicOrderServiceImpl extends ServiceImpl<EconomicOrderMapper, EconomicOrderEntity> implements IEconomicOrderService {

    @Override
    public EconomicOrderEntity getByOrderNo(String orderNo) {
        return baseMapper.selectByOrderNo(orderNo);
    }

    @Override
    public List<EconomicOrderEntity> getBySpaceId(String spaceId) {
        return baseMapper.selectBySpaceId(spaceId);
    }

    @Override
    public EconomicOrderEntity getActiveOrderBySpaceId(String spaceId) {
        List<EconomicOrderEntity> orderEntities = getBySpaceId(spaceId);
        return orderEntities.stream()
                .filter(order -> {
                    // 企微可以无限期试用，即过期时间为空
                    boolean isExpired = Objects.nonNull(order.getExpireTime()) && LocalDateTime.now().isAfter(order.getExpireTime());
                    boolean result = BooleanUtil.isTrue(order.getIsPaid()) && !isExpired;
                    // 其他渠道的订单判断是否已经失效
                    if (!order.getOrderChannel().equals(OrderChannel.VIKA.getName())) {
                        return result && !order.getStatus().equals(OrderStatus.CANCELED.getName());
                    }
                    return result;
                })
                .findFirst().orElse(null);
    }

    @Override
    public Boolean orderExistedBySpaceIdAndChannelOrderId(String spaceId, String channelOrderId) {
        return SqlHelper.retBool(baseMapper.selectCountBySpaceIdChannelOrderId(spaceId, channelOrderId));
    }

    @Override
    public EconomicOrderEntity getBySpaceIdAndChannelOrderId(String spaceId, String channelOrderId) {
        return baseMapper.selectBySpaceIdChannelOrderId(spaceId, channelOrderId);
    }
}
