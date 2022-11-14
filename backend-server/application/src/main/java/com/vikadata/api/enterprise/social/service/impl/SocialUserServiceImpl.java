package com.vikadata.api.enterprise.social.service.impl;

import java.util.List;

import javax.annotation.Resource;

import cn.hutool.core.collection.CollUtil;
import cn.hutool.core.util.StrUtil;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import lombok.extern.slf4j.Slf4j;

import com.vikadata.api.shared.cache.bean.SocialAuthInfo;
import com.vikadata.api.enterprise.social.mapper.SocialUserMapper;
import com.vikadata.api.base.enums.DatabaseException;
import com.vikadata.api.enterprise.social.enums.SocialPlatformType;
import com.vikadata.api.user.enums.LinkType;
import com.vikadata.api.user.dto.UserRegisterResult;
import com.vikadata.api.base.service.IAuthService;
import com.vikadata.api.organization.mapper.MemberMapper;
import com.vikadata.api.enterprise.social.service.IDingTalkService;
import com.vikadata.api.enterprise.social.service.ISocialTenantUserService;
import com.vikadata.api.enterprise.social.service.ISocialUserBindService;
import com.vikadata.api.enterprise.social.service.ISocialUserService;
import com.vikadata.api.user.mapper.UserMapper;
import com.vikadata.api.user.service.IUserLinkService;
import com.vikadata.api.user.service.IUserService;
import com.vikadata.core.util.ExceptionUtil;
import com.vikadata.entity.MemberEntity;
import com.vikadata.entity.SocialUserEntity;
import com.vikadata.social.dingtalk.DingtalkConfig.AgentApp;
import com.vikadata.social.dingtalk.model.DingTalkServerAuthInfoResponse;
import com.vikadata.social.dingtalk.model.DingTalkUserDetail;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Third party platform integration - user service interface implementation
 */
@Service
@Slf4j
public class SocialUserServiceImpl extends ServiceImpl<SocialUserMapper, SocialUserEntity> implements ISocialUserService {

    @Resource
    private SocialUserMapper socialUserMapper;

    @Resource
    private ISocialUserBindService iSocialUserBindService;

    @Resource
    private IUserService userService;

    @Resource
    private IAuthService authService;

    @Resource
    private MemberMapper memberMapper;

    @Resource
    private UserMapper userMapper;

    @Resource
    private IUserLinkService userLinkService;

    @Resource
    private ISocialTenantUserService socialTenantUserService;

    @Resource
    private IDingTalkService dingTalkService;


    @Override
    public void createBatch(List<SocialUserEntity> entities) {
        if (CollUtil.isEmpty(entities)) {
            return;
        }
        socialUserMapper.insertBatch(entities);
    }

    @Override
    public void create(String unionId, SocialPlatformType platformType) {
        SocialUserEntity socialUser = new SocialUserEntity();
        socialUser.setUnionId(unionId);
        socialUser.setPlatform(platformType.getValue());
        boolean saveFlag = save(socialUser);
        ExceptionUtil.isTrue(saveFlag, DatabaseException.INSERT_ERROR);
    }

    @Override
    public SocialUserEntity getByUnionId(String unionId) {
        return socialUserMapper.selectByUnionId(unionId);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void deleteBatchByUnionId(List<String> unionIds) {
        if (CollUtil.isEmpty(unionIds)) {
            return;
        }
        socialUserMapper.deleteByUnionIds(unionIds);
    }

    @Override
    public Long signUpByMobile(SocialAuthInfo authInfo) {
        String token = authService.saveAuthInfoToCache(authInfo);
        UserRegisterResult result = authService.signUpByInviteCode(token, null);
        return result.getUserId();
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public UserRegisterResult dingTalkUserLogin(DingTalkUserDetail userDetail, String agentId) {
        UserRegisterResult result = new UserRegisterResult();
        SocialAuthInfo authInfo = new SocialAuthInfo();
        authInfo.setEmail(userDetail.getEmail());
        authInfo.setMobile(userDetail.getMobile());
        authInfo.setAreaCode(StrUtil.prependIfMissing(userDetail.getStateCode(), "+"));
        authInfo.setAvatar(userDetail.getAvatar());
        authInfo.setNickName(userDetail.getName());
        authInfo.setOpenId(userDetail.getUserid());
        authInfo.setUnionId(userDetail.getUnionid());
        authInfo.setType(LinkType.DINGTALK.getType());
        // The mobile phone number is not bound to a vika account. Create a new user
        if (!userService.checkByCodeAndMobile(authInfo.getAreaCode(), authInfo.getMobile())) {
            DingTalkServerAuthInfoResponse serverAuthInfo = dingTalkService.getServerAuthInfo(agentId);
            authInfo.setTenantName(serverAuthInfo.getAuthCorpInfo().getCorpName());
            result.setUserId(signUpByMobile(authInfo));
            result.setNewUser(true);
        }
        else {
            result.setUserId(userMapper.selectIdByMobile(userDetail.getMobile()));
            // If there is no binding, bind the third-party account. Because the previously registered account is not bound, bind it when logging in
            if (!userLinkService.checkUserLinkExists(result.getUserId(), userDetail.getUnionid(), userDetail.getUserid())) {
                // The user type here does not correspond to the platform type
                userLinkService.createThirdPartyLink(result.getUserId(), userDetail.getUserid(), userDetail.getUnionid(),
                        userDetail.getName(), 0);
            }
            // Check whether the third-party platform integration user binding is written
            if (!iSocialUserBindService.isUnionIdBind(result.getUserId(), userDetail.getUnionid())) {
                iSocialUserBindService.create(result.getUserId(), userDetail.getUnionid());
            }
        }
        // No third-party integrated user information is written
        String tenantId = dingTalkService.getTenantIdByAgentId(agentId);
        AgentApp agentApp = dingTalkService.getAgentAppById(agentId);
        if (!socialTenantUserService.isTenantUserOpenIdExist(agentApp.getCustomKey(), tenantId, userDetail.getUserid())) {
            socialTenantUserService.create(agentApp.getCustomKey(), tenantId, userDetail.getUserid(), userDetail.getUnionid());
        }
        return result;
    }

    @Override
    public void dingTalkActiveMember(Long userId, String spaceId, DingTalkUserDetail userDetail) {
        MemberEntity member = memberMapper.selectBySpaceIdAndOpenId(spaceId, userDetail.getUserid());
        // Activate User
        if (member != null) {
            // Correct member information
            if (StrUtil.isBlank(member.getEmail())) {
                member.setEmail(userDetail.getEmail());
            }
            if (StrUtil.isBlank(member.getMobile())) {
                member.setMobile(userDetail.getMobile());
            }
            if (StrUtil.isBlank(member.getPosition())) {
                member.setPosition(userDetail.getTitle());
            }
            member.setIsActive(true);
            member.setUserId(userId);
            member.setOpenId(userDetail.getUserid());
            memberMapper.updateById(member);
        }
    }
}
