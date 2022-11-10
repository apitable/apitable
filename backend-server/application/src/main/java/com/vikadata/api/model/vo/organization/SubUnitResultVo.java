package com.vikadata.api.model.vo.organization;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import java.util.ArrayList;
import java.util.List;

/**
 * <p>
 * Subordinate Org Unit Result View
 * </p>
 */
@Data
@ApiModel("Subordinate Org Unit Result View")
public class SubUnitResultVo {

	@ApiModelProperty(value = "Department List", position = 1)
	private List<UnitTeamVo> teams = new ArrayList<>();

	@ApiModelProperty(value = "Member List", position = 2)
	private List<UnitMemberVo> members = new ArrayList<>();
}
