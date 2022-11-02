package com.vikadata.api.model.ro.template;

import javax.validation.constraints.NotBlank;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

/**
 * <p>
 * 引用模版请求参数
 * </p>
 *
 * @author Chambers
 * @date 2020/5/23
 */
@Data
@ApiModel("引用模版请求参数")
public class QuoteTemplateRo {

    @ApiModelProperty(value = "模版ID", example = "tplHTbkg7qbNJ", position = 1, required = true)
    @NotBlank(message = "模版ID不能为空")
    private String templateId;

    @ApiModelProperty(value = "父节点ID", example = "fodSf4PZBNwut", position = 2, required = true)
    private String parentId;

    @ApiModelProperty(value = "是否保留数据", example = "true", position = 3)
    private Boolean data = true;
}
