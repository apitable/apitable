package com.vikadata.api.enterprise.social.service.impl;

import javax.annotation.Resource;

import cn.hutool.json.JSONUtil;
import me.chanjar.weixin.common.error.WxErrorException;

import com.vikadata.api.enterprise.social.service.ISocialCpIsvEntityHandler;
import com.vikadata.api.enterprise.social.service.ISocialCpIsvMessageService;
import com.vikadata.api.enterprise.social.service.ISocialCpIsvService;
import com.vikadata.entity.SocialCpIsvMessageEntity;
import com.vikadata.social.wecom.constants.WeComIsvMessageType;
import com.vikadata.social.wecom.model.WxCpIsvPermanentCodeInfo;

import org.springframework.beans.factory.InitializingBean;
import org.springframework.context.ApplicationContext;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * <p>
 * Third party platform integration - WeCom third-party service provider application authorization successfully processed
 * </p>
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
        return true;
    }

    @Override
    public void afterPropertiesSet() {

        this.socialCpIsvMessageService = applicationContext.getBean(ISocialCpIsvMessageService.class);

    }

}
