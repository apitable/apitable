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

package com.apitable.workspace.service;

import com.alibaba.excel.ExcelReader;
import com.alibaba.excel.read.metadata.ReadSheet;
import com.apitable.control.infrastructure.role.ControlRole;
import com.apitable.workspace.dto.CreateNodeDto;
import com.apitable.workspace.dto.NodeCopyEffectDTO;
import com.apitable.workspace.dto.NodeCopyOptions;
import com.apitable.workspace.dto.NodeData;
import com.apitable.workspace.entity.DatasheetEntity;
import com.apitable.workspace.entity.DatasheetMetaEntity;
import com.apitable.workspace.entity.DatasheetRecordEntity;
import com.apitable.workspace.entity.NodeEntity;
import com.apitable.workspace.enums.NodeType;
import com.apitable.workspace.listener.ExcelSheetsDataListener;
import com.apitable.workspace.ro.CreateDatasheetRo;
import com.apitable.workspace.ro.ImportExcelOpRo;
import com.apitable.workspace.ro.NodeCopyOpRo;
import com.apitable.workspace.ro.NodeMoveOpRo;
import com.apitable.workspace.ro.NodeOpRo;
import com.apitable.workspace.ro.NodeRelRo;
import com.apitable.workspace.ro.NodeUpdateOpRo;
import com.apitable.workspace.vo.BaseNodeInfo;
import com.apitable.workspace.vo.NodeFromSpaceVo;
import com.apitable.workspace.vo.NodeInfo;
import com.apitable.workspace.vo.NodeInfoTreeVo;
import com.apitable.workspace.vo.NodeInfoVo;
import com.apitable.workspace.vo.NodeInfoWindowVo;
import com.apitable.workspace.vo.NodePathVo;
import com.apitable.workspace.vo.NodeSearchResult;
import com.apitable.workspace.vo.ShowcaseVo.NodeExtra;
import com.baomidou.mybatisplus.extension.service.IService;
import java.io.IOException;
import java.io.InputStream;
import java.util.Collection;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import javax.annotation.Nullable;

/**
 * node service.
 */
public interface INodeService extends IService<NodeEntity> {

    /**
     * get space's root node id.
     *
     * @param spaceId space id
     * @return root node id
     */
    String getRootNodeIdBySpaceId(String spaceId);

    /**
     * Gets the node ID of the specified space and the specified node type.
     *
     * @param spaceId space id
     * @param type    node type
     * @return node ids
     */
    List<String> getNodeIdBySpaceIdAndType(String spaceId, Integer type);

    /**
     * get info by node id.
     *
     * @param nodeId node id
     * @return NodeEntity
     */
    NodeEntity getByNodeId(String nodeId);

    /**
     * gets the id of the existing node.
     *
     * @param nodeIds nodeIds
     * @return ExistNodeIds
     */
    List<String> getExistNodeIdsBySelf(List<String> nodeIds);

    /**
     * get node type.
     *
     * @param nodeId node id
     * @return NodeType
     */
    NodeType getTypeByNodeId(String nodeId);

    /**
     * get node space id.
     *
     * @param nodeId node id
     * @return space ids
     */
    String getSpaceIdByNodeId(String nodeId);

    /**
     * Gets the space ID of all nodes (multiple spaces trigger exceptions).
     *
     * @param nodeIds node ids
     * @return space id
     */
    String getSpaceIdByNodeIds(List<String> nodeIds);

    /**
     * Gets the ID of the space where the node is deleted.
     *
     * @param nodeId node id
     * @return space id
     */
    String getSpaceIdByNodeIdIncludeDeleted(String nodeId);

    /**
     * gets whether the node belongs to a template.
     *
     * @param nodeIds node ids
     * @return is it a template flag
     */
    Boolean getIsTemplateByNodeIds(List<String> nodeIds);

    /**
     * get node parent id.
     *
     * @param nodeId node id
     * @return parent node id
     */
    String getParentIdByNodeId(String nodeId);

    /**
     * get node name.
     *
     * @param nodeId node id
     * @return node name
     */
    String getNodeNameByNodeId(String nodeId);

