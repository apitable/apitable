package com.vikadata.api.model.ro.node;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.vikadata.core.support.deserializer.StringArrayToLongArrayDeserializer;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotEmpty;
import java.util.List;

/**
 * <p>
 * 添加节点角色请求参数
 * </p>
 *
 * @author Shawn Deng
 * @date 2020/2/20 13:59
 */
@Data
@ApiModel("添加节点角色请求参数")
public class AddNodeRoleRo {

	@NotBlank(message = "节点ID不能为空")
	@ApiModelProperty(value = "节点ID", example = "nod10", position = 1)
	private String nodeId;

	@NotEmpty(message = "组织单元不能为空")
	@ApiModelProperty(value = "组织单元ID集合", dataType = "List", example = "[\"10101\",\"10102\",\"10103\",\"10104\"]", required = true, position = 2)
	@JsonDeserialize(using = StringArrayToLongArrayDeserializer.class)
	private List<Long> unitIds;

	@ApiModelProperty(value = "角色", example = "editor", position = 3, required = true)
	@NotBlank(message = "角色不能为空")
	private String role;
}
