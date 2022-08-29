package com.vikadata.api.model.vo.organization;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import java.util.ArrayList;
import java.util.List;

/**
 * <p>
 * 下属组织单元结果视图
 * </p>
 *
 * @author Shawn Deng
 * @date 2020/2/21 01:03
 */
@Data
@ApiModel("下属组织单元结果视图")
public class SubUnitResultVo {

	@ApiModelProperty(value = "部门列表", position = 1)
	private List<UnitTeamVo> teams = new ArrayList<>();

	@ApiModelProperty(value = "成员列表", position = 2)
	private List<UnitMemberVo> members = new ArrayList<>();
}
