package com.vikadata.api.model.ro.node;

import java.util.List;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotEmpty;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import com.vikadata.core.support.deserializer.StringArrayToLongArrayDeserializer;

/**
 * <p>
 * 批量修改节点角色请求参数
 * </p>
 *
 * @author tao
 */
@Data
@ApiModel("批量修改组织单元角色请求参数")
public class BatchModifyNodeRoleRo {

	@NotBlank(message = "节点ID不能为空")
	@ApiModelProperty(value = "节点ID", example = "nod10", position = 1)
	private String nodeId;

	@NotEmpty(message = "组织单元不能为空")
	@ApiModelProperty(value = "组织单元ID集", dataType = "java.util.List", required = true, example = "[\"1\",\"2\",\"3\"]", position = 2)
	@JsonDeserialize(using = StringArrayToLongArrayDeserializer.class)
	private List<Long> unitIds;

	@ApiModelProperty(value = "角色", example = "readonly", position = 3, required = true)
	@NotBlank(message = "角色不能为空")
	private String role;
}
