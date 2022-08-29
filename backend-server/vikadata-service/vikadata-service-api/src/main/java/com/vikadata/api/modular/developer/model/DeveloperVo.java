package com.vikadata.api.modular.developer.model;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

/**
 * <p>
 * 登录结果
 * </p>
 *
 * @author Kelly Chen
 * @date 2020/4/7 14:55
 */
@Data
@ApiModel("登录结果")
public class DeveloperVo {

    @ApiModelProperty(value = "登录验证是否通过的结果", example = "ABBBAAAVCCC", position = 1)
    private boolean isVerified;

    @ApiModelProperty(value = "登录用户UUID", example = "123123123", position = 2)
    private String uuid;

    @ApiModelProperty(value = "登录用户名", example = "小明", position = 3)
    private String username;
}
