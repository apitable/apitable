package com.vikadata.api.model.ro.template;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;

/**
 * <p>
 * 创建模版请求参数
 * </p>
 *
 * @author Chambers
 * @date 2020/5/12
 */
@Data
@ApiModel("创建模版请求参数")
public class CreateTemplateRo {

    @ApiModelProperty(value = "模板名称", example = "这是一个模板", position = 1, required = true)
    @NotBlank(message = "模板名称不能为空")
    @Size(max = 100, message = "名称长度不能超过100位")
    private String name;

    @ApiModelProperty(value = "创建模版的节点Id", example = "nod10", position = 2, required = true)
    @NotBlank(message = "节点Id不能为空")
    private String nodeId;

    @ApiModelProperty(value = "是否保留数据", example = "true", position = 3)
    private Boolean data = true;
}
