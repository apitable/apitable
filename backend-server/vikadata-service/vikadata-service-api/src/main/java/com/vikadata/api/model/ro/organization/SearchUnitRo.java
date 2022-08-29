package com.vikadata.api.model.ro.organization;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotEmpty;

/**
 * <p>
 * 搜索组织单元请求参数
 * </p>
 *
 * @author Chambers
 * @date 2020/10/13
 */
@Data
@ApiModel("搜索组织单元请求参数")
public class SearchUnitRo {

    @ApiModelProperty(value = "名称列表", required = true, example = "张三,李四", position = 1)
    @NotBlank(message = "名称列表不能为空")
    private String names;

    @ApiModelProperty(value = "关联ID：节点分享ID、模板ID", dataType = "java.lang.String", example = "shr8T8vAfehg3yj3McmDG", position = 2)
    private String linkId;
}
