package com.vikadata.api.modular.user.strategey;

import java.util.concurrent.TimeUnit;
import java.util.concurrent.locks.Lock;

import javax.annotation.Resource;

import cn.hutool.core.text.CharSequenceUtil;
import cn.hutool.core.util.StrUtil;
import lombok.extern.slf4j.Slf4j;

import com.vikadata.api.component.TaskManager;
import com.vikadata.api.enums.action.TrackEventType;
import com.vikadata.api.enums.exception.UserException;
import com.vikadata.api.model.dto.client.ClientOriginInfo;
import com.vikadata.api.modular.base.service.SensorsService;
import com.vikadata.api.enums.social.SocialPlatformType;
import com.vikadata.api.modular.base.service.IAssetService;
import com.vikadata.api.modular.social.enums.SocialAppType;
import com.vikadata.api.modular.social.service.ISocialCpTenantUserService;
import com.vikadata.api.modular.social.service.ISocialCpUserBindService;
import com.vikadata.api.modular.user.SocialUser;
import com.vikadata.api.modular.user.User;
import com.vikadata.api.util.InformationUtil;
import com.vikadata.core.exception.BusinessException;
import com.vikadata.core.util.ExceptionUtil;
import com.vikadata.entity.MemberEntity;
import com.vikadata.entity.UserEntity;

import org.springframework.integration.redis.util.RedisLockRegistry;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import static com.vikadata.api.enums.exception.SocialException.USER_NOT_EXIST_WECOM;
import static com.vikadata.api.enums.exception.UserException.SIGN_IN_ERROR;
import static com.vikadata.api.enums.exception.UserException.USER_ALREADY_LINK_SAME_TYPE_ERROR_WECOM;

/**
 * <p>
 * WeCom creates Social User policy implementation
 * </p>
 */
@Slf4j
@Component
public class SocialWeComUserStrategey extends AbstractCreateSocialUser {

    @Resource
    private IAssetService iAssetService;
    @Resource
    private ISocialCpTenantUserService iSocialCpTenantUserService;

    @Resource
    private ISocialCpUserBindService iSocialCpUserBindService;

    @Resource
    private RedisLockRegistry redisLockRegistry;

    @Resource
    private SensorsService sensorsService;

