package com.vikadata.api.modular.automation.model;

import cn.hutool.json.JSONObject;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;


/**
 * <p>
 * 自动化- 触发器原型 Dto
 * </p>
 *
 * @author Mayne
 * @date 2021/08/04
 */
@Data
@ApiModel("AutomationTriggerType")
public class AutomationTriggerTypeDto {
    @ApiModelProperty(value = "原型ID", example = "attxxxxxxxx")
    private String triggerTypeId;

    @ApiModelProperty(value = "名称", example = "当表单提交时")
    private String name;

    @ApiModelProperty(value = "描述", example = "当指定的表单有新的提交时，这个触发器将被触发。")
    private String description;

    @ApiModelProperty(value = "endpoint", example = "form_submitted")
    private String endpoint;

    @ApiModelProperty(value = "输入值的 JSON 范式", example = "")
    private JSONObject inputJsonSchema;

    @ApiModelProperty(value = "输出值的 JSON 范式", example = "")
    private JSONObject outputJsonSchema;

    @ApiModelProperty(value = "所属服务ID")
    private AutomationServiceDto service;
}

