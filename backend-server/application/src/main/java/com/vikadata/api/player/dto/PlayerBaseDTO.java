package com.vikadata.api.player.dto;

import lombok.Data;

@Data
public class PlayerBaseDTO {
    private String uuid;

    private Long memberId;

    private String userName;

    private String memberName;

    private String avatar;

    private String team;

    private Boolean isNickNameModified;

    private Boolean isMemberNameModified;

    private String email;

    private Boolean isMemberDeleted;
}
