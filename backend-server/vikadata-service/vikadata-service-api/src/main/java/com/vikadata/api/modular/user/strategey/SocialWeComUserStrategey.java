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
 * 企业微信创建SocialUser策略实现
 * </p>
 *
 * @author Pengap
 * @date 2021/8/23 11:24:07
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

        // TODO 先测试微信创建用户加锁，后面统一在策略工厂前加锁
        String lockKey = StrUtil.format("createSocialUser:wecom_{}_{}:{}", su.getTenantId(), su.getAppId(), su.getOpenId());
        Lock lock = redisLockRegistry.obtain(lockKey);
        try {
            if (lock.tryLock(100, TimeUnit.MILLISECONDS)) {
                try {
                    // 检查租户应用状态
                    this.checkTenantAppStatus(su.getTenantId(), su.getAppId());
                    // 检查应用绑定空间状态
                    String bindSpaceId = this.checkTenantAppBindSpace(su.getTenantId(), su.getAppId());
                    // 查询同企业不同应用下WeComUser 是否绑定VikaUser，如果绑定不创建用户，直接建立绑定关系
                    Long bindUserId = iSocialCpUserBindService.getUserIdByTenantIdAndAppIdAndCpUserId(su.getTenantId(), su.getAppId(), su.getOpenId());
                    // 租户空间的成员信息
                    MemberEntity member = iMemberService.getBySpaceIdAndOpenId(bindSpaceId, su.getOpenId());
                    ExceptionUtil.isNotNull(member, USER_NOT_EXIST_WECOM);
                    if (null != bindUserId) {
                        // 检查绑定关系是否存在意外未删除，但是成员信息已删除，重新建立关联关系
                        if (null == member.getUserId()) {
                            // 修改Member关联的VikaUserId（弥补操作）
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
                            // 企业微信服务商需要判断是否更新头像
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

                    // 查询同企业下企业微信成员是否存在绑定，如果有绑定关系，直接建立绑定关系，如果不存在则创建用户并且建立绑定关系
                    Long tenantAgentOtherBindUserId = iSocialCpUserBindService.getUserIdByTenantIdAndCpUserId(su.getTenantId(), su.getOpenId());
                    if (null == tenantAgentOtherBindUserId) {
                        // 创建用户
                        UserEntity entity = this.createUserAndCopyAvatar(user, SIGN_IN_ERROR);
                        // 创建用户活动记录
                        iPlayerActivityService.createUserActivityRecord(entity.getId());
                        // 创建个人邀请码
                        ivCodeService.createPersonalInviteCode(entity.getId());
                        bindUserId = entity.getId();
                        ClientOriginInfo origin = InformationUtil.getClientOriginInfo(false, true);
                        // 神策埋点 - 注册
                        Long finalBindUserId = bindUserId;
                        String scene = "企业微信";
                        TaskManager.me().execute(() -> sensorsService.track(finalBindUserId, TrackEventType.REGISTER, scene, origin));
                    }
                    else {
                        bindUserId = tenantAgentOtherBindUserId;
                        if (CharSequenceUtil.isNotBlank(su.getAvatar()) &&
                                su.getSocialPlatformType() == SocialPlatformType.WECOM && su.getSocialAppType() == SocialAppType.ISV) {
                            // 企业微信服务商需要判断是否更新头像
                            UserEntity userEntity = iUserService.getById(bindUserId);
                            if (CharSequenceUtil.isBlank(userEntity.getAvatar())) {
                                iUserService.updateById(UserEntity.builder()
                                        .id(bindUserId)
                                        .avatar(iAssetService.downloadAndUploadUrl(su.getAvatar()))
                                        .build());
                            }
                        }
                    }

                    // 绑定住户成员关联关系
                    Long cpTenantUserId = iSocialCpTenantUserService.getCpTenantUserId(su.getTenantId(), su.getAppId(), su.getOpenId());
                    if (null == cpTenantUserId) {
                        cpTenantUserId = iSocialCpTenantUserService.create(su.getTenantId(), su.getAppId(), su.getOpenId(), su.getUnionId());
                    }
                    boolean isBind = iSocialCpUserBindService.isCpTenantUserIdBind(bindUserId, cpTenantUserId);
                    if (!isBind) {
                        iSocialCpUserBindService.create(bindUserId, cpTenantUserId);
                    }

                    // 兜底逻辑，一个user只能绑定一个企业微信账号（TenantId + OpenId）
                    String linkedWeComUserId = iSocialCpUserBindService.getOpenIdByTenantIdAndUserId(su.getTenantId(), bindUserId);
                    if (null != linkedWeComUserId) {
                        ExceptionUtil.isTrue(linkedWeComUserId.equalsIgnoreCase(su.getOpenId()), USER_ALREADY_LINK_SAME_TYPE_ERROR_WECOM);
                    }
                    long tenantBindUserNum = iSocialCpUserBindService.countTenantBindByUserId(su.getTenantId(), bindUserId);
                    ExceptionUtil.isFalse(tenantBindUserNum > 1, USER_ALREADY_LINK_SAME_TYPE_ERROR_WECOM);

                    // 修改Member关联的VikaUserId
                    iMemberService.updateById(MemberEntity.builder().id(member.getId()).userId(bindUserId).isActive(true).build());
                    return bindUserId;
                }
                catch (Exception e) {
                    log.error("用户登陆操作失败", e);
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
            log.error("用户登陆操作频繁", e);
            // 获取锁被中断
            throw new BusinessException(UserException.REFRESH_MA_CODE_OFTEN);
        }
    }

}
