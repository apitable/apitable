package com.vikadata.core.support.tree;

import java.util.List;

/**
 * <p>
 * 构造树节点的接口规范
 * </p>
 *
 * @author Shawn Deng
 * @date 2018/10/25 20:24
 */
public interface Tree {

    /**
     * 获取节点id
     *
     * @return 节点id
     * @author Shawn Deng
     * @date 2018/10/25 20:25
     */
    String getNodeId();

    /**
     * 获取节点父id
     *
     * @return 父节点ID
     * @author Shawn Deng
     * @date 2018/10/25 20:25
     */
    String getNodeParentId();

    /**
     * 获取子节点数据
     *
     * @return 子节点
     */
     List getChildrenNodes();

    /**
     * 设置children
     *
     * @param childrenNodes 子节点
     * @author Shawn Deng
     * @date 2018/10/25 20:26
     */
    void setChildrenNodes(List childrenNodes);
}
