package com.vikadata.api.model.ro.client;

import javax.validation.constraints.NotBlank;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

/**
 * <p>
 * 添加客户端release版本请求参数
 * </p>
 *
 * @author Shawn Deng
 * @date 2020/2/12 23:58
 */
@Data
@ApiModel("添加客户端release版本请求参数")
public class ClientBuildRo {

    @NotBlank(message = "版本号不允许为空")
    @ApiModelProperty(value = "版本号", dataType = "java.lang.String", example = "aaaa", required = true)
    private String version;

    @NotBlank(message = "base64Encode之后的html内容,不允许为空")
    @ApiModelProperty(value = "html内容", dataType = "java.lang.String", required = true, example = "aaaaadd")
    private String htmlContent;

    @ApiModelProperty(value = "版本描述", dataType = "java.lang.String", required = true, example = "构建")
    private String description;

    @NotBlank(message = "发版用户不能为空")
    @ApiModelProperty(value = "发版用户", dataType = "java.lang.String", required = true, example = "zhengxu@vikadta.com")
    private String publishUser;
}
