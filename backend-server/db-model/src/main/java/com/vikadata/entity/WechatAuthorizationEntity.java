package com.vikadata.entity;

import java.io.Serializable;
import java.time.LocalDateTime;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.Accessors;

/**
 * <p>
 * 第三方系统-微信第三方平台授权方信息表
 * </p>
 *
 * @author Mybatis Generator Tool
 */
@Data
@Builder(toBuilder = true)
@NoArgsConstructor
@AllArgsConstructor
@Accessors(chain = true)
@EqualsAndHashCode
@TableName(keepGlobalPrefix = true, value = "wechat_authorization")
public class WechatAuthorizationEntity implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * 主键
     */
    @TableId(value = "id", type = IdType.ASSIGN_ID)
    private Long id;

    /**
     * 授权方 appid
     */
    private String authorizerAppid;

    /**
     * 接口调用令牌
     */
    private String authorizerAccessToken;

    /**
     * 令牌有效期，单位：秒
     */
    private Long accessTokenExpire;

    /**
     * 刷新令牌
     */
    private String authorizerRefreshToken;

    /**
     * 昵称
     */
    private String nickName;

    /**
     * 头像
     */
    private String avatar;

    /**
     * 公众号类型 (0:订阅号,1:由历史老帐号升级后的订阅号,2:服务号)
     */
    private Integer serviceType;

    /**
     * 公众号/小程序（只有-1/0）认证类型 (-1:未认证,0:微信,1:新浪微博,2:腾讯微博,3:已资质认证通过但还未通过名称认证,4:已资质认证通过、还未通过名称认证，但通过了新浪微博认证,5:已资质认证通过、还未通过名称认证，但通过了腾讯微博认证)
     */
    private Integer verifyType;

    /**
     * 原始 ID
     */
    private String userName;

    /**
     * 公众号所设置的微信号
     */
    private String alias;

    /**
     * 主体名称
     */
    private String principalName;

    /**
     * 功能的开通状况（0代表未开通，1代表已开通）
     */
    private String businessInfo;

    /**
     * 二维码图片的 URL
     */
    private String qrcodeUrl;

    /**
     * 小程序帐号介绍
     */
    private String signature;

    /**
     * 小程序配置
     */
    private String miniprograminfo;

    /**
     * 创建时间
     */
    private LocalDateTime createdAt;

    /**
     * 更新时间
     */
    private LocalDateTime updatedAt;

}
