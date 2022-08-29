package com.vikadata.social.feishu.event.contact.v3;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import com.vikadata.social.feishu.annotation.FeishuEvent;
import com.vikadata.social.feishu.model.v3.FeishuDeptObject;

/**
 * 新版通讯录事件
 * 部门被删除
 *
 * @author Shawn Deng
 * @date 2020-12-24 12:10:43
 */
@Setter
@Getter
@ToString
@FeishuEvent("contact.department.deleted_v3")
public class ContactDeptDeleteEvent extends BaseV3ContactEvent {

    private Event event;

    @Setter
    @Getter
    public static class Event {

        @JsonProperty("object")
        private FeishuDeptObject department;
    }
}
