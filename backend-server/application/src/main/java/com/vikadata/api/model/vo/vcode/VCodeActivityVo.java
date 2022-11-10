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
 * Code V active view
 * </p>
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder(toBuilder = true)
@ApiModel("Code V active view")
public class VCodeActivityVo {

    @ApiModelProperty(value = "Activity ID", dataType = "java.lang.String", example = "1456", position = 1)
    @JsonSerialize(using = ToStringSerializer.class)
    private Long activityId;

    @ApiModelProperty(value = "Activity Name", dataType = "java.lang.String", example = "Promotion of XX channel", position = 2)
    private String name;

    @ApiModelProperty(value = "Scene Values", dataType = "java.lang.String", example = "XX_channel_popularize", position = 3)
    private String scene;

}
