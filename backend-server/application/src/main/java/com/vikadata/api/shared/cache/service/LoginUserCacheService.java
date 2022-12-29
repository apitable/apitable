package com.vikadata.api.shared.cache.service;

import com.vikadata.api.shared.cache.bean.LoginUserDto;

/**
 * <p>
 * login user cache interface
 * </p>
 *
 * @author Shawn Deng
 */
public interface LoginUserCacheService {

    /**
     * get login user info
     *
     * @param userId user id
     * @return LoginUserDto
     */
    LoginUserDto getLoginUser(Long userId);

    /**
     * delete cache
     *
     * @param userId user id
     */
    void delete(Long userId);
}
