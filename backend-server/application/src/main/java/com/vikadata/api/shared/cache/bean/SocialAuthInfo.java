package com.vikadata.api.shared.cache.bean;

import lombok.Data;

/**
 * <p>
 * social auth info
 * </p>
 *
 * @author Chambers
 */
@Data
public class SocialAuthInfo {

    @Deprecated
    private String areaCode;

    @Deprecated
    private String mobile;

    @Deprecated
    private String email;

    private String unionId;

    private String openId;

    private String nickName;

    private String avatar;

    /**
     * social type
     */
    private Integer type;

    /**
     * social tenant name
     */
    private String tenantName;
}
