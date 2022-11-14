package com.vikadata.api.enterprise.social.service;

import java.util.List;

import com.baomidou.mybatisplus.extension.service.IService;

import com.vikadata.api.shared.cache.bean.SocialAuthInfo;
import com.vikadata.api.enterprise.social.enums.SocialPlatformType;
import com.vikadata.api.user.dto.UserRegisterResult;
import com.vikadata.entity.SocialUserEntity;
import com.vikadata.social.dingtalk.model.DingTalkUserDetail;

/**
 * Third party platform integration - user service interface
 */
public interface ISocialUserService extends IService<SocialUserEntity> {

    /**
     * Bulk Insert
     *
     * @param entities Entity List
     */
    void createBatch(List<SocialUserEntity> entities);

    /**
     * Record third-party platform users
     *
     * @param unionId      Third party platform user ID
     * @param platformType Third party platform type
     */
    void create(String unionId, SocialPlatformType platformType);

    /**
     * Access to third-party platform user information
     *
     * @param unionId Third party platform user ID
     * @return SocialUserEntity
     */
    SocialUserEntity getByUnionId(String unionId);

    /**
     * Batch delete
     *
     * @param unionIds Third party platform user ID
     */
    void deleteBatchByUnionId(List<String> unionIds);

    /**
     * For third-party platform applications, users can automatically register vika accounts through the mobile phone number bound to the platform
     *
     * @param authInfo Data required for registration
     * @return Default space name
     */
    Long signUpByMobile(SocialAuthInfo authInfo);


    /**
     * User login of DingTalk application
     *
     * @param userDetail User details obtained by DingTalk application
     * @param agentId Unique ID of authorized application
     * @return UserId of the user
     */
    UserRegisterResult dingTalkUserLogin(DingTalkUserDetail userDetail, String agentId);

    /**
     * Member Activation
     *
     * @param userId User ID
     * @param spaceId Space ID
     * @param userDetail Third party user details
     */
    void dingTalkActiveMember(Long userId, String spaceId, DingTalkUserDetail userDetail);
}
