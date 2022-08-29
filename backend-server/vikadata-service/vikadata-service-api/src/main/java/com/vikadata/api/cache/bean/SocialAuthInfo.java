package com.vikadata.api.cache.bean;

import lombok.Data;

/**
 * <p>
 * 第三方登录授权信息的保存
 * </p>
 *
 * @author Chambers
 * @date 2020/8/27
 */
@Data
public class SocialAuthInfo {

    /**
     * 注册手机区号
     */
    @Deprecated
    private String areaCode;

    /**
     * 注册手机号
     */
    @Deprecated
    private String mobile;

    /**
     * 注册邮箱
     */
    @Deprecated
    private String email;

    /**
     * unionId
     */
    private String unionId;

    /**
     * openId
     */
    private String openId;

    /**
     * 第三方用户昵称
     */
    private String nickName;

    /**
     * 第三方用户头像
     */
    private String avatar;

    /**
     * 关联的第三方类型(飞书、微信公众号、钉钉、)
     */
    private Integer type;

    /**
     * 关联第三方企业名称
     */
    private String tenantName;
}
