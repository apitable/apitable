package com.vikadata.api.model.dto.user;

import lombok.Data;

/**
 * <p>
 * 用户注册结果信息
 * </p>
 *
 * @author Chambers
 * @date 2020/11/6
 */
@Data
public class UserRegisterResult {

    /**
     * 用户ID
     */
    private Long userId;

    /**
     * 是否为新用户
     */
    private boolean isNewUser;

    /**
     * 关联的第三方类型
     */
    private Integer type;

    /**
     * 第三方平台用户标识
     */
    private String unionId;

    /**
     * 邮箱注册
     */
    private boolean emailRegister;
}
