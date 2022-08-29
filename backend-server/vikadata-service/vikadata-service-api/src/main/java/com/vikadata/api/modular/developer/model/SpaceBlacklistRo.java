package com.vikadata.api.modular.developer.model;

import java.util.List;

import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

/**
 * <p>
 * 空间站黑名单参数
 * </p>
 * @author Pengap
 * @date 2022/3/24 15:13:01
 */
@Data
@ApiModel("空间站黑名单参数")
public class SpaceBlacklistRo {

    @ApiModelProperty(value = "空间ID 列表", required = true, example = "[\"spczJrh2i3tLW\",\"spczdmQDfBAn5\"]", position = 1)
    @NotEmpty(message = "空间ID 不能为空")
    private List<String> spaceIds;

    @ApiModelProperty(value = "黑名单状态", required = true, example = "true", position = 2)
    @NotNull(message = "设置状态 不能为空")
    private Boolean status;

}
