package com.vikadata.social.feishu.event.contact;

import com.vikadata.social.feishu.annotation.FeishuEvent;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

/**
 * 员工离职 事件
 *
 * @author Shawn Deng
 * @date 2020-12-10 18:04:25
 */
@Setter
@Getter
@ToString
@FeishuEvent("user_leave")
public class UserLeaveEvent extends BaseUserChangeEvent {
}
