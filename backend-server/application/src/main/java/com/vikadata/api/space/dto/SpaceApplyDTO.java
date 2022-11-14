package com.vikadata.api.space.dto;

import lombok.Data;

@Data
public class SpaceApplyDTO {

    private Integer notifyApplyStatus;

    private Long applyId;

    private String spaceId;

    private Integer status;

    private Long createdBy;
}
