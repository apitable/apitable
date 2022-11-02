package com.vikadata.api.model.ro.vcode;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import javax.validation.constraints.NotBlank;

/**
 * <p>
 * V码活动请求参数
 * </p>
 *
 * @author Chambers
 * @date 2020/8/14
 */
@Data
@ApiModel("V码活动请求参数")
public class VCodeActivityRo {

    @ApiModelProperty(value = "活动名称", example = "XX 渠道推广", position = 1, required = true)
    @NotBlank(message = "名称不能为空")
    private String name;

    @ApiModelProperty(value = "场景值", example = "XX_channel_popularize", position = 2, required = true)
    @NotBlank(message = "场景值不能为空")
    private String scene;

}
