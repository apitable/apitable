package com.vikadata.api.model.ro.node;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.vikadata.core.support.deserializer.StringToLongDeserializer;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

/**
 * <p>
 *
 * </p>
 *
 * @author Shawn Deng
 * @date 2020/5/7 17:56
 */
@Data
@ApiModel("节点角色参数")
public class NodeRoleRo {

    @NotNull(message = "组织单元不能为空")
    @ApiModelProperty(value = "组织单元ID", dataType = "java.lang.String", required = true, example = "761263712638", position = 2)
    @JsonDeserialize(using = StringToLongDeserializer.class)
    private Long unitId;

    @ApiModelProperty(value = "角色", example = "readonly", position = 3, required = true)
    @NotBlank(message = "角色不能为空")
    private String role;
}
