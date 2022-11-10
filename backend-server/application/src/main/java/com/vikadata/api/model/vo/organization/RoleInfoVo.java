package com.vikadata.api.model.vo.organization;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Builder;
import lombok.Data;

import com.vikadata.api.support.serializer.NullNumberSerializer;

/**
 * <p>
 *     role's info
 * </p>
 */
@Data
@Builder
@ApiModel("role's info")
public class RoleInfoVo {

    @ApiModelProperty(value = "unit id", example = "1", position = 1)
    @JsonSerialize(using = ToStringSerializer.class)
    private Long unitId;

    @ApiModelProperty(value = "role id", example = "1", position = 2)
    @JsonSerialize(using = ToStringSerializer.class)
    private Long roleId;

    @ApiModelProperty(value = "role name", example = "Finance", position = 3)
    private String roleName;

    @ApiModelProperty(value = "role's member amount", example = "1", position = 4)
    @JsonSerialize(nullsUsing = NullNumberSerializer.class)
    private Integer memberCount;

    @ApiModelProperty(value = "the role's position in role list", example = "1", position = 5)
    private Integer position;
}
