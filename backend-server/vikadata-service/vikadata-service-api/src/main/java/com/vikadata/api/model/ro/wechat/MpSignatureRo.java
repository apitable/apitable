package com.vikadata.api.model.ro.wechat;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import javax.validation.constraints.NotBlank;

/**
 * <p>
 * 公众号签名请求参数
 * </p>
 *
 * @author Chambers
 * @date 2020/5/26
 */
@Data
@ApiModel("公众号签名请求参数")
public class MpSignatureRo {

    @ApiModelProperty(value = "路径", dataType = "java.lang.String", example = "https://...", position = 1, required = true)
    @NotBlank(message = "url不能为空")
    private String url;
}
