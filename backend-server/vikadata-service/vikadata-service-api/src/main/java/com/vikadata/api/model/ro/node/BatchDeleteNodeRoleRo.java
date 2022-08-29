package com.vikadata.api.model.ro.node;

import java.util.List;

import javax.validation.constraints.NotEmpty;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import com.vikadata.core.support.deserializer.StringArrayToLongArrayDeserializer;

/**
 * <p>
 * 批量删除节点角色请求参数
 * </p>
 *
 * @author tao
 */
@Data
@ApiModel("批量删除节点角色请求参数")
public class BatchDeleteNodeRoleRo {

	@ApiModelProperty(value = "节点ID，不传递代表根节点，即工作目录", example = "nod10", position = 1)
	private String nodeId;

    @NotEmpty(message = "组织单元不能为空")
    @ApiModelProperty(value = "组织单元ID集", dataType = "java.util.List", required = true, example = "[\"1\",\"2\",\"3\"]", position = 2)
    @JsonDeserialize(using = StringArrayToLongArrayDeserializer.class)
    private List<Long> unitIds;
}
