package com.vikadata.api.modular.social.service.impl;

import javax.annotation.Resource;

import cn.hutool.json.JSONUtil;
import me.chanjar.weixin.common.error.WxErrorException;

import com.vikadata.api.modular.social.enums.SocialCpIsvMessageProcessStatus;
import com.vikadata.api.modular.social.service.ISocialCpIsvEntityHandler;
import com.vikadata.api.modular.social.service.ISocialCpIsvMessageService;
import com.vikadata.api.modular.social.service.ISocialCpIsvService;
import com.vikadata.entity.SocialCpIsvMessageEntity;
import com.vikadata.social.wecom.constants.WeComIsvMessageType;
import com.vikadata.social.wecom.model.WxCpIsvPermanentCodeInfo;

import org.springframework.beans.factory.InitializingBean;
import org.springframework.context.ApplicationContext;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * <p>
 * 第三方平台集成 - 企业微信第三方服务商应用授权成功处理
 * </p>
 * @author 刘斌华
 * @date 2022-01-11 11:39:57
 */
@Service
public class SocialCpIsvAuthCreateEntityHandler implements ISocialCpIsvEntityHandler, InitializingBean {

    @Resource
    private ApplicationContext applicationContext;

    @Resource
    private ISocialCpIsvService socialCpIsvService;

    private ISocialCpIsvMessageService socialCpIsvMessageService;

    @Override
    public WeComIsvMessageType type() {

        return WeComIsvMessageType.AUTH_CREATE;

    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public boolean process(SocialCpIsvMessageEntity unprocessed) throws WxErrorException {

        WxCpIsvPermanentCodeInfo permanentCodeInfo = JSONUtil.toBean(unprocessed.getMessage(), WxCpIsvPermanentCodeInfo.class);
        socialCpIsvService.createAuthFromPermanentInfo(unprocessed.getSuiteId(), unprocessed.getAuthCorpId(), permanentCodeInfo);

        // 将消息改成处理成功状态
        unprocessed.setProcessStatus(SocialCpIsvMessageProcessStatus.SUCCESS.getValue());
        socialCpIsvMessageService.updateById(unprocessed);

        return true;

    }

    @Override
    public void afterPropertiesSet() {

        this.socialCpIsvMessageService = applicationContext.getBean(ISocialCpIsvMessageService.class);

    }

}
