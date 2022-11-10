package com.vikadata.api.model.vo.vcode;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * <p>
 * View of V-code coupon template
 * </p>
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder(toBuilder = true)
@ApiModel("View of V-code coupon template")
public class VCodeCouponVo {

    @ApiModelProperty(value = "Exchange coupon template ID", dataType = "java.lang.String", example = "1456", position = 1)
    @JsonSerialize(using = ToStringSerializer.class)
    private Long templateId;

    @ApiModelProperty(value = "Exchange amount", dataType = "java.lang.Integer", example = "10", position = 2)
    private Integer count;

    @ApiModelProperty(value = "Remarks", dataType = "java.lang.String", example = "Seed user benefit exchange template", position = 3)
    private String comment;

}
