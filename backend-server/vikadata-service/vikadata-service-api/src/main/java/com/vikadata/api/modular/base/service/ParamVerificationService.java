package com.vikadata.api.modular.base.service;

/**
* <p>
* 参数验证相关服务接口
* </p>
*
* @author Chambers
* @date 2019/11/30
*/
public interface ParamVerificationService {

    /**
     * 验证手机号
     *
     * @param phone 手机号
     * @author Chambers
     * @date 2019/11/30
     */
    void verifyPhone(String phone);

    /**
     * 验证密码
     *
     * @param password 密码
     * @author Chambers
     * @date 2019/11/30
     */
    void verifyPassword(String password);
}
