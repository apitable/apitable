package com.vikadata.api.modular.workspace.mapper;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Param;

import com.vikadata.api.model.dto.node.NodeBaseInfoDTO;
import com.vikadata.api.model.dto.node.UrlNodeInfoDTO;
import com.vikadata.api.model.vo.node.BaseNodeInfo;
import com.vikadata.api.model.vo.node.NodeInfo;
import com.vikadata.api.model.vo.node.NodeInfoTreeVo;
import com.vikadata.api.model.vo.node.NodeInfoVo;
import com.vikadata.api.model.vo.node.NodePathVo;
import com.vikadata.api.model.vo.node.NodeShareTree;
import com.vikadata.api.model.vo.node.RubbishNodeVo;
import com.vikadata.api.model.vo.node.SimpleSortableNodeInfo;
import com.vikadata.api.modular.workspace.model.SimpleNodeInfo;
import com.vikadata.define.enums.NodeType;
import com.vikadata.entity.NodeEntity;

public interface NodeMapper extends BaseMapper<NodeEntity> {

    /**
     * @param entities nodes
     * @return affected rows
     */
    int insertBatch(@Param("entities") List<NodeEntity> entities);

    /**
     * get the space id by the node id
     *
     * @param nodeId node id
     * @return space id
     */
    String selectSpaceIdByNodeIdIncludeDeleted(@Param("nodeId") String nodeId);

    /**
     * gets the node id of the specified node type
     *
     * @param spaceId space id
     * @param nodeType node type
     * @return node id
     */
    List<String> selectNodeIdBySpaceIdAndType(@Param("spaceId") String spaceId, @Param("nodeType") Integer nodeType);

    /**
     * @param nodeIds node ids
     * @return node id which not in rubbish
     */
    List<String> selectNodeIdByNodeIdIn(@Param("nodeIds") List<String> nodeIds);

    /**
     * @param nodeId node id
     * @return node name
     */
    String selectNodeNameByNodeId(@Param("nodeId") String nodeId);

    /**
     * @param nodeId node id
     * @return node name
     */
    String selectNodeNameByNodeIdIncludeDeleted(@Param("nodeId") String nodeId);

    /**
     * @param spaceId space id
     * @return node id
     */
    String selectRootNodeIdBySpaceId(@Param("spaceId") String spaceId);

    /**
     * Fuzzy search node, return node ID
     * the root node cannot be searched
     *
     * @param spaceId space id
     * @param likeName keyword
     * @return node ids
     */
    List<String> selectLikeNodeName(@Param("spaceId") String spaceId, @Param("likeName") String likeName);

    /**
     * Fuzzy search node
     * does not contain root node and template node
     *
     * @param spaceId space id
     * @param likeName keyword
     * @return nodeIds
     */
    List<String> selectNodeIdBySpaceIdAndNodeNameLikeIncludeDeleted(@Param("spaceId") String spaceId, @Param("likeName") String likeName);

    /**
     * @param nodeIds node ids
     * @param memberId member id
     * @return NodeInfoVos
     */
    List<NodeInfoVo> selectNodeInfoByNodeIds(@Param("nodeIds") Collection<String> nodeIds, @Param("memberId") Long memberId);

    /**
     * query order node tree
     *
     * @param nodeIds node ids
     * @param memberId member id
     * @return NodeInfoTreeVo
     */
    List<NodeInfoTreeVo> selectNodeInfoTreeByNodeIds(@Param("nodeIds") Collection<String> nodeIds, @Param("memberId") Long memberId);

    /**
     * node basic information
     * no logical deletion judgment
     *
     * @param nodeId node id
     * @return BaseNodeInfo
     */
    BaseNodeInfo selectBaseNodeInfoByNodeId(@Param("nodeId") String nodeId);

    /**
     * @param nodeIds node ids
     * @return BaseNodeInfos
     */
    List<BaseNodeInfo> selectBaseNodeInfoByNodeIds(@Param("nodeIds") Collection<String> nodeIds);

    /**
     * @param nodeIds node ids
     * @return NodeInfos
     */
    List<NodeInfo> selectInfoByNodeIds(@Param("nodeIds") Collection<String> nodeIds);

