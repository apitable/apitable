package com.vikadata.core.support.tree.v2;

import java.util.List;

/**
 * <p>
 * 树构建的抽象类，定义构建tree的基本步骤
 * </p>
 *
 * @author Pengap
 * @date 2021/8/9 15:18:21
 */
public abstract class AbstractTreeBuildFactory<T> {

    /**
     * 树节点构建整体过程
     *
     * @param nodes 节点集合
     * @return List
     */
    public List<T> doTreeBuild(List<T> nodes) {
        // 构建之前的节点处理工作
        List<T> readyToBuild = beforeBuild(nodes);

        // 具体构建的过程
        List<T> buildProcess = executeBuilding(readyToBuild);

        // 构建之后的处理工作
        return afterBuild(buildProcess);
    }

    public AbstractTreeBuildFactory<T> setRootNode(String rootNode) {
        this.setRoot(rootNode);
        return this;
    }

    protected abstract void setRoot(String rootNode);

    /**
     * 构建之前的处理工作
     *
     * @param nodes 节点集合
     * @return List
     */
    protected abstract List<T> beforeBuild(List<T> nodes);

    /**
     * 构建过程
     *
     * @param nodes 节点集合
     * @return List
     */
    protected abstract List<T> executeBuilding(List<T> nodes);

    /**
     * 构建之后的处理工作
     *
     * @param nodes 节点集合
     * @return List
     */
    protected abstract List<T> afterBuild(List<T> nodes);

}
