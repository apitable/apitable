package com.vikadata.api.modular.internal.model;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import com.vikadata.api.support.serializer.NullNumberSerializer;

/**
 * <p>
 * 空间的附件容量信息视图
 * </p>
 *
 * @author Chambers
 * @date 2020/9/12
 */
@Data
@ApiModel("空间的订阅信息视图")
public class InternalSpaceSubscriptionVo {

    @ApiModelProperty(value = "单个表最大行数(单位：行)", position = 1)
    @JsonSerialize(nullsUsing = NullNumberSerializer.class)
    private Long maxRowsPerSheet;

    @ApiModelProperty(value = "空间站最大行数(单位：行)", position = 2)
    @JsonSerialize(nullsUsing = NullNumberSerializer.class)
    private Long maxRowsInSpace;

    @ApiModelProperty(value = "最大相册视图数量(单位: 个)", example = "10", position = 3)
    @JsonSerialize(nullsUsing = NullNumberSerializer.class)
    private Long maxGalleryViewsInSpace;

    @ApiModelProperty(value = "最大看板视图数量(单位: 个)", example = "10", position = 4)
    @JsonSerialize(nullsUsing = NullNumberSerializer.class)
    private Long maxKanbanViewsInSpace;

    @ApiModelProperty(value = "最大甘特视图数量(单位: 个)", example = "10", position = 5)
    @JsonSerialize(nullsUsing = NullNumberSerializer.class)
    private Long maxGanttViewsInSpace;

    @ApiModelProperty(value = "最大日历视图数量(单位: 个)", example = "10", position = 6)
    @JsonSerialize(nullsUsing = NullNumberSerializer.class)
    private Long maxCalendarViewsInSpace;
}
