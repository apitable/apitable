package com.vikadata.api.model.vo.space;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import java.util.List;

/**
 * <p>
 * Administrator permission information view
 * </p>
 */
@Data
@ApiModel("Administrator permission information view")
public class SpaceRoleDetailVo {

	@ApiModelProperty(value = "Administrator Name", example = "Zhang San", position = 1)
	private String memberName;

	@ApiModelProperty(value = "The permission code set owned by the administrator", dataType = "List", example = "[\"MANAGE_MEMBER\",\"MANAGE_TEAM\"]", position = 2)
	private List<String> resources;
}
