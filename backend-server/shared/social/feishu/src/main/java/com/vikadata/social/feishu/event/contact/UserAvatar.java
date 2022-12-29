package com.vikadata.social.feishu.event.contact;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class UserAvatar {

    @JsonProperty("avatar_640")
    private String avatar640;

    @JsonProperty("avatar_origin")
    private String avatarOrigin;

    @JsonProperty("avatar_72")
    private String avatar72;

    @JsonProperty("avatar_240")
    private String avatar240;
}
