package com.vikadata.api.base.service;

import com.vikadata.api.user.dto.UserLoginDTO;
import com.vikadata.api.user.ro.LoginRo;

/**
 * Authorization related service interface
 */
public interface IAuthService {

    /**
     * Password login, only log in existing users, no need to automatically register an account
     * @param loginRo request parameters
     * @return user id
     */
    Long loginUsingPassword(LoginRo loginRo);

    /**
     * Login with mobile phone verification code, if it does not exist, the account will be registered automatically
     * @param loginRo request parameters
     * @return user id
     */
    UserLoginDTO loginUsingSmsCode(LoginRo loginRo);

    /**
     * Email login, only log in existing users, no need to automatically register an account
     * @param loginRo request parameters
     * @return user id
     */
    UserLoginDTO loginUsingEmailCode(LoginRo loginRo);

    /**
     * invite new user attachment capacity bonus
     *
     * @param userId   member id
     * @param userName member name
     * @param spaceId  space id
     */
    void checkSpaceRewardCapacity(Long userId, String userName, String spaceId);
}
