package com.vikadata.api.model.dto.organization;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class SpaceMemberDto {

    private Long userId;

    private String spaceId;

    private String memberName;

    private Boolean isAdmin;
}
