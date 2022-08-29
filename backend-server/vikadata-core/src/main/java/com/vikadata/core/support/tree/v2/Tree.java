package com.vikadata.core.support.tree.v2;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

import cn.hutool.core.util.ArrayUtil;

/**
 * <p>
 * V2 构造树节点的接口规范
 * </p>
 *
 * @author Pengap
 * @date 2021/8/9 15:18:21
 */
@SuppressWarnings("unchecked")
public interface Tree extends Serializable {

    /**
     * 获取节点id
     *
     * @return 节点id
     */
    String getId();

    /**
     * 获取节点父id
     *
     * @return 父节点ID
     */
    String getParentId();

    /**
     * 设置父节点ID
     *
     * @parentId 父节点ID
     */
    void setParentId(String parentId);

    /**
     * 获取子节点数据
     *
     * @return 子节点
     */
    List getChildren();

    /**
     * 设置children
     *
     * @param children 子节点
     */
    void setChildren(List children);

    /**
     * 设置树层级
     *
     * @param level 树层级
     */
    void setLevel(int level);

    /**
     * 获取树层级
     *
     * @return 树层级
     */
    int getLevel();

    /**
     * 增加子节点，同时关联子节点的父节点为当前节点
     *
     * @param children 子节点列表
     * @return this
     */
    default Tree addChildren(Tree... children) {
        if (ArrayUtil.isNotEmpty(children)) {
            List<Tree> childrenList = this.getChildren();
            if (null == childrenList) {
                childrenList = new ArrayList<>();
                this.setChildren(childrenList);
            }
            for (Tree child : children) {
                if (null != child) {
                    child.setParentId(this.getId());
                    child.setLevel(this.getLevel() + 1);
                }
                childrenList.add(child);
            }
        }
        return this;
    }

}
