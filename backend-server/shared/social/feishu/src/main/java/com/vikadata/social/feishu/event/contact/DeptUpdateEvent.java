package com.vikadata.social.feishu.event.contact;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import com.vikadata.social.feishu.annotation.FeishuEvent;

/**
 * Modify Department
 */
@Setter
@Getter
@ToString
@FeishuEvent("dept_update")
public class DeptUpdateEvent extends BaseDeptChangeEvent {
}
