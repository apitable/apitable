package com.vikadata.api.modular.social.service.impl;

import java.util.Collections;

import javax.annotation.Resource;

import cn.hutool.core.lang.Assert;
import cn.hutool.json.JSONUtil;
import me.chanjar.weixin.common.error.WxErrorException;
import me.chanjar.weixin.cp.bean.WxCpTpAuthInfo.Agent;
import me.chanjar.weixin.cp.bean.message.WxCpMessage;
import me.chanjar.weixin.cp.bean.message.WxCpTpXmlMessage;

import com.vikadata.api.modular.social.enums.SocialCpIsvMessageProcessStatus;
import com.vikadata.api.modular.social.event.wecom.WeComIsvCardFactory;
import com.vikadata.api.modular.social.service.ISocialCpIsvEntityHandler;
import com.vikadata.api.modular.social.service.ISocialCpIsvMessageService;
import com.vikadata.api.modular.social.service.ISocialCpIsvService;
import com.vikadata.api.modular.social.service.ISocialTenantBindService;
import com.vikadata.api.modular.social.service.ISocialTenantService;
import com.vikadata.entity.SocialCpIsvMessageEntity;
import com.vikadata.entity.SocialTenantEntity;
import com.vikadata.social.wecom.constants.WeComIsvMessageType;

import org.springframework.beans.factory.InitializingBean;
import org.springframework.context.ApplicationContext;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * <p>
 * 第三方平台集成 - 企业微信第三方服务商成员关注处理
 * </p>
 * @author 刘斌华
 * @date 2022-01-20 17:33:58
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

        // 1 获取企业已有的租户信息
        SocialTenantEntity socialTenantEntity = socialTenantService.getByAppIdAndTenantId(suiteId, authCorpId);
        Assert.notNull(socialTenantEntity, () -> new IllegalStateException(String
                .format("没有找到可用的租户信息，tenantId：%s，appId：%s", authCorpId, suiteId)));
        // 如果需要，先刷新 access_token
        socialCpIsvService.refreshAccessToken(suiteId, authCorpId, socialTenantEntity.getPermanentCode());
        // 2 获取绑定的空间站
        String spaceId = socialTenantBindService.getTenantBindSpaceId(authCorpId, suiteId);
        Assert.notBlank(spaceId, () -> new IllegalStateException(String
                .format("没有找到对应的空间站信息，tenantId：%s，appId：%s", authCorpId, suiteId)));
        // 3 添加成员
        WxCpTpXmlMessage wxMessage = JSONUtil.toBean(unprocessed.getMessage(), WxCpTpXmlMessage.class);
        socialCpIsvService.syncSingleUser(authCorpId, wxMessage.getFromUserName(), suiteId, spaceId, false);
        // 4 对新增成员发送开始使用消息
        Agent agent = JSONUtil.toBean(socialTenantEntity.getContactAuthScope(), Agent.class);
        WxCpMessage wxCpMessage = WeComIsvCardFactory.createWelcomeMsg(agent.getAgentId());
        socialCpIsvService.sendWelcomeMessage(socialTenantEntity, spaceId, wxCpMessage,
                Collections.singletonList(wxMessage.getFromUserName()), null, null);
        // 5 将消息改成处理成功状态
        unprocessed.setProcessStatus(SocialCpIsvMessageProcessStatus.SUCCESS.getValue());
        socialCpIsvMessageService.updateById(unprocessed);
        // 6 清空临时缓存
        socialCpIsvService.clearCache(authCorpId);

        return true;

    }

    @Override
    public void afterPropertiesSet() {

        this.socialCpIsvMessageService = applicationContext.getBean(ISocialCpIsvMessageService.class);

    }

}
