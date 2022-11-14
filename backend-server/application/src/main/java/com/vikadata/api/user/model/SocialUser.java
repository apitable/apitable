package com.vikadata.api.user.model;

import lombok.Data;

import com.vikadata.api.enterprise.social.enums.SocialPlatformType;
import com.vikadata.api.enterprise.social.enums.SocialAppType;
import com.vikadata.api.user.factory.SocialFeishuBuilder;
import com.vikadata.api.user.factory.SocialWeComBuilder;

@Data
public class SocialUser implements User {

    private String nickName;

    private String avatar;

    private String tenantId;

    private String openId;

    private String unionId;

    private String appId;

    private String areaCode;

    private String telephoneNumber;

    private String emailAddress;

    private SocialPlatformType socialPlatformType;

    private SocialAppType socialAppType;

    public SocialUser() {
    }

    public SocialUser(String nickName, String avatar, String appId, String tenantId, String openId, String unionId, SocialPlatformType socialPlatformType) {
        this.nickName = nickName;
        this.avatar = avatar;
        this.appId = appId;
        this.tenantId = tenantId;
        this.openId = openId;
        this.unionId = unionId;
        this.socialPlatformType = socialPlatformType;
    }

    public SocialUser(String nickName, String avatar,
            String areaCode, String telephoneNumber, String emailAddress,
            String appId, String tenantId, String openId, String unionId, SocialPlatformType socialPlatformType) {
        this.nickName = nickName;
        this.avatar = avatar;
        this.areaCode = areaCode;
        this.telephoneNumber = telephoneNumber;
        this.emailAddress = emailAddress;
        this.appId = appId;
        this.tenantId = tenantId;
        this.openId = openId;
        this.unionId = unionId;
        this.socialPlatformType = socialPlatformType;
    }

    /**
     * Lark Builder
     */
    public static SocialFeishuBuilder FEISHU() {
        return new SocialFeishuBuilder();
    }

    /**
     * WeCom Builder
     */
    public static SocialWeComBuilder WECOM() {
        return new SocialWeComBuilder();
    }

    @Override
    public String getPassword() {
        return null;
    }

}
