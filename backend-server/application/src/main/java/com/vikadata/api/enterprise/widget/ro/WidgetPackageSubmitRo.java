package com.vikadata.api.enterprise.widget.ro;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Pattern;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;
import lombok.EqualsAndHashCode;

import com.vikadata.api.shared.constants.PatternConstants;

import java.util.List;

/**
 * <p>
 * Widget publish request parameters
 * </p>
 */
@Data
@EqualsAndHashCode(callSuper = true)
@ApiModel("Widget publish request parameters")
public class WidgetPackageSubmitRo extends WidgetPackageBaseRo {

    @ApiModelProperty(value = "Widget Package ID", example = "wpkAAA", position = 1)
    @NotBlank(message = "Package Id cannot be empty")
    private String packageId;

    @ApiModelProperty(value = "Version No", example = "1.0.0", position = 2)
    @NotBlank(message = "The release version number cannot be empty")
    private String version;

    @ApiModelProperty(value = "Widget official website", position = 3)
    @NotBlank(message = "website address not blank")
    @Pattern(regexp = PatternConstants.URL_HTTP, message = "website address format error")
    private String website;

    @ApiModelProperty(value = "Widget name", example = "{'zh-CN':'Chinese','en-US':'English'}", position = 4)
    private String name;

    @ApiModelProperty(value = "Release Notes", position = 5)
    private String releaseNote;

    @ApiModelProperty(value = "Sandbox or not", position = 6)
    private Boolean sandbox;

    @ApiModelProperty(value = "Installation environment type", example = "dashboard", position = 7)
    private List<String> installEnv;

    @ApiModelProperty(value = "Operating environment type", example = "mobile", position = 8)
    private List<String> runtimeEnv;
}
