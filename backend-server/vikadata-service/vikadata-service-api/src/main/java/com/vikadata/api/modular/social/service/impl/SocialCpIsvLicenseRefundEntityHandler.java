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
 * 第三方平台集成 - 企业微信第三方服务商接口许可退款结果处理
 * </p>
 * @author 刘斌华
 * @date 2022-08-04 09:58:47
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
        // 获取接口许可订单信息
        SocialWecomPermitOrderEntity orderEntity = socialWecomPermitOrderService.getByOrderId(orderId);
        if (Objects.isNull(orderEntity)) {
            log.warn("未找到退款的接口许可订单，请检查是否为其他环境数据，suiteId：{}，authCorpId：{}，订单号：{}",
                    unprocessed.getSuiteId(), unprocessed.getAuthCorpId(), orderId);
        }
        else {
            // 订单存在，确认订单的状态
            orderEntity = socialCpIsvPermitService.ensureOrder(orderId);
            if (orderEntity.getOrderStatus() == 5) {
                // 如果退款成功，则确认所有账号的激活状态
                socialCpIsvPermitService.ensureAllActiveCodes(unprocessed.getSuiteId(), unprocessed.getAuthCorpId());
            }
        }
        return true;
    }

}