    /**
     * @param nodeId node id
     * @return NodeInfoVo
     */
    NodeInfoVo selectNodeInfoByNodeId(@Param("nodeId") String nodeId);

    /**
     * the child node of the query node, their order.
     *
     * @param spaceId space id
     * @param nodeId node id
     * @param depth recursive depth starting with 1
     * @return NodeInfoTreeVo
     */
    List<String> selectSubNodesByOrder(@Param("spaceId") String spaceId, @Param("nodeId") String nodeId, @Param("depth") int depth);

    /**
     * locate nodes and construct an ordered set of nodes
     *
     * @param spaceId space id
     * @param nodeId node id
     * @return NodeInfoTreeVo
     */
    @Deprecated
    List<String> selectParentNodesByOrder(@Param("spaceId") String spaceId, @Param("nodeId") String nodeId);

    /**
     * Query the ID of the direct child node
     *
     * @param parentId parent node id
     * @return children node
     */
    List<String> selectSubNodeIds(@Param("parentId") String parentId);

    /**
     * Query the ID of the direct child node
     *
     * @param parentId parent node id
     * @return children node
     */
    List<SimpleSortableNodeInfo> selectSubNodeInfo(@Param("parentId") String parentId);

    /**
     * Query the ID of the direct child node
     * Ordered nodes, performance consumption
     *
     * @param nodeId node id
     * @return children node
     */
    List<String> selectOrderSubNodeIds(@Param("nodeId") String nodeId, @Param("nodeType") NodeType nodeType);

    /**
     * get the node sharing tree
     *
     * @param spaceId space id
     * @param nodeId node id
     * @return NodeShareTree
     */
    List<NodeShareTree> selectShareTreeByNodeId(@Param("spaceId") String spaceId, @Param("nodeId") String nodeId);

    /**
     * share tree view according to node ids query
     *
     * @param nodeIds node ids
     * @return NodeShareTree
     */
    List<NodeShareTree> selectShareTree(@Param("nodeIds") Collection<String> nodeIds);

    /**
     * query whether there are child nodes
     *
     * @param nodeId node id
     * @return TRUE | FALSE
     */
    boolean selectHasChildren(@Param("nodeId") String nodeId);

    /**
     * find all child nodes
     * Unordered, improve query performance
     *
     * @param nodeId node id
     * @return children node
     */
    List<String> selectAllSubNodeIds(@Param("nodeId") String nodeId);

    /**
     * find all child nodes by type
     * Unordered, improve query performance
     *
     * @param nodeId node id
     * @param nodeType node type
     * @return children node
     */
    List<String> selectAllSubNodeIdsByNodeType(@Param("nodeId") String nodeId, @Param("nodeType") Integer nodeType);

    /**
     * Gets the list of node names of the same type under the parent node.
     *
     * @param parentId parent node id
     * @param nodeType node type
     * @param nodeId retired nodes (itself when modified)
     * @return node names
     */
    List<String> selectNameList(@Param("parentId") String parentId, @Param("nodeType") Integer nodeType, @Param("nodeId") String nodeId);

    /**
     * Obtain the node ID list of the node and its child descendants.
     *
     * @param nodeIds node ids
     * @param isRubbish whether in rubbish
     * @return node ids
     */
    List<String> selectBatchAllSubNodeIds(@Param("nodeIds") List<String> nodeIds, @Param("isRubbish") Boolean isRubbish);

    /**
     * Query the number of non-root nodes and non-logically deleted nodes
     *
     * @param nodeIds node ids
     * @return node amount
     */
    Long countByNodeIds(@Param("nodeIds") List<String> nodeIds);

    /**
     * @param nodeId node id
     * @return space id
     */
    String selectSpaceIdByNodeId(@Param("nodeId") String nodeId);

    /**
     * @param nodeIds node ids
     * @return SpaceIds
     */
    List<String> selectSpaceIdsByNodeIds(@Param("nodeIds") List<String> nodeIds);

    /**
     * @param nodeId node id
     * @return node
     */
    NodeEntity selectByNodeIdIncludeDeleted(@Param("nodeId") String nodeId);

    /**
     * @param nodeIds node ids
     * @return nodes
     */
    List<NodeEntity> selectByNodeIdsIncludeDeleted(@Param("nodeIds") Collection<String> nodeIds);

