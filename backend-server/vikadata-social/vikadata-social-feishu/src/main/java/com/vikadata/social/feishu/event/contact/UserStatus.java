package com.vikadata.social.feishu.event.contact;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.Setter;

/**
 * user status,
 * new contacts events
 */
@Setter
@Getter
public class UserStatus {

    @JsonProperty("is_activated")
    private boolean isActivated;

    @JsonProperty("is_frozen")
    private boolean isFrozen;

    @JsonProperty("is_resigned")
    private boolean isResigned;
}