    /**
     * obtain the node id of the node path
     * Order: first-level node-> node itself.
     *
     * @param nodeId node id
     * @return node path
     */
    List<String> getPathParentNode(String nodeId);

    /**
     * get multi node info.
     *
     * @param nodeIds node ids
     * @return NodeInfos
     */
    List<NodeInfo> getNodeInfoByNodeIds(Collection<String> nodeIds);

    /**
     * get multi node info.
     *
     * @param spaceId  space id
     * @param memberId member id
     * @param nodeIds  node id list
     * @return NodeInfoVos
     */
    List<NodeInfoVo> getNodeInfoByNodeIds(String spaceId, Long memberId, List<String> nodeIds);

    /**
     * The query node includes the associated nodes of all the following nodes.
     *
     * @param nodeId node id
     * @return BaseNodeInfo
     */
    List<BaseNodeInfo> getForeignSheet(String nodeId);

    /**
     * whether node exist on the specific space.
     *
     * @param spaceId space id
     * @param nodeId  node id
     * @return spaceId
     */
    String checkNodeIfExist(String spaceId, String nodeId);

    /**
     * check the source table.
     *
     * @param spaceId  space id
     * @param memberId member id
     * @param type     node type
     * @param extra    node correlation parameters
     */
    void checkSourceDatasheet(String spaceId, Long memberId, Integer type, NodeRelRo extra);

    /**
     * get member id by user  id and node id.
     *
     * @param userId user id
     * @param nodeId node id
     * @return MemberId
     */
    Long getMemberIdByUserIdAndNodeId(Long userId, String nodeId);

    /**
     * query node.
     *
     * @param spaceId  space id
     * @param memberId member id
     * @param keyword  keyword
     * @return result
     */
    List<NodeSearchResult> searchNode(String spaceId, Long memberId, String keyword);

    /**
     * query node tree.
     *
     * @param spaceId  space id
     * @param memberId member id
     * @param nodeId   node id
     * @param depth    recursive depth, min 1
     * @return NodeInfoTreeVo
     */
    NodeInfoTreeVo getNodeTree(String spaceId, String nodeId, Long memberId, int depth);

    /**
     * query child node information.
     *
     * @param spaceId  space id
     * @param memberId member id
     * @param nodeId   node id
     * @param nodeType node type 1:folder,2:datasheet
     * @return NodeInfoVos
     */
    List<NodeInfoVo> getChildNodesByNodeId(String spaceId, Long memberId, String nodeId,
                                           NodeType nodeType);

    /**
     * gets the node parent path
     * contains root node.
     *
     * @param spaceId space id
     * @param nodeId  node id
     * @return parent path
     */
    List<NodePathVo> getParentPathByNodeId(String spaceId, String nodeId);

    /**
     * get node position.
     *
     * @param spaceId  space id
     * @param memberId member id
     * @param nodeId   node id
     * @return tree from node to root node
     */
    NodeInfoTreeVo position(String spaceId, Long memberId, String nodeId);

    /**
     * get node info .
     *
     * @param spaceId space id
     * @param nodeId  node id
     * @param role    node control unit role
     * @return NodeInfoVo
     */
    NodeInfoVo getNodeInfoByNodeId(String spaceId, String nodeId, ControlRole role);

    /**
     * get node tree info.
     *
     * @param spaceId  space id
     * @param memberId member id
     * @param nodeIds  node id list
     * @return NodeInfoVo
     */
    NodeInfoTreeVo getNodeInfoTreeByNodeIds(String spaceId, Long memberId, List<String> nodeIds);

    /**
     * create node.
     *
     * @param userId   user id
     * @param spaceId  space id
     * @param nodeOpRo request parameters
     * @return node id
     */
    String createNode(Long userId, String spaceId, NodeOpRo nodeOpRo);

    /**
     * Create forms and add pictures (if needed).
     *
     * @param spaceId           space id
     * @param createDatasheetRo request parameters
     * @return form id
     */
    String createDatasheetWithDesc(String spaceId, Long userId,
                                   CreateDatasheetRo createDatasheetRo);

