package com.vikadata.api.modular.automation.model;

import javax.validation.constraints.NotBlank;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;


/**
 * <p>
 * 创建 trigger 实例 ro
 * </p>
 *
 * @author Benson Cheung
 * @date 2021/09/09
 */
@Data
@ApiModel("AutomationApiTrigger")
public class AutomationApiRobotRo {
    @NotBlank
    @ApiModelProperty(value = "名称", example = "订单物流信息通知机器人", position = 1, required = true)
    private String name;

    @ApiModelProperty(value = "描述", example = "这个一个测试用的机器人", position = 2, required = true)
    private String description;

    @NotBlank
    @ApiModelProperty(value = "绑定资源ID", example = "dstL8cTQmPqaRPcbRF", position = 3, required = true)
    private String resourceId;

}
