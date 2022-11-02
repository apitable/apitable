package com.vikadata.api.model.vo.space;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import java.util.List;

/**
 * <p>
 * 角色资源视图
 * </p>
 *
 * @author Shawn Deng
 * @date 2020/2/12 23:15
 */
@Data
@ApiModel("角色资源视图")
public class RoleResourceVo {

	@ApiModelProperty(value = "分组名称", example = "通讯录管理", position = 1)
	private String groupName;

	@ApiModelProperty(value = "资源列表", example = "[\"管理成员\",\"管理部门\",\"管理标签\"]", position = 2)
	private List<String> resourceNames;
}
