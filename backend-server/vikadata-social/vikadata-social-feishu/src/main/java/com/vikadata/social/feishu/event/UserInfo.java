package com.vikadata.social.feishu.event;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

/**
 * Basic information of Feishu users
 */
@Setter
@Getter
@ToString
public class UserInfo {

    private String openId;

    private String userId;

    private String unionId;
}
