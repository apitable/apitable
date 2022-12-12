package com.vikadata.api.internal.vo;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import com.vikadata.api.shared.support.serializer.NullNumberSerializer;

/**
 * Space usage information view
 */
@Data
@ApiModel("space usage information view")
public class InternalSpaceUsageVo {

    @ApiModelProperty(value = "The total number of rows in all tables of the space", example = "5", position = 1)
    @JsonSerialize(nullsUsing = NullNumberSerializer.class)
    private Long recordNums;

    @ApiModelProperty(value = "total album views", example = "10", position = 2)
    @JsonSerialize(nullsUsing = NullNumberSerializer.class)
    private Long galleryViewNums;

    @ApiModelProperty(value = "total kanban views", example = "10", position = 3)
    @JsonSerialize(nullsUsing = NullNumberSerializer.class)
    private Long kanbanViewNums;

    @ApiModelProperty(value = "total gantt views", example = "10", position = 4)
    @JsonSerialize(nullsUsing = NullNumberSerializer.class)
    private Long ganttViewNums;

    @ApiModelProperty(value = "total number of calendar views", example = "10", position = 5)
    @JsonSerialize(nullsUsing = NullNumberSerializer.class)
    private Long calendarViewNums;
}
