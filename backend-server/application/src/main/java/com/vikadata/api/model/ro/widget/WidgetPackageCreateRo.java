package com.vikadata.api.model.ro.widget;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Pattern;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import com.vikadata.api.constants.PatternConstants;

import java.util.List;

/**
 * <p>
 * Widget package creation request parameters
 * </p>
 */
@Data
@ApiModel("Widget package creation request parameters")
public class WidgetPackageCreateRo {

    @ApiModelProperty(value = "Custom Widget Package ID", example = "wpkAAA", position = 1)
    @Pattern(regexp = PatternConstants.PACKAGE_ID, message = "Package ID format error,Please start with 'wpk' and add a combination of English letters and numbers with a length of 10")
    private String packageId;

    @ApiModelProperty(value = "Space ID", example = "spcyQkKp9XJEl", position = 2)
    @NotBlank(message = "Space Id cannot be empty")
    private String spaceId;

    @ApiModelProperty(value = "Widget name", example = "{'zh-CN':'Chinese','en-US':'English'}", position = 3)
    @NotBlank(message = "Widget name cannot be empty")
    private String name;

    @ApiModelProperty(value = "Package Type(0:Third party,1:Official)", position = 4)
    @NotNull(message = "Component package type cannot be empty")
    private Integer packageType;

    @ApiModelProperty(value = "0：Publish to the component store in the space station，1：Publish to Global Store（Only package_ Only allowed if the type is 1）", position = 5)
    @NotNull(message = "The component package publishing type cannot be empty")
    private Integer releaseType;

    @ApiModelProperty(value = "Template or not", position = 6)
    private Boolean isTemplate;

    @ApiModelProperty(value = "Sandbox or not", position = 7)
    private Boolean sandbox;

    @ApiModelProperty(value = "Installation environment type", example = "dashboard", position = 8)
    private List<String> installEnv;

    @ApiModelProperty(value = "Operating environment type", example = "mobile", position = 9)
    private List<String> runtimeEnv;

}
