package com.vikadata.api.model.ro.datasheet;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import com.vikadata.api.validator.FieldRoleMatch;
import com.vikadata.core.support.deserializer.StringToLongDeserializer;

/**
 * <p>
 * 数表字段角色编辑请求参数
 * </p>
 *
 * @author Chambers
 */
@Data
@ApiModel("数表字段角色编辑请求参数")
public class FieldRoleEditRo {

    @NotNull(message = "组织单元不能为空")
    @ApiModelProperty(value = "组织单元ID", dataType = "java.lang.String", required = true, example = "761263712638", position = 2)
    @JsonDeserialize(using = StringToLongDeserializer.class)
    private Long unitId;

    @NotBlank(message = "角色不能为空")
    @FieldRoleMatch
    @ApiModelProperty(value = "角色", example = "editor", required = true, position = 3)
    private String role;
}
