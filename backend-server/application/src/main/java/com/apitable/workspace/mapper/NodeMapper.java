/*
 * APITable <https://github.com/apitable/apitable>
 * Copyright (C) 2022 APITable Ltd. <https://apitable.com>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

package com.apitable.workspace.mapper;

import com.apitable.workspace.dto.NodeBaseInfoDTO;
import com.apitable.workspace.dto.NodeStatisticsDTO;
import com.apitable.workspace.dto.NodeTreeDTO;
import com.apitable.workspace.dto.SimpleNodeInfo;
import com.apitable.workspace.dto.UrlNodeInfoDTO;
import com.apitable.workspace.entity.NodeEntity;
import com.apitable.workspace.vo.BaseNodeInfo;
import com.apitable.workspace.vo.NodeInfo;
import com.apitable.workspace.vo.NodeInfoTreeVo;
import com.apitable.workspace.vo.NodeInfoVo;
import com.apitable.workspace.vo.NodeShareTree;
import com.apitable.workspace.vo.RubbishNodeVo;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;
import org.apache.ibatis.annotations.Param;

/**
 * node mapper.
 */
public interface NodeMapper extends BaseMapper<NodeEntity> {

    /**
     * insert batch.
     *
     * @param entities nodes
     * @return affected rows
     */
    int insertBatch(@Param("entities") List<NodeEntity> entities);

    /**
     * get the space id by the node id.
     *
     * @param nodeId node id
     * @return space id
     */
    String selectSpaceIdByNodeIdIncludeDeleted(@Param("nodeId") String nodeId);

    /**
     * gets the node id of the specified node type.
     *
     * @param spaceId  space id
     * @param nodeType node type
     * @return node id
     */
    List<String> selectNodeIdBySpaceIdAndType(@Param("spaceId") String spaceId,
                                              @Param("nodeType") Integer nodeType);

    /**
     * get the node by node type and node name keyword in space.
     *
     * @param spaceId  space id
     * @param nodeType node type
     * @param keyword  node name keyword
     * @return node ids
     */
    List<String> selectNodeIdsBySpaceIdAndTypeAndKeyword(@Param("spaceId") String spaceId,
                                                         @Param("nodeType") Integer nodeType,
                                                         @Param("keyword") String keyword);

    /**
     * query node id.
     *
     * @param nodeIds node ids
     * @return node id which not in rubbish
     */
    List<String> selectNodeIdByNodeIdIn(@Param("nodeIds") List<String> nodeIds);

    /**
     * query node name.
     *
     * @param nodeId node id
     * @return node name
     */
    String selectNodeNameByNodeId(@Param("nodeId") String nodeId);

    /**
     * query node name.
     *
     * @param nodeId node id
     * @return node name
     */
    String selectNodeNameByNodeIdIncludeDeleted(@Param("nodeId") String nodeId);

    /**
     * query root node id.
     *
     * @param spaceId space id
     * @return node id
     */
    String selectRootNodeIdBySpaceId(@Param("spaceId") String spaceId);

    /**
     * Query first node id.
     *
     * @param parentId parent id
     * @param preNodeId pre node id
     * @param unitId unit id
     * @return node id
     * @author Chambers
     */
    String selectNodeIdByParentIdAndPreNodeIdAndUnitId(@Param("parentId") String parentId,
                                                       @Param("preNodeId") String preNodeId,
                                                       @Param("unitId") Long unitId);

    /**
     * Fuzzy search node, return node ID the root node cannot be searched.
     *
     * @param spaceId  space id
     * @param unitIds unit id
     * @param likeName keyword
     * @return node ids
     */
    List<String> selectLikeNodeName(@Param("spaceId") String spaceId,
                                    @Param("unitIds") List<Long> unitIds,
                                    @Param("likeName") String likeName);

