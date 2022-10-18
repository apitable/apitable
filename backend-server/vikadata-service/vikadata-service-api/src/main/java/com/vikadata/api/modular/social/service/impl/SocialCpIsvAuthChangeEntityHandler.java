package com.vikadata.api.modular.social.service.impl;

import java.util.Objects;
import java.util.Optional;

import javax.annotation.Resource;

import cn.hutool.core.lang.Assert;
import cn.hutool.json.JSONUtil;
import lombok.extern.slf4j.Slf4j;
import me.chanjar.weixin.common.error.WxErrorException;
import me.chanjar.weixin.cp.bean.WxCpTpAuthInfo;
import me.chanjar.weixin.cp.bean.WxCpTpAuthInfo.Agent;
import me.chanjar.weixin.cp.bean.WxCpTpAuthInfo.AuthCorpInfo;
import me.chanjar.weixin.cp.bean.WxCpTpAuthInfo.AuthInfo;
import me.chanjar.weixin.cp.bean.WxCpTpAuthInfo.Privilege;
import me.chanjar.weixin.cp.bean.message.WxCpMessage;

import com.vikadata.api.cache.service.UserSpaceService;
import com.vikadata.api.modular.social.enums.SocialTenantAuthMode;
import com.vikadata.api.modular.social.event.wecom.WeComIsvCardFactory;
import com.vikadata.api.modular.social.service.ISocialCpIsvEntityHandler;
import com.vikadata.api.modular.social.service.ISocialCpIsvMessageService;
import com.vikadata.api.modular.social.service.ISocialCpIsvPermitService;
import com.vikadata.api.modular.social.service.ISocialCpIsvService;
import com.vikadata.api.modular.social.service.ISocialTenantBindService;
import com.vikadata.api.modular.social.service.ISocialTenantService;
import com.vikadata.entity.SocialCpIsvMessageEntity;
import com.vikadata.entity.SocialTenantEntity;
import com.vikadata.social.wecom.WeComTemplate;
import com.vikadata.social.wecom.constants.WeComIsvMessageType;

import org.springframework.beans.factory.InitializingBean;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * <p>
 * 第三方平台集成 - 企业微信第三方服务商变更授权处理
 * </p>
 * @author 刘斌华
 * @date 2022-01-19 16:51:54
 */
@Slf4j
@Service
public class SocialCpIsvAuthChangeEntityHandler implements ISocialCpIsvEntityHandler, InitializingBean {

    @Resource
    private ApplicationContext applicationContext;

    @Autowired(required = false)
    private WeComTemplate weComTemplate;

    @Resource
    private ISocialCpIsvService socialCpIsvService;

    @Resource
    private ISocialCpIsvPermitService socialCpIsvPermitService;

    @Resource
    private ISocialTenantService socialTenantService;

    @Resource
    private ISocialTenantBindService socialTenantBindService;

    @Resource
    private UserSpaceService userSpaceService;

    private ISocialCpIsvMessageService socialCpIsvMessageService;

    @Override
    public WeComIsvMessageType type() {

        return WeComIsvMessageType.AUTH_CHANGE;

    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public boolean process(SocialCpIsvMessageEntity unprocessed) throws WxErrorException {

        String suiteId = unprocessed.getSuiteId();
        String authCorpId = unprocessed.getAuthCorpId();

        // 1 获取企业已有的租户和空间站信息
        SocialTenantEntity socialTenantEntity = socialTenantService.getByAppIdAndTenantId(suiteId, authCorpId);
        Assert.notNull(socialTenantEntity, () -> new IllegalStateException(String
                .format("没有找到可用的租户信息，tenantId：%s，appId：%s", authCorpId, suiteId)));
        String spaceId = socialTenantBindService.getTenantBindSpaceId(authCorpId, suiteId);
        Assert.notBlank(spaceId, () -> new IllegalStateException(String
                .format("没有找到对应的空间站信息，tenantId：%s，appId：%s", authCorpId, suiteId)));
        // 2 获取该企业最新的授权信息
        WxCpTpAuthInfo wxCpTpAuthInfo = weComTemplate.isvService(suiteId)
                .getAuthInfo(authCorpId, socialTenantEntity.getPermanentCode());
        AuthCorpInfo authCorpInfo = wxCpTpAuthInfo.getAuthCorpInfo();
        Agent agent = Optional.ofNullable(wxCpTpAuthInfo.getAuthInfo())
                .map(AuthInfo::getAgents)
                .filter(agents -> !agents.isEmpty())
                .map(agents -> agents.get(0))
                .orElse(null);
        Objects.requireNonNull(authCorpInfo, "AuthCorpInfo cannot be null.");
        Objects.requireNonNull(agent, "Agent cannot be null.");
        // 3 更新企业的授权信息
        socialTenantEntity.setContactAuthScope(JSONUtil.toJsonStr(agent));
        socialTenantEntity.setAuthMode(SocialTenantAuthMode.fromWeCom(agent.getAuthMode()).getValue());
        socialTenantEntity.setAuthInfo(JSONUtil.toJsonStr(wxCpTpAuthInfo));
        socialTenantService.updateById(socialTenantEntity);
        // 如果需要，先刷新 access_token
        socialCpIsvService.refreshAccessToken(suiteId, unprocessed.getAuthCorpId(), socialTenantEntity.getPermanentCode());
        // 4 重新同步通讯录
        Privilege privilege = agent.getPrivilege();
        socialCpIsvService.syncViewableUsers(suiteId, authCorpInfo.getCorpId(), spaceId,
                privilege.getAllowUsers(), privilege.getAllowParties(), privilege.getAllowTags());
        // 5 对新增成员发送开始使用消息
        WxCpMessage wxCpMessage = WeComIsvCardFactory.createWelcomeMsg(agent.getAgentId());
        socialCpIsvService.sendWelcomeMessage(socialTenantEntity, spaceId, wxCpMessage);
        // 7 清空临时缓存
        socialCpIsvService.clearCache(authCorpInfo.getCorpId());
        // 8 清空空间站缓存
        userSpaceService.delete(spaceId);
        // 9 接口许可处理
        try {
            socialCpIsvPermitService.autoProcessPermitOrder(suiteId, authCorpId, spaceId);
        }
        catch (Exception ex) {
            log.error("企微接口许可自动化处理失败", ex);
        }

        return true;

    }

    @Override
    public void afterPropertiesSet() {

        this.socialCpIsvMessageService = applicationContext.getBean(ISocialCpIsvMessageService.class);

    }

}
