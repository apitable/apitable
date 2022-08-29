package com.vikadata.core.support.tree.v2;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.List;

import cn.hutool.core.bean.BeanUtil;
import cn.hutool.core.bean.copier.CopyOptions;
import cn.hutool.core.collection.CollUtil;
import cn.hutool.core.util.ReflectUtil;

/**
 * <p>
 * 树形结构工具类
 * </p>
 *
 * @author Pengap
 * @date 2021/8/9 15:14:03
 */
@SuppressWarnings("unchecked")
public class TreeUtil {

    /**
     * 使用默认的构建工厂，构建树
     *
     * @param totalNodes 树形数据
     * @return List
     */
    public static <T extends Tree> List<T> build(List<T> totalNodes) {
        return build(totalNodes, DefaultTreeBuildFactory.ROOT_PARENT_ID, new DefaultTreeBuildFactory<>());
    }

    /**
     * 使用默认的构建工厂，构建树
     *
     * @param totalNodes 树形数据
     * @param rootId     最顶层父id值 一般为 0 之类
     * @return List
     */
    public static <T extends Tree> List<T> build(List<T> totalNodes, String rootId) {
        return build(totalNodes, rootId, new DefaultTreeBuildFactory<>());
    }

    /**
     * 构建树
     *
     * @param totalNodes        树形数据
     * @param rootId            最顶层父id值 一般为 0 之类
     * @param abstractTreeBuild 构建工厂
     * @return List
     */
    public static <T extends Tree> List<T> build(List<T> totalNodes, String rootId, AbstractTreeBuildFactory<T> abstractTreeBuild) {
        return abstractTreeBuild.setRootNode(rootId).doTreeBuild(totalNodes);
    }

    /**
     * 根据节点ID查找
     *
     * @param treeList 树形数据
     * @param id       树形节点
     * @return T
     */
    public static <T extends Tree> T find(Collection<T> treeList, String id) {
        T t;
        for (T tree : treeList) {
            if (tree.getId().equals(id)) {
                return tree;
            }
            else {
                List<T> children = tree.getChildren();
                if (children != null && children.size() > 0) {
                    t = find(children, id);

                    if (t != null) {
                        return t;
                    }
                }
            }
        }
        return null;
    }

    /**
     * 将tree结构数据转成List结构，不破坏原集合
     */
    public static <T extends Tree> List<T> treeToList(T node) {
        return treeToList(node, 0, null);
    }

    /**
     * 将tree结构数据转成List结构，不破坏原集合
     */
    public static <T extends Tree> List<T> treeToList(T node, int deep, Integer maxDeep) {
        return treeToList(Collections.singletonList(node), deep, maxDeep);
    }

    /**
     * 将tree结构数据转成List结构，不破坏原集合
     */
    public static <T extends Tree> List<T> treeToList(List<T> nodes) {
        return treeToList(nodes, 0, null);
    }

    /**
     * 将tree结构数据转成List结构，不破坏原集合
     *
     * @param nodes   树形接口集合
     * @param deep    已递归深度
     * @param maxDeep 最大递归深度 可能为null即不限制
     * @return 树结构初始列表
     */
    public static <T extends Tree> List<T> treeToList(List<T> nodes, int deep, Integer maxDeep) {
        List<T> result = new ArrayList<>();

        // maxDeep 可能为空
        if (maxDeep != null && deep >= maxDeep) {
            return new ArrayList<>();
        }

        // 遍历递归子节点
        for (T node : nodes) {
            T tNode;
            BeanUtil.copyProperties(node, tNode = (T) ReflectUtil.newInstance(node.getClass()), CopyOptions.create().ignoreError());

            tNode.setChildren(null); // 清空子集
            result.add(tNode);

            if (CollUtil.isNotEmpty(node.getChildren())) {
                result.addAll(treeToList(node.getChildren(), deep + 1, maxDeep));
            }
        }
        return result;
    }

}
