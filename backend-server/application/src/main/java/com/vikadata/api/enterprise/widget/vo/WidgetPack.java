package com.vikadata.api.enterprise.widget.vo;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonInclude.Include;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import com.vikadata.api.shared.support.serializer.ImageSerializer;
import com.vikadata.api.shared.support.serializer.NullNumberSerializer;
import com.vikadata.api.shared.support.serializer.NullStringSerializer;

import java.util.List;

/**
 * <p>
 * Widget package information (alignment with front-end structure requirements)
 * </p>
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder(toBuilder = true)
@ApiModel("Widget package information")
public class WidgetPack {

    @ApiModelProperty(value = "Widget ID", example = "wdt123", position = 1)
    private String id;

    @ApiModelProperty(value = "Widget version number", example = "0", position = 2)
    @JsonSerialize(nullsUsing = NullNumberSerializer.class)
    private Long revision;

    @ApiModelProperty(value = "Package ID", example = "wpkABC", position = 3)
    private String widgetPackageId;

    @ApiModelProperty(value = "Widget package name", example = "Chart", position = 4)
    private String widgetPackageName;

    @ApiModelProperty(value = "English name of component package (obsolete field)", example = "chart", position = 4)
    @Deprecated
    private String widgetPackageNameEn;

    @ApiModelProperty(value = "Widget package icon", example = "https://s1.vika.cn/space/2020/12/23/aqa", position = 5)
    @JsonSerialize(nullsUsing = NullStringSerializer.class, using = ImageSerializer.class)
    private String widgetPackageIcon;

    @ApiModelProperty(value = "Widget package version number", example = "v1.0.0", position = 6)
    private String widgetPackageVersion;

    @ApiModelProperty(value = "Widget snapshot information", position = 7)
    private WidgetSnapshot snapshot;

    @ApiModelProperty(value = "Widget status (0: under development; 1: banned; 2: to be published; 3: published; 4: off the shelf)", position = 8)
    private Integer status;

    @ApiModelProperty(value = "Widget Author Name", position = 9)
    private String authorName;

    @ApiModelProperty(value = "Widget author Email", position = 10)
    private String authorEmail;

    @ApiModelProperty(value = "Widget Author Icon", position = 11)
    @JsonSerialize(using = ImageSerializer.class)
    private String authorIcon;

    @ApiModelProperty(value = "Widget Author Web Address", position = 12)
    private String authorLink;

    @ApiModelProperty(value = "Widget package type (0: third party, 1: official)", position = 13)
    private Integer packageType;

    @ApiModelProperty(value = "Widget publishing type (0: space station, 1: global)", position = 14)
    private Integer releaseType;

    @ApiModelProperty(value = "Widget code address", example = "https://s1.vika.cn/code/2020/12/23/aqa", position = 15)
    @JsonSerialize(using = ImageSerializer.class)
    private String releaseCodeBundle;

    @ApiModelProperty(value = "Sandbox or not", position = 16)
    private Boolean sandbox;

    @JsonInclude(Include.NON_EMPTY)
    @ApiModelProperty(value = "Audit Applet Parent Applet Id", notes = "Dynamic key", position = 17)
    private String fatherWidgetPackageId;

    @ApiModelProperty(value = "Installation environment type", example = "dashboard", position = 18)
    private List<String> installEnv;

    @ApiModelProperty(value = "Operating environment type", example = "mobile", position = 19)
    private List<String> runtimeEnv;

}
