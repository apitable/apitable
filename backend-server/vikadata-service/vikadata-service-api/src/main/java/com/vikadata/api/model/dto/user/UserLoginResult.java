package com.vikadata.api.model.dto.user;

import lombok.Data;

/**
 * <p>
 * 用户登录结果信息
 * </p>
 *
 * @author Chambers
 * @date 2020/8/26
 */
@Data
public class UserLoginResult {

    /**
     * 用户ID
     */
    private Long userId;

    /**
     * 第三方平台用户标识
     */
    private String unionId;

    /**
     * 用户昵称
     */
    private String nickName;

    /**
     * 是否是新注册
     */
    private Boolean isSignUp;

    /**
     * 用户授权信息令牌
     */
    @Deprecated
    private String token;
}
