package com.vikadata.api.modular.developer.model;

import java.util.List;

import javax.validation.constraints.Max;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

/**
 * <p>
 * 企微服务商下单续期接口许可
 * </p>
 * @author 刘斌华
 * @date 2022-07-04 16:02:03
 */
@Data
@ApiModel("企微服务商下单续期接口许可")
public class WeComIsvPermitRenewalRo {

    @ApiModelProperty("要续期接口许可的空间站 ID")
    @NotBlank
    private String spaceId;

    @ApiModelProperty("要续期的企微用户 ID 列表")
    @NotEmpty
    private List<String> cpUserIds;

    @ApiModelProperty("续期时长的月数。以 31 天为一个月，最多 36 个月")
    @NotNull
    @Min(1)
    @Max(36)
    private Integer durationMonths;

}
