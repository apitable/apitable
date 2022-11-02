package com.vikadata.api.model.ro.organization;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

/**
 * 新增标签请求参数
 *
 * @author Chambers
 * @since 2019/10/15
 */
@Data
@ApiModel("新增标签请求参数")
public class CreateTagRo {

    @NotNull(message = "空间ID不能为空")
    @ApiModelProperty(value = "空间唯一ID", example = "r4Arzo4YydiwsgAV", required = true, position = 1)
    private String spaceId;

    @NotBlank
    @Size(min = 1, max = 100, message = "限制1到100个字符，限制输入特殊字符")
    @ApiModelProperty(value = "标签名称", dataType = "string", example = "新建标签", required = true, position = 2)
    private String tagName;
}
