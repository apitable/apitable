package com.vikadata.api.modular.social.model;

import lombok.Data;

/**
 * <p>
 * 飞书用户信息
 * </p>
 * @author zoe zheng
 * @date 2022/2/15 14:35
 */
@Data
public class SocialTenantUserDTO {

    private String openId;

    private String unionId;
}
