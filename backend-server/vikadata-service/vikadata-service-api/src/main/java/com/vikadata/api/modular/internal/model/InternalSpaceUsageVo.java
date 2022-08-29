package com.vikadata.api.modular.internal.model;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import com.vikadata.api.support.serializer.NullNumberSerializer;

/**
 * <p>
 * 空间的用量信息视图
 * </p>
 *
 * @author Chambers
 * @date 2021/9/23
 */
@Data
@ApiModel("空间的用量信息视图")
public class InternalSpaceUsageVo {

    @ApiModelProperty(value = "空间所有表总行数", example = "5", position = 1)
    @JsonSerialize(nullsUsing = NullNumberSerializer.class)
    private Long recordNums;

    @ApiModelProperty(value = "相册视图总数", example = "10", position = 2)
    @JsonSerialize(nullsUsing = NullNumberSerializer.class)
    private Long galleryViewNums;

    @ApiModelProperty(value = "看板视图总数", example = "10", position = 3)
    @JsonSerialize(nullsUsing = NullNumberSerializer.class)
    private Long kanbanViewNums;

    @ApiModelProperty(value = "甘特视图总数", example = "10", position = 4)
    @JsonSerialize(nullsUsing = NullNumberSerializer.class)
    private Long ganttViewNums;

    @ApiModelProperty(value = "日历视图总数", example = "10", position = 5)
    @JsonSerialize(nullsUsing = NullNumberSerializer.class)
    private Long calendarViewNums;
}
