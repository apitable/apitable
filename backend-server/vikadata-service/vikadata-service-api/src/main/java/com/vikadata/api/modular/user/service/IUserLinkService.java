package com.vikadata.api.modular.user.service;

import java.util.List;

import com.baomidou.mybatisplus.extension.service.IService;

import com.vikadata.api.cache.bean.SocialAuthInfo;
import com.vikadata.api.enums.user.LinkType;
import com.vikadata.entity.UserLinkEntity;

/**
 * <p>
 * Basic - Account Association Table Service Class
 * </p>
 */
public interface IUserLinkService extends IService<UserLinkEntity> {

    /**
     * Create associations
     *
     * @param userId         User ID
     * @param wechatMemberId WeChat member ID
     */
    void create(Long userId, Long wechatMemberId);

    /**
     * Check whether the third-party account is associated with other vika accounts
     *
     * @param unionId unionId
     * @param type    Third party association type
     */
    void checkThirdPartyLinkOtherUser(String unionId, Integer type);

    /**
     * Create Third Party Association
     *
     * @param userId   User ID
     * @param authInfo User authorization information
     * @param check    Check whether they are associated with other accounts
     * @param type     Third party association type
     */
    void createUserLink(Long userId, SocialAuthInfo authInfo, boolean check, Integer type);

    /**
     * Create third-party account association
     *
     * @param userId   User ID
     * @param openId   Third party platform user ID
     * @param unionId  Third party platform unified ID
     * @param nickName User nickname
     * @param type     {@code LinkType} Association Type
     */
    void createThirdPartyLink(Long userId, String openId, String unionId, String nickName, int type);

    /**
     * Whether it is associated with a third-party account
     *
     * @param unionId  Third party platform unified ID
     * @param linkType Association Type
     * @return True | False
     */
    boolean isUserLink(String unionId, int linkType);

    /**
     * Batch delete
     *
     * @param unionIds Third party platform user ID
     */
    void deleteBatchByUnionId(List<String> unionIds);

    /**
     * Check whether the user is bound to a third-party account
     *
     * @param userId User ID
     * @param unionId Third party account unique ID
     * @param openId Third party account ID
     * @return boolean
     */
    Boolean checkUserLinkExists(Long userId, String unionId, String openId);

    /**
     * Batch delete
     *
     * @param openIds Unique identification within open applications
     * @param type Application User Type
     */
    void deleteBatchOpenId(List<String> openIds, int type);

    /**
     * Batch delete
     *
     * @param unionId Unique identification within open applications
     * @param openId Unique identification within open applications
     * @param linkType Application User Type
     */
    Long getUserIdByUnionIdAndOpenId(String unionId, String openId, LinkType linkType);
}
