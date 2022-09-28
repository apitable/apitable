package com.vikadata.api.modular.social.service.impl;

import cn.hutool.core.collection.CollUtil;
import cn.hutool.json.JSONUtil;
import com.vikadata.api.modular.finance.service.ISocialWecomOrderService;
import com.vikadata.api.modular.social.enums.SocialCpIsvMessageProcessStatus;
import com.vikadata.api.modular.social.service.ISocialCpIsvEntityHandler;
import com.vikadata.api.modular.social.service.ISocialCpIsvMessageService;
import com.vikadata.api.modular.social.service.ISocialCpIsvService;
import com.vikadata.api.modular.social.service.ISocialTenantBindService;
import com.vikadata.entity.SocialCpIsvMessageEntity;
import com.vikadata.entity.SocialWecomOrderEntity;
import com.vikadata.social.wecom.WeComTemplate;
import com.vikadata.social.wecom.constants.WeComIsvMessageType;
import com.vikadata.social.wecom.model.WxCpIsvXmlMessage;
import lombok.extern.slf4j.Slf4j;
import me.chanjar.weixin.common.error.WxErrorException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.annotation.Resource;
import java.util.List;
import java.util.Objects;

/**
 * <p>
 * 第三方平台集成 - 企业微信第三方服务商订单支付成功处理
 * </p>
 *
 * @author 刘斌华
 * @date 2022-04-25 10:13:08
 */
@Service
@Slf4j
public class SocialCpIsvPayForAppSuccessEntityHandler implements ISocialCpIsvEntityHandler {

    @Autowired(required = false)
    private WeComTemplate weComTemplate;

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
            String spaceId = CollUtil.isEmpty(spaceIds) ? null : spaceIds.get(0);
            socialCpIsvService.handleTenantPaidSubscribe(suiteId, authCorpId, spaceId, orderId);
        } else {
            log.warn("Wecom order has handled：{}", orderId);
        }
        // 2 replace message processStatus to success
        unprocessed.setProcessStatus(SocialCpIsvMessageProcessStatus.SUCCESS.getValue());
        socialCpIsvMessageService.updateById(unprocessed);
        return true;
    }

}
