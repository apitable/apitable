package com.vikadata.api.modular.social.service.impl;

import java.util.Optional;

import cn.hutool.json.JSONUtil;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import me.chanjar.weixin.common.error.WxErrorException;

import com.vikadata.api.modular.social.mapper.SocialOrderWeComMapper;
import com.vikadata.api.modular.social.service.ISocialOrderWeComService;
import com.vikadata.core.util.DateTimeUtil;
import com.vikadata.entity.SocialOrderWecomEntity;
import com.vikadata.social.wecom.WeComTemplate;
import com.vikadata.social.wecom.WxCpIsvServiceImpl;
import com.vikadata.social.wecom.model.WxCpIsvGetOrder;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 * <p>
 * 第三方平台集成 - 企业微信第三方服务商应用付费订单信息
 * </p>
 * @author 刘斌华
 * @date 2022-04-26 15:10:30
 */
@Service
public class SocialOrderWeComServiceImpl extends ServiceImpl<SocialOrderWeComMapper, SocialOrderWecomEntity>
        implements ISocialOrderWeComService {

    @Autowired(required = false)
    private WeComTemplate weComTemplate;

    @Override
    public SocialOrderWecomEntity createOrder(String suiteId, String orderId) throws WxErrorException {
        SocialOrderWecomEntity socialOrderWeComEntity = new SocialOrderWecomEntity();
        copyWeComOrder(suiteId, orderId, socialOrderWeComEntity);

        save(socialOrderWeComEntity);

        return socialOrderWeComEntity;
    }

    @Override
    public SocialOrderWecomEntity refreshOrder(String suiteId, String orderId) throws WxErrorException {
        SocialOrderWecomEntity socialOrderWeComEntity = getBaseMapper().selectByOrderId(orderId);
        copyWeComOrder(suiteId, orderId, socialOrderWeComEntity);

        updateById(socialOrderWeComEntity);

        return socialOrderWeComEntity;
    }

    @Override
    public SocialOrderWecomEntity getFirstPaidOrder(String suiteId, String paidCorpId) {
        return getBaseMapper().selectFirstPaidOrder(suiteId, paidCorpId);
    }

    @Override
    public SocialOrderWecomEntity getLastPaidOrder(String suiteId, String paidCorpId) {
        return getBaseMapper().selectLastPaidOrder(suiteId, paidCorpId);
    }

    private void copyWeComOrder(String suiteId, String orderId, SocialOrderWecomEntity orderWeComEntity) throws WxErrorException {
        // 获取企业微信的原始订单信息
        WxCpIsvServiceImpl wxCpIsvService = (WxCpIsvServiceImpl) weComTemplate.isvService(suiteId);
        WxCpIsvGetOrder wxCpIsvGetOrder = wxCpIsvService.getOrder(orderId);
        // 复制企微订单的信息
        orderWeComEntity.setOrderId(wxCpIsvGetOrder.getOrderId());
        orderWeComEntity.setOrderStatus(wxCpIsvGetOrder.getOrderStatus());
        orderWeComEntity.setOrderType(wxCpIsvGetOrder.getOrderType());
        orderWeComEntity.setPaidCorpId(wxCpIsvGetOrder.getPaidCorpId());
        orderWeComEntity.setOperatorId(wxCpIsvGetOrder.getOperatorId());
        orderWeComEntity.setSuiteId(wxCpIsvGetOrder.getSuiteId());
        orderWeComEntity.setEditionId(wxCpIsvGetOrder.getEditionId());
        orderWeComEntity.setPrice(wxCpIsvGetOrder.getPrice());
        orderWeComEntity.setUserCount(wxCpIsvGetOrder.getUserCount());
        orderWeComEntity.setOrderPeriod(wxCpIsvGetOrder.getOrderPeriod());
        orderWeComEntity.setOrderTime(DateTimeUtil.localDateTimeFromSeconds(wxCpIsvGetOrder.getOrderTime(), 8));
        orderWeComEntity.setPaidTime(DateTimeUtil.localDateTimeFromSeconds(wxCpIsvGetOrder.getPaidTime(), 8));
        orderWeComEntity.setBeginTime(DateTimeUtil.localDateTimeFromSeconds(wxCpIsvGetOrder.getBeginTime(), 8));
        orderWeComEntity.setEndTime(DateTimeUtil.localDateTimeFromSeconds(wxCpIsvGetOrder.getEndTime(), 8));
        orderWeComEntity.setOrderFrom(wxCpIsvGetOrder.getOrderFrom());
        orderWeComEntity.setOperatorCorpId(wxCpIsvGetOrder.getOperatorCorpId());
        orderWeComEntity.setServiceShareAmount(wxCpIsvGetOrder.getServiceShareAmount());
        orderWeComEntity.setPlatformShareAmount(wxCpIsvGetOrder.getPlatformShareAmount());
        orderWeComEntity.setDealerShareAmount(wxCpIsvGetOrder.getDealerShareAmount());
        orderWeComEntity.setDealerCorpId(Optional.ofNullable(wxCpIsvGetOrder.getDealerCorpInfo())
                .map(WxCpIsvGetOrder.DealerCorpInfo::getCorpId)
                .orElse(null));
        // 去除无用字段
        wxCpIsvGetOrder.setErrcode(null);
        wxCpIsvGetOrder.setErrmsg(null);
        orderWeComEntity.setOrderInfo(JSONUtil.toJsonStr(wxCpIsvGetOrder));
    }

}
