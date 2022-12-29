package com.vikadata.core.support.tree.v2;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

import cn.hutool.core.util.ArrayUtil;

/**
 * <p>
 * V2 interface: the tree node's behavior
 * </p>
 */
@SuppressWarnings("unchecked")
public interface Tree extends Serializable {

    /**
     * get the node's id
     *
     * @return node id
     */
    String getId();

    /**
     * get the parent node's id
     *
     * @return the parent node id
     */
    String getParentId();

    /**
     * set the parent node's id
     *
     * @param parentId  the parent node id
     */
    void setParentId(String parentId);

    /**
     * get the child nodes
     *
     * @return the list of children nodes
     */
    List getChildren();

    /**
     * set the child nodes
     *
     * @param children the list of children nodes
     */
    void setChildren(List children);

    /**
     * set the tree level
     *
     * @param level the tree level
     */
    void setLevel(int level);

    /**
     * get the tree level
     *
     * @return the tree level
     */
    int getLevel();

    /**
     * add child node，and set the child node's parent node is this node
     *
     * @param children the list of children nodes
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
