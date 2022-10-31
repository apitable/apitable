package com.vikadata.social.feishu.event.contact;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import com.vikadata.social.feishu.annotation.FeishuEvent;
import com.vikadata.social.feishu.event.BaseEvent;

@Setter
@Getter
@ToString
@FeishuEvent("user_status_change")
public class UserStatusChangeEvent extends BaseEvent {

    private String openId;

    private String employeeId;

    private String unionId;

    private Status beforeStatus;

    private Status currentStatus;

    private String changeTime;

    @Setter
    @Getter
    @ToString
    public static class Status {

        @JsonProperty("is_active")
        private boolean isActive;

        @JsonProperty("is_frozen")
        private boolean isFrozen;

        @JsonProperty("is_resigned")
        private boolean isResigned;
    }
}
