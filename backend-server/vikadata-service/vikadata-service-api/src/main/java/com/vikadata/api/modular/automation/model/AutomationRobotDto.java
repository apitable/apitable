package com.vikadata.api.modular.automation.model;

import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

/**
 * <p>
 * 自动化 - 机器人 dto
 * </p>
 *
 * @author Mayne
 * @date 2021/08/05
 */
@Data
public class AutomationRobotDto {
    @ApiModelProperty(value = "机器人 ID", example = "arbtxxxxxxxxx", position = 1, required = true)
    private String robotId;

    @ApiModelProperty(value = "名称", example = "0001 号机器人", position = 2, required = true)
    private String name;

    @ApiModelProperty(value = "描述", example = "这个一个测试用的机器人", position = 3, required = true)
    private String description;
}
