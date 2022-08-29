package com.vikadata.api.modular.automation.model;

import cn.hutool.json.JSONObject;
import io.swagger.annotations.ApiModelProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 自动化 - 执行动作 VO
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AutomationActionVo {

    @ApiModelProperty(value = "动作 ID", example = "aacxxxxxxxx")
    private String actionId;

    @ApiModelProperty(value = "所属机器人 ID", example = "arbxxxxxxxx")
    private String robotId;

    @ApiModelProperty(value = "动作原型 ID", example = "aatxxxxxxxx")
    private String actionTypeId;

    @ApiModelProperty(value = "动作输入值")
    private JSONObject input;

    @ApiModelProperty(value = "上一个动作的 ID", example = "aacxxxxxxxx")
    private String nextActionId;

}
