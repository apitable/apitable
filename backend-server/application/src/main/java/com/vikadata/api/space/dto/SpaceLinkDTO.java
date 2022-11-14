package com.vikadata.api.space.dto;

import lombok.Data;

@Data
public class SpaceLinkDTO {

    private Long id;

    private String spaceId;

    private String spaceName;

    private Long teamId;

    private String teamName;

    private Long userId;

    private Long memberId;

    private String memberName;

    private boolean isMainAdmin;

    private boolean isAdmin;
}
