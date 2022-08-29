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
 * 钉钉创建SocialUser策略实现
 * </p> 
 * @author zoe zheng 
 * @date 2021/9/16 6:49 下午
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
            // 创建用户
            UserEntity entity = createUserAndCopyAvatar(user, SIGN_IN_ERROR);
            userId = entity.getId();
            // 创建用户活动记录
            iPlayerActivityService.createUserActivityRecord(userId);
            // 创建个人邀请码
            ivCodeService.createPersonalInviteCode(userId);
            // 第三方平台集成-用户绑定
            iSocialUserBindService.create(userId, unionId);
            ClientOriginInfo origin = InformationUtil.getClientOriginInfo(false, true);
            // 神策埋点 - 注册
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
        // 关联所在租户空间的成员
        List<String> bindSpaceIds = iSocialTenantBindService.getSpaceIdsByTenantId(tenantId);
        if (CollUtil.isNotEmpty(bindSpaceIds)) {
            for (String bindSpaceId : bindSpaceIds) {
                // todo 需要验证同一个企业下载两个相同服务商的应用，openID是否一样
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
        // 新建的userID
        return userId;
    }
}
