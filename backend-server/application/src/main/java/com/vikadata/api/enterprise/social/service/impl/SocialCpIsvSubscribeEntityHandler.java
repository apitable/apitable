package com.vikadata.api.enterprise.social.service.impl;

import java.util.Collections;

import javax.annotation.Resource;

import cn.hutool.core.lang.Assert;
import cn.hutool.json.JSONUtil;
import me.chanjar.weixin.common.error.WxErrorException;
import me.chanjar.weixin.cp.bean.WxCpTpAuthInfo.Agent;
import me.chanjar.weixin.cp.bean.message.WxCpMessage;
import me.chanjar.weixin.cp.bean.message.WxCpTpXmlMessage;

import com.vikadata.api.enterprise.social.event.wecom.WeComIsvCardFactory;
import com.vikadata.api.enterprise.social.service.ISocialCpIsvEntityHandler;
import com.vikadata.api.enterprise.social.service.ISocialCpIsvMessageService;
import com.vikadata.api.enterprise.social.service.ISocialCpIsvService;
import com.vikadata.api.enterprise.social.service.ISocialTenantBindService;
import com.vikadata.api.enterprise.social.service.ISocialTenantService;
import com.vikadata.entity.SocialCpIsvMessageEntity;
import com.vikadata.entity.SocialTenantEntity;
import com.vikadata.social.wecom.constants.WeComIsvMessageType;

import org.springframework.beans.factory.InitializingBean;
import org.springframework.context.ApplicationContext;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * <p>
 * Third party platform integration - WeCom third-party service provider members pay attention to processing
 * </p>
 */
@Service
public class SocialCpIsvSubscribeEntityHandler implements ISocialCpIsvEntityHandler, InitializingBean {

    @Resource
    private ApplicationContext applicationContext;

    @Resource
    private ISocialCpIsvService socialCpIsvService;

    @Resource
    private ISocialTenantService socialTenantService;

    @Resource
    private ISocialTenantBindService socialTenantBindService;

    private ISocialCpIsvMessageService socialCpIsvMessageService;

    @Override
    public WeComIsvMessageType type() {

        return WeComIsvMessageType.SUBSCRIBE;

    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public boolean process(SocialCpIsvMessageEntity unprocessed) throws WxErrorException {

        String suiteId = unprocessed.getSuiteId();
        String authCorpId = unprocessed.getAuthCorpId();

        // 1 Obtain the existing tenant information of the enterprise
        SocialTenantEntity socialTenantEntity = socialTenantService.getByAppIdAndTenantId(suiteId, authCorpId);
        Assert.notNull(socialTenantEntity, () -> new IllegalStateException(String
                .format("No available tenant information found,tenantId：%s，appId：%s", authCorpId, suiteId)));
        // If necessary, refresh access first_ token
        socialCpIsvService.refreshAccessToken(suiteId, authCorpId, socialTenantEntity.getPermanentCode());
        // 2 Get the bound space station
        String spaceId = socialTenantBindService.getTenantBindSpaceId(authCorpId, suiteId);
        Assert.notBlank(spaceId, () -> new IllegalStateException(String
                .format("No corresponding space station information was found,tenantId：%s，appId：%s", authCorpId, suiteId)));
        // 3 Add Members
        WxCpTpXmlMessage wxMessage = JSONUtil.toBean(unprocessed.getMessage(), WxCpTpXmlMessage.class);
        socialCpIsvService.syncSingleUser(authCorpId, wxMessage.getFromUserName(), suiteId, spaceId, false);
        // 4 Send the start message to the new member
        Agent agent = JSONUtil.toBean(socialTenantEntity.getContactAuthScope(), Agent.class);
        WxCpMessage wxCpMessage = WeComIsvCardFactory.createWelcomeMsg(agent.getAgentId());
        socialCpIsvService.sendWelcomeMessage(socialTenantEntity, spaceId, wxCpMessage,
                Collections.singletonList(wxMessage.getFromUserName()), null, null);
        // 6 Empty temporary cache
        socialCpIsvService.clearCache(authCorpId);

        return true;

    }

    @Override
    public void afterPropertiesSet() {

        this.socialCpIsvMessageService = applicationContext.getBean(ISocialCpIsvMessageService.class);

    }

}
