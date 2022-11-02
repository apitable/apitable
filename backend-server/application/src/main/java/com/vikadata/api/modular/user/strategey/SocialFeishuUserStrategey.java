package com.vikadata.api.modular.user.strategey;

import javax.annotation.Resource;

import cn.hutool.core.util.StrUtil;

import com.vikadata.api.component.TaskManager;
import com.vikadata.api.enums.action.TrackEventType;
import com.vikadata.api.enums.exception.SocialException;
import com.vikadata.api.enums.user.LinkType;
import com.vikadata.api.model.dto.client.ClientOriginInfo;
import com.vikadata.api.modular.base.service.SensorsService;
import com.vikadata.api.modular.organization.service.IMemberService;
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
 * Lark creates social user policy implementation
 * </p>
 */
@Component
public class SocialFeishuUserStrategey extends AbstractCreateSocialUser {

    @Resource
    private ISocialUserBindService iSocialUserBindService;

    @Resource
    private IUserLinkService iUserLinkService;

    @Resource
    private IMemberService iMemberService;

    @Resource
    private SensorsService sensorsService;

    @Override
    @Transactional(rollbackFor = Exception.class)
    public Long createSocialUser(User user) {
        if (user.getUnionId() == null) {
            throw new BusinessException(SocialException.GET_USER_INFO_ERROR);
        }
        Long userId = iSocialUserBindService.getUserIdByUnionId(user.getUnionId());
        String bindSpaceId = iSocialTenantBindService.getTenantDepartmentBindSpaceId(user.getAppId(), user.getTenantId());
        MemberEntity member = null;
        if (StrUtil.isNotBlank(bindSpaceId)) {
            member = iMemberService.getBySpaceIdAndOpenId(bindSpaceId, user.getOpenId());
        }
        // Compatible with the change of the subject information, resulting in the change of the union ID
        if (userId == null && member != null && member.getUserId() != null) {
            // Create an associated user and associate the user ID with the new union ID
            iSocialUserBindService.create(member.getUserId(), user.getUnionId());
            boolean isLink = iUserLinkService.isUserLink(user.getUnionId(), LinkType.FEISHU.getType());
            if (!isLink) {
                iUserLinkService.createThirdPartyLink(member.getUserId(), user.getOpenId(), user.getUnionId(), user.getNickName(), LinkType.FEISHU.getType());
            }
            userId = member.getUserId();
        }
        if (null == userId) {
            // Create User
            UserEntity entity = this.createUserAndCopyAvatar(user, SIGN_IN_ERROR);
            // Create user activity record
            iPlayerActivityService.createUserActivityRecord(entity.getId());
            // Create personal invitation code
            ivCodeService.createPersonalInviteCode(entity.getId());
            // Create Associated User
            iSocialUserBindService.create(entity.getId(), user.getUnionId());
            boolean isLink = iUserLinkService.isUserLink(user.getUnionId(), LinkType.FEISHU.getType());
            if (!isLink) {
                iUserLinkService.createThirdPartyLink(entity.getId(), user.getOpenId(), user.getUnionId(), user.getNickName(), LinkType.FEISHU.getType());
            }
            userId = entity.getId();
            ClientOriginInfo origin = InformationUtil.getClientOriginInfo(false, true);
            // Shence burial site - registration
            Long finalUserId = userId;
            String scene = "飞书ISV";
            TaskManager.me().execute(() -> sensorsService.track(finalUserId, TrackEventType.REGISTER, scene, origin));
        }
        // Associate the members of the tenant space
        if (member != null) {
            MemberEntity updatedMember = new MemberEntity();
            updatedMember.setId(member.getId());
            updatedMember.setUserId(userId);
            updatedMember.setIsActive(true);
            iMemberService.updateById(updatedMember);
        }
        return userId;
    }

}
