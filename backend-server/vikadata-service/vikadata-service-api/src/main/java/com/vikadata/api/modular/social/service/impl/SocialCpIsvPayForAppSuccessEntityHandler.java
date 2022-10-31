package com.vikadata.api.modular.social.service.impl;

import java.util.List;
import java.util.Objects;

import javax.annotation.Resource;

import cn.hutool.json.JSONUtil;
import lombok.extern.slf4j.Slf4j;
import me.chanjar.weixin.common.error.WxErrorException;

import com.vikadata.api.modular.finance.service.ISocialWecomOrderService;
import com.vikadata.api.modular.social.service.ISocialCpIsvEntityHandler;
import com.vikadata.api.modular.social.service.ISocialCpIsvMessageService;
import com.vikadata.api.modular.social.service.ISocialCpIsvService;
import com.vikadata.api.modular.social.service.ISocialTenantBindService;
import com.vikadata.entity.SocialCpIsvMessageEntity;
import com.vikadata.entity.SocialWecomOrderEntity;
import com.vikadata.social.wecom.constants.WeComIsvMessageType;
import com.vikadata.social.wecom.event.order.WeComOrderPaidEvent;
import com.vikadata.social.wecom.model.WxCpIsvXmlMessage;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * <p>
 * Third party platform integration - WeCom third-party service provider order payment successfully processed
 * </p>
 */
@Service
@Slf4j
public class SocialCpIsvPayForAppSuccessEntityHandler implements ISocialCpIsvEntityHandler {

    @Resource
    private ISocialCpIsvService socialCpIsvService;

    @Resource
    private ISocialCpIsvMessageService socialCpIsvMessageService;

    @Resource
    private ISocialTenantBindService socialTenantBindService;

    @Resource
    private ISocialWecomOrderService socialWecomOrderService;

    @Override
    public WeComIsvMessageType type() {
        return WeComIsvMessageType.PAY_FOR_APP_SUCCESS;
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public boolean process(SocialCpIsvMessageEntity unprocessed) throws WxErrorException {
        String suiteId = unprocessed.getSuiteId();
        String authCorpId = unprocessed.getAuthCorpId();
        WxCpIsvXmlMessage wxCpIsvXmlMessage = JSONUtil.toBean(unprocessed.getMessage(), WxCpIsvXmlMessage.class);
        // 1 wecom order saved or not
        String orderId = wxCpIsvXmlMessage.getOrderId();
        SocialWecomOrderEntity existedOrder = socialWecomOrderService.getByOrderId(orderId);
        if (Objects.isNull(existedOrder)) {
            // 1.1 save order and handle paid subscription if not
            List<String> spaceIds = socialTenantBindService.getSpaceIdsByTenantIdAndAppId(authCorpId, suiteId);
            for (String spaceId : spaceIds) {
                WeComOrderPaidEvent paidEvent = socialCpIsvService.fetchPaidEvent(suiteId, orderId);
                socialCpIsvService.handleTenantPaidSubscribe(suiteId, authCorpId, spaceId, paidEvent);
            }
        }
        else {
            log.warn("Wecom order has handled：{}", orderId);
        }
        return true;
    }

}
