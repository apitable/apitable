package com.vikadata.api.model.ro.client;

import javax.validation.constraints.NotBlank;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

/**
* <p>
* 客户端更新版本
* </p>
* @author zoe zheng
* @date 2020/7/15 3:19 下午
*/
@Data
@ApiModel("datasheet更新版本")
public class ClientPublishRo {

    @NotBlank(message = "版本号")
    @ApiModelProperty(value = "版本号", dataType = "java.lang.String", example = "aaaa", required = true)
    private String version;
}
