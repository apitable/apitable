package com.vikadata.api.model.vo.vcode;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * <p>
 * V码活动视图
 * </p>
 *
 * @author Chambers
 * @date 2020/8/15
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder(toBuilder = true)
@ApiModel("V码活动视图")
public class VCodeActivityVo {

    @ApiModelProperty(value = "活动ID", dataType = "java.lang.String", example = "1456", position = 1)
    @JsonSerialize(using = ToStringSerializer.class)
    private Long activityId;

    @ApiModelProperty(value = "活动名称", dataType = "java.lang.String", example = "某某渠道推广", position = 2)
    private String name;

    @ApiModelProperty(value = "场景值", dataType = "java.lang.String", example = "XX_channel_popularize", position = 3)
    private String scene;

}
