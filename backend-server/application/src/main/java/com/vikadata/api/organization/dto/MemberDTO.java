package com.vikadata.api.organization.dto;

import lombok.Data;

@Data
public class MemberDTO {

    private Long id;

    private String spaceId;

    private Long userId;

    private String memberName;

    private String avatar;

    private Boolean isActive;

    private Boolean isDeleted;

    private Integer isSocialNameModified;
}
