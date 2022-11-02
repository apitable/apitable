package com.vikadata.api.model.dto.space;

import lombok.Data;

@Data
public class SpaceApplyDto {

    private Integer notifyApplyStatus;

    private Long applyId;

    private String spaceId;

    private Integer status;

    private Long createdBy;
}
