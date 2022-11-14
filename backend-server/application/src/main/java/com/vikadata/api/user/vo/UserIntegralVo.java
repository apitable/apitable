package com.vikadata.api.user.vo;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.vikadata.api.shared.support.serializer.NullNumberSerializer;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

/**
 * <p>
 * User integral information view
 * </p>
 */
@Data
@ApiModel("User integral information view")
public class UserIntegralVo {

    @ApiModelProperty(value = "Integral value (unit: minute)", example = "10000", position = 1)
    @JsonSerialize(nullsUsing = NullNumberSerializer.class)
    private Integer totalIntegral;
}
