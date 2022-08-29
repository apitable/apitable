package com.vikadata.api.modular.social.service.impl;

import java.util.List;
import java.util.Objects;

import javax.annotation.Resource;

import cn.hutool.core.collection.CollUtil;
import cn.hutool.json.JSONUtil;
import me.chanjar.weixin.common.error.WxErrorException;

import com.vikadata.api.component.TaskManager;
import com.vikadata.api.enums.finance.OrderStatus;
import com.vikadata.api.modular.eco.service.IEconomicOrderService;
import com.vikadata.api.modular.social.enums.SocialCpIsvMessageProcessStatus;
import com.vikadata.api.modular.social.service.ISocialCpIsvEntityHandler;
import com.vikadata.api.modular.social.service.ISocialCpIsvMessageService;
import com.vikadata.api.modular.social.service.ISocialCpIsvPermitService;
import com.vikadata.api.modular.social.service.ISocialOrderWeComService;
import com.vikadata.api.modular.social.service.ISocialTenantBindService;
import com.vikadata.core.util.DateTimeUtil;
import com.vikadata.entity.EconomicOrderEntity;
import com.vikadata.entity.SocialCpIsvMessageEntity;
import com.vikadata.entity.SocialOrderWecomEntity;
import com.vikadata.social.wecom.constants.WeComIsvMessageType;
import com.vikadata.social.wecom.model.WxCpIsvXmlMessage;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * <p>
 * 第三方平台集成 - 企业微信第三方服务商应用退款处理
 * </p>
 * @author 刘斌华
 * @date 2022-04-25 10:13:31
 */
@Service
public class SocialCpIsvRefundEntityHandler implements ISocialCpIsvEntityHandler {

    @Resource
    private IEconomicOrderService economicOrderService;

    @Resource
    private ISocialCpIsvMessageService socialCpIsvMessageService;

    @Resource
    private ISocialCpIsvPermitService socialCpIsvPermitService;

    @Resource
    private ISocialOrderWeComService socialOrderWeComService;

    @Resource
    private ISocialTenantBindService socialTenantBindService;

    @Override
    public WeComIsvMessageType type() {

        return WeComIsvMessageType.REFUND;

    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public boolean process(SocialCpIsvMessageEntity unprocessed) throws WxErrorException {
        // 企微对订单退款的操作是按照支付订单时的顺序反向操作的
        // 当对升级、续期、切换版本订单进行退款时，会回退到上一阶段的版本
        // 因此在处理退款时，需要将退款的订单取消，同时将上一阶段支付成功的订单激活
        WxCpIsvXmlMessage wxCpIsvXmlMessage = JSONUtil.toBean(unprocessed.getMessage(), WxCpIsvXmlMessage.class);
        String refundWeComOrderId = wxCpIsvXmlMessage.getOrderId();
        // 1 更改企微订单为已退款状态
        socialOrderWeComService.refreshOrder(unprocessed.getSuiteId(), refundWeComOrderId);

        List<String> spaceIds = socialTenantBindService.getSpaceIdsByTenantIdAndAppId(unprocessed.getAuthCorpId(), unprocessed.getSuiteId());
        if (CollUtil.isNotEmpty(spaceIds)) {
            String spaceId = spaceIds.get(0);
            // 2 取消对应的经济订单
            EconomicOrderEntity refundEconomicOrder = economicOrderService.getBySpaceIdAndChannelOrderId(spaceId, refundWeComOrderId);
            refundEconomicOrder.setStatus(OrderStatus.CANCELED.getName());
            economicOrderService.updateById(refundEconomicOrder);
            // 3 激活上一阶段支付成功的订单
            // 3.1 先获取上一阶段支付成功的企微订单号
            SocialOrderWecomEntity activeOrderWeComEntity = socialOrderWeComService.getLastPaidOrder(unprocessed.getSuiteId(), unprocessed.getAuthCorpId());
            if (Objects.nonNull(activeOrderWeComEntity)) {
                // 3.2 获取该企微订单对应的经济订单，并激活
                // 如果没有待激活的已支付企微订单，则回退到基础版，此时不需要做处理
                EconomicOrderEntity activeEconomicOrder = economicOrderService.getBySpaceIdAndChannelOrderId(spaceId, activeOrderWeComEntity.getOrderId());
                activeEconomicOrder.setStatus(OrderStatus.FINISHED.getName());
                economicOrderService.updateById(activeEconomicOrder);
            }
            if (Objects.isNull(activeOrderWeComEntity) || DateTimeUtil.localDateTimeNow(8).isAfter(activeOrderWeComEntity.getEndTime())) {
                // 3.2 如果上一阶段支付成功的企微订单不存在或者已过期，即已不存在付费订阅版本，则通知将该企业的接口许可退款
                TaskManager.me().execute(() -> socialCpIsvPermitService.sendRefundWebhook(unprocessed.getSuiteId(), unprocessed.getAuthCorpId()));
            }
        }

        // 将消息改成处理成功状态
        unprocessed.setProcessStatus(SocialCpIsvMessageProcessStatus.SUCCESS.getValue());
        socialCpIsvMessageService.updateById(unprocessed);

        return true;
    }

}
