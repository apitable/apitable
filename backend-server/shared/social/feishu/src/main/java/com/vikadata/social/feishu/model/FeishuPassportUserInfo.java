package com.vikadata.social.feishu.model;

import lombok.Getter;
import lombok.Setter;

import com.vikadata.social.feishu.model.v3.Avatar;
import com.vikadata.social.feishu.model.v3.FeishuUserObject;

/**
 * @author Shawn Deng
 * @date 2020-11-26 16:00:37
 */
@Setter
@Getter
public class FeishuPassportUserInfo {

    private String sub;

    private String name;

    private String picture;

    private String openId;

    private String unionId;

    private String enName;

    private String tenantKey;

    private String avatarUrl;

    private String avatarThumb;

    private String avatarMiddle;

    private String avatarBig;

    private String email;

    private String userId;

    private String mobile;

    public FeishuUserObject createUserObject() {
        FeishuUserObject userObject = new FeishuUserObject();
        userObject.setName(name);
        userObject.setEnName(enName);
        Avatar avatar = new Avatar();
        avatar.setAvatarOrigin(avatarUrl);
        avatar.setAvatar72(avatarThumb);
        avatar.setAvatar240(avatarMiddle);
        avatar.setAvatar640(avatarBig);
        userObject.setAvatar(avatar);
        userObject.setOpenId(openId);
        userObject.setUnionId(unionId);
        return userObject;
    }

}
