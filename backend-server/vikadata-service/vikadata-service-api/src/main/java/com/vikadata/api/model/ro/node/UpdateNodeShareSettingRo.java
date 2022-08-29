package com.vikadata.api.model.ro.node;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import javax.validation.constraints.NotBlank;

/**
 * <p>
 * 更改节点分享设置请求参数
 * </p>
 *
 * @author Shawn Deng
 * @date 2020/10/19 14:59
 */
@Data
@ApiModel("更改节点分享设置请求参数")
public class UpdateNodeShareSettingRo {

    @NotBlank(message = "分享设置参数不能为空")
    @ApiModelProperty(value = "分享设置参数字符串", dataType = "string", required = true, example = "\"{\"onlyRead\": true}\"")
    private String props;
}
