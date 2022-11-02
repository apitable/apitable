package com.vikadata.api.model.ro.space;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import javax.validation.constraints.NotBlank;

/**
 * <p>
 * 空间加入申请的请求参数
 * </p>
 *
 * @author Chambers
 * @date 2020/10/26
 */
@Data
@ApiModel("空间加入申请的请求参数")
public class SpaceJoinApplyRo {

    @ApiModelProperty(value = "空间ID", required = true, example = "spczdmQDfBAn5", position = 1)
    @NotBlank(message = "空间ID不能为空")
    private String spaceId;
}
