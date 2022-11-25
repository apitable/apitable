package com.vikadata.core.support.tree;

import java.util.List;

/**
 * <p>
 * interface: the tree node's behavior
 * </p>
 */
public interface Tree {

    /**
     * get the node's id
     *
     * @return  node id
     */
    String getNodeId();

    /**
     * get the parent node's id
     *
     * @return  the parent node id
     */
    String getNodeParentId();

    /**
     * get the child nodes
     *
     * @return  the list of children nodes
     */
     List getChildrenNodes();

    /**
     * set children node
     *
     * @param childrenNodes the list of children nodes
     */
    void setChildrenNodes(List childrenNodes);
}
