package com.vikadata.social.feishu.event.contact.v3;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import com.vikadata.social.feishu.annotation.FeishuEvent;
import com.vikadata.social.feishu.model.v3.FeishuUserObject;

/**
 * 新版通讯录事件
 * 员工入职事件
 *
 * @author Shawn Deng
 * @date 2020-12-24 11:55:38
 */
@Setter
@Getter
@ToString
@FeishuEvent("contact.user.created_v3")
public class ContactUserCreateEvent extends BaseV3ContactEvent {

    private Event event;

    @Setter
    @Getter
    public static class Event {

        @JsonProperty("object")
        private FeishuUserObject user;
    }
}
