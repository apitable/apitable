package com.vikadata.api.modular.developer.model;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

/**
 * <p>
 * 开发者信息
 * </p>
 *
 * @author Shawn Deng
 * @date 2020/6/22 16:29
 */
@Data
@ApiModel("开发者信息")
public class DevelopUserVo {

    @ApiModelProperty(value = "登录用户名", example = "小明", position = 1, required = true)
    private String userName;
}
