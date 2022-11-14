package com.vikadata.api.organization.vo;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Builder;
import lombok.Data;

/**
 * <p>
 *      role's info
 * </p>
 *
 * @author tao
 */
@Data
@Builder
@ApiModel("role's info")
public class RoleVo {

    @ApiModelProperty(value = "role id", dataType = "java.lang.String", example = "1", position = 1)
    @JsonSerialize(using = ToStringSerializer.class)
    private Long roleId;

    @ApiModelProperty(value = "role's name", example = "Finance", position = 2)
    private String roleName;

}
