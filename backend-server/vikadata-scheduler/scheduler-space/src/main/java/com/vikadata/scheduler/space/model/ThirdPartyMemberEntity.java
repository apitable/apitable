package com.vikadata.scheduler.space.model;

import lombok.Data;

import java.time.LocalDateTime;

/**
 * <p>
 * 第三方系统-会员信息表
 * </p>
 *
 * @author Chambers
 * @since 2020/9/8
 */
@Data
public class ThirdPartyMemberEntity {

    /**
     * 主键
     */
    private Long id;

    /**
     * 应用 appid
     */
    private String appId;

    /**
     * 类型(0:微信小程序;1:微信公众号)
     */
    private Integer type;

    /**
     * 应用的唯一标识
     */
    private String openId;

    /**
     * 平台的唯一标识
     */
    private String unionId;

    /**
     * 会话密钥
     */
    private String sessionKey;

    /**
     * 手机号
     */
    private String mobile;

    /**
     * 昵称
     */
    private String nickName;

    /**
     * 头像
     */
    private String avatar;

    /**
     * 其他信息
     */
    private String extra;

    /**
     * 创建时间
     */
    private LocalDateTime createdAt;

    /**
     * 更新时间
     */
    private LocalDateTime updatedAt;
}
