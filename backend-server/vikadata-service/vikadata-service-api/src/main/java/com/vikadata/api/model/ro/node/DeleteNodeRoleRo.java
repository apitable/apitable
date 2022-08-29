package com.vikadata.api.model.ro.node;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.vikadata.core.support.deserializer.StringToLongDeserializer;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import javax.validation.constraints.NotNull;

/**
 * <p>
 * 删除节点角色请求参数
 * </p>
 *
 * @author Shawn Deng
 * @date 2020/2/20 13:59
 */
@Data
@ApiModel("删除节点角色请求参数")
public class DeleteNodeRoleRo {

	@ApiModelProperty(value = "节点ID，不传递代表根节点，即工作目录", example = "nod10", position = 1)
	private String nodeId;

	@NotNull(message = "组织单元不能为空")
	@ApiModelProperty(value = "组织单元ID", dataType = "java.lang.String", required = true, example = "71638172638", position = 2)
	@JsonDeserialize(using = StringToLongDeserializer.class)
	private Long unitId;
}
