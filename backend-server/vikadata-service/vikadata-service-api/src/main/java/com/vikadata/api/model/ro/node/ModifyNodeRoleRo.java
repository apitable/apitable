package com.vikadata.api.model.ro.node;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import com.vikadata.core.support.deserializer.StringToLongDeserializer;

/**
 * <p>
 * 修改节点角色请求参数
 * </p>
 *
 * @author Shawn Deng
 * @date 2020/2/20 13:59
 */
@Data
@ApiModel("修改组织单元角色请求参数")
public class ModifyNodeRoleRo {

	@NotBlank(message = "节点ID不能为空")
	@ApiModelProperty(value = "节点ID", example = "nod10", position = 1)
	private String nodeId;

	@NotNull(message = "组织单元不能为空")
	@ApiModelProperty(value = "组织单元ID", dataType = "java.lang.String", required = true, example = "761263712638", position = 2)
	@JsonDeserialize(using = StringToLongDeserializer.class)
	private Long unitId;

	@ApiModelProperty(value = "角色", example = "readonly", position = 3, required = true)
	@NotBlank(message = "角色不能为空")
	private String role;
}
