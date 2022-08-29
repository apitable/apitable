package com.vikadata.api.model.vo.organization;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.vikadata.api.support.serializer.NullArraySerializer;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import java.util.List;

/**
 * <p>
 * 组织单元搜索结果视图
 * </p>
 *
 * @author Shawn Deng
 * @date 2020/2/21 01:03
 */
@Data
@ApiModel("组织单元搜索结果视图")
public class UnitSearchResultVo {

	@ApiModelProperty(value = "部门列表", position = 1)
	@JsonSerialize(nullsUsing = NullArraySerializer.class)
	private List<UnitTeamVo> teams;

	@ApiModelProperty(value = "标签列表", position = 2)
	@JsonSerialize(nullsUsing = NullArraySerializer.class)
	private List<UnitTagVo> tags;

	@ApiModelProperty(value = "成员列表", position = 3)
	@JsonSerialize(nullsUsing = NullArraySerializer.class)
	private List<UnitMemberVo> members;
}