    /**
     * Fuzzy search node does not contain root node and template node.
     *
     * @param spaceId  space id
     * @param likeName keyword
     * @return nodeIds
     */
    List<String> selectNodeIdBySpaceIdAndNodeNameLikeIncludeDeleted(
        @Param("spaceId") String spaceId, @Param("likeName") String likeName);

    /**
     * query node info.
     *
     * @param nodeIds  node ids
     * @param memberId member id
     * @return NodeInfoVos
     */
    List<NodeInfoVo> selectNodeInfoByNodeIds(@Param("nodeIds") Collection<String> nodeIds,
                                             @Param("memberId") Long memberId);

    /**
     * query order node tree.
     *
     * @param nodeIds  node ids
     * @param memberId member id
     * @return NodeInfoTreeVo
     */
    List<NodeInfoTreeVo> selectNodeInfoTreeByNodeIds(@Param("nodeIds") Collection<String> nodeIds,
                                                     @Param("memberId") Long memberId);

    /**
     * node basic information no logical deletion judgment.
     *
     * @param nodeId node id
     * @return BaseNodeInfo
     */
    BaseNodeInfo selectBaseNodeInfoByNodeId(@Param("nodeId") String nodeId);

    /**
     * query base node info.
     *
     * @param nodeIds node ids
     * @return BaseNodeInfos
     */
    List<BaseNodeInfo> selectBaseNodeInfoByNodeIds(@Param("nodeIds") Collection<String> nodeIds);

    /**
     * query multi node info.
     *
     * @param nodeIds node ids
     * @return NodeInfos
     */
    List<NodeInfo> selectInfoByNodeIds(@Param("nodeIds") Collection<String> nodeIds);

    /**
     * query multi node info.
     *
     * @param nodeIds  node ids
     * @param memberId member id
     * @return NodeInfos
     */
    List<NodeInfo> selectNodeInfo(@Param("nodeIds") Collection<String> nodeIds,
                                  @Param("memberId") Long memberId);

    /**
     * query node.
     *
     * @param nodeId node id
     * @return NodeInfoVo
     */
    NodeInfoVo selectNodeInfoByNodeId(@Param("nodeId") String nodeId);

    /**
     * Query node tree dto.
     *
     * @param parentIds parent node ids
     * @param isRubbish rubbish status
     * @param unitIds unit ids
     * @return List of NodeTreeDTO
     */
    List<NodeTreeDTO> selectNodeTreeDTOByParentIdIn(
        @Param("parentIds") Collection<String> parentIds, @Param("isRubbish") Boolean isRubbish,
        @Param("unitIds") List<Long> unitIds);

    /**
     * Query the ID of the direct child node.
     *
     * @param parentId parent node id
     * @return children node
     */
    List<String> selectSubNodeIds(@Param("parentId") String parentId);

    /**
     * share tree view according to node ids query.
     *
     * @param nodeIds node ids
     * @return NodeShareTree
     */
    List<NodeShareTree> selectShareTree(@Param("nodeIds") Collection<String> nodeIds);

    /**
     * query whether there are child nodes.
     *
     * @param nodeId node id
     * @return TRUE | FALSE
     */
    boolean selectHasChildren(@Param("nodeId") String nodeId);

    /**
     * Gets the list of node names of the same type under the parent node.
     *
     * @param parentId parent node id
     * @param nodeType node type
     * @param nodeId   retired nodes (itself when modified)
     * @param unitId unit id
     * @return node names
     */
    List<String> selectNameList(@Param("parentId") String parentId,
                                @Param("nodeType") Integer nodeType,
                                @Param("nodeId") String nodeId,
                                @Param("unitId") Long unitId);

    /**
     * Query the number of non-root nodes and non-logically deleted nodes.
     *
     * @param nodeIds node ids
     * @return node amount
     */
    Long countByNodeIds(@Param("nodeIds") List<String> nodeIds);

    /**
     * query space id.
     *
     * @param nodeId node id
     * @return space id
     */
    String selectSpaceIdByNodeId(@Param("nodeId") String nodeId);


