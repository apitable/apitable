package com.vikadata.api.model.ro.widget;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

/**
 * <p>
 * 小程序移交拥有者请求参数
 * </p>
 *
 * @author Pengap
 * @date 2021/7/8
 */
@Data
@ApiModel("小程序移交拥有者请求参数")
public class WidgetTransferOwnerRo {

    @NotBlank
    @ApiModelProperty(value = "小程序Id", position = 1)
    private String packageId;

    @NotNull(message = "新移交成员ID不能为空")
    @ApiModelProperty(value = "移交成员Id", position = 2)
    private Long transferMemberId;

}
