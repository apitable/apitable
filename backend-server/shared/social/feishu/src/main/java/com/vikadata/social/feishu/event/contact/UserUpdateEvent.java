package com.vikadata.social.feishu.event.contact;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import com.vikadata.social.feishu.annotation.FeishuEvent;

@Setter
@Getter
@ToString
@FeishuEvent("user_update")
public class UserUpdateEvent extends BaseUserChangeEvent {
}