    /**
     * query space id.
     *
     * @param nodeId node id
     * @return space id
     */
    NodeEntity selectSpaceIdAndUnitIdByNodeId(@Param("nodeId") String nodeId);

    /**
     * query space id list.
     *
     * @param nodeIds node ids
     * @return SpaceIds
     */
    List<String> selectSpaceIdsByNodeIds(@Param("nodeIds") List<String> nodeIds);

    /**
     * query node id.
     *
     * @param nodeId node id
     * @return node
     */
    NodeEntity selectByNodeIdIncludeDeleted(@Param("nodeId") String nodeId);

    /**
     * query node list.
     *
     * @param nodeIds node ids
     * @return nodes
     */
    List<NodeEntity> selectByNodeIdsIncludeDeleted(@Param("nodeIds") Collection<String> nodeIds);

    /**
     * query node.
     *
     * @param nodeId node id
     * @return node
     */
    NodeEntity selectByNodeId(@Param("nodeId") String nodeId);

    /**
     * query node list.
     *
     * @param nodeIds node ids
     * @return nodes
     */
    List<NodeEntity> selectByNodeIds(@Param("nodeIds") Collection<String> nodeIds);

    /**
     * update node.
     *
     * @param nodeId    node id
     * @param parentId  parent node id
     * @param preNodeId pre node id
     * @param name      node name
     * @param  unitId   unit id
     * @return affected rows
     */
    int updateInfoByNodeId(@Param("nodeId") String nodeId, @Param("parentId") String parentId,
                           @Param("preNodeId") String preNodeId, @Param("name") String name,
                           @Param("unitId") Long unitId);

    /**
     * （working directory delete node/rubbish recovery node）.
     *
     * @param userId    user id
     * @param nodeIds   node ids
     * @param isRubbish flag of node whether rubbish (yes for deletion, no for recovery)
     * @return affected rows
     */
    int updateIsRubbishByNodeIdIn(@Param("userId") Long userId,
                                  @Param("nodeIds") Collection<String> nodeIds,
                                  @Param("isRubbish") Boolean isRubbish);

    /**
     * logical delete node（delete rubbish node）.
     *
     * @param userId user id
     * @param nodeId node id
     * @return affected rows
     */
    int updateIsDeletedByNodeId(@Param("userId") Long userId, @Param("nodeId") String nodeId);

    /**
     * change delete path.
     *
     * @param nodeId  node id
     * @param delPath delete path
     * @return affected rows
     */
    int updateDeletedPathByNodeId(@Param("userId") Long userId,
                                  @Param("nodeId") String nodeId, @Param("delPath") String delPath);

    /**
     * According to the old front node ID, modify the new front node ID (self-associated
     * real-time).
     *
     * @param preNodeId new pre node id
     * @param parentId  parent node id
     * @return affected rows
     */
    int updatePreNodeIdByJoinSelf(@Param("preNodeId") String preNodeId,
                                  @Param("parentId") String parentId);

    /**
     * Modify the new front node ID based on the old front node ID.
     *
     * @param newPreNodeId    new pre node id
     * @param originPreNodeId origin pre node id
     * @param parentId        parent node id
     * @return affected rows
     */
    int updatePreNodeIdBySelf(@Param("newPreNodeId") String newPreNodeId,
                              @Param("originPreNodeId") String originPreNodeId,
                              @Param("parentId") String parentId);

    /**
     * Update preNodeId by nodeId.
     *
     * @param updatedPreNodeId new pre node id
     * @param nodeId           node id
     * @return affected rows
     * @author Chambers
     */
    int updatePreNodeIdByNodeId(@Param("updatedPreNodeId") String updatedPreNodeId,
                                @Param("nodeId") String nodeId);


    /**
     * query node parent id.
     *
     * @param nodeId node id
     * @return parent node id
     */
    String selectParentIdByNodeId(@Param("nodeId") String nodeId);

