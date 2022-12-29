package com.vikadata.api.workspace.service;

import java.util.Collection;
import java.util.List;
import java.util.Map;

import com.vikadata.api.workspace.vo.NodeInfo;
import com.vikadata.entity.NodeRelEntity;

public interface INodeRelService {

    /**
     * @param userId user id
     * @param mainNodeId mainNodeId
     * @param relNodeId  relNodeId
     * @param extra      extra
     */
    void create(Long userId, String mainNodeId, String relNodeId, String extra);

    /**
     * copy node association
     *
     * @param userId user id
     * @param sourceRelNodeId sourceRelNodeId
     * @param destRelNodeId   destRelNodeId
     */
    void copy(Long userId, String sourceRelNodeId, String destRelNodeId);

    /**
     * batch replication node association relationship
     *
     * @param userId user id
     * @param relNodeIds list of original associated node id
     * @param newNodeMap original node id - new created node id map
     */
    void copyBatch(Long userId, Collection<String> relNodeIds, Map<String, String> newNodeMap);

    /**
     * Obtain the associated node and the corresponding master node.
     *
     * @param relNodeIds relNodeIds
     * @return MAP
     */
    Map<String, String> getRelNodeToMainNodeMap(Collection<String> relNodeIds);

    /**
     * query the information of the associated node
     *
     * @param nodeId node id
     * @param viewId viewId（not necessary）
     * @param memberId member id
     * @param nodeType nodeType（not necessary）
     * @return BaseNodeInfo List
     */
    List<NodeInfo> getRelationNodeInfoByNodeId(String nodeId, String viewId, Long memberId, Integer nodeType);

    /**
     * @param relNodeId v
     * @return NodeRelEntity
     */
    NodeRelEntity getByRelNodeId(String relNodeId);
}
