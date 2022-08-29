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

/**
 * <p>
 *
 * </p>
 *
 * @author Pengap
 * @date 2021/8/23 11:49:12
 */
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
     * 检查企业应用状态
     *
     * @param tenantId  应用企业Id
     * @param appId     应用Id
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
     * 检查企业应用是否绑定空间
     * @param tenantId  应用企业Id
     * @param appId     应用Id
     * @return 绑定的空间ID
     */
    protected String checkTenantAppBindSpace(String tenantId, String appId) {
        String bindSpaceId = iSocialTenantBindService.getTenantBindSpaceId(tenantId, appId);
        ExceptionUtil.isNotBlank(bindSpaceId, NODE_NOT_EXIST);
        return bindSpaceId;
    }

    /**
     * 创建用户并且上传头像
     *
     * @param user  用户参数
     * @param saveException 保存异常
     */
    @Transactional(rollbackFor = Exception.class)
    public UserEntity createUserAndCopyAvatar(User user, BaseException saveException) {
        String avatar = iAssetService.downloadAndUploadUrl(user.getAvatar());
        UserEntity entity = UserEntity.builder()
                .uuid(IdUtil.fastSimpleUUID())
                .nickName(user.getNickName())
                .avatar(avatar)
                .lastLoginTime(LocalDateTime.now())
                // 目前只有企业微信服务商需要设置该字段
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
