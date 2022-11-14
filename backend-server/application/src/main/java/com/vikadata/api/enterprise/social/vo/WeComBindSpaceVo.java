package com.vikadata.api.enterprise.social.vo;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * <p>
 * WeCom application binding space information
 * </p>
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder(toBuilder = true)
@ApiModel("WeCom application binding space information")
public class WeComBindSpaceVo {

    @ApiModelProperty(value = "Space ID bound by the application", position = 1)
    private String bindSpaceId;

}
