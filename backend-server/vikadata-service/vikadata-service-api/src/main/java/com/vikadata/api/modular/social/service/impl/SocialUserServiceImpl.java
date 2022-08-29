package com.vikadata.api.modular.social.service.impl;

import java.util.List;

import javax.annotation.Resource;

import cn.hutool.core.collection.CollUtil;
import cn.hutool.core.util.StrUtil;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import lombok.extern.slf4j.Slf4j;

import com.vikadata.api.cache.bean.SocialAuthInfo;
import com.vikadata.api.enums.exception.DatabaseException;
import com.vikadata.api.enums.social.SocialPlatformType;
import com.vikadata.api.enums.user.LinkType;
import com.vikadata.api.model.dto.user.UserRegisterResult;
import com.vikadata.api.modular.base.service.IAuthService;
import com.vikadata.api.modular.organization.mapper.MemberMapper;
import com.vikadata.api.modular.social.mapper.SocialUserMapper;
import com.vikadata.api.modular.social.service.IDingTalkService;
import com.vikadata.api.modular.social.service.ISocialTenantUserService;
import com.vikadata.api.modular.social.service.ISocialUserBindService;
import com.vikadata.api.modular.social.service.ISocialUserService;
import com.vikadata.api.modular.user.mapper.UserMapper;
import com.vikadata.api.modular.user.service.IUserLinkService;
import com.vikadata.api.modular.user.service.IUserService;
import com.vikadata.core.util.ExceptionUtil;
import com.vikadata.entity.MemberEntity;
import com.vikadata.entity.SocialUserEntity;
import com.vikadata.social.dingtalk.DingtalkConfig.AgentApp;
import com.vikadata.social.dingtalk.model.DingTalkServerAuthInfoResponse;
import com.vikadata.social.dingtalk.model.DingTalkUserDetail;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * 第三方平台集成-用户 服务接口 实现
 *
 * @author Shawn Deng
 * @date 2020-12-07 11:22:47
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
        // 手机号没有绑定维格账号，新建一个用户
        if (!userService.checkByCodeAndMobile(authInfo.getAreaCode(), authInfo.getMobile())) {
            DingTalkServerAuthInfoResponse serverAuthInfo = dingTalkService.getServerAuthInfo(agentId);
            authInfo.setTenantName(serverAuthInfo.getAuthCorpInfo().getCorpName());
            result.setUserId(signUpByMobile(authInfo));
            result.setNewUser(true);
        }
        else {
            result.setUserId(userMapper.selectIdByMobile(userDetail.getMobile()));
            // 如果没有绑定，就绑定第三方账号, 因为以前注册过的账号没有绑定，所以在登录的时候进行绑定
            if (!userLinkService.checkUserLinkExists(result.getUserId(), userDetail.getUnionid(), userDetail.getUserid())) {
                // 这里的用户类型和平台类型对应不上
                userLinkService.createThirdPartyLink(result.getUserId(), userDetail.getUserid(), userDetail.getUnionid(),
                        userDetail.getName(), 0);
            }
            // 检查是否有写入第三方平台集成-用户绑定
            if (!iSocialUserBindService.isUnionIdBind(result.getUserId(), userDetail.getUnionid())) {
                iSocialUserBindService.create(result.getUserId(), userDetail.getUnionid());
            }
        }
        // 没有写入第三方集成用户信息
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
        // 激活用户
        if (member != null) {
            // 更正成员方信息
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
