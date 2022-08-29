package com.vikadata.api.modular.developer.model;

import javax.validation.constraints.Max;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

/**
 * <p>
 * 企微服务商下单购买接口许可
 * </p>
 * @author 刘斌华
 * @date 2022-06-24 09:49:27
 */
@Data
@ApiModel("企微服务商下单购买接口许可")
public class WeComIsvPermitNewOrderRo {

    @ApiModelProperty("要购买接口许可的空间站 ID")
    @NotBlank
    private String spaceId;

    @ApiModelProperty("购买账号时长的月数。以 31 天为一个月，最多 36 个月")
    @NotNull
    @Min(1)
    @Max(36)
    private Integer durationMonths;

}