    /**
     * update node name.
     *
     * @param nodeId   node id
     * @param nodeName node name
     * @return affected rows
     */
    int updateNameByNodeId(@Param("nodeId") String nodeId, @Param("nodeName") String nodeName);

    /**
     * update node icon.
     *
     * @param nodeId node id
     * @param icon   icon
     * @return affected rows
     */
    int updateIconByNodeId(@Param("nodeId") String nodeId, @Param("icon") String icon);

    /**
     * update node cover.
     *
     * @param nodeId node id
     * @param cover  cover token
     * @return affected rows
     */
    int updateCoverByNodeId(@Param("nodeId") String nodeId, @Param("cover") String cover);

    /**
     * query node type.
     *
     * @param nodeId node id
     * @return node type
     */
    Integer selectNodeTypeByNodeId(@Param("nodeId") String nodeId);

    /**
     * query node id.
     *
     * @param preNodeIdList pre node ids(no null)
     * @return node ids
     */
    List<String> selectNodeIdByPreNodeIdIn(@Param("list") List<String> preNodeIdList);

    /**
     * update node ban status.
     *
     * @param nodeId node id
     * @param status Whether to ban(0: No, 1: Yes)
     * @return affected rows
     */
    int updateNodeBanStatus(@Param("nodeId") String nodeId, @Param("status") Integer status);

    /**
     * query whether the node is a template.
     *
     * @param nodeIds node ids
     * @return Boolean
     */
    List<Boolean> selectIsTemplateByNodeId(@Param("nodeIds") List<String> nodeIds);

    /**
     * Query node information with permission.
     *
     * @param nodeId nodeId
     * @return SimpleNodeInfo
     * @author Chambers
     */
    SimpleNodeInfo selectNodeInfoWithPermissionStatus(@Param("nodeId") String nodeId);

    /**
     * query node base info.
     *
     * @param nodeId node id
     * @return BaseNodeInfoDTO
     */
    NodeBaseInfoDTO selectNodeBaseInfoByNodeId(@Param("nodeId") String nodeId);

    /**
     * Batch query node base info.
     *
     * @param nodeIds       node ids
     * @param ignoreRubbish ignore rubbish status(no require.default:false)
     * @return List of NodeBaseInfoDTO
     */
    List<NodeBaseInfoDTO> selectNodeBaseInfosByNodeIds(@Param("nodeIds") Collection<String> nodeIds,
                                                       @Param("ignoreRubbish")
                                                       Boolean ignoreRubbish);

    /**
     * Query all parent node id list.
     *
     * @param nodeIds     node ids
     * @param includeRoot whether include root node
     * @return List of NodeBaseInfoDTO
     */
    List<NodeBaseInfoDTO> selectAllParentNodeIds(@Param("nodeIds") List<String> nodeIds,
                                                 @Param("includeRoot") boolean includeRoot);

    /**
     * Query the modification time of the recovery compartment node.
     *
     * @param nodeId node id
     * @return UpdatedAt
     */
    LocalDateTime selectRubbishUpdatedAtByNodeId(@Param("nodeId") String nodeId);

    /**
     * query the recovery compartment node id（modify time reverse order）.
     *
     * @param spaceId   space id
     * @param size      load quantity
     * @param beginTime begin time（does not contain）
     * @param endTime   endtime（Not required, not included）
     * @return NodeIds
     */
    List<String> selectRubbishNodeIds(@Param("spaceId") String spaceId, @Param("size") int size,
                                      @Param("beginTime") LocalDateTime beginTime,
                                      @Param("endTime") LocalDateTime endTime);

    /**
     * query rubbish node info.
     *
     * @param spaceId space id
     * @param nodeIds node ids
     * @return node info in rubbish
     */
    List<RubbishNodeVo> selectRubbishNodeInfo(@Param("spaceId") String spaceId,
                                              @Param("nodeIds") List<String> nodeIds);

