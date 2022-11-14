package com.vikadata.api.enterprise.widget.vo;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import com.vikadata.api.shared.support.serializer.ImageSerializer;
import com.vikadata.api.shared.support.serializer.NullStringSerializer;

/**
 * <p>
 * Template Widget Package Information View
 * </p>
 */
@Data
@ApiModel("Template Widget Package Information View")
public class WidgetTemplatePackageInfo {

    @ApiModelProperty(value = "Widget Package ID", example = "wpkABC", position = 1)
    private String widgetPackageId;

    @ApiModelProperty(value = "Widget package name", example = "Chart", position = 2)
    private String name;

    @ApiModelProperty(value = "Widget package icon", example = "https://s1.vika.cn/space/2020/12/23/aqa", position = 3)
    @JsonSerialize(nullsUsing = NullStringSerializer.class, using = ImageSerializer.class)
    private String icon;

    @ApiModelProperty(value = "Widget Package Cover", example = "https://s1.vika.cn/space/2020/12/23/aqa", position = 4)
    @JsonSerialize(nullsUsing = NullStringSerializer.class, using = ImageSerializer.class)
    private String cover;

    @ApiModelProperty(value = "Describe", example = "This is the description of a chart applet", position = 5)
    private String description;

    @ApiModelProperty(value = "Widget package version number", example = "1.0.0", position = 6)
    private String version;

    @ApiModelProperty(value = "Code Address", example = "https://s1.vika.cn/code/2020/12/23/aqa", position = 7)
    @JsonSerialize(using = ImageSerializer.class)
    private String releaseCodeBundle;

    @ApiModelProperty(value = "Source code address", example = "https://s1.vika.cn/code/2020/12/23/aqa", position = 8)
    @JsonSerialize(using = ImageSerializer.class)
    private String sourceCodeBundle;

    @ApiModelProperty(value = "Widget Package Extension Information", position = 9)
    private WidgetTemplatePackageExtraInfo extras;

}
