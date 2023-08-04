/*
 * APITable <https://github.com/apitable/apitable>
 * Copyright (C) 2022 APITable Ltd. <https://apitable.com>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

package com.apitable.space.vo;

import com.apitable.core.support.tree.Tree;
import com.fasterxml.jackson.annotation.JsonIgnore;
import io.swagger.v3.oas.annotations.media.Schema;
import java.io.Serializable;
import java.util.List;
import java.util.Set;
import lombok.Data;

/**
 * <p>
 * Menu tree structure of member corresponding space.
 * </p>
 */
@Data
@Schema(description = "Space resource menu list")
public class UserSpaceMenuTree implements Tree, Serializable {

    private static final long serialVersionUID = 5569104968926431919L;

    @Schema(description = "Menu coding", example = "ManageOrg:ManageMember")
    private String menuCode;

    @Schema(description = "Menu Name", example = "Member Management")
    private String menuName;

    @Schema(description = "Menu No", example = "1")
    private Integer sequence;

    @Schema(description = "Parent menu code", example = "ManageOrg")
    private String parentCode;

    @Schema(description = "Operation permission resources corresponding to the menu",
        type = "List", example = "[\"ADD_MEMBER\",\"UPDATE_MEMBER\"]")
    private Set<String> operators;

    @Schema(description = "Submenu")
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
