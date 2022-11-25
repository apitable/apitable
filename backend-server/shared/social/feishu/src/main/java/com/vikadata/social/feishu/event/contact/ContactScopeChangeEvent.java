package com.vikadata.social.feishu.event.contact;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import com.vikadata.social.feishu.annotation.FeishuEvent;
import com.vikadata.social.feishu.event.BaseEvent;

@Setter
@Getter
@ToString
@FeishuEvent("contact_scope_change")
public class ContactScopeChangeEvent extends BaseEvent {
}
