package com.vikadata.core.support.tree.v2;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import cn.hutool.core.collection.CollUtil;
import cn.hutool.core.util.ObjectUtil;
import cn.hutool.core.util.StrUtil;

/**
 * <p>
 * V2 默认递归工具类，用于遍历有父子关系的节点，例如菜单树，字典树等等
 * </p>
 *
 * @author Pengap
 * @date 2021/8/9 15:18:21
 */
public class DefaultTreeBuildFactory<T extends Tree> extends AbstractTreeBuildFactory<T> {
    /**
     * 顶级节点的父节点id
     */
    public static final String ROOT_PARENT_ID = "0";

    private String rootNode = ROOT_PARENT_ID;

    @Override
    protected void setRoot(String rootNode) {
        if (StrUtil.isNotEmpty(rootNode)) {
            this.rootNode = rootNode;
        }
    }

    @Override
    protected List<T> beforeBuild(List<T> nodes) {
        // 默认不进行前置处理,直接返回
        // 为了重复构建树不破坏原有数据结构
        return ObjectUtil.cloneByStream(nodes);
    }

    @Override
    protected List<T> executeBuilding(List<T> nodes) {
        return this.build(nodes, this.rootNode);
    }

    @Override
    protected List<T> afterBuild(List<T> nodes) {
        // 默认不进行前置处理,直接返回
        return nodes;
    }

    /**
     * 树构建
     *
     * @param totalNodes 源数据集合
     * @param rootId     最顶层父id值 一般为 0 之类
     */
    private List<T> build(List<T> totalNodes, String rootId) {
        if (null == totalNodes || null == rootId) {
            return null;
        }

        final Map<String, T> eTreeMap = new LinkedHashMap<>(totalNodes.size(), 1);

        for (T totalNode : totalNodes) {
            eTreeMap.put(totalNode.getId(), totalNode);
        }

        List<T> rootTreeList = CollUtil.newArrayList();
        String parentId;
        for (T node : eTreeMap.values()) {
            // 没有子节点时，构建一个空对象
            if (CollUtil.isEmpty(node.getChildren())) {
                node.setChildren(new ArrayList<>());
            }
            parentId = node.getParentId();
            if (ObjectUtil.equals(rootId, parentId)) {
                rootTreeList.add(node);
                continue;
            }

            final T parentNode = eTreeMap.get(parentId);
            if (null != parentNode) {
                parentNode.addChildren(node);
            }
        }
        return rootTreeList;
    }

}
