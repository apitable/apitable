package com.vikadata.api.enterprise.social.service.impl;

import java.util.Collections;
import java.util.Objects;
import java.util.Optional;

import javax.annotation.Resource;

import cn.hutool.core.lang.Assert;
import cn.hutool.json.JSONUtil;
import me.chanjar.weixin.common.error.WxErrorException;
import me.chanjar.weixin.cp.bean.message.WxCpTpXmlMessage;

import com.vikadata.api.organization.service.IMemberService;
import com.vikadata.api.enterprise.social.service.ISocialCpIsvEntityHandler;
import com.vikadata.api.enterprise.social.service.ISocialCpIsvMessageService;
import com.vikadata.api.enterprise.social.service.ISocialCpUserBindService;
import com.vikadata.api.enterprise.social.service.ISocialTenantBindService;
import com.vikadata.api.enterprise.social.service.ISocialTenantService;
import com.vikadata.api.space.service.ISpaceService;
import com.vikadata.entity.MemberEntity;
import com.vikadata.entity.SocialCpIsvMessageEntity;
import com.vikadata.entity.SocialTenantEntity;
import com.vikadata.social.wecom.constants.WeComIsvMessageType;

import org.springframework.beans.factory.InitializingBean;
import org.springframework.context.ApplicationContext;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * <p>
 * Third party platform integration - WeCom third-party service provider member cancels the attention processing
 * </p>
 */
@Service
public class SocialCpIsvUnsubscribeEntityHandler implements ISocialCpIsvEntityHandler, InitializingBean {

    @Resource
    private ApplicationContext applicationContext;

    @Resource
    private IMemberService memberService;

    @Resource
    private ISocialCpUserBindService socialCpUserBindService;

    @Resource
    private ISocialTenantService socialTenantService;

    @Resource
    private ISocialTenantBindService socialTenantBindService;

    @Resource
    private ISpaceService spaceService;

    private ISocialCpIsvMessageService socialCpIsvMessageService;

    @Override
    public WeComIsvMessageType type() {

        return WeComIsvMessageType.UNSUBSCRIBE;

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
        // 2 Get the bound space station
        String spaceId = socialTenantBindService.getTenantBindSpaceId(authCorpId, suiteId);
        Assert.notBlank(spaceId, () -> new IllegalStateException(String
                .format("No corresponding space station information was found,tenantId：%s，appId：%s", authCorpId, suiteId)));
        // 3 Get member information
        WxCpTpXmlMessage wxMessage = JSONUtil.toBean(unprocessed.getMessage(), WxCpTpXmlMessage.class);
        MemberEntity memberEntity = Optional.ofNullable(socialCpUserBindService
                        .getUserIdByTenantIdAndAppIdAndCpUserId(authCorpId, suiteId, wxMessage.getFromUserName()))
                .map(userId -> memberService.getByUserIdAndSpaceId(userId, spaceId))
                .orElse(null);
        if (Objects.isNull(memberEntity)) {
            // 3.1 The member information does not exist. Ignore it directly
            return true;
        }
        // 4 Remove Members
        memberService.batchDeleteMemberFromSpace(spaceId, Collections.singletonList(memberEntity.getId()), false);
        // 5 If it is an administrator, clear the administrator of the space station
        if (Boolean.TRUE.equals(memberEntity.getIsAdmin())) {
            spaceService.removeMainAdmin(spaceId);
        }
        return true;

    }

    @Override
    public void afterPropertiesSet() {

        this.socialCpIsvMessageService = applicationContext.getBean(ISocialCpIsvMessageService.class);

    }

}
