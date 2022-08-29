package com.vikadata.api.modular.developer.model;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

/**
 * <p>
 * 用户活动请求参数
 * </p>
 *
 * @author Chambers
 * @date 2020/9/21
 */
@Data
@ApiModel("用户活动请求参数")
public class UserActivityRo {

    @ApiModelProperty(value = "引导ID", example = "7", position = 1)
    private Integer wizardId;
}
