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
 * 第三方平台集成 - 企业微信第三方服务商应用管理员变更处理
 * </p>
 * @author 刘斌华
 * @date 2022-01-19 11:32:21
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
                .format("没有找到可用的租户信息，tenantId：%s，appId：%s", authCorpId, suiteId)));
        if (socialTenantEntity.getAuthMode() == SocialTenantAuthMode.MEMBER.getValue()) {
            // 成员授权模式不受应用管理员影响，直接忽略
            return true;
        }

        // 如果需要，先刷新 access_token
        socialCpIsvService.refreshAccessToken(suiteId, unprocessed.getAuthCorpId(), socialTenantEntity.getPermanentCode());
        // 1 获取授权企业的空间站及其主管理员
        String spaceId = socialTenantBindService.getTenantBindSpaceId(authCorpId, suiteId);
        Assert.notBlank(spaceId, () -> new IllegalStateException(String
                .format("没有找到对应的空间站信息，tenantId：%s，appId：%s", authCorpId, suiteId)));
        MemberEntity adminMember = Optional.ofNullable(memberService.getAdminBySpaceId(spaceId))
                .orElse(null);
        // 2 获取应用变更后的管理员列表
        WxCpIsvServiceImpl wxCpIsvService = (WxCpIsvServiceImpl) weComTemplate.isvService(suiteId);
        WxCpTpXmlMessage xmlMessage = JSONUtil.toBean(unprocessed.getMessage(), WxCpTpXmlMessage.class);
        WxCpIsvAdmin wxCpIsvAdmin = wxCpIsvService.getAuthCorpAdminList(authCorpId, Integer.parseInt(xmlMessage.getAgentID()));
        List<WxCpIsvAdmin.Admin> isvAdmins = Optional.ofNullable(wxCpIsvAdmin.getAdmin())
                .map(admins -> admins.stream()
                        // 拥有管理权限的应用管理员才可以设置为空间站主管理员
                        .filter(item -> item.getAuthType() == 1)
                        .collect(Collectors.toList()))
                .orElse(null);
        List<String> adminOpenIds = Optional.ofNullable(isvAdmins)
                .map(admins -> admins.stream()
                        .map(WxCpIsvAdmin.Admin::getUserId)
                        .collect(Collectors.toList()))
                .orElse(null);
        // 3 设置变更后的空间站主管理员
        if (CollUtil.isEmpty(adminOpenIds)) {
            // 3.1 变更后应用管理员为空，则移除当前空间站管理员
            if (Objects.nonNull(adminMember)) {
                adminMember.setIsAdmin(false);
                memberService.updateById(adminMember);

                spaceService.removeMainAdmin(spaceId);
            }
        }
        else if (Objects.isNull(adminMember) || !CollUtil.contains(adminOpenIds, adminMember.getOpenId())) {
            // 3.2 空间站原来没有主管理员，或者已有的主管理员不属于变更后的应用管理员
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
                    // 3.2.1 将可见范围内管理员列表中的第一个人设置为空间站主管理员
                    socialCpIsvService.syncSingleUser(authCorpId, isvAdmin.getUserId(), suiteId, spaceId, true);
                    // 3.2.2 取消原来的主管理员
                    if (Objects.nonNull(adminMember)) {
                        adminMember.setIsAdmin(false);
                        memberService.updateById(adminMember);
                    }
                    hasAdmin = true;

                    break;
                }
            }
            // 3.3.3 如果没有可见范围内的管理员，则直接清除空间站主管理员
            if (!hasAdmin) {
                spaceService.removeMainAdmin(spaceId);
            }
        }
        // 5 清空临时缓存
        socialCpIsvService.clearCache(authCorpId);
        // 6 清空空间站缓存
        userSpaceService.delete(spaceId);

        return true;

    }

    @Override
    public void afterPropertiesSet() {

        this.socialCpIsvMessageService = applicationContext.getBean(ISocialCpIsvMessageService.class);

    }

}
