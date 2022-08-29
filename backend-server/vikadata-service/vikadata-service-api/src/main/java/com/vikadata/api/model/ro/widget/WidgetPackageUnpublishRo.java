package com.vikadata.api.model.ro.widget;

import javax.validation.constraints.NotBlank;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

/**
 * <p>
 * 小程序下架请求参数
 * </p>
 *
 * @author Pengap
 * @date 2021/7/8
 */
@Data
@ApiModel("小程序下架请求参数")
public class WidgetPackageUnpublishRo {

    @ApiModelProperty(value = "小程序包ID", example = "wpkAAA", position = 1)
    @NotBlank(message = "packageId不能为空")
    private String packageId;

}
