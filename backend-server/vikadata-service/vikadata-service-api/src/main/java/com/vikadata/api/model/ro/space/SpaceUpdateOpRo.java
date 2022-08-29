package com.vikadata.api.model.ro.space;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.Size;

/**
 * 空间编辑请求参数
 *
 * @author Chambers
 * @since 2019/11/01
 */
@ApiModel("空间编辑请求参数")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder(toBuilder = true)
public class SpaceUpdateOpRo {

    @ApiModelProperty(value = "名称", example = "这是一个新的空间名称", position = 1)
    @Size(max = 100, message = "空间名称长度需为2-100位")
    private String name;

    @ApiModelProperty(value = "图标", example = "https://...", position = 2)
    private String logo;
}
