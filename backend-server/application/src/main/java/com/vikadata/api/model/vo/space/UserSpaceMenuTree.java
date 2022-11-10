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
 * Menu tree structure of member corresponding space
 * </p>
 */
@Data
@ApiModel("Space resource menu list")
public class UserSpaceMenuTree implements Tree, Serializable {

	private static final long serialVersionUID = 5569104968926431919L;

	@ApiModelProperty(value = "Menu coding", example = "ManageOrg:ManageMember", position = 1)
	private String menuCode;

	@ApiModelProperty(value = "Menu Name", example = "Member Management", position = 2)
	private String menuName;

	@ApiModelProperty(value = "Menu No", example = "1", position = 3)
	private Integer sequence;

	@ApiModelProperty(value = "Parent menu code", example = "ManageOrg", position = 4)
	private String parentCode;

	@ApiModelProperty(value = "Operation permission resources corresponding to the menu", dataType = "List", example = "[\"ADD_MEMBER\",\"UPDATE_MEMBER\"]", position = 5)
	private Set<String> operators;

	@ApiModelProperty(value = "Submenu", position = 6)
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
