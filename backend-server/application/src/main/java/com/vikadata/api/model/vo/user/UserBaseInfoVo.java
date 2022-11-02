package com.vikadata.api.model.vo.user;

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
 * 用户基本信息
 * </p>
 *
 * @author zoe zheng
 * @date 2020/8/28 10:59 上午
 */
@Data
@Builder(toBuilder = true)
@NoArgsConstructor
@AllArgsConstructor
@ApiModel("用户基本信息")
public class UserBaseInfoVo {

    @ApiModelProperty(value = "当前用户标识", example = "123", position = 1)
    @JsonSerialize(using = ToStringSerializer.class)
    private Long userId;

    @ApiModelProperty(value = "当前用户唯一标识", example = "123", position = 2)
    private String uuid;
}
