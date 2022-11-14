package com.vikadata.api.enterprise.widget.ro;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

/**
 * <p>
 * Widget Package Request Parameters
 * </p>
 */
@Data
@ApiModel("Widget Package Request Parameters")
public class WidgetPackageRo {

    @ApiModelProperty(value = "Widget Package ID", example = "wpkCKtqGTjzM7")
    private String widgetPackageId;

    @ApiModelProperty(value = "Name", example = "Chart", position = 1)
    private String name;

    @ApiModelProperty(value = "English name", example = "chart", position = 2)
    private String nameEn;

    @ApiModelProperty(value = "Icon", example = "space/2020/12/23/aqa", position = 3)
    private String icon;

    @ApiModelProperty(value = "Cover", example = "space/2020/12/23/aqa", position = 3)
    private String cover;

    @ApiModelProperty(value = "Describe", example = "This is the description of a chart applet", position = 4)
    private String description;

    @ApiModelProperty(value = "Version No", example = "v1.0.0", position = 5)
    private String version;

    @ApiModelProperty(value = "Widget package status(0:To be reviewed;1:Fail;2:To be released;3:Online;4:Off shelf)", example = "3", position = 6)
    private Integer status;
}
