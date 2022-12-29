package com.vikadata.social.dingtalk.event;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import com.vikadata.social.dingtalk.annotation.DingTalkEvent;
import com.vikadata.social.dingtalk.enums.DingTalkEventTag;

/**
 * Event list -- verify the validity of the updated callback address
 */
@Setter
@Getter
@ToString
@DingTalkEvent(DingTalkEventTag.CHECK_UPDATE_SUITE_URL)
public class CheckUpdateSuiteUrlEvent extends BaseEvent {

}
