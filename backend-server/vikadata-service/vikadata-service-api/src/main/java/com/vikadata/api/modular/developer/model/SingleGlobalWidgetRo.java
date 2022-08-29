package com.vikadata.api.modular.developer.model;

import javax.validation.constraints.NotBlank;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

/**
 * <p>
 * GM 命令单个小组件发布请求参数
 * </p>
 * @author Pengap
 * @date 2021/9/29 18:55:41
 */
@Data
@ApiModel("单个小组件发布请求参数")
public class SingleGlobalWidgetRo {

    @NotBlank
    @ApiModelProperty(value = "节点Id", hidden = true)
    private String nodeId;

    @NotBlank
    @ApiModelProperty(value = "小组件包Id")
    private String packageId;

    @ApiModelProperty(value = "是否生效")
    private Boolean isEnabled;

    @ApiModelProperty(value = "是否模版")
    private Boolean isTemplate;

    @ApiModelProperty(value = "模版小组件源码地址")
    private String openSourceAddres;

    @ApiModelProperty(value = "模版小组件扩展封面图")
    private String templateCover;

    @ApiModelProperty(value = "官方小组网站")
    private String website;

    @NotBlank
    @ApiModelProperty(value = "记录Id", hidden = true)
    private String recordId;

}