    /**
     * @param nodeId node id
     * @return node
     */
    NodeEntity selectByNodeId(@Param("nodeId") String nodeId);

    /**
     * @param nodeIds node ids
     * @return nodes
     */
    List<NodeEntity> selectByNodeIds(@Param("nodeIds") Collection<String> nodeIds);

    /**
     * query the node path from bottom to top, include itself
     *
     * @param nodeId node id
     * @return node path list
     */
    List<String> selectParentNodePath(@Param("nodeId") String nodeId);

    /**
     * all parent node paths of the query node
     * contains own nodes
     * node must be a folder
     *
     * @param spaceId space id
     * @param nodeId node id
     * @return node path list
     */
    List<NodePathVo> selectParentNodeListByNodeId(@Param("spaceId") String spaceId, @Param("nodeId") String nodeId);

    /**
     * all parent node paths of the query node
     * Contains its own node, but does not include the root node
     *
     * @param spaceId space id
     * @param nodeIds node ids
     * @return BaseNodeInfoDto
     */
    List<NodeBaseInfoDTO> selectParentNodeByNodeIds(@Param("spaceId") String spaceId, @Param("list") List<String> nodeIds);

    /**
     *
     * @param nodeId node id
     * @param parentId parent node id
     * @param preNodeId pre node id
     * @param name node name
     * @return affected rows
     */
    int updateInfoByNodeId(@Param("nodeId") String nodeId, @Param("parentId") String parentId, @Param("preNodeId") String preNodeId, @Param("name") String name);

    /**
     * （working directory delete node/rubbish recovery node）
     *
     * @param userId user id
     * @param nodeIds node ids
     * @param isRubbish flag of node whether rubbish (yes for deletion, no for recovery)
     * @return affected rows
     */
    int updateIsRubbishByNodeIdIn(@Param("userId") Long userId, @Param("list") List<String> nodeIds, @Param("isRubbish") Boolean isRubbish);

    /**
     * logical delete node（delete rubbish node）
     *
     * @param userId user id
     * @param nodeId node id
     * @return affected rows
     */
    int updateIsDeletedByNodeId(@Param("userId") Long userId, @Param("nodeId") String nodeId);

    /**
     * change delete path
     *
     * @param nodeId node id
     * @param delPath delete path
     * @return affected rows
     */
    int updateDeletedPathByNodeId(@Param("nodeId") String nodeId, @Param("delPath") String delPath);

    /**
     * According to the old front node ID, modify the new front node ID (self-associated real-time)
     *
     * @param preNodeId new pre node id
     * @param parentId parent node id
     * @return affected rows
     */
    int updatePreNodeIdByJoinSelf(@Param("preNodeId") String preNodeId, @Param("parentId") String parentId);

    /**
     *Modify the new front node ID based on the old front node ID.
     *
     * @param newPreNodeId new pre node id
     * @param originPreNodeId origin pre node id
     * @param parentId parent node id
     * @return affected rows
     */
    int updatePreNodeIdBySelf(@Param("newPreNodeId") String newPreNodeId, @Param("originPreNodeId") String originPreNodeId, @Param("parentId") String parentId);

    /**
     * @param nodeId node id
     * @return parent node id
     */
    String selectParentIdByNodeId(@Param("nodeId") String nodeId);

    /**
     * @param nodeId node id
     * @param nodeName node name
     * @return affected rows
     */
    int updateNameByNodeId(@Param("nodeId") String nodeId, @Param("nodeName") String nodeName);

    /**
     * @param nodeId node id
     * @param icon icon
     * @return affected rows
     */
    int updateIconByNodeId(@Param("nodeId") String nodeId, @Param("icon") String icon);

    /**
     * @param nodeId node id
     * @param cover cover token
     * @return affected rows
     */
    int updateCoverByNodeId(@Param("nodeId") String nodeId, @Param("cover") String cover);

    /**
     * @param nodeId node id
     * @return node type
     */
    Integer selectNodeTypeByNodeId(@Param("nodeId") String nodeId);

    /**
     *
     * @param preNodeIdList pre node ids(no null)
     * @return node ids
     */
    List<String> selectNodeIdByPreNodeIdIn(@Param("list") List<String> preNodeIdList);

