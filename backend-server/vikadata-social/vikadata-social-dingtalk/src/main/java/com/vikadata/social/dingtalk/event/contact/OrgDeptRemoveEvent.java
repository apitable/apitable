package com.vikadata.social.dingtalk.event.contact;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import com.vikadata.social.dingtalk.annotation.DingTalkEvent;
import com.vikadata.social.dingtalk.enums.DingTalkEventTag;

/**
 * 通讯录企业部门删除
 *
 * @author Zoe Zheng
 * @date 2021-05-13 13:57:35
 */
@Setter
@Getter
@ToString
@DingTalkEvent(DingTalkEventTag.ORG_DEPT_REMOVE)
public class OrgDeptRemoveEvent extends BaseContactDeptEvent {
    
}
