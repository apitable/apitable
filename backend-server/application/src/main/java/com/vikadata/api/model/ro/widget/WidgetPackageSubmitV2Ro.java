package com.vikadata.api.model.ro.widget;

import java.util.List;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Pattern;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;
import lombok.EqualsAndHashCode;

import com.vikadata.api.constants.PatternConstants;

/**
 * <p>
 * widget submit request
 * </p>
 *
 */
@Data
@EqualsAndHashCode(callSuper = true)
@ApiModel("widget submit request")
public class WidgetPackageSubmitV2Ro extends WidgetPackageBaseV2Ro {

    @ApiModelProperty(value = "widget wi", position = 3)
    @NotBlank(message = "website address not blank")
    @Pattern(regexp = PatternConstants.URL_HTTP, message = "website address format error")
    private String website;

    @ApiModelProperty(value = "widget's name", example = "{'zh-CN':'中','en-US':'英'}", position = 4)
    private String name;

    @ApiModelProperty(value = "发布说明", position = 5)
    private String releaseNote;

    @ApiModelProperty(value = "是否沙箱", position = 6)
    private Boolean sandbox;

    @ApiModelProperty(value = "安装环境类型", example = "dashboard", position = 7)
    private List<String> installEnv;

    @ApiModelProperty(value = "运行环境类型", example = "mobile", position = 8)
    private List<String> runtimeEnv;
}