    /**
     * create child node.
     *
     * @param userId user id
     * @param dto    parameters
     * @return node id
     */
    String createChildNode(Long userId, CreateNodeDto dto);

    /**
     * insert batch.
     *
     * @param nodeList nodeList
     * @param dstCount the datasheet amount
     */
    void insertBatch(List<NodeEntity> nodeList, Integer dstCount);

    /**
     * edit.
     *
     * @param userId user id
     * @param nodeId node custom id
     * @param opRo   request parameters
     */
    void edit(Long userId, String nodeId, NodeUpdateOpRo opRo);

    /**
     * move.
     *
     * @param userId user id
     * @param opRo   request parameters
     * @return nodes with data changes
     */
    List<String> move(Long userId, NodeMoveOpRo opRo);

    /**
     * delete node.
     *
     * @param spaceId  space id
     * @param memberId member id
     * @param ids      custom node ids
     */
    void deleteById(String spaceId, Long memberId, String... ids);

    /**
     * delete template node.
     * delete template mapping node
     *
     * @param userId  user id
     * @param nodeIds nodeIds
     */
    void delTemplateRefNode(Long userId, String... nodeIds);

    /**
     * copy.
     *
     * @param userId user id
     * @param opRo   request parameters
     * @return copy the new node id
     */
    NodeCopyEffectDTO copy(Long userId, NodeCopyOpRo opRo);

    /**
     * Copy node (including all child descendants) to the specified space.
     *
     * @param userId       user id
     * @param destSpaceId  target space id
     * @param destParentId target location parent node id（not necessary）
     * @param sourceNodeId original node id
     * @param options      copy attribute
     * @return new node id
     */
    String copyNodeToSpace(Long userId, String destSpaceId, String destParentId,
                           String sourceNodeId, NodeCopyOptions options);

    /**
     * import excel.
     *
     * @param userId  user id
     * @param spaceId space id
     * @param opRo    request parameters
     * @return data
     * @throws IOException io exception
     */
    @Deprecated
    String importExcel(Long userId, String spaceId, ImportExcelOpRo opRo) throws IOException;

    /**
     * import.
     *
     * @param excelReader        Excel read listener
     * @param sheetsDataListener Excel listener
     * @param readSheets         array of sheet objects
     * @return excel data
     */
    Map<String, List<List<Object>>> importMultipleSheetsByEasyExcel(ExcelReader excelReader,
                                                                    ExcelSheetsDataListener sheetsDataListener,
                                                                    List<ReadSheet> readSheets);

    /**
     * import.
     *
     * @param excelReader        Excel read listener
     * @param sheetsDataListener Excel listener
     * @param readSheet          datasheet
     * @return excel data
     */
    List<List<Object>> importSingleSheetByEasyExcel(ExcelReader excelReader,
                                                    ExcelSheetsDataListener sheetsDataListener,
                                                    ReadSheet readSheet);

    /**
     * update node ban status.
     *
     * @param nodeId node id
     * @param status is baned
     */
    void updateNodeBanStatus(String nodeId, Integer status);

    /**
     * duplicate name modification.
     *
     * @param parentId parentId
     * @param nodeType nodeType
     * @param nodeName original node name
     * @param nodeId   eliminate nodes（when modifying itself）
     * @return modified name
     */
    String duplicateNameModify(String parentId, int nodeType, String nodeName, String nodeId);

    /**
     * Determine whether the node and all child and descendant nodes contain member fields.
     *
     * @param nodeId node id
     * @return boolean
     */
    boolean judgeAllSubNodeContainMemberFld(String nodeId);

    /**
     * Verify the permissions of all child and descendant nodes.
     *
     * @param memberId member id
     * @param nodeId   node id
     * @param role     required node roles
     * @return AllSubNodeId
     */
    List<String> checkSubNodePermission(Long memberId, String nodeId, ControlRole role);

    /**
     * The next step after the table node is copied, complete the attributes and contents of the link field.
     *
     * @param effect impact field collection for node replication
     */
    void nodeCopyChangeset(NodeCopyEffectDTO effect);

