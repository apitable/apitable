package com.vikadata.social.dingtalk.event;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import com.vikadata.social.dingtalk.annotation.DingTalkEvent;
import com.vikadata.social.dingtalk.enums.DingTalkEventTag;

/**
 * <p>
 * 事件订阅 -- 回调域名检测
 * </p>
 * @author zoe zheng
 * @date 2021/5/13 1:56 下午
 */
@Setter
@Getter
@ToString
@DingTalkEvent(DingTalkEventTag.CHECK_URL)
public class CheckUrlEvent extends BaseEvent {

}
