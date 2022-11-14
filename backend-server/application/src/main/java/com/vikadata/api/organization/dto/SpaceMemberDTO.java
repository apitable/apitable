package com.vikadata.api.organization.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class SpaceMemberDTO {

    private Long userId;

    private String spaceId;

    private String memberName;

    private Boolean isAdmin;
}
