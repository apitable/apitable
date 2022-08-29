package com.vikadata.api.model.vo.user;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.vikadata.api.support.serializer.NullNumberSerializer;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

/**
 * <p>
 * 用户积分信息视图
 * </p>
 *
 * @author Shawn Deng
 * @date 2020/9/16 16:26
 */
@Data
@ApiModel("用户积分信息视图")
public class UserIntegralVo {

    @ApiModelProperty(value = "积分值(单位: 分)", example = "10000", position = 1)
    @JsonSerialize(nullsUsing = NullNumberSerializer.class)
    private Integer totalIntegral;
}
