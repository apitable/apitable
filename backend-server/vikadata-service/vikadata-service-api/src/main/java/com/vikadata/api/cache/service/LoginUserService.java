package com.vikadata.api.cache.service;

import com.vikadata.api.cache.bean.LoginUserDto;

/**
 * <p>
 * login user cache interface
 * </p>
 *
 * @author Shawn Deng
 */
public interface LoginUserService {

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
