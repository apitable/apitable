package com.vikadata.api.modular.user;

import com.vikadata.api.enums.social.SocialPlatformType;
import com.vikadata.api.modular.social.enums.SocialAppType;

/**
 * <p>
 * 住户基础User Builder
 * </p>
 *
 * @author Pengap
 * @date 2021/8/23 14:45:50
 */
public class BaseSocialUserBuilder<T> {

    protected String nickName;

    protected String avatar;

    protected String tenantId;

    protected String openId;

    protected String unionId;

    protected SocialPlatformType socialPlatformType;

    protected SocialAppType socialAppType;

    public T nickName(String nickName) {
        this.nickName = nickName;
        return (T) this;
    }

    public T avatar(String avatar) {
        this.avatar = avatar;
        return (T) this;
    }

    public T tenantId(String tenantId) {
        this.tenantId = tenantId;
        return (T) this;
    }

    public T openId(String openId) {
        this.openId = openId;
        return (T) this;
    }

    public T unionId(String unionId) {
        this.unionId = unionId;
        return (T) this;
    }

    public T socialPlatformType(SocialPlatformType socialPlatformType) {
        this.socialPlatformType = socialPlatformType;
        return (T) this;
    }

    public T socialAppType(SocialAppType socialAppType) {
        this.socialAppType = socialAppType;
        return (T) this;
    }

    public SocialUser build() {
        SocialUser su = new SocialUser();
        su.setNickName(this.nickName);
        su.setAvatar(this.avatar);
        su.setTenantId(this.tenantId);
        su.setOpenId(this.openId);
        su.setUnionId(this.unionId);
        su.setSocialPlatformType(this.socialPlatformType);
        su.setSocialAppType(this.socialAppType);
        return su;
    }

}
