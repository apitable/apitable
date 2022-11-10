package com.vikadata.api.model.ro.widget;


import java.util.List;

import javax.validation.constraints.NotBlank;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * <p>
 * widget release request
 * </p>
 *
 */
@Data
@EqualsAndHashCode(callSuper = true)
@ApiModel("widget release request")
public class WidgetPackageReleaseV2Ro extends WidgetPackageBaseV2Ro {

    @ApiModelProperty(value = "space id", example = "spcyQkKp9XJEl", position = 13)
    @NotBlank(message = "Space id not blank")
    private String spaceId;

    @ApiModelProperty(value = "widget name", example = "{'zh-CN':'Chinese','en-US':'English'}", position = 14)
    private String name;

    @ApiModelProperty(value = "release note", position = 15)
    private String releaseNote;

    @ApiModelProperty(value = "is sandbox", position = 16)
    private Boolean sandbox;

    @ApiModelProperty(value = "install environment", example = "dashboard", position = 17)
    private List<String> installEnv;

    @ApiModelProperty(value = "runtime environment", example = "mobile", position = 18)
    private List<String> runtimeEnv;

}