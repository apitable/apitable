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
 * 节点角色视图
 * </p>
 *
 * @author Shawn Deng
 * @date 2020/2/28 13:48
 */
@Data
@ApiModel("节点角色视图")
public class NodeRoleVo implements Serializable {

	private static final long serialVersionUID = -3532750242987274847L;

	@ApiModelProperty(value = "角色", example = "manager", position = 1)
	private String role;

	@ApiModelProperty(value = "部门列表", position = 2)
	@JsonSerialize(nullsUsing = NullArraySerializer.class)
	private List<UnitTeamVo> teams;

	@ApiModelProperty(value = "标签列表", position = 3)
	@JsonSerialize(nullsUsing = NullArraySerializer.class)
	private List<UnitTagVo> tags;

	@ApiModelProperty(value = "成员列表", position = 4)
	@JsonSerialize(nullsUsing = NullArraySerializer.class)
	private List<UnitMemberVo> members;
}
