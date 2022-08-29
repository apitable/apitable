package com.vikadata.api.model.ro.config;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import javax.validation.constraints.NotNull;

/**
 * <p>
 * 配置请求参数
 * </p>
 *
 * @author Chambers
 * @date 2020/7/10
 */
@Data
@ApiModel("配置请求参数")
public class ConfigRo {

    @ApiModelProperty(value = "类型：1、新手引导/公告", example = "1", position = 1, required = true)
    @NotNull(message = "类型不能为空")
    private Integer type;

    @ApiModelProperty(value = "配置内容", example = "json", position = 2)
    private String content;

    @ApiModelProperty(value = "是否回滚", example = "true", position = 3)
    private Boolean rollback;

    @ApiModelProperty(value = "语言", example = "zh-CN", position = 4)
    private String lang = "zh_CN";
}
