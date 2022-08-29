package com.vikadata.api.modular.developer.model;

import javax.validation.constraints.NotBlank;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

/**
 * <p>
 * 为手动删除了空间站的企微服务商重新创建空间站
 * </p>
 * @author 刘斌华
 * @date 2022-06-16 10:39:56
 */
@Data
@ApiModel("为手动删除了空间站的企微服务商重新创建空间站")
public class WeComIsvNewSpaceRo {

    @ApiModelProperty("应用套件 ID")
    @NotBlank
    private String suiteId;

    @ApiModelProperty("授权的企业 ID")
    @NotBlank
    private String authCorpId;

}
