package com.vikadata.api.modular.user.strategey;

import java.util.List;

import javax.annotation.Resource;

import cn.hutool.core.collection.CollUtil;

import com.vikadata.api.component.TaskManager;
import com.vikadata.api.enums.action.TrackEventType;
import com.vikadata.api.enums.exception.SocialException;
import com.vikadata.api.enums.user.LinkType;
import com.vikadata.api.model.dto.client.ClientOriginInfo;
import com.vikadata.api.modular.base.service.SensorsService;
import com.vikadata.api.modular.social.enums.SocialAppType;
import com.vikadata.api.modular.social.service.ISocialTenantUserService;
import com.vikadata.api.modular.social.service.ISocialUserBindService;
import com.vikadata.api.modular.user.User;
import com.vikadata.api.modular.user.service.IUserLinkService;
import com.vikadata.api.util.InformationUtil;
import com.vikadata.core.exception.BusinessException;
import com.vikadata.entity.MemberEntity;
import com.vikadata.entity.UserEntity;

import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import static com.vikadata.api.enums.exception.UserException.SIGN_IN_ERROR;

/**
 * <p> 
 * DingTalk creates Social User policy implementation
 * </p>
 */
@Component
public class SocialDingTalkUserStrategey extends AbstractCreateSocialUser {
    @Resource
    private ISocialTenantUserService iSocialTenantUserService;

    @Resource
    private ISocialUserBindService iSocialUserBindService;

    @Resource
    private IUserLinkService iUserLinkService;

    @Resource
    private SensorsService sensorsService;

    @Override
    @Transactional(rollbackFor = Exception.class)
    public Long createSocialUser(User user) {
        if (user.getUnionId() == null) {
            throw new BusinessException(SocialException.GET_USER_INFO_ERROR);
        }
        String unionId = user.getUnionId();
        String openId = user.getOpenId();
        String tenantId = user.getTenantId();
        Long userId = iSocialUserBindService.getUserIdByUnionId(unionId);
        if (userId == null) {
            // Create User
            UserEntity entity = createUserAndCopyAvatar(user, SIGN_IN_ERROR);
            userId = entity.getId();
            // Create user activity record
            iPlayerActivityService.createUserActivityRecord(userId);
            // Create personal invitation code
            ivCodeService.createPersonalInviteCode(userId);
            // Third party platform integration - user bind
            iSocialUserBindService.create(userId, unionId);
            ClientOriginInfo origin = InformationUtil.getClientOriginInfo(false, true);
            // Shence burial site - registration
            Long finalUserId = userId;
            String scene = "钉钉";
            TaskManager.me().execute(() -> sensorsService.track(finalUserId, TrackEventType.REGISTER, scene, origin));
        }
        if (!iUserLinkService.checkUserLinkExists(userId, unionId, openId)) {
            iUserLinkService.createThirdPartyLink(userId, openId, unionId, user.getNickName(),
                    LinkType.DINGTALK.getType());
        }
        boolean isExistTenantUser = iSocialTenantUserService.isTenantUserOpenIdExist(user.getAppId(), tenantId, openId);
        if (!isExistTenantUser) {
            iSocialTenantUserService.create(user.getAppId(), tenantId, openId, unionId);
        }
        // Associate the members of the tenant space
        List<String> bindSpaceIds = iSocialTenantBindService.getSpaceIdsByTenantId(tenantId);
        if (CollUtil.isNotEmpty(bindSpaceIds)) {
            for (String bindSpaceId : bindSpaceIds) {
                // todo It is necessary to verify whether the open ID of the same enterprise downloading applications from two same service providers is the same
                MemberEntity member = iMemberService.getBySpaceIdAndOpenId(bindSpaceId, openId);
                if (member != null) {
                    MemberEntity updatedMember = new MemberEntity();
                    updatedMember.setId(member.getId());
                    updatedMember.setUserId(userId);
                    updatedMember.setIsActive(true);
                    iMemberService.updateById(updatedMember);
                }
            }
        }
        // New user ID
        return userId;
    }
}
