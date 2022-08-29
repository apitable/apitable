package com.vikadata.api.modular.developer.model;

import javax.validation.constraints.NotBlank;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

/**
 * <p>
 * 企业认证参数
 * </p>
 * @author zoe zheng
 * @date 2022/4/6 16:20
 */
@Data
@ApiModel("企业认证参数")
public class SpaceCertificationRo {

    @NotBlank(message = "空间ID不能为空")
    @ApiModelProperty(value = "空间ID", required = true, example = "spcNrqN2iH0qK", position = 1)
    private String spaceId;

    @NotBlank(message = "用户uuid")
    @ApiModelProperty(value = "用户的uuid", required = true, example = "dfada", position = 2)
    private String uuid;

    @NotBlank(message = "认证等级")
    @ApiModelProperty(value = "认证等级", required = true, example = "basic/senior", position = 3)
    private String certification;
}
