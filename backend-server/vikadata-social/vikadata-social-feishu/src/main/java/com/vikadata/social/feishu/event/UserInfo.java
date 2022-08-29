package com.vikadata.social.feishu.event;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

/**
 * 飞书用户基本信息
 *
 * @author Shawn Deng
 * @date 2020-11-23 20:18:05
 */
@Setter
@Getter
@ToString
public class UserInfo {

    private String openId;

    private String userId;

    private String unionId;
}
