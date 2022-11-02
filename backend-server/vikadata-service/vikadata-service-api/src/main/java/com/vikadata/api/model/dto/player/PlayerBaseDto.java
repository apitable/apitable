package com.vikadata.api.model.dto.player;

import lombok.Data;

@Data
public class PlayerBaseDto {
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
