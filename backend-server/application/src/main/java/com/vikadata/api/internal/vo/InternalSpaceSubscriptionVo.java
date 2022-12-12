package com.vikadata.api.internal.vo;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import com.vikadata.api.shared.support.serializer.NullNumberSerializer;
import com.vikadata.api.shared.support.serializer.NullBooleanSerializer;

/**
 * attachment capacity information view for spaces
 */
@Data
@ApiModel("Subscription information view for spaces")
public class InternalSpaceSubscriptionVo {

    @ApiModelProperty(value = "Maximum number of rows in a single table (unit: row)", position = 1)
    @JsonSerialize(nullsUsing = NullNumberSerializer.class)
    private Long maxRowsPerSheet;

    @ApiModelProperty(value = "The maximum number of rows of the space station (unit: row)", position = 2)
    @JsonSerialize(nullsUsing = NullNumberSerializer.class)
    private Long maxRowsInSpace;

    @ApiModelProperty(value = "Maximum number of album views (unit: pieces)", example = "10", position = 3)
    @JsonSerialize(nullsUsing = NullNumberSerializer.class)
    private Long maxGalleryViewsInSpace;

    @ApiModelProperty(value = "Maximum number of Kanban views (unit: pieces)", example = "10", position = 4)
    @JsonSerialize(nullsUsing = NullNumberSerializer.class)
    private Long maxKanbanViewsInSpace;

    @ApiModelProperty(value = "Maximum number of Gantt views (unit: pieces)", example = "10", position = 5)
    @JsonSerialize(nullsUsing = NullNumberSerializer.class)
    private Long maxGanttViewsInSpace;

    @ApiModelProperty(value = "Maximum number of calendar views (unit: pieces)", example = "10", position = 6)
    @JsonSerialize(nullsUsing = NullNumberSerializer.class)
    private Long maxCalendarViewsInSpace;

    @ApiModelProperty(value = "Is it possible to call enterprise-level APIs", example = "true", position = 7)
    @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
    private Boolean canCallEnterpriseApi;
}
