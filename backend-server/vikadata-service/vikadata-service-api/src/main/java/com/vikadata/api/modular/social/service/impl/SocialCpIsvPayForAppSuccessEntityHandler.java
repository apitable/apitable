package com.vikadata.api.modular.social.service.impl;

import java.util.List;

import javax.annotation.Resource;

import cn.hutool.core.collection.CollUtil;
import cn.hutool.json.JSONUtil;
import lombok.extern.slf4j.Slf4j;
import me.chanjar.weixin.common.error.WxErrorException;

import com.vikadata.api.enums.social.SocialPlatformType;
import com.vikadata.api.modular.social.enums.SocialCpIsvMessageProcessStatus;
import com.vikadata.api.modular.social.service.ISocialCpIsvEntityHandler;
import com.vikadata.api.modular.social.service.ISocialCpIsvMessageService;
import com.vikadata.api.modular.social.service.ISocialCpIsvPermitService;
import com.vikadata.api.modular.social.service.ISocialCpIsvService;
import com.vikadata.api.modular.social.service.ISocialOrderWeComService;
import com.vikadata.api.modular.social.service.ISocialTenantBindService;
import com.vikadata.api.modular.social.service.ISocialTenantOrderService;
import com.vikadata.entity.SocialCpIsvMessageEntity;
import com.vikadata.entity.SocialOrderWecomEntity;
import com.vikadata.social.wecom.constants.WeComIsvMessageType;
import com.vikadata.social.wecom.model.WxCpIsvXmlMessage;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * <p>
 * 第三方平台集成 - 企业微信第三方服务商订单支付成功处理
 * </p>
 * @author 刘斌华
 * @date 2022-04-25 10:13:08
 */
@Service
@Slf4j
public class SocialCpIsvPayForAppSuccessEntityHandler implements ISocialCpIsvEntityHandler {

    @Resource
    private ISocialCpIsvService socialCpIsvService;

    @Resource
    private ISocialCpIsvMessageService socialCpIsvMessageService;

    @Resource
    private ISocialCpIsvPermitService socialCpIsvPermitService;

    @Resource
    private ISocialOrderWeComService socialOrderWeComService;

    @Resource
    private ISocialTenantBindService socialTenantBindService;

    @Resource
    private ISocialTenantOrderService socialTenantOrderService;

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
        // 1 判断订单信息是否已经存在
        boolean tenantOrderExisted = socialTenantOrderService.tenantOrderExisted(wxCpIsvXmlMessage.getOrderId(),
                authCorpId, suiteId, SocialPlatformType.WECOM);
        if (!tenantOrderExisted) {
            // 2 订单不存在，则保存第三方订单信息
            socialTenantOrderService.createTenantOrder(wxCpIsvXmlMessage.getOrderId(),
                    authCorpId, suiteId, SocialPlatformType.WECOM,
                    JSONUtil.toJsonStr(wxCpIsvXmlMessage));
            // 3 同时保存企微订单信息
            SocialOrderWecomEntity orderWeComEntity = socialOrderWeComService.createOrder(suiteId, wxCpIsvXmlMessage.getOrderId());
            // 4 判断租户的空间站是否存在
            List<String> spaceIds = socialTenantBindService.getSpaceIdsByTenantIdAndAppId(authCorpId, suiteId);
            if (CollUtil.isNotEmpty(spaceIds)) {
                // 5 空间站已经存在，则保存经济系统订单信息
                // 如果空间站不存在，说明是新租户安装的同时付费，此时由【授权安装】事件处理
                String spaceId = spaceIds.get(0);
                socialCpIsvService.handleTenantPaidSubscribe(orderWeComEntity, spaceId);
                // 6 接口许可处理
                try {
                    socialCpIsvPermitService.autoProcessPermitOrder(suiteId, authCorpId, spaceId);
                } catch (Exception ex) {
                    log.error("企微接口许可自动化处理失败", ex);
                }
            }
        }
        else {
            log.warn("企业微信订单已经处理：{}", wxCpIsvXmlMessage.getOrderId());
        }

        // 将消息改成处理成功状态
        unprocessed.setProcessStatus(SocialCpIsvMessageProcessStatus.SUCCESS.getValue());
        socialCpIsvMessageService.updateById(unprocessed);

        return true;
    }

}
