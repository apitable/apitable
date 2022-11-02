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
 * 积分收支记录视图
 * </p>
 *
 * @author Shawn Deng
 * @date 2020/9/16 16:32
 */
@Data
@ApiModel("积分收支记录视图")
public class IntegralRecordVO {

    @ApiModelProperty(value = "动作标识", example = "invitation_reward", position = 1)
    private String action;

    @ApiModelProperty(value = "变更类型(0:收入, 1:支出)", example = "0", position = 2)
    private Integer alterType;

    @ApiModelProperty(value = "变更值(单位:分)", example = "1000", position = 3)
    private String alterValue;

    @ApiModelProperty(value = "参数", position = 4)
    private JSONObject params;

    @ApiModelProperty(value = "变更时间", example = "1000", position = 5)
    @JsonSerialize(using = ChinaLocalDateTimeToUtcSerializer.class)
    private LocalDateTime createdAt;
}