    /**
     * update node extra.
     *
     * @param nodeId            node id
     * @param showRecordHistory Whether the node displays the modification history of the record
     * @return affected rows
     */
    int updateExtraShowRecordHistoryByNodeId(@Param("nodeId") String nodeId,
                                             @Param("showRecordHistory") int showRecordHistory);


    /**
     * update node extra.
     *
     * @param nodeId node id
     * @param extra  embed page
     * @return affected rows
     */
    int updateExtraByNodeId(@Param("nodeId") String nodeId, @Param("extra") String extra);

    /**
     * update node extra.
     *
     * @param nodeId node id
     * @param extra  node's extra
     * @return affected rows
     */
    int insertExtraByNodeId(@Param("nodeId") String nodeId, @Param("extra") String extra);

    /**
     * modify node --The DingTalk status of the template transfer.
     *
     * @param nodeId           node id
     * @param dingTalkDaStatus dingTalkDaStatus
     * @return affected rows
     */
    int updateDingTalkDaStatusByNodeId(@Param("nodeId") String nodeId,
                                       @Param("dingTalkDaStatus") int dingTalkDaStatus);

    /**
     * query node extra info.
     *
     * @param nodeId node id
     * @return dingTalkDaStatus
     */
    Integer selectDingTalkDaStatusByNodeId(@Param("nodeId") String nodeId);

    /**
     * query node extra.
     *
     * @param nodeId node id
     * @return node's extra info
     */
    String selectExtraByNodeId(@Param("nodeId") String nodeId);

    /**
     * query node id.
     *
     * @param nodeIds node ids
     * @return dstIds which no in rubbish
     */
    List<String> selectNodeIdByNodeIds(@Param("nodeIds") List<String> nodeIds);

    /**
     * get space_id node_name node_id.
     *
     * @param nodeId node id
     * @return URLNodeInfoVo
     */
    UrlNodeInfoDTO selectSpaceIdAndNodeNameByNodeId(@Param("nodeId") String nodeId);

    /**
     * get space_id node_name node_id.
     *
     * @param nodeIds node ids
     * @return URLNodeInfoVo
     */
    List<UrlNodeInfoDTO> selectSpaceIdAndNodeNameByNodeIds(@Param("nodeIds") List<String> nodeIds);

    /**
     * select node creator by nodeId.
     *
     * @param nodeId node id
     * @return creator
     */
    Long selectCreatedByByNodeId(@Param("nodeId") String nodeId);

    /**
     * query count by parent node id and node name.
     *
     * @param parentId parent node id
     * @param nodeName node name
     * @return Integer
     */
    String selectNodeIdByParentIdAndNodeName(@Param("parentId") String parentId,
                                             @Param("nodeName") String nodeName);

    /**
     * query by parent node id.
     *
     * @param parentId parent node id
     * @return NodeEntity List
     */
    List<NodeEntity> selectByParentId(@Param("parentId") String parentId);

    /**
     * update is deleted.
     *
     * @param unitIds unit id list
     * @return affected rows
     */
    int updateIsDeletedByUnitIds(@Param("unitIds") List<Long> unitIds,
                                 @Param("isDeleted") boolean isDeleted);

    /**
     * query count by space id.
     *
     * @param spaceId space id
     * @param page    page
     * @return IPage NodeStatisticsDTO
     */
    IPage<NodeStatisticsDTO> selectCountBySpaceIdWithPage(@Param("spaceId") String spaceId,
                                                          Page<Void> page);

    /**
     * query count by unitRefIds.
     *
     * @param unitIds unit id list
     * @return List NodeStatisticsDTO
     */
    List<NodeStatisticsDTO> selectCountByUnitIds(@Param("unitIds") List<Long> unitIds);

    /**
     * query unitId.
     *
     * @param nodeId node id
     * @return unit id
     */
    Long selectUnitIdByNodeId(@Param("nodeId") String nodeId);

}
