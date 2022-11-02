package com.vikadata.api.model.ro.datasheet;

import java.util.List;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotEmpty;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import com.vikadata.api.validator.FieldRoleMatch;
import com.vikadata.core.support.deserializer.StringArrayToLongArrayDeserializer;

/**
 * <p>
 * 数表字段角色创建请求参数
 * </p>
 *
 * @author Chambers
 * @date 2021/3/29
 */
@Data
@ApiModel("数表字段角色创建请求参数")
public class FieldRoleCreateRo {

    @NotEmpty(message = "组织单元不能为空")
    @ApiModelProperty(value = "组织单元ID集合", dataType = "List", example = "10101,10102,10103,10104", required = true, position = 2)
    @JsonDeserialize(using = StringArrayToLongArrayDeserializer.class)
    private List<Long> unitIds;

    @NotBlank(message = "角色不能为空")
    @FieldRoleMatch
    @ApiModelProperty(value = "角色", example = "editor", required = true, position = 3)
    private String role;
}
