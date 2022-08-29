package com.vikadata.social.feishu.event.contact;

import com.vikadata.social.feishu.annotation.FeishuEvent;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

/**
 * 修改部门
 *
 * @author Shawn Deng
 * @date 2020-12-10 18:04:25
 */
@Setter
@Getter
@ToString
@FeishuEvent("dept_update")
public class DeptUpdateEvent extends BaseDeptChangeEvent {
}
