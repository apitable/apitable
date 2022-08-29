package com.vikadata.social.dingtalk.event;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import com.vikadata.social.dingtalk.annotation.DingTalkEvent;
import com.vikadata.social.dingtalk.enums.DingTalkEventTag;

/** 
* <p> 
* 事件列表 -- 验证设置的回调地址有效性
* </p> 
* @author zoe zheng 
* @date 2021/9/2 3:47 下午
*/
@Setter
@Getter
@ToString
@DingTalkEvent(DingTalkEventTag.CHECK_CREATE_SUITE_URL)
public class CheckCreateSuiteUrlEvent extends BaseEvent {

}
