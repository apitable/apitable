package com.vikadata.api.model.ro.space;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import javax.validation.constraints.NotNull;

/**
 * <p>
 * 空间更换主管理员请求参数
 * </p>
 *
 * @author Chambers
 * @date 2020/1/21
 */
@Data
@ApiModel("空间更换主管理员请求参数")
public class SpaceMainAdminChangeOpRo {

    @ApiModelProperty(value = "新主管理员的成员ID", example = "123456", position = 2, required = true)
    @NotNull(message = "新主管理员的成员ID不能为空")
    private Long memberId;
}
