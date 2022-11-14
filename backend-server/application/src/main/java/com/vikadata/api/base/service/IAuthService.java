package com.vikadata.api.base.service;

import com.vikadata.api.shared.cache.bean.SocialAuthInfo;
import com.vikadata.api.user.dto.UserLoginResult;
import com.vikadata.api.user.dto.UserRegisterResult;
import com.vikadata.api.user.ro.LoginRo;

/**
 * Authorization related service interface
 */
public interface IAuthService {

    /**
     * login request
     *
     * @param loginRo request parameters
     * @return Long user id
     */
    @Deprecated
    Long loginByPassword(LoginRo loginRo);

    /**
     * Password login, only log in existing users, no need to automatically register an account
     * @param loginRo request parameters
     * @return user id
     */
    Long loginUsingPassword(LoginRo loginRo);

    /**
     * Login with SMS verification code
     *
     * @param loginRo request parameters
     * @return result
     */
    @Deprecated
    UserLoginResult loginBySmsCode(LoginRo loginRo);

    /**
     * Login with mobile phone verification code, if it does not exist, the account will be registered automatically
     * @param loginRo request parameters
     * @return user id
     */
    UserLoginResult loginUsingSmsCode(LoginRo loginRo);

    /**
     * Email verification code login
     *
     * @param loginRo request parameters
     * @return result
     */
    @Deprecated
    UserLoginResult loginByEmailCode(LoginRo loginRo);

    /**
     * Email login, only log in existing users, no need to automatically register an account
     * @param loginRo request parameters
     * @return user id
     */
    UserLoginResult loginUsingEmailCode(LoginRo loginRo);

    /**
     * Invitation code to register new user
     *
     * @param token      token
     * @param inviteCode invitation code
     * @return result
     */
    @Deprecated
    UserRegisterResult signUpByInviteCode(String token, String inviteCode);

    /**
     * Save user authorization information to cache
     *
     * @param authInfo User authorization information
     * @return token
     */
    String saveAuthInfoToCache(SocialAuthInfo authInfo);

    /**
     * Get user information from cache
     *
     * @param token token
     * @return UserAuthInfo
     */
    SocialAuthInfo getAuthInfoFromCache(String token);

    /**
     * official invitation code rewards
     *
     * @param registerUserId    registered user id
     */
    void officialInvitedReward(Long registerUserId);

    /**
     * personal invitation code reward
     *
     * @param registerUserId    registered user id
     * @param registerUserName  registered user nickname
     * @param inviteUserId      inviter user id
     */
    void personalInvitedReward(Long registerUserId, String registerUserName, Long inviteUserId);

    /**
     * invite new user attachment capacity bonus
     *
     * @param userId   member id
     * @param userName member name
     * @param spaceId  space id
     */
    void checkSpaceRewardCapacity(Long userId, String userName, String spaceId);
}
