package com.vikadata.social.feishu.event.contact.v3;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import com.vikadata.social.feishu.annotation.FeishuEvent;
import com.vikadata.social.feishu.model.v3.FeishuUserObject;

@Setter
@Getter
@ToString
@FeishuEvent("contact.user.updated_v3")
public class ContactUserUpdateEvent extends BaseV3ContactEvent {

    private Event event;

    @Setter
    @Getter
    public static class Event {

        @JsonProperty("object")
        private FeishuUserObject user;

        @JsonProperty("old_object")
        private UserChangeProperty changeProperty;
    }

    @Setter
    @Getter
    public static class UserChangeProperty extends FeishuUserObject {}
}
