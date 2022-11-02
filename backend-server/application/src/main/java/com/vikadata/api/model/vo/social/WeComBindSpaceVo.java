package com.vikadata.api.model.vo.social;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * <p>
 * 企业微信应用绑定空间站信息
 * </p>
 *
 * @author Pengap
 * @date 2021/8/28 19:03:54
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder(toBuilder = true)
@ApiModel("企业微信应用绑定空间站信息")
public class WeComBindSpaceVo {

    @ApiModelProperty(value = "应用绑定的空间站ID", position = 1)
    private String bindSpaceId;

}
