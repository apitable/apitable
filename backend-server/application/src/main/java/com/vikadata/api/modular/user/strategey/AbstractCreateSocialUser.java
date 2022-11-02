package com.vikadata.api.modular.user.strategey;

import java.time.LocalDateTime;

import javax.annotation.Resource;

import cn.hutool.core.util.BooleanUtil;
import cn.hutool.core.util.IdUtil;
import lombok.extern.slf4j.Slf4j;

import com.vikadata.api.enums.exception.SocialException;
import com.vikadata.api.enums.social.SocialPlatformType;
import com.vikadata.api.modular.base.service.IAssetService;
import com.vikadata.api.modular.organization.service.IMemberService;
import com.vikadata.api.modular.player.service.IPlayerActivityService;
import com.vikadata.api.modular.social.enums.SocialAppType;
import com.vikadata.api.modular.social.enums.SocialNameModified;
import com.vikadata.api.modular.social.service.ISocialTenantBindService;
import com.vikadata.api.modular.social.service.ISocialTenantService;
import com.vikadata.api.modular.user.User;
import com.vikadata.api.modular.user.service.IUserService;
import com.vikadata.api.modular.vcode.service.IVCodeService;
import com.vikadata.core.exception.BaseException;
import com.vikadata.core.exception.BusinessException;
import com.vikadata.core.util.ExceptionUtil;
import com.vikadata.entity.SocialTenantEntity;
import com.vikadata.entity.UserEntity;

import org.springframework.transaction.annotation.Transactional;

import static com.vikadata.api.enums.exception.PermissionException.NODE_NOT_EXIST;

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