    @Override
    @Transactional(rollbackFor = Exception.class)
    public Long createSocialUser(User user) {
        SocialUser su = (SocialUser) user;

        // TODO First test the locking of WeChat users, and then uniformly lock in front of the policy factory
        String lockKey = StrUtil.format("createSocialUser:wecom_{}_{}:{}", su.getTenantId(), su.getAppId(), su.getOpenId());
        Lock lock = redisLockRegistry.obtain(lockKey);
        try {
            if (lock.tryLock(100, TimeUnit.MILLISECONDS)) {
                try {
                    // Check tenant application status
                    this.checkTenantAppStatus(su.getTenantId(), su.getAppId());
                    // Check the status of application binding space
                    String bindSpaceId = this.checkTenantAppBindSpace(su.getTenantId(), su.getAppId());
                    // Query whether WeComUser is bound to vika user under different applications of the same enterprise.
                    // If the binding does not create a user, the binding relationship is established directly
                    Long bindUserId = iSocialCpUserBindService.getUserIdByTenantIdAndAppIdAndCpUserId(su.getTenantId(), su.getAppId(), su.getOpenId());
                    // Member information of tenant space
                    MemberEntity member = iMemberService.getBySpaceIdAndOpenId(bindSpaceId, su.getOpenId());
                    ExceptionUtil.isNotNull(member, USER_NOT_EXIST_WECOM);
                    if (null != bindUserId) {
                        // Check whether the binding relationship has not been deleted unexpectedly, but the member information has been deleted. Re establish the association relationship
                        if (null == member.getUserId()) {
                            // Modify the vika user id associated with a Member (make up operation)
                            MemberEntity condition = MemberEntity.builder()
                                    .id(member.getId())
                                    .memberName(su.getNickName())
                                    .userId(bindUserId)
                                    .isActive(true)
                                    .build();
                            iMemberService.updateById(condition);
                        }
                        if (CharSequenceUtil.isNotBlank(su.getAvatar()) &&
                                su.getSocialPlatformType() == SocialPlatformType.WECOM && su.getSocialAppType() == SocialAppType.ISV) {
                            // WeCom service provider needs to judge whether to update the avatar
                            UserEntity userEntity = iUserService.getById(bindUserId);
                            if (CharSequenceUtil.isBlank(userEntity.getAvatar())) {
                                iUserService.updateById(UserEntity.builder()
                                        .id(bindUserId)
                                        .avatar(iAssetService.downloadAndUploadUrl(su.getAvatar()))
                                        .build());
                            }
                        }

                        return bindUserId;
                    }

                    // Query whether there is a binding between WeChat members of enterprises under the same enterprise. If there is a binding relationship, establish a binding relationship directly.
                    // If not, create a user and establish a binding relationship
                    Long tenantAgentOtherBindUserId = iSocialCpUserBindService.getUserIdByTenantIdAndCpUserId(su.getTenantId(), su.getOpenId());
                    if (null == tenantAgentOtherBindUserId) {
                        // Create User
                        UserEntity entity = this.createUserAndCopyAvatar(user, SIGN_IN_ERROR);
                        // Create user activity record
                        iPlayerActivityService.createUserActivityRecord(entity.getId());
                        // Create personal invitation code
                        ivCodeService.createPersonalInviteCode(entity.getId());
                        bindUserId = entity.getId();
                        ClientOriginInfo origin = InformationUtil.getClientOriginInfo(false, true);
                        // Shence burial site - registration
                        Long finalBindUserId = bindUserId;
                        String scene = "企业微信";
                        TaskManager.me().execute(() -> sensorsService.track(finalBindUserId, TrackEventType.REGISTER, scene, origin));
                    }
                    else {
                        bindUserId = tenantAgentOtherBindUserId;
                        if (CharSequenceUtil.isNotBlank(su.getAvatar()) &&
                                su.getSocialPlatformType() == SocialPlatformType.WECOM && su.getSocialAppType() == SocialAppType.ISV) {
                            // WeCom service provider needs to judge whether to update the avatar
                            UserEntity userEntity = iUserService.getById(bindUserId);
                            if (CharSequenceUtil.isBlank(userEntity.getAvatar())) {
                                iUserService.updateById(UserEntity.builder()
                                        .id(bindUserId)
                                        .avatar(iAssetService.downloadAndUploadUrl(su.getAvatar()))
                                        .build());
                            }
                        }
                    }

                    // Bind household member association
                    Long cpTenantUserId = iSocialCpTenantUserService.getCpTenantUserId(su.getTenantId(), su.getAppId(), su.getOpenId());
                    if (null == cpTenantUserId) {
                        cpTenantUserId = iSocialCpTenantUserService.create(su.getTenantId(), su.getAppId(), su.getOpenId(), su.getUnionId());
                    }
                    boolean isBind = iSocialCpUserBindService.isCpTenantUserIdBind(bindUserId, cpTenantUserId);
                    if (!isBind) {
                        iSocialCpUserBindService.create(bindUserId, cpTenantUserId);
                    }

                    // Bottom line logic: one user can only bind to one enterprise WeChat account (TenantId+OpenId)
                    String linkedWeComUserId = iSocialCpUserBindService.getOpenIdByTenantIdAndUserId(su.getTenantId(), bindUserId);
                    if (null != linkedWeComUserId) {
                        ExceptionUtil.isTrue(linkedWeComUserId.equalsIgnoreCase(su.getOpenId()), USER_ALREADY_LINK_SAME_TYPE_ERROR_WECOM);
                    }
                    long tenantBindUserNum = iSocialCpUserBindService.countTenantBindByUserId(su.getTenantId(), bindUserId);
                    ExceptionUtil.isFalse(tenantBindUserNum > 1, USER_ALREADY_LINK_SAME_TYPE_ERROR_WECOM);

                    // Modify the vika user id associated with a Member
                    iMemberService.updateById(MemberEntity.builder().id(member.getId()).userId(bindUserId).isActive(true).build());
                    return bindUserId;
                }
                catch (Exception e) {
                    log.error("User login operation failed", e);
                    throw e;
                }
                finally {
                    lock.unlock();
                }
            }
            else {
                throw new BusinessException(UserException.REFRESH_MA_CODE_OFTEN);
            }
        }
        catch (InterruptedException e) {
            log.error("Frequent user login operations", e);
            // Obtaining lock is interrupted
            throw new BusinessException(UserException.REFRESH_MA_CODE_OFTEN);
        }
    }

}
