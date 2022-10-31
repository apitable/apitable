package com.vikadata.api.modular.social.service.impl;

import java.util.Objects;

import javax.annotation.Resource;

import cn.hutool.json.JSONUtil;
import lombok.extern.slf4j.Slf4j;
import me.chanjar.weixin.common.error.WxErrorException;

import com.vikadata.api.modular.social.service.ISocialCpIsvEntityHandler;
import com.vikadata.api.modular.social.service.ISocialCpIsvMessageService;
import com.vikadata.api.modular.social.service.ISocialCpIsvPermitService;
import com.vikadata.api.modular.social.service.ISocialWecomPermitOrderService;
import com.vikadata.entity.SocialCpIsvMessageEntity;
import com.vikadata.entity.SocialWecomPermitOrderEntity;
import com.vikadata.social.wecom.constants.WeComIsvMessageType;
import com.vikadata.social.wecom.model.WxCpIsvXmlMessage;

import org.springframework.stereotype.Service;

/**
 * <p>
 * Third party platform integration - WeCom third-party service provider interface license refund result processing
 * </p>
 */
@Slf4j
@Service
public class SocialCpIsvLicenseRefundEntityHandler implements ISocialCpIsvEntityHandler {

    @Resource
    private ISocialCpIsvMessageService socialCpIsvMessageService;

    @Resource
    private ISocialCpIsvPermitService socialCpIsvPermitService;

    @Resource
    private ISocialWecomPermitOrderService socialWecomPermitOrderService;

    @Override
    public WeComIsvMessageType type() {
        return WeComIsvMessageType.LICENSE_REFUND;
    }

    @Override
    public boolean process(SocialCpIsvMessageEntity unprocessed) throws WxErrorException {
        WxCpIsvXmlMessage wxCpIsvXmlMessage = JSONUtil.toBean(unprocessed.getMessage(), WxCpIsvXmlMessage.class);
        String orderId = wxCpIsvXmlMessage.getOrderId();
        // Obtain interface license order information
        SocialWecomPermitOrderEntity orderEntity = socialWecomPermitOrderService.getByOrderId(orderId);
        if (Objects.isNull(orderEntity)) {
            log.warn("No refunded interface license order was found. Please check whether it is other environmental data,suiteId：{}，authCorpId：{}，订单号：{}",
                    unprocessed.getSuiteId(), unprocessed.getAuthCorpId(), orderId);
        }
        else {
            // Order exists, confirm the order status
            orderEntity = socialCpIsvPermitService.ensureOrder(orderId);
            if (orderEntity.getOrderStatus() == 5) {
                // If the refund is successful, confirm the activation status of all accounts
                socialCpIsvPermitService.ensureAllActiveCodes(unprocessed.getSuiteId(), unprocessed.getAuthCorpId());
            }
        }
        return true;
    }

}
