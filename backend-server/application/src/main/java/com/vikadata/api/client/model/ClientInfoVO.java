package com.vikadata.api.client.model;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

/**
 * Application version information
 */
@Data
@ApiModel("Application version information")
public class ClientInfoVO {

    @Deprecated
    @ApiModelProperty(value = "application environment ", example = "production", position = 1, hidden = true)
    private String env;

    @Deprecated
    @ApiModelProperty(value = "Application version", example = "v0.12.1-release.3", position = 2, hidden = true)
    private String version;

    @ApiModelProperty(value = "Client language set globally by the user", example = "zh-CN", position = 3)
    private String locale;

    @ApiModelProperty(value = "Web page header information (the rendering information of the header is returned according to the customer's language settings)", position = 4)
    private String metaContent;

    @ApiModelProperty(value = "User information", position = 5)
    private String userInfo;

    @ApiModelProperty(value = "Novice guidance information", position = 6)
    private String wizards;

    @ApiModelProperty(value = "Visit['/', '/workbench'], redirect. Redirect if you have something, ignore if you have nothing", position = 7)
    private String redirect;

    @ApiModelProperty(value = "The grayscale environment of the space station can be empty", position = 8)
    private String spaceGrayEnv;
}
