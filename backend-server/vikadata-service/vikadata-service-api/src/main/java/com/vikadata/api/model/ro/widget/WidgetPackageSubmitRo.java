package com.vikadata.api.model.ro.widget;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Pattern;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;
import lombok.EqualsAndHashCode;

import com.vikadata.api.constants.PatternConstants;

import java.util.List;

/**
 * <p>
 * 小程序发布请求参数
 * </p>
 *
 * @author Pengap
 * @date 2021/7/8
 */
@Data
@EqualsAndHashCode(callSuper = true)
@ApiModel("小程序发布请求参数")
public class WidgetPackageSubmitRo extends WidgetPackageBaseRo {

    @ApiModelProperty(value = "小程序包ID", example = "wpkAAA", position = 1)
    @NotBlank(message = "packageId不能为空")
    private String packageId;

    @ApiModelProperty(value = "版本号", example = "1.0.0", position = 2)
    @NotBlank(message = "发布版本号不能为空")
    private String version;

    @ApiModelProperty(value = "小程序官网", position = 3)
    @NotBlank(message = "website address not blank")
    @Pattern(regexp = PatternConstants.URL_HTTP, message = "website address format error")
    private String website;

    @ApiModelProperty(value = "小程序名称", example = "{'zh-CN':'中','en-US':'英'}", position = 4)
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
