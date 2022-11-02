package com.vikadata.api.model.ro.template;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

/**
 * <p>
 * Template Center Config Ro
 * </p>
 *
 * @author Chambers
 * @date 2022/9/22
 */
@Data
@ApiModel("Template Center Config Request Object")
public class TemplateCenterConfigRo {

    @ApiModelProperty(value = "Request Host", example = "https://api.com", position = 1)
    private String host;

    @ApiModelProperty(value = "Request Bearer Token", example = "uskxx", position = 2)
    private String token;

    @ApiModelProperty(value = "Recommend Datasheet ID", example = "dstxxx", position = 3, required = true)
    private String recommendDatasheetId;

    @ApiModelProperty(value = "Recommend View ID", example = "viwxxx", position = 3)
    private String recommendViewId;

    @ApiModelProperty(value = "Template Category Datasheet ID", example = "dstxxx", position = 4, required = true)
    private String categoryDatasheetId;

    @ApiModelProperty(value = "Template Category View ID", example = "viwxxx", position = 4)
    private String categoryViewId;

    @ApiModelProperty(value = "Template Album Datasheet ID", example = "dstxxx", position = 5, required = true)
    private String albumDatasheetId;

    @ApiModelProperty(value = "Template Album View ID", example = "viwxxx", position = 5)
    private String albumViewId;

    @ApiModelProperty(value = "Template Datasheet ID", example = "dstxxx", position = 6, required = true)
    private String templateDatasheetId;

    @ApiModelProperty(value = "Template View ID", example = "viwxxx", position = 6)
    private String templateViewId;
}
