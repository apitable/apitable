package com.vikadata.social.feishu.event.contact;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import com.vikadata.social.feishu.annotation.FeishuEvent;

/**
 * Employee joins company event
 */
@Setter
@Getter
@ToString
@FeishuEvent("user_add")
public class UserAddEvent extends BaseUserChangeEvent {
}
