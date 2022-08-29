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
 * 飞书创建SocialUser策略实现
 * </p>
 *
 * @author Pengap
 * @date 2021/8/23 11:22:14
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
        // 兼容跟换了主体信息，导致unionId发生改变
        if (userId == null && member != null && member.getUserId() != null) {
            // 创建关联用户,将userId和新的unionId关联上
            iSocialUserBindService.create(member.getUserId(), user.getUnionId());
            boolean isLink = iUserLinkService.isUserLink(user.getUnionId(), LinkType.FEISHU.getType());
            if (!isLink) {
                iUserLinkService.createThirdPartyLink(member.getUserId(), user.getOpenId(), user.getUnionId(), user.getNickName(), LinkType.FEISHU.getType());
            }
            userId = member.getUserId();
        }
        if (null == userId) {
            // 创建用户
            UserEntity entity = this.createUserAndCopyAvatar(user, SIGN_IN_ERROR);
            // 创建用户活动记录
            iPlayerActivityService.createUserActivityRecord(entity.getId());
            // 创建个人邀请码
            ivCodeService.createPersonalInviteCode(entity.getId());
            // 创建关联用户
            iSocialUserBindService.create(entity.getId(), user.getUnionId());
            boolean isLink = iUserLinkService.isUserLink(user.getUnionId(), LinkType.FEISHU.getType());
            if (!isLink) {
                iUserLinkService.createThirdPartyLink(entity.getId(), user.getOpenId(), user.getUnionId(), user.getNickName(), LinkType.FEISHU.getType());
            }
            userId = entity.getId();
            ClientOriginInfo origin = InformationUtil.getClientOriginInfo(false, true);
            // 神策埋点 - 注册
            Long finalUserId = userId;
            String scene = "飞书ISV";
            TaskManager.me().execute(() -> sensorsService.track(finalUserId, TrackEventType.REGISTER, scene, origin));
        }
        // 关联所在租户空间的成员
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
