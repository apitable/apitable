package com.vikadata.api.model.dto.space;

import lombok.Data;

/**
 * <p>
 * 空间加入申请dto
 * </p>
 *
 * @author Chambers
 * @date 2020/10/30
 */
@Data
public class SpaceApplyDto {

    private Integer notifyApplyStatus;

    private Long applyId;

    private String spaceId;

    private Integer status;

    private Long createdBy;
}
