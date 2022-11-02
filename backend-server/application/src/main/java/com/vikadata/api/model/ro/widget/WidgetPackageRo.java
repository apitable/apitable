package com.vikadata.api.model.ro.widget;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

/**
 * <p>
 * 小程序包请求参数
 * </p>
 *
 * @author Chambers
 * @date 2020/12/23
 */
@Data
@ApiModel("小程序包请求参数")
public class WidgetPackageRo {

    @ApiModelProperty(value = "小程序包ID", example = "wpkCKtqGTjzM7")
    private String widgetPackageId;

    @ApiModelProperty(value = "名称", example = "图表", position = 1)
    private String name;

    @ApiModelProperty(value = "英文名称", example = "chart", position = 2)
    private String nameEn;

    @ApiModelProperty(value = "图标", example = "space/2020/12/23/aqa", position = 3)
    private String icon;

    @ApiModelProperty(value = "封面图", example = "space/2020/12/23/aqa", position = 3)
    private String cover;

    @ApiModelProperty(value = "描述", example = "这是一个图表小程序的描述", position = 4)
    private String description;

    @ApiModelProperty(value = "版本号", example = "v1.0.0", position = 5)
    private String version;

    @ApiModelProperty(value = "小程序包状态(0:待审核;1:不通过;2:待发布;3:已上线;4:已下架)", example = "3", position = 6)
    private Integer status;
}
