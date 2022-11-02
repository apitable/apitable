package com.vikadata.api.model.ro.datasheet;

import javax.validation.constraints.NotNull;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import com.vikadata.core.support.deserializer.StringToLongDeserializer;

/**
 * <p>
 * 数表字段角色删除请求参数
 * </p>
 *
 * @author Chambers
 * @date 2021/3/29
 */
@Data
@ApiModel("数表字段角色删除请求参数")
public class FieldRoleDeleteRo {

    @NotNull(message = "组织单元不能为空")
    @ApiModelProperty(value = "组织单元ID", dataType = "java.lang.String", required = true, example = "761263712638", position = 2)
    @JsonDeserialize(using = StringToLongDeserializer.class)
    private Long unitId;
}
