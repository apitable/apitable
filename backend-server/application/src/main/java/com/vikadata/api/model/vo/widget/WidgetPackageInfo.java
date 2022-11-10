package com.vikadata.api.model.vo.widget;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import com.vikadata.api.support.serializer.ImageSerializer;
import com.vikadata.api.support.serializer.NullStringSerializer;

/**
 * <p>
 * Widget package information view
 * </p>
 */
@Data
@ApiModel("Widget package information view")
public class WidgetPackageInfo {

    @ApiModelProperty(value = "Package ID", example = "wpkABC", position = 1)
    private String widgetPackageId;

    @ApiModelProperty(value = "Widget package name", example = "CHART", position = 2)
    private String name;

    @Deprecated
    @ApiModelProperty(value = "English name", example = "chart", position = 2)
    private String nameEn;

    @ApiModelProperty(value = "Widget package icon", example = "https://s1.vika.cn/space/2020/12/23/aqa", position = 3)
    @JsonSerialize(nullsUsing = NullStringSerializer.class, using = ImageSerializer.class)
    private String icon;

    @ApiModelProperty(value = "Cover drawing of component package", example = "https://s1.vika.cn/space/2020/12/23/aqa", position = 3)
    @JsonSerialize(nullsUsing = NullStringSerializer.class, using = ImageSerializer.class)
    private String cover;

    @ApiModelProperty(value = "DESCRIBE", example = "This is the description of a chart applet", position = 4)
    private String description;

    @ApiModelProperty(value = "Widget package version number", example = "1.0.0", position = 5)
    private String version;

    @ApiModelProperty(value = "Author Name", position = 6)
    private String authorName;

    @ApiModelProperty(value = "Author icon", position = 7)
    @JsonSerialize(using = ImageSerializer.class)
    private String authorIcon;

    @ApiModelProperty(value = "Author Email", position = 8)
    private String authorEmail;

    @ApiModelProperty(value = "Author website address", position = 9)
    private String authorLink;

    @ApiModelProperty(value = "Widget package type (0: third party, 1: official)", position = 10)
    private Integer packageType;

    @ApiModelProperty(value = "0: Publish to the component store in the space station, 1: Publish to the global app store", position = 11)
    private Integer releaseType;

    @ApiModelProperty(value = "Widget package status (0: to be approved; 1: not passed; 2: to be released; 3: online; 4: offline)", example = "3", position = 12)
    private Integer status;

}
