package com.vikadata.api.modular.automation.model;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;
import org.hibernate.validator.constraints.Length;

import javax.validation.constraints.NotNull;


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
public class AutomationApiTriggerCreateRo {

    @ApiModelProperty(value = "机器人基础信息", position = 1, required = true)
    @NotNull(message = "robot 不能为空")
    private AutomationApiRobotRo robot;

    @ApiModelProperty(value = "触发器输入的内容", position = 2, required = true)
    @NotNull(message = "trigger 不能为空")
    private AutomationApiTriggerRo trigger;

    @ApiModelProperty(value = "执行动作的webhookURL", example = "https://xxxxx", position = 3, required = true)
    private String webhookUrl;

    @ApiModelProperty(value = "请求唯一编码,通常为32位uuid", example = "1e16c603908743a8aaa5933faec91973", position = 4)
    @Length(max=64)
    private String seqId;

}
