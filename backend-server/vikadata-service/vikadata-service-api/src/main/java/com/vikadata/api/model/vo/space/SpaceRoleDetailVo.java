package com.vikadata.api.model.vo.space;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import java.util.List;

/**
 * <p>
 * 管理员权限信息视图
 * </p>
 *
 * @author Shawn Deng
 * @date 2019/11/12 17:29
 */
@Data
@ApiModel("管理员权限信息视图")
public class SpaceRoleDetailVo {

	@ApiModelProperty(value = "管理员名称", example = "张三", position = 1)
	private String memberName;

	@ApiModelProperty(value = "管理员拥有的权限编码集合", dataType = "List", example = "[\"MANAGE_MEMBER\",\"MANAGE_TEAM\"]", position = 2)
	private List<String> resources;
}
