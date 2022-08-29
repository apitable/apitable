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
 * 小程序包创建请求参数
 * </p>
 *
 * @author Pengap
 * @date 2021/7/8
 */
@Data
@ApiModel("小程序包创建请求参数")
public class WidgetPackageCreateRo {

    @ApiModelProperty(value = "自定义小程序包ID", example = "wpkAAA", position = 1)
    @Pattern(regexp = PatternConstants.PACKAGE_ID, message = "Package ID format error,Please start with 'wpk' and add a combination of English letters and numbers with a length of 10")
    private String packageId;

    @ApiModelProperty(value = "空间站ID", example = "spcyQkKp9XJEl", position = 2)
    @NotBlank(message = "spaceId不能为空")
    private String spaceId;

    @ApiModelProperty(value = "小程序名称", example = "{'zh-CN':'中','en-US':'英'}", position = 3)
    @NotBlank(message = "小程序名称不能为空")
    private String name;

    @ApiModelProperty(value = "组件包类型(0:第三方,1:官方)", position = 4)
    @NotNull(message = "组件包类型不能为空")
    private Integer packageType;

    @ApiModelProperty(value = "0：发布到空间站中的组件商店，1：发布到全局应用商店（只有 package_type 为 1 才允许）", position = 5)
    @NotNull(message = "组件包发布类型不能为空")
    private Integer releaseType;

    @ApiModelProperty(value = "是否模版", position = 6)
    private Boolean isTemplate;

    @ApiModelProperty(value = "是否沙箱", position = 7)
    private Boolean sandbox;

    @ApiModelProperty(value = "安装环境类型", example = "dashboard", position = 8)
    private List<String> installEnv;

    @ApiModelProperty(value = "运行环境类型", example = "mobile", position = 9)
    private List<String> runtimeEnv;

}
