package com.vikadata.social.feishu.event.contact;

import com.vikadata.social.feishu.event.BaseEvent;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

/**
 * 员工变更
 *
 * @author Shawn Deng
 * @date 2020-12-18 00:39:29
 */
@Setter
@Getter
@ToString
public class BaseUserChangeEvent extends BaseEvent {

    private String openId;
    private String unionId;
    private String employeeId;
}
