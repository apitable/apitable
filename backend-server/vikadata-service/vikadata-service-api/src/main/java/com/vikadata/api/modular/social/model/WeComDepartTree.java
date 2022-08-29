package com.vikadata.api.modular.social.model;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import com.vikadata.core.support.tree.v2.Tree;

/**
 * <p>
 * 企业微信部门树结构
 * </p>
 *
 * @author Pengap
 * @date 2021/8/9 16:11:01
 */
@Data
@EqualsAndHashCode(of = { "id" })
@AllArgsConstructor
@NoArgsConstructor
public class WeComDepartTree implements Tree {

    private static final long serialVersionUID = 3860593887489174660L;

    private String id;

    private String name;

    private String enName;

    private String parentId;

    private Long order;

    private int level;

    private List<WeComDepartTree> children;

    public WeComDepartTree(String id, String name, String enName, String parentId, Long order) {
        this.id = id;
        this.name = name;
        this.enName = enName;
        this.parentId = parentId;
        this.order = order;
    }

    @JsonIgnore
    @Override
    public List getChildren() {
        return this.children;
    }

    @Override
    public void setChildren(List childrenNodes) {
        this.children = childrenNodes;
    }

}
