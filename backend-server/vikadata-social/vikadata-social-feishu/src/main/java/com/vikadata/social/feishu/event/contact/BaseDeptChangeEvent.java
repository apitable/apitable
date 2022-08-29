package com.vikadata.social.feishu.event.contact;

import com.vikadata.social.feishu.event.BaseEvent;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

/**
 * 部门变更
 *
 * @author Shawn Deng
 * @date 2020-12-18 00:39:29
 */
@Setter
@Getter
@ToString
public class BaseDeptChangeEvent extends BaseEvent {

    private String openDepartmentId;
}
