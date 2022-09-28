package com.vikadata.api.modular.finance.service.impl;

import java.util.List;
import java.util.Optional;

import cn.hutool.json.JSONUtil;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;

import com.vikadata.api.modular.finance.mapper.SocialWecomOrderMapper;
import com.vikadata.api.modular.finance.service.ISocialWecomOrderService;
import com.vikadata.core.util.DateTimeUtil;
import com.vikadata.entity.SocialWecomOrderEntity;
import com.vikadata.social.wecom.event.order.WeComOrderPaidEvent;

import org.springframework.stereotype.Service;

/**
 * <p>
 * 订阅计费系统-企微商店渠道订单
 * </p>
 *
 * @author 刘斌华
 * @date 2022-08-18 18:43:27
 */
@Service
public class SocialWecomOrderServiceImpl extends ServiceImpl<SocialWecomOrderMapper, SocialWecomOrderEntity> implements ISocialWecomOrderService {

    @Override
    public SocialWecomOrderEntity createOrder(WeComOrderPaidEvent paidEvent) {
        // 复制数据
        SocialWecomOrderEntity orderEntity = new SocialWecomOrderEntity();
        orderEntity.setOrderId(paidEvent.getOrderId());
        orderEntity.setOrderStatus(paidEvent.getOrderStatus());
        orderEntity.setOrderType(paidEvent.getOrderType());
        orderEntity.setPaidCorpId(paidEvent.getPaidCorpId());
        orderEntity.setOperatorId(paidEvent.getOperatorId());
        orderEntity.setSuiteId(paidEvent.getSuiteId());
        orderEntity.setEditionId(paidEvent.getEditionId());
        orderEntity.setPrice(paidEvent.getPrice());
        orderEntity.setUserCount(paidEvent.getUserCount());
        orderEntity.setOrderPeriod(paidEvent.getOrderPeriod());
        orderEntity.setOrderTime(DateTimeUtil.localDateTimeFromSeconds(paidEvent.getOrderTime(), 8));
        orderEntity.setPaidTime(DateTimeUtil.localDateTimeFromSeconds(paidEvent.getPaidTime(), 8));
        orderEntity.setBeginTime(DateTimeUtil.localDateTimeFromSeconds(paidEvent.getBeginTime(), 8));
        orderEntity.setEndTime(DateTimeUtil.localDateTimeFromSeconds(paidEvent.getEndTime(), 8));
        orderEntity.setOrderFrom(paidEvent.getOrderFrom());
        orderEntity.setOperatorCorpId(paidEvent.getOperatorCorpId());
        orderEntity.setServiceShareAmount(paidEvent.getServiceShareAmount());
        orderEntity.setPlatformShareAmount(paidEvent.getPlatformShareAmount());
        orderEntity.setDealerShareAmount(paidEvent.getDealerShareAmount());
        orderEntity.setDealerCorpId(Optional.ofNullable(paidEvent.getDealerCorpInfo())
                .map(WeComOrderPaidEvent.DealerCorpInfo::getCorpId)
                .orElse(null));
        orderEntity.setOrderInfo(JSONUtil.toJsonStr(paidEvent));
        orderEntity.setCreatedBy(-1L);
        orderEntity.setUpdatedBy(-1L);
        // 保存
        save(orderEntity);
        // 返回
        return orderEntity;
    }

    @Override
    public List<SocialWecomOrderEntity> getAllOrders(String suiteId, String paidCorpId, List<Integer> orderStatuses) {
        return getBaseMapper().selectAllOrders(suiteId, paidCorpId, orderStatuses);
    }

    @Override
    public SocialWecomOrderEntity getByOrderId(String orderId) {
        return getBaseMapper().selectByOrderId(orderId);
    }

    @Override
    public SocialWecomOrderEntity getFirstPaidOrder(String suiteId, String paidCorpId) {
        return getBaseMapper().selectFirstPaidOrder(suiteId, paidCorpId);
    }

    @Override
    public SocialWecomOrderEntity getLastPaidOrder(String suiteId, String paidCorpId) {
        return getBaseMapper().selectLastPaidOrder(suiteId, paidCorpId);
    }

}
