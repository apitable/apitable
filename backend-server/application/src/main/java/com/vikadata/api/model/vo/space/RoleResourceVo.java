package com.vikadata.api.model.vo.space;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import java.util.List;

/**
 * <p>
 * Role Resource View
 * </p>
 */
@Data
@ApiModel("Role Resource View")
public class RoleResourceVo {

	@ApiModelProperty(value = "Group Name", example = "Address book management", position = 1)
	private String groupName;

	@ApiModelProperty(value = "Resource list", example = "[\"Manage Members\",\"Administrative department\",\"Manage Labels\"]", position = 2)
	private List<String> resourceNames;
}
