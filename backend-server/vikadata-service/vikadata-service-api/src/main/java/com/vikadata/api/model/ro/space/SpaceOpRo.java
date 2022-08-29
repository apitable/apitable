package com.vikadata.api.model.ro.space;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;

/**
 * 空间请求参数
 *
 * @author Chambers
 * @since 2019/10/8
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder(toBuilder = true)
@ApiModel("空间请求参数")
public class SpaceOpRo {

    @ApiModelProperty(value = "名称", example = "这是一个空间", position = 1, required = true)
    @NotBlank(message = "名称不能为空")
    @Size(min = 2, max = 100, message = "空间名称长度需为2-100位")
    private String name;

}
