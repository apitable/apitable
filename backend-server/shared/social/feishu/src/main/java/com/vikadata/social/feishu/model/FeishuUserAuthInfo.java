package com.vikadata.social.feishu.model;

import lombok.Getter;
import lombok.Setter;

/**
 * @author Shawn Deng
 * @date 2020-11-26 16:00:37
 */
@Setter
@Getter
public class FeishuUserAuthInfo {

    private String name;

    private String enName;

    private String avatarUrl;

    private String avatarThumb;

    private String avatarMiddle;

    private String avatarBig;

    private String email;

    private String userId;

    private String mobile;

    private String openId;

    private String unionId;

    private String tenantKey;
}