    /**
     * The next step after the deletion of the table node converts the undeleted association into a text field.
     *
     * @param nodeIds deleted node id
     */
    void nodeDeleteChangeset(List<String> nodeIds);

    /**
     * parse excel.
     *
     * @param userId       user id
     * @param uuid         user external id
     * @param spaceId      space id
     * @param memberId     member id
     * @param parentNodeId parentNodeId
     * @param fileName     filename
     * @param fileSuffix   file name suffix
     * @param inputStream  file
     * @return node id
     */
    String parseExcel(Long userId, String uuid, String spaceId, Long memberId, String parentNodeId,
                      String fileName, String fileSuffix, InputStream inputStream);

    /**
     * parse csv.
     *
     * @param userId       user id
     * @param uuid         user external id
     * @param spaceId      space id
     * @param memberId     member id
     * @param parentNodeId parentNodeId
     * @param fileName     file name
     * @param inputStream  file
     * @return node id
     */
    String parseCsv(Long userId, String uuid, String spaceId, Long memberId, String parentNodeId,
                    String fileName, InputStream inputStream);

    /**
     * special batch save operation
     * The data is assembled by Excel, and all one-time transactions are submitted to the database.
     *
     * @param data              data
     * @param nodeEntities      nodes
     * @param metaEntities      metadata
     * @param datasheetEntities datasheet
     * @param recordEntities    records
     */
    void batchCreateDataSheet(NodeData data, List<NodeEntity> nodeEntities,
                              List<DatasheetEntity> datasheetEntities,
                              List<DatasheetMetaEntity> metaEntities,
                              List<DatasheetRecordEntity> recordEntities);

    /**
     * save records.
     *
     * @param recordEntities record
     */
    void batchSaveDstRecords(List<DatasheetRecordEntity> recordEntities);

    /**
     * get node extra.
     *
     * @param nodeId  node id
     * @param spaceId space id
     * @param extras  node additional information
     * @return ShowcaseVo.NodeExtra
     */
    NodeExtra getNodeExtras(String nodeId, @Nullable String spaceId, @Nullable String extras);

    /**
     * get node window info.
     *
     * @param nodeId nodeId
     * @return NodeInfoWindowVo
     */
    NodeInfoWindowVo getNodeWindowInfo(String nodeId);

    /**
     * node info.
     *
     * @param nodeId nodeId
     * @return NodeFromSpaceVo
     */
    NodeFromSpaceVo nodeFromSpace(String nodeId);

    /**
     * node name.
     *
     * @param nodeId nodeId
     * @param userId user id
     * @return node name
     */
    Optional<String> getNodeName(String nodeId, Long userId);

    /**
     * If the node is a root node, check whether the user's operations on the root directory meet the requirements of global security settings-root directory management.
     *
     * @param memberId member id
     * @param spaceId  space id
     * @param nodeId   nodeId
     */
    void checkEnableOperateNodeBySpaceFeature(Long memberId, String spaceId, String nodeId);

    /**
     * Check whether the user's operation on the root directory meets the requirements of global security settings-root directory management.
     *
     * @param memberId member id
     * @param spaceId  space id
     */
    void checkEnableOperateRootNodeBySpaceFeature(Long memberId, String spaceId);

    /**
     * node position.
     *
     * @param spaceId space id
     * @param nodeId  nodeId
     * @return is the node in the root directory
     */
    boolean isNodeBelongRootFolder(String spaceId, String nodeId);

    /**
     * get member recently browsing folder.
     *
     * @param spaceId  space id
     * @param memberId member id
     * @return NodeSearchResult
     */
    List<NodeSearchResult> recentList(String spaceId, Long memberId);

    /**
     * get node creator.
     *
     * @param nodeId id node id
     * @return creator
     */
    Long getCreatedMemberId(String nodeId);

    /**
     * whether the node name exists on the same directory.
     *
     * @param parentNodeId parent node id
     * @param nodeName     node name
     * @return boolean
     */
    boolean nodeNameExists(String parentNodeId, String nodeName);

}
