package com.vikadata.api.modular.social.service.impl;

import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Collectors;

import javax.annotation.Resource;

import cn.hutool.core.collection.CollUtil;
import cn.hutool.core.lang.Assert;
import cn.hutool.json.JSONUtil;
import me.chanjar.weixin.common.error.WxErrorException;
import me.chanjar.weixin.cp.bean.WxCpTpPermanentCodeInfo.Agent;
import me.chanjar.weixin.cp.bean.WxCpTpPermanentCodeInfo.Privilege;
import me.chanjar.weixin.cp.bean.message.WxCpTpXmlMessage;

import com.vikadata.api.cache.service.UserSpaceService;
import com.vikadata.api.modular.organization.service.IMemberService;
import com.vikadata.api.modular.social.enums.SocialTenantAuthMode;
import com.vikadata.api.modular.social.service.ISocialCpIsvEntityHandler;
import com.vikadata.api.modular.social.service.ISocialCpIsvMessageService;
import com.vikadata.api.modular.social.service.ISocialCpIsvService;
import com.vikadata.api.modular.social.service.ISocialTenantBindService;
import com.vikadata.api.modular.social.service.ISocialTenantService;
import com.vikadata.api.modular.space.service.ISpaceService;
import com.vikadata.entity.MemberEntity;
import com.vikadata.entity.SocialCpIsvMessageEntity;
import com.vikadata.entity.SocialTenantEntity;
import com.vikadata.social.wecom.WeComTemplate;
import com.vikadata.social.wecom.WxCpIsvServiceImpl;
import com.vikadata.social.wecom.constants.WeComIsvMessageType;
import com.vikadata.social.wecom.model.WxCpIsvAdmin;

import org.springframework.beans.factory.InitializingBean;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * <p>
 * Third party platform integration - WeCom third-party service provider application administrator change processing
 * </p>
 */
@Service
public class SocialCpIsvChangeAppAdminEntityHandler implements ISocialCpIsvEntityHandler, InitializingBean {

    @Resource
    private ApplicationContext applicationContext;

    @Autowired(required = false)
    private WeComTemplate weComTemplate;

    @Resource
    private IMemberService memberService;

    @Resource
    private ISocialCpIsvService socialCpIsvService;

    @Resource
    private ISocialTenantService socialTenantService;

    @Resource
    private ISocialTenantBindService socialTenantBindService;

    @Resource
    private ISpaceService spaceService;

    @Resource
    private UserSpaceService userSpaceService;

    private ISocialCpIsvMessageService socialCpIsvMessageService;

    @Override
    public WeComIsvMessageType type() {

        return WeComIsvMessageType.CHANGE_APP_ADMIN;

    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public boolean process(SocialCpIsvMessageEntity unprocessed) throws WxErrorException {

        String suiteId = unprocessed.getSuiteId();
        String authCorpId = unprocessed.getAuthCorpId();

        SocialTenantEntity socialTenantEntity = socialTenantService.getByAppIdAndTenantId(suiteId, authCorpId);
        Assert.notNull(socialTenantEntity, () -> new IllegalStateException(String
                .format("No available tenant information found,tenantId：%s，appId：%s", authCorpId, suiteId)));
        if (socialTenantEntity.getAuthMode() == SocialTenantAuthMode.MEMBER.getValue()) {
            // The member authorization mode is not affected by the application administrator and is ignored directly
            return true;
        }

        // If necessary, refresh access first_ token
        socialCpIsvService.refreshAccessToken(suiteId, unprocessed.getAuthCorpId(), socialTenantEntity.getPermanentCode());
        // 1 Obtain the space station and its master administrator of the authorized enterprise
        String spaceId = socialTenantBindService.getTenantBindSpaceId(authCorpId, suiteId);
        Assert.notBlank(spaceId, () -> new IllegalStateException(String
                .format("No corresponding space station information was found,tenantId：%s，appId：%s", authCorpId, suiteId)));
        MemberEntity adminMember = Optional.ofNullable(memberService.getAdminBySpaceId(spaceId))
                .orElse(null);
        // 2 Get the list of administrators after applying changes
        WxCpIsvServiceImpl wxCpIsvService = (WxCpIsvServiceImpl) weComTemplate.isvService(suiteId);
        WxCpTpXmlMessage xmlMessage = JSONUtil.toBean(unprocessed.getMessage(), WxCpTpXmlMessage.class);
        WxCpIsvAdmin wxCpIsvAdmin = wxCpIsvService.getAuthCorpAdminList(authCorpId, Integer.parseInt(xmlMessage.getAgentID()));
        List<WxCpIsvAdmin.Admin> isvAdmins = Optional.ofNullable(wxCpIsvAdmin.getAdmin())
                .map(admins -> admins.stream()
                        // Only the application administrator with management permission can be set as the primary administrator of the space station
                        .filter(item -> item.getAuthType() == 1)
                        .collect(Collectors.toList()))
                .orElse(null);
        List<String> adminOpenIds = Optional.ofNullable(isvAdmins)
                .map(admins -> admins.stream()
                        .map(WxCpIsvAdmin.Admin::getUserId)
                        .collect(Collectors.toList()))
                .orElse(null);
        // 3 Master administrator of the space station after setting changes
        if (CollUtil.isEmpty(adminOpenIds)) {
            // 3.1 If the application administrator is empty after the change, remove the current space station administrator
            if (Objects.nonNull(adminMember)) {
                adminMember.setIsAdmin(false);
                memberService.updateById(adminMember);

                spaceService.removeMainAdmin(spaceId);
            }
        }
        else if (Objects.isNull(adminMember) || !CollUtil.contains(adminOpenIds, adminMember.getOpenId())) {
            // 3.2 The space station has no original master administrator, or the existing master administrator is not the application administrator after the change
            Agent agent = JSONUtil.toBean(socialTenantEntity.getContactAuthScope(), Agent.class);
            Privilege privilege = agent.getPrivilege();
            List<String> allowUsers = privilege.getAllowUsers();
            List<Integer> allowParties = privilege.getAllowParties();
            List<Integer> allowTags = privilege.getAllowTags();
            boolean hasAdmin = false;
            for (WxCpIsvAdmin.Admin isvAdmin : isvAdmins) {
                boolean viewable = socialCpIsvService.judgeViewable(authCorpId, isvAdmin.getUserId(), suiteId,
                        allowUsers, allowParties, allowTags);
                if (viewable) {
                    // 3.2.1 Set the first person in the administrator list within the visible range as the primary administrator of the space station
                    socialCpIsvService.syncSingleUser(authCorpId, isvAdmin.getUserId(), suiteId, spaceId, true);
                    // 3.2.2 Cancel the original primary administrator
                    if (Objects.nonNull(adminMember)) {
                        adminMember.setIsAdmin(false);
                        memberService.updateById(adminMember);
                    }
                    hasAdmin = true;

                    break;
                }
            }
            // 3.3.3 If there is no administrator within the visible range, clear the primary administrator of the space station directly
            if (!hasAdmin) {
                spaceService.removeMainAdmin(spaceId);
            }
        }
        // 5 Empty temporary cache
        socialCpIsvService.clearCache(authCorpId);
        // 6 Clear the space station cache
        userSpaceService.delete(spaceId);

        return true;

    }

    @Override
    public void afterPropertiesSet() {

        this.socialCpIsvMessageService = applicationContext.getBean(ISocialCpIsvMessageService.class);

    }

}
