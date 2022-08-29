package com.vikadata.scheduler.space.model;

import lombok.Data;

import java.time.LocalDateTime;

/**
 * <p>
 * 用户微信信息表
 * </p>
 *
 * @author Chambers
 * @date 2020/9/8
 */
@Data
public class WechatMemberEntity {

    /**
     * 主键
     */
    private Long id;

    /**
     * 微信用户的唯一标识
     */
    private String openId;

    /**
     * 用户在微信开放平台的唯一标识符
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
     * 手机号（国外手机号会有区号）
     */
    private String fullMobile;

    /**
     * 区号
     */
    private String code;

    /**
     * 昵称
     */
    private String nickName;

    /**
     * 头像
     */
    private String avatar;

    /**
     * 性别
     */
    private String gender;

    /**
     * 语言
     */
    private String language;

    /**
     * 城市
     */
    private String city;

    /**
     * 省份
     */
    private String province;

    /**
     * 国家
     */
    private String country;

    /**
     * 删除标记(0:否,1:是)
     */
    private Boolean isDeleted;

    /**
     * 创建时间
     */
    private LocalDateTime createdAt;

    /**
     * 更新时间
     */
    private LocalDateTime updatedAt;
}
