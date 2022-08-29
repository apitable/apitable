package com.vikadata.social.qq;

/**
 * QQ开放平台接口
 *
 * @author Shawn Deng
 * @date 2021-01-11 19:23:19
 */
public interface QQ {

    /**
     * 授权模块接口
     *
     * @return AuthOperations
     */
    AuthOperations authOperations();
}