    /**
     * @param nodeIds node ids
     * @return NodeTrees
     */
    List<SimpleNodeInfo> selectAllParentNodeIdsByNodeIds(@Param("nodeIds") List<String> nodeIds, @Param("includeRoot") boolean includeRoot);

    /**
     * @param nodeId node id
     * @param status Whether to ban(0: No, 1: Yes)
     * @return affected rows
     */
    int updateNodeBanStatus(@Param("nodeId") String nodeId, @Param("status") Integer status);

    /**
     * @param nodeIds node ids
     * @return Boolean
     */
    List<Boolean> selectIsTemplateByNodeId(@Param("nodeIds") List<String> nodeIds);

    /**
     * select icon, name
     *
     * @param nodeIds node ids
     * @return BaseNodeInfoDto
     */
    List<NodeBaseInfoDTO> selectBaseNodeInfoByNodeIdsIncludeDelete(@Param("nodeIds") List<String> nodeIds);

    /**
     * Query the modification time of the recovery compartment node.
     *
     * @param nodeId node id
     * @return UpdatedAt
     */
    LocalDateTime selectRubbishUpdatedAtByNodeId(@Param("nodeId") String nodeId);

    /**
     * query the recovery compartment node id（modify time reverse order）
     *
     * @param spaceId space id
     * @param size load quantity
     * @param beginTime begin time（does not contain）
     * @param endTime endtime（Not required, not included）
     * @return NodeIds
     */
    List<String> selectRubbishNodeIds(@Param("spaceId") String spaceId, @Param("size") int size,
            @Param("beginTime") LocalDateTime beginTime, @Param("endTime") LocalDateTime endTime);

    /**
     *
     * @param spaceId space id
     * @param nodeIds node ids
     * @param retainDay days retained
     * @return node info in rubbish
     */
    List<RubbishNodeVo> selectRubbishNodeInfo(@Param("spaceId") String spaceId, @Param("nodeIds") List<String> nodeIds, @Param("retainDay") Long retainDay);

    /**
     * @param nodeId node id
     * @return BaseNodeInfoDTO
     */
    NodeBaseInfoDTO selectNodeBaseInfoByNodeId(@Param("nodeId") String nodeId);

    /**
     * @param nodeId node id
     * @param showRecordHistory Whether the node displays the modification history of the record
     * @return affected rows
     */
    int updateExtraShowRecordHistoryByNodeId(@Param("nodeId") String nodeId, @Param("showRecordHistory") int showRecordHistory);

    /**
     * @param nodeId node id
     * @param extra node's extra
     * @return affected rows
     */
    int updateExtraByNodeId(@Param("nodeId") String nodeId, @Param("extra") String extra);

    /**
     * modify node --The DingTalk status of the template transfer
     *
     * @param nodeId node id
     * @param dingTalkDaStatus dingTalkDaStatus
     * @return affected rows
     */
    int updateDingTalkDaStatusByNodeId(@Param("nodeId") String nodeId, @Param("dingTalkDaStatus") int dingTalkDaStatus);

    /**
     * @param nodeId node id
     * @return dingTalkDaStatus
     */
    Integer selectDingTalkDaStatusByNodeId(@Param("nodeId") String nodeId);

    /**
     *
     * @param nodeId node id
     * @return node's extra info
     */
    String selectExtraByNodeId(@Param("nodeId") String nodeId);

    /**
     * @param nodeIds node ids
     * @return dstIds which no in rubbish
     */
    List<String> selectNodeIdByNodeIds(@Param("nodeIds") List<String> nodeIds);

    /**
     * get space_id node_name node_id
     *
     * @param nodeId node id
     * @return URLNodeInfoVo
     */
    UrlNodeInfoDTO selectSpaceIdAndNodeNameByNodeId(@Param("nodeId") String nodeId);

    /**
     * get space_id node_name node_id
     *
     * @param nodeIds node ids
     * @return URLNodeInfoVo
     */
    List<UrlNodeInfoDTO> selectSpaceIdAndNodeNameByNodeIds(@Param("nodeIds") List<String> nodeIds);

    /**
     * select node creator by nodeId
     * @param nodeId node id
     * @return creator
     */
    Long selectCreatedByByNodeId(@Param("nodeId") String nodeId);
}
