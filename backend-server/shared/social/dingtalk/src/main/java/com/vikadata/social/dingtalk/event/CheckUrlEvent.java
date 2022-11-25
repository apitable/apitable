package com.vikadata.social.dingtalk.event;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import com.vikadata.social.dingtalk.annotation.DingTalkEvent;
import com.vikadata.social.dingtalk.enums.DingTalkEventTag;

/**
 * Event subscription -- callback domain name detection
 */
@Setter
@Getter
@ToString
@DingTalkEvent(DingTalkEventTag.CHECK_URL)
public class CheckUrlEvent extends BaseEvent {

}
