package com.vikadata.api.model.vo.space;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.vikadata.core.support.tree.Tree;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import java.io.Serializable;
import java.util.List;
import java.util.Set;

/**
 * <p>
 * 成员对应空间的菜单树形结构
 * </p>
 *
 * @author Shawn Deng
 * @date 2020/2/8 22:36
 */
@Data
@ApiModel("空间资源菜单列表")
public class UserSpaceMenuTree implements Tree, Serializable {

	private static final long serialVersionUID = 5569104968926431919L;

	@ApiModelProperty(value = "菜单编码", example = "ManageOrg:ManageMember", position = 1)
	private String menuCode;

	@ApiModelProperty(value = "菜单名称", example = "成员管理", position = 2)
	private String menuName;

	@ApiModelProperty(value = "菜单序号", example = "1", position = 3)
	private Integer sequence;

	@ApiModelProperty(value = "父级菜单编码", example = "ManageOrg", position = 4)
	private String parentCode;

	@ApiModelProperty(value = "菜单对应的操作权限资源", dataType = "List", example = "[\"ADD_MEMBER\",\"UPDATE_MEMBER\"]", position = 5)
	private Set<String> operators;

	@ApiModelProperty(value = "子菜单", position = 6)
	private List<UserSpaceMenuTree> children;

	@JsonIgnore
	@Override
	public String getNodeId() {
		if (this.getMenuCode() == null) {
			return null;
		} else {
			return this.getMenuCode();
		}
	}

	@JsonIgnore
	@Override
	public String getNodeParentId() {
		if (this.parentCode == null) {
			return null;
		} else {
			return this.parentCode;
		}
	}

	@JsonIgnore
	@Override
	public List<UserSpaceMenuTree> getChildrenNodes() {
		if (this.children != null && this.children.size() > 0) {
			return children;
		}
		return null;
	}

	@Override
	public void setChildrenNodes(List childrenNodes) {
		this.children = childrenNodes;
	}
}
