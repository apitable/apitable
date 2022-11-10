package com.vikadata.api.model.vo.node;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.vikadata.api.model.vo.organization.UnitMemberVo;
import com.vikadata.api.model.vo.organization.UnitTagVo;
import com.vikadata.api.model.vo.organization.UnitTeamVo;
import com.vikadata.api.support.serializer.NullArraySerializer;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import java.io.Serializable;
import java.util.List;

/**
 * <p>
 * Node Role View
 * </p>
 */
@Data
@ApiModel("Node Role View")
public class NodeRoleVo implements Serializable {

	private static final long serialVersionUID = -3532750242987274847L;

	@ApiModelProperty(value = "Role", example = "manager", position = 1)
	private String role;

	@ApiModelProperty(value = "Department List", position = 2)
	@JsonSerialize(nullsUsing = NullArraySerializer.class)
	private List<UnitTeamVo> teams;

	@ApiModelProperty(value = "Tag List", position = 3)
	@JsonSerialize(nullsUsing = NullArraySerializer.class)
	private List<UnitTagVo> tags;

	@ApiModelProperty(value = "Member List", position = 4)
	@JsonSerialize(nullsUsing = NullArraySerializer.class)
	private List<UnitMemberVo> members;
}
