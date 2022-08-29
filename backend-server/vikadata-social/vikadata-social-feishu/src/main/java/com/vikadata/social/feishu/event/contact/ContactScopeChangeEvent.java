package com.vikadata.social.feishu.event.contact;

import com.vikadata.social.feishu.annotation.FeishuEvent;
import com.vikadata.social.feishu.event.BaseEvent;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

/**
 * 授权范围变更 事件
 *
 * @author Shawn Deng
 * @date 2020-11-26 19:03:06
 */
@Setter
@Getter
@ToString
@FeishuEvent("contact_scope_change")
public class ContactScopeChangeEvent extends BaseEvent {
}
