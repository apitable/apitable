package com.vikadata.api.modular.workspace.service;

import java.util.Collection;
import java.util.List;
import java.util.Map;

import com.vikadata.api.model.vo.node.NodeInfo;
import com.vikadata.entity.NodeRelEntity;

/**
 * <p>
 * 节点关联 服务接口
 * </p>
 *
 * @author Chambers
 * @date 2020/11/11
 */
public interface INodeRelService {

    /**
     * 创建节点关联
     *
     * @param userId     用户ID
     * @param mainNodeId 主节点ID
     * @param relNodeId  关联节点ID
     * @param extra      其他信息
     * @author Chambers
     * @date 2020/11/11
     */
    void create(Long userId, String mainNodeId, String relNodeId, String extra);

    /**
     * 复制节点关联关系
     *
     * @param userId          用户ID
     * @param sourceRelNodeId 原关联节点ID
     * @param destRelNodeId   目标关联节点ID
     * @author Chambers
     * @date 2020/11/11
     */
    void copy(Long userId, String sourceRelNodeId, String destRelNodeId);

    /**
     * 批量复制节点关联关系
     *
     * @param userId     用户ID
     * @param relNodeIds 原关联节点ID 列表
     * @param newNodeMap 原节点ID-新创建节点ID MAP
     * @author Chambers
     * @date 2020/11/17
     */
    void copyBatch(Long userId, Collection<String> relNodeIds, Map<String, String> newNodeMap);

    /**
     * 获取关联节点及对应的主节点
     *
     * @param relNodeIds 关联节点ID 列表
     * @return MAP
     * @author Chambers
     * @date 2020/11/17
     */
    Map<String, String> getRelNodeToMainNodeMap(Collection<String> relNodeIds);

    /**
     * 查询关联节点的信息
     *
     * @param nodeId 节点
     * @param viewId 视图（非必须）
     * @param memberId 成员ID（非必须）
     * @param nodeType 指定节点类型（非必须）
     * @return BaseNodeInfo List
     * @author Shawn Deng
     * @date 2021/1/6 17:06
     */
    List<NodeInfo> getRelationNodeInfoByNodeId(String nodeId, String viewId, Long memberId, Integer nodeType);

    /**
     * 查询节点关联关系
     *
     * @param relNodeId 关联节点ID
     * @return entity
     * @author Chambers
     * @date 2022/1/14
     */
    NodeRelEntity getByRelNodeId(String relNodeId);
}
