package com.vikadata.social.dingtalk.event.contact;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import com.vikadata.social.dingtalk.annotation.DingTalkEvent;
import com.vikadata.social.dingtalk.enums.DingTalkEventTag;

/**
 * 加入企业后用户激活
 *
 * @author Zoe Zheng
 * @date 2021-05-13 13:57:35
 */
@Setter
@Getter
@ToString
@DingTalkEvent(DingTalkEventTag.USER_ACTIVATE_ORG)
public class UserActiveOrgEvent extends BaseContactUserEvent {
}
