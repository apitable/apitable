package com.vikadata.api.model.vo.node;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.vikadata.api.support.serializer.ChinaLocalDateTimeToUtcSerializer;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import java.time.LocalDateTime;

/**
 * <p>
 * Share operation records
 * </p>
 */
@Data
@ApiModel("Node sharing operation record view")
public class ShareOperateNoteVO {

    @ApiModelProperty(value = "Operator", example = "Zhang San", position = 1)
    private String operator;

    @ApiModelProperty(value = "Denomination of dive", example = "Open｜Close｜Refresh", position = 2)
    private String action;

    @ApiModelProperty(value = "Operation event", example = "Share｜ Allow others to save ｜ Share Link", position = 3)
    private String event;

    @ApiModelProperty(value = "Operation time (UTC timestamp)", example = "2020-03-19T16:03:16.000", position = 4)
    @JsonSerialize(using = ChinaLocalDateTimeToUtcSerializer.class)
    private LocalDateTime timestamp;
}
