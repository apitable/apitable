package com.vikadata.social.feishu.event.contact;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.Setter;

/**
 * 用户状态
 * 新版通讯录事件
 *
 * @author Shawn Deng
 * @date 2020-12-24 12:08:15
 */
@Setter
@Getter
public class UserStatus {

    @JsonProperty("is_activated")
    private boolean isActivated;

    @JsonProperty("is_frozen")
    private boolean isFrozen;

    @JsonProperty("is_resigned")
    private boolean isResigned;
}
