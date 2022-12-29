package com.vikadata.social.feishu.event.contact;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import com.vikadata.social.feishu.annotation.FeishuEvent;

/**
 * delete department
 */
@Setter
@Getter
@ToString
@FeishuEvent("dept_delete")
public class DeptDeleteEvent extends BaseDeptChangeEvent {
}
