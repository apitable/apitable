package com.vikadata.api.model.ro.widget;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

/**
 * <p>
 * 小程序封禁/解封请求参数
 * </p>
 *
 * @author Pengap
 * @date 2021/7/8
 */
@Data
@ApiModel("小程序封禁/解封请求参数")
public class WidgetPackageBanRo {

    @ApiModelProperty(value = "小程序包ID", example = "wpkAAA", position = 1)
    @NotBlank(message = "packageId不能为空")
    private String packageId;

    @ApiModelProperty(value = "封禁：false,解禁：true", example = "false", position = 2)
    @NotNull(message = "操作状态不能为空")
    private Boolean unban;

}
