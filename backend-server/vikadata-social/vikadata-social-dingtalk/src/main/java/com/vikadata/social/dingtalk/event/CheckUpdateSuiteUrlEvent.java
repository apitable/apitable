package com.vikadata.social.dingtalk.event;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import com.vikadata.social.dingtalk.annotation.DingTalkEvent;
import com.vikadata.social.dingtalk.enums.DingTalkEventTag;

/** 
* <p> 
* 事件列表 -- 验证更新的回调地址有效性
* </p> 
* @author zoe zheng 
* @date 2021/9/2 3:46 下午
*/
@Setter
@Getter
@ToString
@DingTalkEvent(DingTalkEventTag.CHECK_UPDATE_SUITE_URL)
public class CheckUpdateSuiteUrlEvent extends BaseEvent {

}
