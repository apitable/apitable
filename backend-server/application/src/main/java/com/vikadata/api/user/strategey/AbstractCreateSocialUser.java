package com.vikadata.api.user.strategey;

import java.time.LocalDateTime;

import javax.annotation.Resource;

import cn.hutool.core.util.BooleanUtil;
import cn.hutool.core.util.IdUtil;
import lombok.extern.slf4j.Slf4j;

import com.vikadata.api.enterprise.social.enums.SocialException;
import com.vikadata.api.enterprise.social.enums.SocialPlatformType;
import com.vikadata.api.asset.service.IAssetService;
import com.vikadata.api.organization.service.IMemberService;
import com.vikadata.api.player.service.IPlayerActivityService;
import com.vikadata.api.enterprise.social.enums.SocialAppType;
import com.vikadata.api.enterprise.social.enums.SocialNameModified;
import com.vikadata.api.enterprise.social.service.ISocialTenantBindService;
import com.vikadata.api.enterprise.social.service.ISocialTenantService;
import com.vikadata.api.user.model.User;
import com.vikadata.api.user.service.IUserService;
import com.vikadata.api.enterprise.vcode.service.IVCodeService;
import com.vikadata.core.exception.BaseException;
import com.vikadata.core.exception.BusinessException;
import com.vikadata.core.util.ExceptionUtil;
import com.vikadata.entity.SocialTenantEntity;
import com.vikadata.api.user.entity.UserEntity;

import org.springframework.transaction.annotation.Transactional;

import static com.vikadata.api.workspace.enums.PermissionException.NODE_NOT_EXIST;

@Slf4j
public abstract class AbstractCreateSocialUser implements CreateSocialUserStrategey {

    @Resource
    private IAssetService iAssetService;

    @Resource
    protected IUserService iUserService;

    @Resource
    protected IMemberService iMemberService;

    @Resource
    protected ISocialTenantService iSocialTenantService;

    @Resource
    protected ISocialTenantBindService iSocialTenantBindService;

    @Resource
    protected IPlayerActivityService iPlayerActivityService;

    @Resource
    protected IVCodeService ivCodeService;

    /**
     * Check enterprise application status
     *
     * @param tenantId  Application Enterprise ID
     * @param appId     App ID
     */
    protected void checkTenantAppStatus(String tenantId, String appId) {
        SocialTenantEntity tenant = iSocialTenantService.getByAppIdAndTenantId(appId, tenantId);
        if (tenant == null) {
            throw new BusinessException(SocialException.TENANT_NOT_EXIST);
        }
        if (BooleanUtil.isFalse(tenant.getStatus())) {
            throw new BusinessException(SocialException.TENANT_DISABLED);
        }
    }

    /**
     * Check whether the enterprise application is bound to the space
     *
     * @param tenantId  Application Enterprise ID
     * @param appId     App ID
     * @return Bound space ID
     */
    protected String checkTenantAppBindSpace(String tenantId, String appId) {
        String bindSpaceId = iSocialTenantBindService.getTenantBindSpaceId(tenantId, appId);
        ExceptionUtil.isNotBlank(bindSpaceId, NODE_NOT_EXIST);
        return bindSpaceId;
    }

    /**
     * Create users and upload avatars
     *
     * @param user  User parameters
     * @param saveException Save Exception
     */
    @Transactional(rollbackFor = Exception.class)
    public UserEntity createUserAndCopyAvatar(User user, BaseException saveException) {
        String avatar = iAssetService.downloadAndUploadUrl(user.getAvatar());
        UserEntity entity = UserEntity.builder()
                .uuid(IdUtil.fastSimpleUUID())
                .nickName(user.getNickName())
                .avatar(avatar)
                .lastLoginTime(LocalDateTime.now())
                // Currently, only enterprise WeChat service providers need to set this field
                .isSocialNameModified(user.getSocialPlatformType() == SocialPlatformType.WECOM && user.getSocialAppType() == SocialAppType.ISV ?
                        SocialNameModified.NO.getValue() : SocialNameModified.NO_SOCIAL.getValue())
                .build();
        boolean flag = iUserService.save(entity);
        if (!flag) {
            throw new BusinessException(saveException);
        }
        return entity;
    }

}
