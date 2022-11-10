package com.vikadata.api.model.vo.integral;

import cn.hutool.json.JSONObject;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.vikadata.api.support.serializer.ChinaLocalDateTimeToUtcSerializer;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import java.time.LocalDateTime;

/**
 * <p>
 * Integral Revenue&Expense Record View
 * </p>
 */
@Data
@ApiModel("Integral Revenue&Expense Record View")
public class IntegralRecordVO {

    @ApiModelProperty(value = "Action ID", example = "invitation_reward", position = 1)
    private String action;

    @ApiModelProperty(value = "Change Type (0: Revenue, 1: Expense)", example = "0", position = 2)
    private Integer alterType;

    @ApiModelProperty(value = "Change value (unit: minutes)", example = "1000", position = 3)
    private String alterValue;

    @ApiModelProperty(value = "Parameter", position = 4)
    private JSONObject params;

    @ApiModelProperty(value = "Change time", example = "1000", position = 5)
    @JsonSerialize(using = ChinaLocalDateTimeToUtcSerializer.class)
    private LocalDateTime createdAt;
}
