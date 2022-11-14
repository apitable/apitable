package com.vikadata.api.organization.vo;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.vikadata.api.shared.support.serializer.NullArraySerializer;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import java.util.List;

/**
 * <p>
 * Organizational Unit Search Results View
 * </p>
 */
@Data
@ApiModel("Organizational Unit Search Results View")
public class UnitSearchResultVo {

	@ApiModelProperty(value = "Department List", position = 1)
	@JsonSerialize(nullsUsing = NullArraySerializer.class)
	private List<UnitTeamVo> teams;

	@ApiModelProperty(value = "Tag List", position = 2)
	@JsonSerialize(nullsUsing = NullArraySerializer.class)
	private List<UnitTagVo> tags;

	@ApiModelProperty(value = "Member List", position = 3)
	@JsonSerialize(nullsUsing = NullArraySerializer.class)
	private List<UnitMemberVo> members;
}
