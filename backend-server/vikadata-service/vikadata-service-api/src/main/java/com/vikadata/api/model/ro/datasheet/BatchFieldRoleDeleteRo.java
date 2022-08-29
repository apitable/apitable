package com.vikadata.api.model.ro.datasheet;

import java.util.List;

import javax.validation.constraints.NotEmpty;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import com.vikadata.core.support.deserializer.StringArrayToLongArrayDeserializer;

/**
 * @author tao
 */
@Data
@ApiModel("批量数表字段角色删除请求参数")
public class BatchFieldRoleDeleteRo {

    @NotEmpty(message = "组织单元不能为空")
    @ApiModelProperty(value = "组织单元ID集", dataType = "java.util.List", required = true, example = "[\"1\",\"2\",\"3\"]", position = 2)
    @JsonDeserialize(using = StringArrayToLongArrayDeserializer.class)
    private List<Long> unitIds;

}
