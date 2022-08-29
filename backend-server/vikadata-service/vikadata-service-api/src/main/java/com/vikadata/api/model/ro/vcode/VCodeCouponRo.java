package com.vikadata.api.model.ro.vcode;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import javax.validation.constraints.NotNull;

/**
 * <p>
 * V码兑换券模板请求参数
 * </p>
 *
 * @author Chambers
 * @date 2020/8/20
 */
@Data
@ApiModel("V码兑换券模板请求参数")
public class VCodeCouponRo {

    @ApiModelProperty(value = "兑换数", example = "10", position = 1, required = true)
    @NotNull(message = "兑换数不能为空")
    private Integer count;

    @ApiModelProperty(value = "备注", example = "种子用户福利兑换模板", position = 2)
    private String comment;

}
