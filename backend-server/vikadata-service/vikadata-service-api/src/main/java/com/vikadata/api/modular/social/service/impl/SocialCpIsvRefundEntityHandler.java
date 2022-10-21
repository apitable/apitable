package com.vikadata.api.modular.social.service.impl;

import java.util.Objects;

import javax.annotation.Resource;

import cn.hutool.json.JSONUtil;
import me.chanjar.weixin.common.error.WxErrorException;

import com.vikadata.api.component.TaskManager;
import com.vikadata.api.enums.social.SocialPlatformType;
import com.vikadata.api.modular.finance.service.ISocialWecomOrderService;
import com.vikadata.api.modular.finance.strategy.SocialOrderStrategyFactory;
import com.vikadata.api.modular.social.service.ISocialCpIsvEntityHandler;
import com.vikadata.api.modular.social.service.ISocialCpIsvMessageService;
import com.vikadata.api.modular.social.service.ISocialCpIsvPermitService;
import com.vikadata.core.util.DateTimeUtil;
import com.vikadata.entity.SocialCpIsvMessageEntity;
import com.vikadata.entity.SocialWecomOrderEntity;
import com.vikadata.social.wecom.WeComTemplate;
import com.vikadata.social.wecom.WxCpIsvServiceImpl;
import com.vikadata.social.wecom.constants.WeComIsvMessageType;
import com.vikadata.social.wecom.event.order.WeComOrderRefundEvent;
import com.vikadata.social.wecom.model.WxCpIsvGetOrder;
import com.vikadata.social.wecom.model.WxCpIsvXmlMessage;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * <p>
 * 第三方平台集成 - 企业微信第三方服务商应用退款处理
 * </p>
 *
 * @author 刘斌华
 * @date 2022-04-25 10:13:31
 */
@Service
public class SocialCpIsvRefundEntityHandler implements ISocialCpIsvEntityHandler {

    @Autowired(required = false)
    private WeComTemplate weComTemplate;

    @Resource
    private ISocialCpIsvMessageService socialCpIsvMessageService;

    @Resource
    private ISocialCpIsvPermitService socialCpIsvPermitService;

    @Resource
    private ISocialWecomOrderService socialWecomOrderService;

    @Override
    public WeComIsvMessageType type() {
        return WeComIsvMessageType.REFUND;
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public boolean process(SocialCpIsvMessageEntity unprocessed) throws WxErrorException {
        // 企微对订单退款的操作是按照支付订单时的顺序反向操作的
        // 当对升级、续期、切换版本订单进行退款时，会回退到上一阶段的版本
        String suiteId = unprocessed.getSuiteId();
        String authCorpId = unprocessed.getAuthCorpId();
        WxCpIsvXmlMessage wxCpIsvXmlMessage = JSONUtil.toBean(unprocessed.getMessage(), WxCpIsvXmlMessage.class);
        String refundWeComOrderId = wxCpIsvXmlMessage.getOrderId();
        // 1 更改企微订单为已退款状态
        updateOrderStatus(suiteId, refundWeComOrderId);
        // 2 处理订阅变更
        WeComOrderRefundEvent refundEvent = new WeComOrderRefundEvent();
        refundEvent.setSuiteId(suiteId);
        refundEvent.setPaidCorpId(authCorpId);
        refundEvent.setOrderId(refundWeComOrderId);
        SocialOrderStrategyFactory.getService(SocialPlatformType.WECOM)
                .retrieveOrderRefundEvent(refundEvent);
        // 3 判断是否已不存在付费订阅
        SocialWecomOrderEntity lastPaidOrder = socialWecomOrderService.getLastPaidOrder(suiteId, authCorpId);
        if (Objects.isNull(lastPaidOrder) || DateTimeUtil.localDateTimeNow(8).isAfter(lastPaidOrder.getEndTime())) {
            // 3.1 如果上一阶段支付成功的企微订单不存在或者已过期，即已不存在付费订阅版本，则通知将该企业的接口许可退款
            TaskManager.me().execute(() -> socialCpIsvPermitService.sendRefundWebhook(suiteId, authCorpId));
        }
        return true;
    }

    /**
     * 更新企微订单的状态
     *
     * @param suiteId 应用套件 ID
     * @param orderId 企微订单号
     * @author 刘斌华
     * @date 2022-08-25 16:58:34
     */
    private void updateOrderStatus(String suiteId, String orderId) throws WxErrorException {
        // 获取企业微信订单的最新信息
        WxCpIsvServiceImpl wxCpIsvService = (WxCpIsvServiceImpl) weComTemplate.isvService(suiteId);
        WxCpIsvGetOrder wxCpIsvGetOrder = wxCpIsvService.getOrder(orderId);
        socialWecomOrderService.updateOrderStatusByOrderId(orderId, wxCpIsvGetOrder.getOrderStatus());
    }

}
