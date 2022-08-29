package com.vikadata.api.cache.service;

import com.vikadata.api.cache.bean.LoginUserDto;

/**
 * <p>
 * 登录用户服务接口
 * </p>
 *
 * @author Shawn Deng
 * @date 2019/11/12 17:22
 */
public interface LoginUserService {

    /**
     * 获取登录信息
     *
     * @param userId 用户ID
     * @return LoginUserDto
     * @author Shawn Deng
     * @date 2019/11/14 10:54
     */
    LoginUserDto getLoginUser(Long userId);

    /**
     * 删除登录信息
     *
     * @param userId 用户ID
     * @author Chambers
     * @date 2019/11/28
     */
    void delete(Long userId);
}
