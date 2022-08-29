package com.vikadata.api.modular.automation.model;

import javax.validation.constraints.NotBlank;

import cn.hutool.json.JSONObject;
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
public class AutomationApiTriggerRo {
    @NotBlank
    @ApiModelProperty(value = "触发器名@vika 的固定格式", example = "form_submitted@vika", position = 1, required = true)
    private String typeName;

    @NotBlank
    @ApiModelProperty(value = "触发器input参数", example = "{\"formId\": {\"type\":\"Literal\",\"value\":\"fomuzHzhN3BSpYho5d\"}}", position = 2, required = true)
    private JSONObject input;

}
