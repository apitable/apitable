package com.vikadata.api.model.ro.config;

import javax.validation.constraints.NotNull;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

/**
 * <p>
 *     模板中心相关配置请求参数
 * </p>
 * @author tao
 */
@Data
@ApiModel("模板中心相关配置请求参数")
public class TemplateConfigRo {

    @ApiModelProperty(value = "类型：1、热门推荐；2、上架模板", example = "1", position = 1, required = true)
    @NotNull(message = "类型不能为空")
    private Integer type;

    @ApiModelProperty(value = "节点ID", example = "dstxxx", position = 2, required = true)
    @NotNull(message = "配置表不能为空")
    private String nodeId;

    @ApiModelProperty(value = "节点视图ID", example = "viwxxx", position = 3, required = true)
    @NotNull(message = "配置视图不能为空")
    private String nodeView;

    @ApiModelProperty(value = "语言", example = "zh_CN", position = 4, required = true)
    @NotNull(message = "语言不能为空")
    private String lang;

    @ApiModelProperty(value = "上架模板分类表id", example = "viwxxx", position = 5, required = true)
    private String categoryDatasheetId;

    @ApiModelProperty(value = "节点视图ID", example = "viwxxx", position = 6, required = true)
    private String categoryDatasheetView;
}
