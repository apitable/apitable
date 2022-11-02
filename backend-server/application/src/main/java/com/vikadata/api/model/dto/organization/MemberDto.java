package com.vikadata.api.model.dto.organization;

import lombok.Data;

@Data
public class MemberDto {

    private Long id;

    private String spaceId;

    private Long userId;

    private String memberName;

    private String avatar;

    private Boolean isActive;

    private Boolean isDeleted;

    private Integer isSocialNameModified;
}
