package com.vikadata.core.support.tree.v2;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;

import cn.hutool.core.collection.CollUtil;
import cn.hutool.core.util.ObjectUtil;

import static com.vikadata.core.support.tree.v2.DefaultTreeBuildFactory.ROOT_PARENT_ID;

/**
 * <p>
 * V2 无依赖尝试构建树节点，注意：使用使请在外部排序List，是传入进来的List是有序的
 * </p>
 *
 * @author Pengap
 * @date 2021/8/9 15:18:21
 */
public class NotRelyTryTreeBuildFactory<T extends Tree> extends AbstractTreeBuildFactory<T> {

    @Override
    protected void setRoot(String rootNode) {
    }

    @Override
    protected List<T> beforeBuild(List<T> nodes) {
        // 默认不进行前置处理,直接返回
        // 为了重复构建树不破坏原有数据结构
        return ObjectUtil.cloneByStream(nodes);
    }

    @Override
    protected List<T> executeBuilding(List<T> nodes) {
        return this.build(nodes);
    }

    @Override
    protected List<T> afterBuild(List<T> nodes) {
        // 默认不进行后置处理,直接返回
        return nodes;
    }

    /**
     * 树构建
     *
     * @param totalNodes 源数据集合
     */
    private List<T> build(List<T> totalNodes) {
        if (null == totalNodes || totalNodes.isEmpty()) {
            return new ArrayList<>();
        }

        final Map<String, T> eTreeMap = new LinkedHashMap<>(totalNodes.size(), 1);

        for (T totalNode : totalNodes) {
            eTreeMap.put(totalNode.getId(), totalNode);
        }

        // 默认使用第一个元素父Id当做第一个匹配
        Entry<String, T> next = eTreeMap.entrySet().iterator().next();
        String basisParentId = null == next ? ROOT_PARENT_ID : next.getValue().getParentId();

        List<T> rootTreeList = CollUtil.newArrayList();
        String parentId;
        for (Entry<String, T> entry : eTreeMap.entrySet()) {
            T node = entry.getValue();
            // 没有子节点时，构建一个空对象
            if (CollUtil.isEmpty(node.getChildren())) {
                node.setChildren(new ArrayList<>());
            }

            parentId = node.getParentId();
            if (ObjectUtil.equals(basisParentId, parentId)) {
                rootTreeList.add(node);
                continue;
            }

            final T parentNode = eTreeMap.get(parentId);
            if (null != parentNode) {
                parentNode.addChildren(node);
            }
            else {
                // 如果没有匹配节点，替换条件进行下一轮匹配
                basisParentId = parentId;
                rootTreeList.add(node);
            }
        }

        return rootTreeList;
    }

}
