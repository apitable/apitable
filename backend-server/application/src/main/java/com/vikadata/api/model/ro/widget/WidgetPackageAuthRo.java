package com.vikadata.api.model.ro.widget;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

/**
 * <p>
 * 小程序包登录授权请求参数
 * </p>
 *
 * @author Pengap
 * @date 2021/7/8
 */
@Data
@ApiModel("小程序包登录授权请求参数")
public class WidgetPackageAuthRo {

    @ApiModelProperty(value = "组件包ID", example = "wpkBBB", position = 1)
    private String packageId;

}
