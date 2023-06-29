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

package com.apitable.workspace.service.impl;

import static com.apitable.core.constants.RedisConstants.getTemplateQuoteKey;
import static com.apitable.shared.constants.AssetsPublicConstants.SPACE_PREFIX;

import cn.hutool.core.bean.BeanUtil;
import cn.hutool.core.collection.CollUtil;
import cn.hutool.core.lang.Dict;
import cn.hutool.core.map.MapUtil;
import cn.hutool.core.util.BooleanUtil;
import cn.hutool.core.util.ObjectUtil;
import cn.hutool.core.util.StrUtil;
import cn.hutool.json.JSONArray;
import cn.hutool.json.JSONObject;
import cn.hutool.json.JSONUtil;
import com.alibaba.excel.EasyExcel;
import com.alibaba.excel.ExcelReader;
import com.alibaba.excel.read.builder.ExcelReaderBuilder;
import com.alibaba.excel.read.metadata.ReadSheet;
import com.alibaba.excel.support.ExcelTypeEnum;
import com.apitable.base.enums.ActionException;
import com.apitable.base.enums.DatabaseException;
import com.apitable.base.enums.ParameterException;
import com.apitable.control.infrastructure.ControlRoleDict;
import com.apitable.control.infrastructure.ControlTemplate;
import com.apitable.control.infrastructure.permission.NodePermission;
import com.apitable.control.infrastructure.role.ControlRole;
import com.apitable.core.exception.BusinessException;
import com.apitable.core.support.tree.DefaultTreeBuildFactory;
import com.apitable.core.util.ExceptionUtil;
import com.apitable.core.util.FileTool;
import com.apitable.core.util.SpringContextHolder;
import com.apitable.integration.grpc.BasicResult;
import com.apitable.integration.grpc.NodeCopyRo;
import com.apitable.integration.grpc.NodeDeleteRo;
import com.apitable.interfaces.social.facade.SocialServiceFacade;
import com.apitable.interfaces.social.model.SocialConnectInfo;
import com.apitable.organization.dto.MemberDTO;
import com.apitable.organization.mapper.MemberMapper;
import com.apitable.organization.service.IMemberService;
import com.apitable.shared.cache.bean.LoginUserDto;
import com.apitable.shared.cache.service.UserSpaceCacheService;
import com.apitable.shared.component.adapter.MultiDatasourceAdapterTemplate;
import com.apitable.shared.config.properties.LimitProperties;
import com.apitable.shared.constants.AuditConstants;
import com.apitable.shared.constants.FileSuffixConstants;
import com.apitable.shared.constants.NodeExtraConstants;
import com.apitable.shared.context.LoginContext;
import com.apitable.shared.grpc.IGrpcClientService;
import com.apitable.shared.holder.SpaceHolder;
import com.apitable.shared.listener.event.AuditSpaceEvent;
import com.apitable.shared.listener.event.AuditSpaceEvent.AuditSpaceArg;
import com.apitable.shared.sysconfig.i18n.I18nStringsUtil;
import com.apitable.shared.util.CollectionUtil;
import com.apitable.shared.util.IdUtil;
import com.apitable.shared.util.StringUtil;
import com.apitable.shared.util.information.ClientOriginInfo;
import com.apitable.shared.util.information.InformationUtil;
import com.apitable.space.enums.AuditSpaceAction;
import com.apitable.space.enums.SpaceException;
import com.apitable.space.mapper.SpaceAssetMapper;
import com.apitable.space.service.ISpaceAssetService;
import com.apitable.space.service.ISpaceRoleService;
import com.apitable.space.service.ISpaceService;
import com.apitable.space.vo.SpaceGlobalFeature;
import com.apitable.template.enums.TemplateException;
import com.apitable.widget.service.IWidgetService;
import com.apitable.workspace.dto.CreateNodeDto;
import com.apitable.workspace.dto.NodeBaseInfoDTO;
import com.apitable.workspace.dto.NodeCopyEffectDTO;
import com.apitable.workspace.dto.NodeCopyOptions;
import com.apitable.workspace.dto.NodeData;
import com.apitable.workspace.dto.NodeExtraDTO;
import com.apitable.workspace.dto.NodeTreeDTO;
import com.apitable.workspace.dto.UrlNodeInfoDTO;
import com.apitable.workspace.entity.DatasheetEntity;
import com.apitable.workspace.entity.DatasheetMetaEntity;
import com.apitable.workspace.entity.DatasheetRecordEntity;
import com.apitable.workspace.entity.NodeDescEntity;
import com.apitable.workspace.entity.NodeEntity;
import com.apitable.workspace.enums.FieldType;
import com.apitable.workspace.enums.IdRulePrefixEnum;
import com.apitable.workspace.enums.NodeException;
import com.apitable.workspace.enums.NodeType;
import com.apitable.workspace.enums.PermissionException;
import com.apitable.workspace.enums.ResourceType;
import com.apitable.workspace.enums.ViewType;
import com.apitable.workspace.listener.CsvReadListener;
import com.apitable.workspace.listener.ExcelSheetsDataListener;
import com.apitable.workspace.listener.MultiSheetReadListener;
import com.apitable.workspace.mapper.NodeMapper;
import com.apitable.workspace.mapper.NodeShareSettingMapper;
import com.apitable.workspace.ro.CreateDatasheetRo;
import com.apitable.workspace.ro.FieldMapRo;
import com.apitable.workspace.ro.ImportExcelOpRo;
import com.apitable.workspace.ro.MetaMapRo;
import com.apitable.workspace.ro.NodeCopyOpRo;
import com.apitable.workspace.ro.NodeMoveOpRo;
import com.apitable.workspace.ro.NodeOpRo;
import com.apitable.workspace.ro.NodeRelRo;
import com.apitable.workspace.ro.NodeUpdateOpRo;
import com.apitable.workspace.ro.RecordDataRo;
import com.apitable.workspace.ro.RecordMapRo;
import com.apitable.workspace.ro.ViewMapRo;
import com.apitable.workspace.service.IDatasheetMetaService;
import com.apitable.workspace.service.IDatasheetRecordService;
import com.apitable.workspace.service.IDatasheetService;
import com.apitable.workspace.service.IFieldRoleService;
import com.apitable.workspace.service.INodeDescService;
import com.apitable.workspace.service.INodeRelService;
import com.apitable.workspace.service.INodeRoleService;
import com.apitable.workspace.service.INodeService;
import com.apitable.workspace.service.IResourceMetaService;
import com.apitable.workspace.vo.FieldPermissionInfo;
import com.apitable.workspace.vo.NodeFromSpaceVo;
import com.apitable.workspace.vo.NodeInfo;
import com.apitable.workspace.vo.NodeInfoTreeVo;
import com.apitable.workspace.vo.NodeInfoVo;
import com.apitable.workspace.vo.NodeInfoWindowVo;
import com.apitable.workspace.vo.NodeInfoWindowVo.MemberInfo;
import com.apitable.workspace.vo.NodePathVo;
import com.apitable.workspace.vo.NodePermissionView;
import com.apitable.workspace.vo.NodeSearchResult;
import com.apitable.workspace.vo.NodeShareTree;
import com.apitable.workspace.vo.ShowcaseVo.NodeExtra;
import com.baomidou.mybatisplus.core.toolkit.IdWorker;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.baomidou.mybatisplus.extension.toolkit.SqlHelper;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collection;
import java.util.Collections;
import java.util.HashMap;
import java.util.HashSet;
import java.util.LinkedHashMap;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import java.util.Objects;
import java.util.Optional;
import java.util.Set;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.locks.Lock;
import java.util.stream.Collectors;
import javax.annotation.Resource;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVRecord;
import org.apache.poi.EncryptedDocumentException;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.integration.redis.util.RedisLockRegistry;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

/**
 * node service implement.
 */
@Service
@Slf4j
public class NodeServiceImpl extends ServiceImpl<NodeMapper, NodeEntity> implements INodeService {

    @Resource
    private NodeMapper nodeMapper;

    @Resource
    private INodeDescService iNodeDescService;

    @Resource
    private IDatasheetService iDatasheetService;

    @Resource
    private INodeRelService iNodeRelService;

    @Resource
    private IDatasheetMetaService iDatasheetMetaService;

    @Resource
    private IDatasheetRecordService iDatasheetRecordService;

    @Resource
    private IResourceMetaService iResourceMetaService;

    @Resource
    private ISpaceAssetService iSpaceAssetService;

    @Resource
    private SpaceAssetMapper spaceAssetMapper;

    @Resource
    private ControlTemplate controlTemplate;

    @Resource
    private INodeRoleService iNodeRoleService;

    @Resource
    private ISpaceService iSpaceService;

    @Resource
    private MemberMapper memberMapper;

    @Resource
    private NodeShareSettingMapper nodeShareSettingMapper;

    @Resource
    private LimitProperties limitProperties;

    @Resource
    private IFieldRoleService iFieldRoleService;

    @Resource
    private IGrpcClientService grpcClientService;

    @Resource
    private SocialServiceFacade socialServiceFacade;

    @Resource
    private RedisTemplate<String, String> redisTemplate;

    @Resource
    private INodeDescService nodeDescService;

    @Resource
    private ISpaceRoleService iSpaceRoleService;

    @Resource
    private UserSpaceCacheService userSpaceCacheService;

    @Resource
    private MultiDatasourceAdapterTemplate multiDatasourceAdapterTemplate;

    @Resource
    private IMemberService iMemberService;

    @Resource
    private IWidgetService iWidgetService;

    @Resource
    private RedisLockRegistry redisLockRegistry;

    @Override
    public String getRootNodeIdBySpaceId(String spaceId) {
        log.info("The root node ID of the query space [{}]", spaceId);
        return nodeMapper.selectRootNodeIdBySpaceId(spaceId);
    }

    @Override
    public List<String> getNodeIdBySpaceIdAndType(String spaceId, Integer type) {
        log.info("The ID of the query space [{}] node type [{}]", spaceId, type);
        return nodeMapper.selectNodeIdBySpaceIdAndType(spaceId, type);
    }

    @Override
    public List<String> getNodeIdBySpaceIdAndTypeAndKeyword(String spaceId, Integer type, String keyword) {
        log.info("The ID of the query space [{}] node types [{}] keyword [{}]", spaceId, type, keyword);
        return nodeMapper.selectNodeIdsBySpaceIdAndTypeAndKeyword(spaceId, type, keyword);
    }

    @Override
    public NodeType getTypeByNodeId(String nodeId) {
        Integer type = nodeMapper.selectNodeTypeByNodeId(nodeId);
        ExceptionUtil.isNotNull(type, PermissionException.NODE_NOT_EXIST);
        return NodeType.toEnum(type);
    }

    @Override
    public NodeEntity getByNodeId(String nodeId) {
        log.info("Query node: {}", nodeId);
        NodeEntity nodeEntity = nodeMapper.selectByNodeId(nodeId);
        ExceptionUtil.isNotNull(nodeEntity, PermissionException.NODE_NOT_EXIST);
        return nodeEntity;
    }

    @Override
    public List<String> getExistNodeIdsBySelf(List<String> nodeIds) {
        return nodeMapper.selectNodeIdByNodeIdIn(nodeIds);
    }

    private List<NodeEntity> getByNodeIds(Collection<String> nodeIds) {
        log.info("Batch query node:{}", nodeIds);
        List<NodeEntity> nodeEntities = nodeMapper.selectByNodeIds(nodeIds);
        ExceptionUtil.isNotEmpty(nodeEntities, PermissionException.NODE_NOT_EXIST);
        return nodeEntities;
    }

    @Override
    public String getSpaceIdByNodeId(String nodeId) {
        log.info("The id of the space where the query node is located.");
        String spaceId = nodeMapper.selectSpaceIdByNodeId(nodeId);
        ExceptionUtil.isNotNull(spaceId, PermissionException.NODE_NOT_EXIST);
        return spaceId;
    }

    @Override
    public String getSpaceIdByNodeIds(List<String> nodeIds) {
        List<String> spaceIds = nodeMapper.selectSpaceIdsByNodeIds(nodeIds);
        ExceptionUtil.isTrue(spaceIds.size() == 1, ParameterException.INCORRECT_ARG);
        return spaceIds.get(0);
    }

    @Override
    public String getSpaceIdByNodeIdIncludeDeleted(String nodeId) {
        log.info("Query the space ID of the node [{}] including deletion", nodeId);
        return nodeMapper.selectSpaceIdByNodeIdIncludeDeleted(nodeId);
    }

    @Override
    public Boolean getIsTemplateByNodeIds(List<String> nodeIds) {
        log.info("Query whether all nodes [{}] belong to templates", nodeIds);
        List<Boolean> result = nodeMapper.selectIsTemplateByNodeId(nodeIds);
        ExceptionUtil.isTrue(result.size() > 0, PermissionException.NODE_NOT_EXIST);
        ExceptionUtil.isTrue(result.size() == 1, ParameterException.INCORRECT_ARG);
        return result.get(0);
    }

    @Override
    public String getParentIdByNodeId(String nodeId) {
        log.info("The id of the parent node of the query node [{}]", nodeId);
        return nodeMapper.selectParentIdByNodeId(nodeId);
    }

    @Override
    public String getNodeNameByNodeId(String nodeId) {
        log.info("Query the node name of node [{}]", nodeId);
        return nodeMapper.selectNodeNameByNodeId(nodeId);
    }

    @Override
    public List<String> getPathParentNode(String nodeId) {
        log.info("Query the node path of node [{}]", nodeId);
        List<NodeBaseInfoDTO> parentPathNodes =
            this.getParentPathNodes(Collections.singletonList(nodeId), false);
        return parentPathNodes.stream()
            .map(NodeBaseInfoDTO::getNodeId).collect(Collectors.toList());
    }

    @Override
    public List<NodePathVo> getParentPathByNodeId(String spaceId, String nodeId) {
        log.info("Get the node parent path ");
        List<NodeBaseInfoDTO> parentPathNodes =
            this.getParentPathNodes(Collections.singletonList(nodeId), true);
        return parentPathNodes.stream()
            .map(i -> {
                if (i.getType().equals(NodeType.ROOT.getNodeType())) {
                    String spaceName = iSpaceService.getNameBySpaceId(spaceId);
                    return new NodePathVo(i.getNodeId(), spaceName);
                }
                return new NodePathVo(i.getNodeId(), i.getNodeName());
            })
            .collect(Collectors.toList());
    }

    @Override
    public List<NodeBaseInfoDTO> getParentPathNodes(List<String> nodeIds, boolean includeRootNode) {
        return nodeMapper.selectAllParentNodeIds(nodeIds, includeRootNode);
    }

    @Override
    public List<NodeInfo> getNodeInfoByNodeIds(Collection<String> nodeIds) {
        log.info("Node information view of batch query [{}]", nodeIds);
        return nodeMapper.selectInfoByNodeIds(nodeIds);
    }

    @Override
    public List<NodeInfo> getNodeInfo(String spaceId, List<String> nodeIds, Long memberId) {
        log.info("Node information view of batch query [{}]", nodeIds);
        return nodeMapper.selectNodeInfo(nodeIds, memberId);
    }

    @Override
    public List<NodeInfoVo> getNodeInfoByNodeIds(String spaceId, Long memberId,
                                                 List<String> nodeIds) {
        log.info("Query the view information of multiple nodes ");
        if (CollUtil.isEmpty(nodeIds)) {
            return new ArrayList<>();
        }
        ControlRoleDict roleDict = controlTemplate.fetchNodeRole(memberId, nodeIds);
        if (roleDict.isEmpty()) {
            return new ArrayList<>();
        }
        // Batch query node information
        List<NodeInfoVo> infos = nodeMapper.selectNodeInfoByNodeIds(roleDict.keySet(), memberId);
        // Node switches to memory custom sorting
        CollectionUtil.customSequenceSort(infos, NodeInfoVo::getNodeId,
            new ArrayList<>(roleDict.keySet()));
        SpaceGlobalFeature feature = iSpaceService.getSpaceGlobalFeature(spaceId);
        setRole(infos, roleDict, feature);
        return infos;
    }

    @Override
    public String checkNodeIfExist(String spaceId, String nodeId) {
        log.info("Check if the node exists");
        String nodeSpaceId = nodeMapper.selectSpaceIdByNodeId(nodeId);
        ExceptionUtil.isNotNull(nodeSpaceId, PermissionException.NODE_NOT_EXIST);
        // When the space Id is not empty, check whether the space is cross-space.
        ExceptionUtil.isTrue(StrUtil.isBlank(spaceId) || nodeSpaceId.equals(spaceId),
            SpaceException.NOT_IN_SPACE);
        return nodeSpaceId;
    }

    @Override
    public void checkSourceDatasheet(String spaceId, Long memberId, Integer type, NodeRelRo extra) {
        NodeType nodeType = NodeType.toEnum(type);
        switch (nodeType) {
            case FORM:
            case MIRROR:
                ExceptionUtil.isTrue(extra != null && StrUtil.isNotBlank(extra.getDatasheetId())
                    && StrUtil.isNotBlank(extra.getViewId()), ParameterException.INCORRECT_ARG);
                // Determine whether the datasheet does not exist or is accessed across space.
                this.checkNodeIfExist(spaceId, extra.getDatasheetId());
                // Check whether the specified view of the datasheet exists.
                iDatasheetMetaService.checkViewIfExist(extra.getDatasheetId(), extra.getViewId());
                // The form requires the editable permission of the source datasheet and the
                // mirror requires the management.
                NodePermission permission =
                    nodeType.equals(NodeType.FORM) ? NodePermission.EDIT_NODE :
                        NodePermission.MANAGE_NODE;
                // Check whether the datasheet has the specified operation permission
                controlTemplate.checkNodePermission(memberId, extra.getDatasheetId(), permission,
                    status -> ExceptionUtil.isTrue(status,
                        PermissionException.NODE_OPERATION_DENIED));
                break;
            default:
                break;
        }
    }

    @Override
    public Long getMemberIdByUserIdAndNodeId(Long userId, String nodeId) {
        String spaceId = nodeMapper.selectSpaceIdByNodeId(nodeId);
        if (StrUtil.isBlank(spaceId)) {
            return null;
        }
        SpaceHolder.set(spaceId);
        return memberMapper.selectIdByUserIdAndSpaceId(userId, spaceId);
    }

    @Override
    public List<NodeSearchResult> searchNode(String spaceId, Long memberId, String keyword) {
        log.info("Fuzzy search node");
        if (StrUtil.isBlank(StrUtil.trim(keyword))) {
            return new ArrayList<>();
        }
        // fuzzy search results
        List<String> nodeIds = nodeMapper.selectLikeNodeName(spaceId, StrUtil.trim(keyword));
        List<NodeInfoVo> nodeInfos = this.getNodeInfoByNodeIds(spaceId, memberId, nodeIds);
        return formatNodeSearchResults(nodeInfos);
    }

    @Override
    public NodeInfoTreeVo getNodeTree(String spaceId, String nodeId, Long memberId, int depth) {
        log.info("Query node tree ");
        List<String> nodeIds = this.getNodeIdsInNodeTree(nodeId, depth);
        return this.getNodeInfoTreeByNodeIds(spaceId, memberId, nodeIds);
    }

    @Override
    public List<NodeShareTree> getSubNodes(String nodeId) {
        List<String> subNodeIds = this.getNodeIdsInNodeTree(nodeId, -1);
        subNodeIds.remove(nodeId);
        if (subNodeIds.isEmpty()) {
            return new ArrayList<>();
        }
        List<NodeShareTree> shareTrees = nodeMapper.selectShareTree(subNodeIds);
        // node switches to memory custom sort
        CollectionUtil.customSequenceSort(shareTrees, NodeShareTree::getNodeId, subNodeIds);
        return shareTrees;
    }

    @Override
    public List<String> getNodeIdsInNodeTree(String nodeId, Integer depth) {
        return this.getNodeIdsInNodeTree(nodeId, depth, false);
    }

    @Override
    public List<String> getNodeIdsInNodeTree(String nodeId, Integer depth, Boolean isRubbish) {
        return this.getNodeIdsInNodeTree(Collections.singletonList(nodeId), depth, isRubbish);
    }

    private List<String> getNodeIdsInNodeTree(List<String> nodeIds, Integer depth, Boolean isRubbish) {
        Set<String> nodeIdSet = new LinkedHashSet<>(nodeIds);
        List<String> parentIds = nodeIds.stream()
            .filter(i -> i.startsWith(IdRulePrefixEnum.FOD.getIdRulePrefixEnum()))
            .collect(Collectors.toList());
        while (!parentIds.isEmpty() && depth != 0) {
            List<NodeTreeDTO> subNode =
                nodeMapper.selectNodeTreeDTOByParentIdIn(parentIds, isRubbish);
            if (subNode.isEmpty()) {
                break;
            }
            parentIds = subNode.stream()
                .map(NodeTreeDTO::getNodeId)
                .filter(i -> i.startsWith(IdRulePrefixEnum.FOD.getIdRulePrefixEnum())
                    && !nodeIdSet.contains(i))
                .collect(Collectors.toList());
            Map<String, List<NodeTreeDTO>> parentIdToSubNodeMap =
                subNode.stream().collect(Collectors.groupingBy(NodeTreeDTO::getParentId));
            for (List<NodeTreeDTO> sub : parentIdToSubNodeMap.values()) {
                nodeIdSet.addAll(this.sortNodeAtSameLevel(sub));
            }
            depth--;
        }
        return new ArrayList<>(nodeIdSet);
    }

    @Override
    public List<String> sortNodeAtSameLevel(List<NodeTreeDTO> sub) {
        return this.sortNodeAtSameLevel(sub, null);
    }

    private List<String> sortNodeAtSameLevel(List<NodeTreeDTO> sub, NodeType nodeType) {
        List<String> subNodeIds =
            sub.stream().map(NodeTreeDTO::getNodeId).collect(Collectors.toList());
        List<NodeTreeDTO> nodes = new ArrayList<>();
        Optional<NodeTreeDTO> first =
            sub.stream().filter(i -> i.getPreNodeId() == null).findFirst();
        first.ifPresent(nodes::add);
        nodes.addAll(sub.stream()
            .filter(i -> i.getPreNodeId() != null && !subNodeIds.contains(i.getPreNodeId()))
            .collect(Collectors.toList()));
        if (nodes.isEmpty()) {
            return subNodeIds;
        }
        List<String> nodeIds = new ArrayList<>();
        Map<String, NodeTreeDTO> preNodeIdToNodeMap = sub.stream()
            .collect(Collectors.toMap(NodeTreeDTO::getPreNodeId, i -> i, (k1, k2) -> k2));
        for (NodeTreeDTO node : nodes) {
            String preNodeId = node.getNodeId();
            if (nodeType == null || node.getType() == nodeType.getNodeType()) {
                nodeIds.add(preNodeId);
            }
            while (preNodeIdToNodeMap.containsKey(preNodeId)) {
                NodeTreeDTO nodeTreeDTO = preNodeIdToNodeMap.get(preNodeId);
                preNodeId = nodeTreeDTO.getNodeId();
                if (nodeType == null || nodeTreeDTO.getType() == nodeType.getNodeType()) {
                    nodeIds.add(preNodeId);
                }
            }
        }
        return nodeIds;
    }

    @Override
    public List<NodeInfoVo> getChildNodesByNodeId(String spaceId, Long memberId, String nodeId,
        NodeType nodeType) {
        log.info("Query the list of child nodes ");
        // Get a direct child node
        List<NodeTreeDTO> subNode =
            nodeMapper.selectNodeTreeDTOByParentIdIn(Collections.singleton(nodeId), false);
        if (subNode.isEmpty()) {
            return new ArrayList<>();
        }
        List<String> subNodeIds = this.sortNodeAtSameLevel(subNode, nodeType);
        return this.getNodeInfoByNodeIds(spaceId, memberId, subNodeIds);
    }

    @Override
    public NodeInfoTreeVo position(String spaceId, Long memberId, String nodeId) {
        log.info("positioning node ");
        // Get all parent nodes of the node
        List<String> parentNodeIds = this.getPathParentNode(nodeId);
        // No parent node should report an error,
        // but the location node does not need to return empty directly.
        if (parentNodeIds.isEmpty()) {
            return null;
        }
        // Check whether the parent node has permission to access, otherwise it will not be located.
        ControlRoleDict roleDict = controlTemplate.fetchNodeRole(memberId, parentNodeIds);
        if (roleDict.isEmpty()) {
            return null;
        }
        for (String parentNode : parentNodeIds) {
            if (!roleDict.containsKey(parentNode)) {
                return null;
            }
        }
        // Query root node
        String rootNodeId = getRootNodeIdBySpaceId(spaceId);
        parentNodeIds.add(0, rootNodeId);
        parentNodeIds.remove(nodeId);
        // The parent node supplements the tree node load.
        List<NodeTreeDTO> subNode =
            nodeMapper.selectNodeTreeDTOByParentIdIn(parentNodeIds, false);
        Map<String, List<NodeTreeDTO>> parentIdToSubNodeMap =
            subNode.stream().collect(Collectors.groupingBy(NodeTreeDTO::getParentId));
        List<String> viewNodeIds = new ArrayList<>();
        viewNodeIds.add(rootNodeId);
        for (String parentId : parentNodeIds) {
            List<NodeTreeDTO> sub = parentIdToSubNodeMap.get(parentId);
            viewNodeIds.addAll(this.sortNodeAtSameLevel(sub));
        }
        return this.getNodeInfoTreeByNodeIds(spaceId, memberId, viewNodeIds);
    }

    @Override
    public NodeInfoVo getNodeInfoByNodeId(String spaceId, String nodeId, ControlRole role) {
        log.info("Query node information ");
        NodeInfoVo nodeInfo = nodeMapper.selectNodeInfoByNodeId(nodeId);
        SpaceGlobalFeature feature = iSpaceService.getSpaceGlobalFeature(spaceId);
        nodeInfo.setRole(role.getRoleTag());
        nodeInfo.setPermissions(role.permissionToBean(NodePermissionView.class, feature));
        return nodeInfo;
    }

    @Override
    public NodeInfoTreeVo getNodeInfoTreeByNodeIds(String spaceId, Long memberId,
                                                   List<String> nodeIds) {
        log.info("Query the views of multiple nodes and construct a tree structure ");
        // Constructing a tree requires data structure support to construct a tree,
        // first construct the tree, and then integrate and delete it.
        ControlRoleDict roleDict = controlTemplate.fetchNodeTreeNode(memberId, nodeIds);
        ExceptionUtil.isFalse(roleDict.isEmpty(), PermissionException.NODE_ACCESS_DENIED);
        List<NodeInfoTreeVo> treeList =
            CollUtil.split(roleDict.keySet(), 1000).stream()
                .reduce(new ArrayList<>(),
                    (nodes, item) -> {
                        List<NodeInfoTreeVo> childNodes =
                            nodeMapper.selectNodeInfoTreeByNodeIds(item, memberId);
                        nodes.addAll(childNodes);
                        return nodes;
                    },
                    (nodes, childNodes) -> {
                        nodes.addAll(childNodes);
                        return nodes;
                    });
        // Node switches to memory custom sort
        CollectionUtil.customSequenceSort(treeList, NodeInfoTreeVo::getNodeId,
            new ArrayList<>(roleDict.keySet()));
        SpaceGlobalFeature feature = iSpaceService.getSpaceGlobalFeature(spaceId);
        setRole(treeList, roleDict, feature);
        List<NodeInfoTreeVo> nodeTrees =
            new DefaultTreeBuildFactory<NodeInfoTreeVo>().doTreeBuild(treeList);
        return CollUtil.isNotEmpty(nodeTrees) ? nodeTrees.get(0) : null;
    }

    private <T extends NodeInfoVo> void setRole(List<T> list, ControlRoleDict roleDict,
                                                SpaceGlobalFeature feature) {
        list.forEach(node -> {
            node.setRole(roleDict.get(node.getNodeId()).getRoleTag());
            node.setPermissions(
                roleDict.get(node.getNodeId()).permissionToBean(NodePermissionView.class, feature));
        });
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public String createNode(Long userId, String spaceId, NodeOpRo nodeOpRo) {
        log.info("Add node ");
        // if (nodeOpRo.getType() != NodeType.FOLDER.getNodeType()) {
        //     // Verify that the number of nodes reaches the upper limit
        //     iSubscriptionService.checkSheetNums(spaceId, 1);
        // }
        // The parent id and space id must match.
        // The parent node belongs to this space to prevent cross-space and cross-node operations.
        this.checkNodeIfExist(spaceId, nodeOpRo.getParentId());
        String name =
            duplicateNameModify(nodeOpRo.getParentId(), nodeOpRo.getType(), nodeOpRo.getNodeName(),
                null);
        String nodeId = IdUtil.createNodeId(nodeOpRo.getType());
        // If the new node is a file, it corresponds to the creation of a datasheet form.
        this.createFileMeta(userId, spaceId, nodeId, nodeOpRo.getType(), name, nodeOpRo.getExtra());
        // When an empty string is not passed in,
        // if the pre-node is deleted or not under the parent Id, the move fails.
        String preNodeId = this.verifyPreNodeId(nodeOpRo.getPreNodeId(), nodeOpRo.getParentId());
        NodeEntity nodeEntity = NodeEntity.builder()
            .parentId(nodeOpRo.getParentId())
            .spaceId(spaceId)
            .preNodeId(preNodeId)
            .nodeName(name)
            .type(nodeOpRo.getType())
            .nodeId(nodeId)
            .build();
        // Change the front node ID of the next node to the new node ID(A <- C => B <- C)
        nodeMapper.updatePreNodeIdBySelf(nodeId, preNodeId, nodeOpRo.getParentId());
        boolean flag = save(nodeEntity);
        ExceptionUtil.isTrue(flag, DatabaseException.INSERT_ERROR);
        return nodeEntity.getNodeId();
    }

    @Override
    @Transactional
    public String createDatasheetWithDesc(String spaceId, Long userId, CreateDatasheetRo ro) {
        NodeOpRo nodeOpRo = ro.tranferToNodeOpRo();
        nodeOpRo.setParentId(ro.getFolderId());
        // Create node
        String nodeId = createNode(userId, spaceId, nodeOpRo);

        // Add description information
        if (ro.needToInsertDesc()) {
            NodeDescEntity descEntity = NodeDescEntity.builder().id(IdWorker.getId())
                .nodeId(nodeId).description(ro.getDescription()).build();
            nodeDescService.insertBatch(Collections.singletonList(descEntity));
        }
        return nodeId;
    }

    @Override
    public String createChildNode(Long userId, CreateNodeDto dto) {
        NodeEntity nodeEntity = NodeEntity.builder()
            .spaceId(dto.getSpaceId())
            .nodeId(dto.getNewNodeId())
            .nodeName(dto.getNodeName())
            .parentId(dto.getParentId())
            .type(dto.getType())
            .icon(dto.getIcon())
            .cover(dto.getCover())
            .preNodeId(dto.getPreNodeId())
            .extra(dto.getExtra())
            .createdBy(userId)
            .updatedBy(userId)
            .build();

        boolean flag = save(nodeEntity);
        ExceptionUtil.isTrue(flag, DatabaseException.INSERT_ERROR);
        return nodeEntity.getNodeId();
    }

    @Override
    public void insertBatch(List<NodeEntity> nodeList, Integer dstCount) {
        log.info("Batch add nodes ");
        if (CollUtil.isNotEmpty(nodeList)) {
            if (dstCount == null) {
                dstCount = 0;
                for (NodeEntity node : nodeList) {
                    if (node.getType() == NodeType.DATASHEET.getNodeType()) {
                        dstCount++;
                    }
                }
            }
            // Verify that the number of nodes reaches the upper limit
            // iSubscriptionService.checkSheetNums(nodeList.get(0).getSpaceId(), dstCount);
            boolean flag = SqlHelper.retBool(nodeMapper.insertBatch(nodeList));
            ExceptionUtil.isTrue(flag, DatabaseException.INSERT_ERROR);
        }
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void edit(Long userId, String nodeId, NodeUpdateOpRo opRo) {
        log.info("Edit node ");
        NodeEntity nodeEntity = this.getByNodeId(nodeId);
        ExceptionUtil.isFalse(nodeEntity.getType().equals(NodeType.ROOT.getNodeType()),
            NodeException.NOT_ALLOW);
        // modify name
        this.updateNodeName(userId, nodeId, opRo.getNodeName(), nodeEntity);

        // modify icon
        this.updateNodeIcon(userId, nodeId, opRo.getIcon(), nodeEntity.getIcon());

        // revised the cover picture
        this.updateNodeCover(userId, nodeId, opRo.getCover(), nodeEntity.getCover());

        // Modify whether to display the history of the record
        if (ObjectUtil.isNotNull(opRo.getShowRecordHistory())
            && nodeEntity.getType() == NodeType.DATASHEET.getNodeType()) {
            boolean flag;
            String newValue = JSONUtil.toJsonStr(Dict.create()
                .set(NodeExtraConstants.SHOW_RECORD_HISTORY, opRo.getShowRecordHistory()));
            if (ObjectUtil.isNotNull(nodeEntity.getExtra())) {
                flag = SqlHelper.retBool(nodeMapper.updateExtraShowRecordHistoryByNodeId(nodeId,
                    opRo.getShowRecordHistory()));
            } else {
                flag = SqlHelper.retBool(nodeMapper.updateExtraByNodeId(nodeId, newValue));
            }
            ExceptionUtil.isTrue(flag, DatabaseException.EDIT_ERROR);
        }
    }

    private void updateNodeName(Long userId, String nodeId, String name, NodeEntity entity) {
        if (StrUtil.isBlank(name)) {
            return;
        }
        // Prevent peer directory, duplicate name modification
        String nodeName = duplicateNameModify(entity.getParentId(), entity.getType(), name, nodeId);
        boolean flag = SqlHelper.retBool(nodeMapper.updateNameByNodeId(nodeId, nodeName));
        ExceptionUtil.isTrue(flag, DatabaseException.EDIT_ERROR);
        // The datasheet node, corresponding to the modification.
        if (entity.getType() == NodeType.DATASHEET.getNodeType()) {
            iDatasheetService.updateDstName(userId, nodeId, nodeName);
        }
        // publish space audit events
        JSONObject info = JSONUtil.createObj();
        info.set(AuditConstants.OLD_NODE_NAME, StrUtil.nullToEmpty(entity.getNodeName()));
        info.set(AuditConstants.NODE_NAME, nodeName);
        ClientOriginInfo clientOriginInfo = InformationUtil
            .getClientOriginInfoInCurrentHttpContext(true, false);
        AuditSpaceArg arg =
            AuditSpaceArg.builder().action(AuditSpaceAction.RENAME_NODE).userId(userId)
                .requestIp(clientOriginInfo.getIp())
                .requestUserAgent(clientOriginInfo.getUserAgent())
                .nodeId(nodeId).info(info).build();
        SpringContextHolder.getApplicationContext().publishEvent(new AuditSpaceEvent(this, arg));
    }

    private void updateNodeIcon(Long userId, String nodeId, String icon, String oldNodeIcon) {
        if (icon == null) {
            return;
        }
        // icon reset
        if (icon.trim().equals(StrUtil.EMPTY)) {
            icon = StrUtil.EMPTY;
        }
        boolean flag = SqlHelper.retBool(nodeMapper.updateIconByNodeId(nodeId, icon));
        ExceptionUtil.isTrue(flag, DatabaseException.EDIT_ERROR);
        // publish space audit events
        JSONObject info = JSONUtil.createObj();
        info.set(AuditConstants.OLD_NODE_ICON, StrUtil.nullToEmpty(oldNodeIcon));
        info.set(AuditConstants.NODE_ICON, icon);
        ClientOriginInfo clientOriginInfo = InformationUtil
            .getClientOriginInfoInCurrentHttpContext(true, false);
        AuditSpaceArg arg =
            AuditSpaceArg.builder().action(AuditSpaceAction.UPDATE_NODE_ICON).userId(userId)
                .requestIp(clientOriginInfo.getIp())
                .requestUserAgent(clientOriginInfo.getUserAgent())
                .nodeId(nodeId).info(info).build();
        SpringContextHolder.getApplicationContext().publishEvent(new AuditSpaceEvent(this, arg));
    }

    private void updateNodeCover(Long userId, String nodeId, String cover, String oldNodeCover) {
        if (StrUtil.isBlank(cover)) {
            return;
        }
        // you can reset the cover map to empty
        if ("null".equalsIgnoreCase(cover) || "undefined".equalsIgnoreCase(cover)) {
            cover = null;
        }
        boolean flag = SqlHelper.retBool(nodeMapper.updateCoverByNodeId(nodeId, cover));
        ExceptionUtil.isTrue(flag, DatabaseException.EDIT_ERROR);
        // the old cover map reduces the number of references
        if (StrUtil.startWith(oldNodeCover, SPACE_PREFIX)) {
            spaceAssetMapper.updateCiteByNodeIdAndToken(nodeId, oldNodeCover, -1);
        }
        // publish space audit events
        JSONObject info = JSONUtil.createObj();
        info.set(AuditConstants.OLD_NODE_COVER, StrUtil.nullToEmpty(oldNodeCover));
        info.set(AuditConstants.NODE_COVER, StrUtil.nullToEmpty(cover));
        ClientOriginInfo clientOriginInfo = InformationUtil
            .getClientOriginInfoInCurrentHttpContext(true, false);
        AuditSpaceArg arg =
            AuditSpaceArg.builder().action(AuditSpaceAction.UPDATE_NODE_COVER).userId(userId)
                .requestIp(clientOriginInfo.getIp())
                .requestUserAgent(clientOriginInfo.getUserAgent())
                .nodeId(nodeId).info(info).build();
        SpringContextHolder.getApplicationContext().publishEvent(new AuditSpaceEvent(this, arg));
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public List<String> move(Long userId, NodeMoveOpRo opRo) {
        log.info("Move node");
        NodeEntity nodeEntity = this.getByNodeId(opRo.getNodeId());
        ExceptionUtil.isFalse(nodeEntity.getType().equals(NodeType.ROOT.getNodeType()),
            NodeException.NOT_ALLOW);
        // The input parameter. The node ID is the same as the pre-node ID.
        ExceptionUtil.isFalse(nodeEntity.getNodeId().equals(opRo.getPreNodeId()),
            ParameterException.INCORRECT_ARG);
        ExceptionUtil.isFalse(nodeEntity.getNodeId().equals(opRo.getParentId()),
            ParameterException.INCORRECT_ARG);
        // When this node is a folder, it is prevented from moving into child and descendant nodes.
        if (nodeEntity.getType().equals(NodeType.FOLDER.getNodeType())) {
            List<String> nodeIds =
                this.getNodeIdsInNodeTree(nodeEntity.getNodeId(), -1);
            ExceptionUtil.isFalse(CollUtil.isNotEmpty(nodeIds)
                && nodeIds.contains(opRo.getParentId()), NodeException.MOVE_FAILURE);
        }
        AuditSpaceAction action = AuditSpaceAction.MOVE_NODE;
        JSONObject info = JSONUtil.createObj();
        info.set(AuditConstants.OLD_PRE_NODE_ID, StrUtil.nullToEmpty(nodeEntity.getPreNodeId()));
        String name = nodeEntity.getNodeName();
        String parentId = nodeEntity.getParentId();
        // Nodes that record changes in data (front-end requirements)
        List<String> nodeIds = CollUtil.newArrayList(nodeEntity.getNodeId());
        if (!nodeEntity.getParentId().equals(opRo.getParentId())) {
            // move across folders
            parentId = opRo.getParentId();
            // Check whether the new parent node exists and is in the same space
            this.checkNodeIfExist(nodeEntity.getSpaceId(), parentId);
            name =
                this.duplicateNameModify(parentId, nodeEntity.getType(), nodeEntity.getNodeName(),
                    null);
            // The node is a datasheet, and the name changes corresponding to the modification.
            if (nodeEntity.getType() == NodeType.DATASHEET.getNodeType()
                && !nodeEntity.getNodeName().equals(name)) {
                iDatasheetService.updateDstName(userId, nodeEntity.getNodeId(), name);
            }
            // Parent nodes that record new and old locations
            nodeIds.add(nodeEntity.getParentId());
            nodeIds.add(opRo.getParentId());
            info.set(AuditConstants.OLD_PARENT_ID, nodeEntity.getParentId());
        } else {
            // Sort at the same level, the old and new front nodes are the same,
            // that is, no movement has occurred.
            if (Optional.ofNullable(opRo.getPreNodeId()).orElse("")
                .equals(Optional.ofNullable(nodeEntity.getPreNodeId()).orElse(""))) {
                return new ArrayList<>();
            }
            action = AuditSpaceAction.SORT_NODE;
        }
        // When an empty string is not passed in,
        // if the pre-node is deleted or not under the parent Id, the move fails.
        String preNodeId = this.verifyPreNodeId(opRo.getPreNodeId(), parentId);
        // The next node that records the old and new locations
        List<String> suffixNodeIds = nodeMapper.selectNodeIdByPreNodeIdIn(
            CollUtil.newArrayList(nodeEntity.getNodeId(), preNodeId));
        nodeIds.addAll(suffixNodeIds);
        Lock lock = redisLockRegistry.obtain(parentId);
        try {
            if (lock.tryLock(2, TimeUnit.MINUTES)) {
                // Update the front node of the latter node
                // to the front node of the node (A <- X <- C => A <- C)
                nodeMapper.updatePreNodeIdBySelf(nodeEntity.getPreNodeId(),
                    nodeEntity.getNodeId(), nodeEntity.getParentId());
                // Update the sequence relationship of nodes before
                // and after the move (D <- E => D <- X <- E)
                nodeMapper.updatePreNodeIdBySelf(nodeEntity.getNodeId(), preNodeId, parentId);
                // Update the information of this node (the ID of the previous
                // node may be updated to null, so update By id is not used)
                nodeMapper.updateInfoByNodeId(nodeEntity.getNodeId(), parentId, preNodeId, name);
            } else {
                throw new BusinessException("Frequent operations");
            }
        } catch (InterruptedException e) {
            throw new BusinessException("Frequent operations");
        } finally {
            lock.unlock();
        }
        // Publish Space Audit Events
        info.set(AuditConstants.MOVE_EFFECT_SUFFIX_NODES, CollUtil.emptyIfNull(suffixNodeIds));
        ClientOriginInfo clientOriginInfo = InformationUtil
            .getClientOriginInfoInCurrentHttpContext(true, false);
        AuditSpaceArg arg =
            AuditSpaceArg.builder().action(action).userId(userId).nodeId(opRo.getNodeId())
                .requestIp(clientOriginInfo.getIp())
                .requestUserAgent(clientOriginInfo.getUserAgent())
                .info(info).build();
        SpringContextHolder.getApplicationContext().publishEvent(new AuditSpaceEvent(this, arg));
        return nodeIds;
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void deleteById(String spaceId, Long memberId, String... ids) {
        log.info("Delete node {}", (Object) ids);
        Long userId = memberMapper.selectUserIdByMemberId(memberId);
        List<String> idList = Arrays.asList(ids);
        List<NodeEntity> nodes = this.getByNodeIds(new HashSet<>(idList));
        // verify root node
        long count = nodes.stream()
            .filter(node -> node.getType().equals(NodeType.ROOT.getNodeType()))
            .count();
        ExceptionUtil.isFalse(count > 0, NodeException.NOT_ALLOW);
        // get the superior path
        List<String> parentIds =
            nodes.stream().map(NodeEntity::getParentId).collect(Collectors.toList());
        Map<String, String> parentIdToPathMap = this.getSuperiorPathByParentIds(parentIds);
        // give delete node role
        iNodeRoleService.copyExtendNodeRoleIfExtend(userId, spaceId, memberId,
            new HashSet<>(idList));
        // Obtain the node ID and the corresponding datasheet ID set of the node
        // and its child descendants.
        List<String> nodeIds = this.getNodeIdsInNodeTree(idList, -1, false);
        // delete all nodes and child descendants
        if (CollUtil.isNotEmpty(nodeIds)) {
            this.nodeDeleteChangeset(nodeIds);
            iDatasheetService.updateIsDeletedStatus(userId, nodeIds, true);
            Collection<String> subNodeIds = CollUtil.disjunction(nodeIds, idList);
            if (!subNodeIds.isEmpty()) {
                boolean flag =
                    SqlHelper.retBool(nodeMapper.updateIsRubbishByNodeIdIn(userId,
                        subNodeIds, true));
                ExceptionUtil.isTrue(flag, DatabaseException.DELETE_ERROR);
            }
            // disable node sharing
            nodeShareSettingMapper.disableByNodeIds(nodeIds);
            // delete the spatial attachment resource of the node
            iSpaceAssetService.updateIsDeletedByNodeIds(nodeIds, true);
        }
        for (NodeEntity node : nodes) {
            Lock lock = redisLockRegistry.obtain(node.getParentId());
            try {
                if (lock.tryLock(2, TimeUnit.MINUTES)) {
                    String nodeId = node.getNodeId();
                    // The previous node corresponding to the updated node
                    // (Large datasheet processing takes a long time,
                    // node.getPreNodeId() may have changed,
                    // so updatePreNodeIdBySelf is not used directly)
                    nodeMapper.updatePreNodeIdByJoinSelf(nodeId, node.getParentId());
                    // Save the path of the deletion.
                    // Specify that the deleted node is attached to the parent node -1.
                    String delPath = MapUtil.isNotEmpty(parentIdToPathMap)
                        ? parentIdToPathMap.get(node.getParentId()) : null;
                    nodeMapper.updateDeletedPathByNodeId(userId, nodeId, delPath);
                    // publish space audit events
                    ClientOriginInfo clientOriginInfo = InformationUtil
                        .getClientOriginInfoInCurrentHttpContext(true, false);
                    AuditSpaceArg arg = AuditSpaceArg.builder()
                        .action(AuditSpaceAction.DELETE_NODE)
                        .userId(userId)
                        .nodeId(nodeId)
                        .requestIp(clientOriginInfo.getIp())
                        .requestUserAgent(clientOriginInfo.getUserAgent())
                        .build();
                    SpringContextHolder.getApplicationContext()
                        .publishEvent(new AuditSpaceEvent(this, arg));
                } else {
                    throw new BusinessException("Frequent operations");
                }
            } catch (InterruptedException e) {
                throw new BusinessException("Frequent operations");
            } finally {
                lock.unlock();
            }
        }
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void delTemplateRefNode(Long userId, String nodeId) {
        log.info("Delete template mapping node ");
        // Obtain the node ID of the node and its child descendants.
        List<String> nodeIds = this.getNodeIdsInNodeTree(nodeId, -1);
        if (CollUtil.isEmpty(nodeIds)) {
            return;
        }
        // delete node and datasheet information
        boolean flag =
            SqlHelper.retBool(nodeMapper.updateIsRubbishByNodeIdIn(userId, nodeIds, true));
        ExceptionUtil.isTrue(flag, DatabaseException.DELETE_ERROR);
        iDatasheetService.updateIsDeletedStatus(userId, nodeIds, true);
        // delete the spatial attachment resource of the node
        iSpaceAssetService.updateIsDeletedByNodeIds(nodeIds, true);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public NodeCopyEffectDTO copy(Long userId, NodeCopyOpRo opRo) {
        log.info("Copy node ");
        NodeEntity copyNode = this.getByNodeId(opRo.getNodeId());
        NodeType nodeType = NodeType.toEnum(copyNode.getType());
        // Restrict replication of root nodes and folders
        ExceptionUtil.isFalse(nodeType.equals(NodeType.ROOT), NodeException.NOT_ALLOW);
        ExceptionUtil.isFalse(nodeType.equals(NodeType.FOLDER),
            NodeException.NODE_COPY_FOLDER_ERROR);
        // Verify that the number of nodes reaches the upper limit
        // iSubscriptionService.checkSheetNums(copyNode.getSpaceId(), 1);

        Map<String, Object> param = new HashMap<>(1);
        param.put("file_name", copyNode.getNodeName());
        String nodeName = StringUtil.format(I18nStringsUtil.t("default_file_copy"), param);

        String name =
            duplicateNameModify(copyNode.getParentId(), copyNode.getType(), nodeName, null);
        CreateNodeDto createNodeDto = CreateNodeDto.builder()
            .spaceId(copyNode.getSpaceId())
            .parentId(copyNode.getParentId())
            .nodeName(name)
            .type(copyNode.getType())
            .preNodeId(opRo.getNodeId())
            .newNodeId(IdUtil.createNodeId(copyNode.getType()))
            .icon(copyNode.getIcon())
            .cover(copyNode.getCover())
            .extra(copyNode.getExtra())
            .build();
        // Update the former node of the latter node to the copied node (A <- B => A <- A' <- B)
        nodeMapper.updatePreNodeIdBySelf(createNodeDto.getNewNodeId(), opRo.getNodeId(),
            copyNode.getParentId());
        // save node
        String copyNodeId = createChildNode(userId, createNodeDto);
        // component node id map
        Map<String, String> newNodeMap = new HashMap<>(1);
        newNodeMap.put(copyNode.getNodeId(), copyNodeId);
        NodeCopyEffectDTO copyEffect =
            NodeCopyEffectDTO.builder().nodeId(opRo.getNodeId()).copyNodeId(copyNodeId).build();
        // different types of node processing
        switch (nodeType) {
            case FORM:
                // copy form
                iNodeRelService.copy(userId, opRo.getNodeId(), copyNodeId);
                iResourceMetaService.copyBatch(userId, Collections.singletonList(opRo.getNodeId()),
                    newNodeMap);
                iSpaceAssetService.copyBatch(newNodeMap, copyNode.getSpaceId());
                return copyEffect;
            case DASHBOARD:
                // copy dashboard
                iResourceMetaService.copyResourceMeta(userId, copyNode.getSpaceId(),
                    opRo.getNodeId(), copyNodeId, ResourceType.DASHBOARD);
                return copyEffect;
            case MIRROR:
                // copy mirror
                iNodeRelService.copy(userId, opRo.getNodeId(), copyNodeId);
                iResourceMetaService.copyResourceMeta(userId, copyNode.getSpaceId(),
                    opRo.getNodeId(), copyNodeId, ResourceType.MIRROR);
                return copyEffect;
            default:
                break;
        }
        // Copy the corresponding datasheet, meta, and record.
        boolean copyData = BooleanUtil.isTrue(opRo.getData());
        NodeCopyOptions options = NodeCopyOptions.create(copyData, true);
        // get permissions for all fields in a datasheet
        Long memberId = memberMapper.selectIdByUserIdAndSpaceId(userId, copyNode.getSpaceId());
        Map<String, FieldPermissionInfo> fieldPermissionMap =
            iFieldRoleService.getFieldPermissionMap(memberId, copyNode.getNodeId(), null);
        if (MapUtil.isNotEmpty(fieldPermissionMap)) {
            // filter fields without field permissions
            List<String> fieldIds = fieldPermissionMap.entrySet().stream()
                .filter(entry -> !Boolean.TRUE.equals(entry.getValue().getHasRole()))
                .map(Entry::getKey).collect(Collectors.toList());
            if (!fieldIds.isEmpty()) {
                Map<String, List<String>> dstPermissionFieldsMap = new HashMap<>(1);
                dstPermissionFieldsMap.put(copyNode.getNodeId(), fieldIds);
                options.setDstPermissionFieldsMap(dstPermissionFieldsMap);
                options.setFilterPermissionField(true);
            }
        }
        List<String> linkFieldIds =
            iDatasheetService.copy(userId, copyNode.getSpaceId(), copyNode.getNodeId(),
                createNodeDto.getNewNodeId(), createNodeDto.getNodeName(), options, newNodeMap);
        if (copyData) {
            // When you select to copy data,
            // copy the spatial attachment resources referenced by the node at the same time.
            iSpaceAssetService.copyBatch(newNodeMap, copyNode.getSpaceId());
        }
        // copy node description
        iNodeDescService.copyBatch(newNodeMap);
        copyEffect.setLinkFieldIds(linkFieldIds);
        return copyEffect;
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public String copyNodeToSpace(Long userId, String spaceId, String destParentId,
                                  String sourceNodeId, NodeCopyOptions options) {
        log.info("Copy node to space ");
        // No parent node is specified, take the root node as the parent node
        if (StrUtil.isBlank(destParentId)) {
            destParentId = nodeMapper.selectRootNodeIdBySpaceId(spaceId);
        }
        Lock lock = redisLockRegistry.obtain(destParentId);
        try {
            if (lock.tryLock(2, TimeUnit.MINUTES)) {
                return this.saveDumpedNode(userId, spaceId, destParentId, sourceNodeId, options);
            } else {
                throw new BusinessException("Frequent operations");
            }
        } catch (InterruptedException e) {
            throw new BusinessException("Frequent operations");
        } finally {
            lock.unlock();
        }
    }

    private String saveDumpedNode(Long userId, String spaceId, String destParentId,
        String sourceNodeId, NodeCopyOptions options) {
        NodeEntity shareNode = nodeMapper.selectByNodeId(sourceNodeId);
        String name = StrUtil.isNotBlank(options.getNodeName())
            ? options.getNodeName() : shareNode.getNodeName();
        String toSaveNodeId = StrUtil.isNotBlank(options.getNodeId())
            ? options.getNodeId() : IdUtil.createNodeId(shareNode.getType());
        if (!options.isTemplate()) {
            // check for the same name
            name = duplicateNameModify(destParentId, shareNode.getType(), name, null);
            // update the original first node, and move the position one bit later,
            // that is, the pre-node is the shared node that is transferred.
            nodeMapper.updatePreNodeIdBySelf(toSaveNodeId, null, destParentId);
        }

        // component node id map
        Map<String, String> newNodeMap = CollUtil.newHashMap();
        newNodeMap.put(sourceNodeId, toSaveNodeId);
        NodeType nodeType = NodeType.toEnum(shareNode.getType());
        switch (nodeType) {
            case ROOT:
                throw new BusinessException(NodeException.NOT_ALLOW);
            case FOLDER:
                this.copyFolderProcess(userId, spaceId, shareNode.getSpaceId(),
                    sourceNodeId, newNodeMap, options);
                break;
            case DATASHEET:
                // if (options.isVerifyNodeCount()) {
                //     // Verify that the number of nodes reaches the upper limit
                //     // iSubscriptionService.checkSheetNums(spaceId, 1);
                // }
                if (options.isFilterPermissionField()) {
                    // Obtain the field that has the permission to enable the column.
                    List<String> permissionFieldIds =
                        iFieldRoleService.getPermissionFieldIds(sourceNodeId);
                    if (!permissionFieldIds.isEmpty()) {
                        Map<String, List<String>> dstPermissionFieldsMap = new HashMap<>(1);
                        dstPermissionFieldsMap.put(sourceNodeId, permissionFieldIds);
                        options.setDstPermissionFieldsMap(dstPermissionFieldsMap);
                    }
                }
                // copy table data
                iDatasheetService.copy(userId, spaceId, sourceNodeId,
                    toSaveNodeId, name, options, newNodeMap);
                break;
            case FORM:
            case DASHBOARD:
            case MIRROR:
                throw new BusinessException(NodeException.SHARE_NODE_STORE_FAIL);
            default:
                break;
        }
        NodeEntity toSaveNode = new NodeEntity();
        toSaveNode.setNodeId(toSaveNodeId);
        toSaveNode.setNodeName(name);
        toSaveNode.setCover(shareNode.getCover());
        toSaveNode.setParentId(destParentId);
        toSaveNode.setSpaceId(spaceId);
        toSaveNode.setType(shareNode.getType());
        toSaveNode.setIcon(shareNode.getIcon());
        toSaveNode.setIsTemplate(options.isTemplate());
        JSONObject extraObj = JSONUtil.parseObj(shareNode.getExtra());
        if (StrUtil.isNotBlank(options.getSourceTemplateId())) {
            extraObj.set(NodeExtraConstants.SOURCE_TEMPLATE_ID, options.getSourceTemplateId());
            // The save cache is used to display tips on the client side.
            redisTemplate.opsForValue().set(getTemplateQuoteKey(spaceId, toSaveNodeId),
                options.getSourceTemplateId(), 2, TimeUnit.MINUTES);
        } else {
            extraObj.remove(NodeExtraConstants.SOURCE_TEMPLATE_ID);
        }
        if (StrUtil.isNotBlank(options.getDingTalkDaTemplateKey())) {
            extraObj.set(NodeExtraConstants.DING_TALK_DA_STATUS, 1);
            extraObj.set(NodeExtraConstants.DING_TALK_DA_TEMPLATE_KEY,
                options.getDingTalkDaTemplateKey());
        } else {
            // In order to prevent others from transferring share DingTalk to build a template
            extraObj.remove(NodeExtraConstants.DING_TALK_DA_STATUS);
            extraObj.remove(NodeExtraConstants.DING_TALK_DA_TEMPLATE_KEY);
        }
        toSaveNode.setExtra(JSONUtil.toJsonStr(extraObj));
        toSaveNode.setCreatedBy(userId);
        toSaveNode.setUpdatedBy(userId);
        this.save(toSaveNode);
        // description of batch replication nodes
        iNodeDescService.copyBatch(newNodeMap);
        // Batch copy of spatial attachment resources referenced by nodes
        if (ObjectUtil.isNotNull(options) && options.isCopyData()) {
            iSpaceAssetService.copyBatch(newNodeMap, spaceId);
        }
        return toSaveNodeId;
    }

    private void copyFolderProcess(Long userId, String spaceId, String originSpaceId,
                                   String folderId,
                                   Map<String, String> newNodeMap, NodeCopyOptions options) {
        List<NodeShareTree> subTrees = this.getSubNodes(folderId);
        if (CollUtil.isEmpty(subTrees)) {
            return;
        }
        // grouping by node type
        Map<Integer, List<NodeShareTree>> nodeTypeToNodeIdsMap = subTrees.stream()
            .collect(Collectors.groupingBy(NodeShareTree::getType));
        // set of node ids to be filtered
        List<String> filterNodeIds =
            CollUtil.isEmpty(options.getFilterNodeIds()) ? new ArrayList<>()
                : options.getFilterNodeIds();
        // Collect tables and image preprocessing, and filter the parts that are skipped.
        this.processNodeHasSourceDatasheet(NodeType.FORM.getNodeType(), filterNodeIds,
            nodeTypeToNodeIdsMap);
        this.processNodeHasSourceDatasheet(NodeType.MIRROR.getNodeType(), filterNodeIds,
            nodeTypeToNodeIdsMap);

        // Verify that the number of nodes reaches the upper limit
        // if (options.isVerifyNodeCount()) {
        //     int subCount;
        //     if (nodeTypeToNodeIdsMap.containsKey(NodeType.FOLDER.getNodeType())) {
        //         List<String> fodIds = nodeTypeToNodeIdsMap.get(NodeType.FOLDER.getNodeType())
        //         .stream().map(NodeShareTree::getNodeId).collect(Collectors.toList());
        //         // Take out the double union to avoid some folders already in the filtered list.
        //         subCount = CollUtil.unionDistinct(fodIds, filterNodeIds).size();
        //     }
        //     else {
        //         subCount = filterNodeIds.size();
        //     }
        //     if (subTrees.size() > subCount) {
        //         iSubscriptionService.checkSheetNums(spaceId, subTrees.size() - subCount);
        //     }
        // }
        // Original node-> front node MAP
        Map<String, String> originNodeToPreNodeMap = new HashMap<>(subTrees.size());
        subTrees.forEach(sub -> {
            originNodeToPreNodeMap.put(sub.getNodeId(), sub.getPreNodeId());
            // Supplement the ID mapping relationship between the original node and the new node
            if (!filterNodeIds.contains(sub.getNodeId())) {
                newNodeMap.put(sub.getNodeId(), IdUtil.createNodeId(sub.getType()));
            }
        });
        List<NodeEntity> storeEntities = new ArrayList<>();
        for (NodeShareTree shareTree : subTrees) {
            if (filterNodeIds.contains(shareTree.getNodeId())) {
                continue;
            }
            NodeEntity node = new NodeEntity();
            node.setId(IdWorker.getId());
            node.setSpaceId(spaceId);
            node.setParentId(newNodeMap.get(shareTree.getParentId()));
            node.setNodeId(newNodeMap.get(shareTree.getNodeId()));
            node.setNodeName(shareTree.getNodeName());
            if (shareTree.getPreNodeId() != null) {
                // The original pre-node ID, if it is in the filter column,
                // recursively until the transferred node is found or ends in the first place.
                String preNodeId = shareTree.getPreNodeId();
                while (preNodeId != null && filterNodeIds.contains(preNodeId)) {
                    preNodeId = originNodeToPreNodeMap.get(preNodeId);
                }
                node.setPreNodeId(newNodeMap.get(preNodeId));
            }
            node.setType(shareTree.getType());
            node.setIcon(shareTree.getIcon());
            node.setCover(shareTree.getCover());
            node.setExtra(shareTree.getExtra());
            node.setIsTemplate(options.isTemplate());
            node.setCreatedBy(userId);
            node.setUpdatedBy(userId);
            storeEntities.add(node);
        }
        if (storeEntities.size() == 0) {
            return;
        }
        boolean flag = SqlHelper.retBool(nodeMapper.insertBatch(storeEntities));
        ExceptionUtil.isTrue(flag, NodeException.SHARE_NODE_STORE_FAIL);
        // Copy datasheet processing
        if (nodeTypeToNodeIdsMap.containsKey(NodeType.DATASHEET.getNodeType())) {
            if (options.isFilterPermissionField()) {
                // Obtain the datasheet and the field set of the corresponding column permission
                Map<String, List<String>> dstPermissionFieldsMap = new HashMap<>(16);
                nodeTypeToNodeIdsMap.get(NodeType.DATASHEET.getNodeType()).stream()
                    .filter(subNode -> !filterNodeIds.contains(subNode.getNodeId()))
                    .forEach(subNode -> {
                        List<String> permissionFieldIds =
                            iFieldRoleService.getPermissionFieldIds(subNode.getNodeId());
                        if (!permissionFieldIds.isEmpty()) {
                            dstPermissionFieldsMap.put(subNode.getNodeId(), permissionFieldIds);
                        }
                    });
                options.setDstPermissionFieldsMap(dstPermissionFieldsMap);
            }
            for (NodeShareTree subNode : nodeTypeToNodeIdsMap.get(
                NodeType.DATASHEET.getNodeType())) {
                if (filterNodeIds.contains(subNode.getNodeId())) {
                    continue;
                }
                iDatasheetService.copy(userId, spaceId, subNode.getNodeId(),
                    newNodeMap.get(subNode.getNodeId()), subNode.getNodeName(), options,
                    newNodeMap);
            }
        }
        // Copy form processing
        if (nodeTypeToNodeIdsMap.containsKey(NodeType.FORM.getNodeType())) {
            List<String> formIds = nodeTypeToNodeIdsMap.get(NodeType.FORM.getNodeType()).stream()
                .map(NodeShareTree::getNodeId)
                .filter(nodeId -> !filterNodeIds.contains(nodeId)).collect(Collectors.toList());
            if (CollUtil.isNotEmpty(formIds)) {
                iNodeRelService.copyBatch(userId, formIds, newNodeMap);
                iResourceMetaService.copyBatch(userId, formIds, newNodeMap);
            }
        }
        // Copy dashboard processing
        if (nodeTypeToNodeIdsMap.containsKey(NodeType.DASHBOARD.getNodeType())) {
            List<String> dashboardIds =
                nodeTypeToNodeIdsMap.get(NodeType.DASHBOARD.getNodeType()).stream()
                    .map(NodeShareTree::getNodeId)
                    .filter(nodeId -> !filterNodeIds.contains(nodeId))
                    .collect(Collectors.toList());
            if (CollUtil.isNotEmpty(dashboardIds)) {
                iResourceMetaService.batchCopyResourceMeta(userId, spaceId, dashboardIds,
                    newNodeMap, ResourceType.DASHBOARD);
            }
        }
        // Copy mirror processing
        if (nodeTypeToNodeIdsMap.containsKey(NodeType.MIRROR.getNodeType())) {
            List<String> mirrorIds =
                nodeTypeToNodeIdsMap.get(NodeType.MIRROR.getNodeType()).stream()
                    .map(NodeShareTree::getNodeId)
                    .filter(nodeId -> !filterNodeIds.contains(nodeId)).collect(Collectors.toList());
            if (CollUtil.isNotEmpty(mirrorIds)) {
                iNodeRelService.copyBatch(userId, mirrorIds, newNodeMap);
                iResourceMetaService.batchCopyResourceMeta(userId, spaceId, mirrorIds, newNodeMap,
                    ResourceType.MIRROR);
            }
        }
    }

    /**
     * process node hash source.
     *
     * @param nodeType             node type
     * @param filterNodeIds        node ids
     * @param nodeTypeToNodeIdsMap map of node id with type
     */
    public void processNodeHasSourceDatasheet(Integer nodeType, List<String> filterNodeIds,
                                              Map<Integer, List<NodeShareTree>> nodeTypeToNodeIdsMap) {
        if (!nodeTypeToNodeIdsMap.containsKey(nodeType)) {
            return;
        }
        List<String> allFormIds = nodeTypeToNodeIdsMap.get(nodeType).stream()
            .map(NodeShareTree::getNodeId).collect(Collectors.toList());
        // Take the difference set of all form images and filter nodes
        List<String> nodeIds = CollUtil.subtractToList(allFormIds, filterNodeIds);
        // If the difference set is empty, all form images have been filtered.
        if (CollUtil.isEmpty(nodeIds)) {
            nodeTypeToNodeIdsMap.remove(nodeType);
            return;
        }
        // If numerous tables in the file are transferred,
        // all the collected datasheet images are skipped for transfer.
        if (!nodeTypeToNodeIdsMap.containsKey(NodeType.DATASHEET.getNodeType())) {
            filterNodeIds.addAll(nodeIds);
            return;
        }
        List<String> dstIds = nodeTypeToNodeIdsMap.get(NodeType.DATASHEET.getNodeType()).stream()
            .map(NodeShareTree::getNodeId).collect(Collectors.toList());
        // All the datasheets are in the filter list. Similarly,
        // all the images of the forms are skipped for transfer.
        if (CollUtil.containsAll(filterNodeIds, dstIds)) {
            filterNodeIds.addAll(nodeIds);
            nodeTypeToNodeIdsMap.remove(NodeType.DATASHEET.getNodeType());
            return;
        }
        // Obtain the collected datasheet image and the mapped datasheet MAP.
        Map<String, String> nodeIdToSourceDatasheetIdMap =
            iNodeRelService.getRelNodeToMainNodeMap(nodeIds);
        for (String nodeId : nodeIds) {
            String datasheet = nodeIdToSourceDatasheetIdMap.get(nodeId);
            // The mapped datasheet is in the filter column or not in the dump file,
            // and the form image skips the dump.
            if (filterNodeIds.contains(datasheet) || !dstIds.contains(datasheet)) {
                filterNodeIds.add(nodeId);
            }
        }
    }

    @Override
    public String importExcel(Long userId, String spaceId, ImportExcelOpRo opRo)
        throws IOException {
        log.info("Import new node ");
        // Verify that the number of nodes reaches the upper limit
        // iSubscriptionService.checkSheetNums(spaceId, 1);
        MultipartFile file = opRo.getFile();
        ExceptionUtil.isNotNull(file, ActionException.FILE_EMPTY);
        ExceptionUtil.isNotBlank(file.getOriginalFilename(), ActionException.FILE_EMPTY);
        ExceptionUtil.isTrue(file.getSize() <= limitProperties.getMaxFileSize(),
            ActionException.FILE_EXCEED_LIMIT);
        // fileName
        String mainName = cn.hutool.core.io.FileUtil.mainName(file.getOriginalFilename());
        if (StrUtil.isBlank(mainName)) {
            throw new BusinessException("File name is empty ");
        }
        int nodeType = NodeType.DATASHEET.getNodeType();
        mainName =
            duplicateNameModify(opRo.getParentId(), nodeType, mainName, null);
        // file type suffix
        String fileSuffix = cn.hutool.core.io.FileUtil.extName(file.getOriginalFilename());
        if (StrUtil.isBlank(fileSuffix)) {
            throw new BusinessException("File name is empty ");
        }
        // When importing a node, the uploaded file is in CSV format.
        if (fileSuffix.equals(FileSuffixConstants.CSV)) {
            // identification file code
            String charset = FileTool.identifyCoding(file.getInputStream());
            Iterable<CSVRecord> csvRecords = CSVFormat.DEFAULT.withNullString("").parse(
                new InputStreamReader(file.getInputStream(), charset)
            );
            List<List<Object>> readAll = new ArrayList<>();
            for (CSVRecord csvRecord : csvRecords) {
                // create csv row to store data per row
                List<Object> csvRow = new ArrayList<>();
                for (int i = 0; i < csvRecord.size(); i++) {
                    String value = csvRecord.get(i);
                    if (StrUtil.isBlank(value)) {
                        csvRow.add("");
                    } else {
                        csvRow.add(value);
                    }
                }
                readAll.add(csvRow);
            }
            return this.processExcel(readAll, opRo.getParentId(), spaceId, userId, mainName);
        }
        // When importing a node, the uploaded file is in XLS or XLSX format.
        if (fileSuffix.equals(FileSuffixConstants.XLS)
            || fileSuffix.equals(FileSuffixConstants.XLSX)) {
            ExcelReader excelReader = null;
            try {
                // ExcelListener (cannot be handed over to spring container management)
                ExcelSheetsDataListener sheetsDataListener = new ExcelSheetsDataListener();
                excelReader =
                    EasyExcel.read(file.getInputStream(), null, sheetsDataListener).build();
                List<ReadSheet> readSheets = excelReader.excelExecutor().sheetList();
                // If there is a WPS hidden table, the removal will not be processed.
                String wps = "WpsReserved_CellImgList";
                readSheets.removeIf(readSheet -> wps.equals(readSheet.getSheetName()));
                // Excel contains only one worksheet
                if (readSheets.size() == 1) {
                    List<List<Object>> read =
                        this.importSingleSheetByEasyExcel(excelReader, sheetsDataListener,
                            readSheets.get(0));
                    return this.processExcel(read, opRo.getParentId(), spaceId, userId, mainName);
                }
                // Excel contains multiple worksheets
                Map<String, List<List<Object>>> readAll =
                    this.importMultipleSheetsByEasyExcel(excelReader, sheetsDataListener,
                        readSheets);
                return this.processExcels(readAll, opRo.getParentId(), spaceId, userId, mainName);
            } catch (EncryptedDocumentException e) {
                throw new BusinessException(ActionException.FILE_HAS_PASSWORD);
            } finally {
                if (Objects.nonNull(excelReader)) {
                    excelReader.finish();
                }
            }
        } else {
            throw new BusinessException(ActionException.FILE_ERROR_FORMAT);
        }
    }

    @Override
    public Map<String, List<List<Object>>> importMultipleSheetsByEasyExcel(ExcelReader excelReader,
                                                                           ExcelSheetsDataListener sheetsDataListener,
                                                                           List<ReadSheet> readSheets) {
        Map<String, List<List<Object>>> readAll = new LinkedHashMap<>(readSheets.size());
        // inverse Excel Sheet
        Collections.reverse(readSheets);
        for (ReadSheet readSheet : readSheets) {
            // read by worksheet
            excelReader.read(readSheet);
            // read header
            List<Object> sheetHeader = sheetsDataListener.getSheetHeader();
            // read table data
            List<List<Object>> sheetsData = sheetsDataListener.getSheetData();
            List<List<Object>> assembleData = new ArrayList<>();
            // assemble header and table data
            if (CollectionUtil.isNotEmpty(sheetHeader)) {
                assembleData.add(sheetHeader);
            }
            if (CollectionUtil.isNotEmpty(sheetsData)) {
                assembleData.addAll(sheetsData);
            }
            readAll.put(readSheet.getSheetName(), assembleData);
            // Empty the header and table objects in the listener and read the next worksheet.
            sheetsDataListener.setSheetHeader(new ArrayList<>());
            sheetsDataListener.setSheetData(new ArrayList<>());
        }
        return readAll;
    }

    @Override
    public List<List<Object>> importSingleSheetByEasyExcel(ExcelReader excelReader,
                                                           ExcelSheetsDataListener sheetsDataListener,
                                                           ReadSheet readSheet) {
        excelReader.read(readSheet);
        List<Object> sheetHeader = sheetsDataListener.getSheetHeader();
        List<List<Object>> sheetData = sheetsDataListener.getSheetData();
        List<List<Object>> assembleData = new ArrayList<>();
        if (CollectionUtil.isNotEmpty(sheetHeader)) {
            assembleData.add(sheetHeader);
        }
        if (CollectionUtil.isNotEmpty(sheetData)) {
            assembleData.addAll(sheetData);
        }
        return assembleData;
    }

    @Override
    public void updateNodeBanStatus(String nodeId, Integer status) {
        log.info("Ban or unban nodes ");
        boolean flag = SqlHelper.retBool(nodeMapper.updateNodeBanStatus(nodeId, status));
        ExceptionUtil.isTrue(flag, DatabaseException.EDIT_ERROR);
    }

    /**
     * processing excel data.
     */
    private String processExcel(List<List<Object>> readAll, String parentId, String spaceId,
                                Long userId, String name) {
        Long memberId = userSpaceCacheService.getMemberId(userId, spaceId);
        checkEnableOperateNodeBySpaceFeature(memberId, spaceId, parentId);
        // long maxRowLimit = iSubscriptionService.getPlanMaxRows(spaceId);
        // ExceptionUtil.isTrue(readAll != null && readAll.size() <= maxRowLimit + 1,
        // SubscribeFunctionException.ROW_LIMIT);
        // If the table is empty, create an initialization table
        if (readAll.size() == 0) {
            return this.createNode(userId, spaceId, NodeOpRo.builder()
                .type(NodeType.DATASHEET.getNodeType())
                .parentId(parentId)
                .nodeName(name)
                .build());
        } else {
            boolean first = true;
            JSONObject recordMap = JSONUtil.createObj();
            JSONObject fieldMap = JSONUtil.createObj();
            ViewMapRo viewMapRo = new ViewMapRo();
            JSONArray columns = JSONUtil.createArray();
            JSONArray rows = JSONUtil.createArray();
            List<String> fieldIds = null;
            List<String> fldNameList = new ArrayList<>();
            // Traverse row, first row as field attribute
            for (List<Object> list : readAll) {
                // Handling Empty Character Columns at the End Caused by excel Format Problems
                if (ObjectUtil.isNull(CollUtil.getLast(list)) || CollUtil.getLast(list) == "") {
                    int i;
                    for (i = list.size() - 1; i >= 0; i--) {
                        if (ObjectUtil.isNotNull(list.get(i)) && list.get(i) != "") {
                            break;
                        }
                    }
                    list = CollUtil.sub(list, 0, i + 1);
                }
                ExceptionUtil.isTrue(list.size() <= limitProperties.getMaxColumnCount(),
                    ActionException.COLUMN_EXCEED_LIMIT);
                if (first) {
                    fieldIds = new ArrayList<>(list.size());
                    first = false;
                    int i = 1;
                    for (Object fieldName : list) {
                        this.addField(fieldIds, columns, fieldMap,
                            null == fieldName ? null : fieldName.toString(), i, fldNameList);
                        i++;
                    }
                    viewMapRo = ViewMapRo.builder()
                        .id(IdUtil.createViewId())
                        .name(I18nStringsUtil.t("default_view"))
                        .type(ViewType.GRID.getType())
                        .columns(columns)
                        .frozenColumnCount(1)
                        .build();
                    if (readAll.size() == 1) {
                        // Only one line acts as a field condition and fills a blank line.
                        this.addRecord(recordMap, rows, null, null, null, null, null, fldNameList);
                    }
                } else {
                    // processing record
                    this.addRecord(recordMap, rows, list, fieldIds, columns, fieldMap, viewMapRo,
                        fldNameList);
                }
            }
            viewMapRo.setRows(rows);
            JSONArray views = JSONUtil.createArray();
            views.add(viewMapRo);
            MetaMapRo metaMapRo = MetaMapRo.builder().fieldMap(fieldMap).views(views).build();
            String nodeId = IdUtil.createDstId();
            // Change the pre-node ID of the original first node to the imported node ID
            nodeMapper.updatePreNodeIdBySelf(nodeId, null, parentId);
            // create node datasheet
            this.createChildNode(userId, CreateNodeDto.builder()
                .spaceId(spaceId)
                .parentId(parentId)
                .nodeName(name)
                .newNodeId(nodeId)
                .type(NodeType.DATASHEET.getNodeType()).build());
            iDatasheetService.create(userId, spaceId, nodeId, name, metaMapRo, recordMap);
            return nodeId;
        }
    }

    /**
     * add records.
     */
    private void addRecord(JSONObject recordMap, JSONArray rows, List<Object> list,
                           List<String> fieldIds, JSONArray columns, JSONObject fieldMap,
                           ViewMapRo viewMapRo, List<String> fldNameList) {
        String recordId = IdUtil.createRecordId();
        JSONObject recordJson = JSONUtil.createObj();
        recordJson.set("recordId", recordId);
        rows.add(recordJson);
        JSONObject data = JSONUtil.createObj();
        if (CollUtil.isNotEmpty(list)) {
            int i = 0;
            for (Object text : list) {
                if (i >= fieldIds.size()) {
                    // The number of columns exceeds the first row list, fill the field
                    this.addField(fieldIds, columns, fieldMap, null, i + 1, fldNameList);
                    viewMapRo.setColumns(columns);
                }
                if (ObjectUtil.isNotNull(text) && text != "") {
                    JSONArray filedArray = JSONUtil.createArray();
                    filedArray.add(RecordDataRo.builder().text(text.toString())
                        .type(FieldType.TEXT.getFieldType()).build());
                    data.set(fieldIds.get(i), filedArray);
                }
                i++;
            }
        }
        recordMap.set(recordId, RecordMapRo.builder().id(recordId).data(data).build());
    }

    /**
     * add field.
     */
    private void addField(List<String> fieldIds, JSONArray columns, JSONObject fieldMap,
                          String fieldName, int i, List<String> fldNameList) {
        String fieldId = IdUtil.createFieldId();
        fieldIds.add(fieldId);
        JSONObject fieldJson = JSONUtil.createObj();
        fieldJson.set("fieldId", fieldId);
        if (i == 1) {
            // Add the total number of statistical records in the first column
            fieldJson.set("statType", 1);
        }
        columns.add(fieldJson);
        if (StrUtil.isBlank(fieldName)) {
            fieldName = "Field " + i;
        }
        // ensure that the field name is unique
        int j = 2;
        String name = fieldName;
        while (fldNameList.contains(fieldName)) {
            fieldName = name.concat(" " + j);
            j++;
        }
        fldNameList.add(fieldName);
        fieldMap.set(fieldId, FieldMapRo.builder()
            .id(fieldId)
            .name(fieldName)
            .type(FieldType.TEXT.getFieldType()).build());
    }

    /**
     * duplicate name modification.
     */
    @Override
    public String duplicateNameModify(String parentId, int nodeType, String nodeName,
                                      String nodeId) {
        List<String> nameList = nodeMapper.selectNameList(parentId, nodeType, nodeId);
        int i = 2;
        String name = nodeName;
        while (nameList.contains(name)) {
            name = nodeName.concat(" " + i);
            i++;
        }
        return name;
    }

    @Override
    public List<String> checkSubNodePermission(Long memberId, String nodeId, ControlRole role) {
        boolean hasChildren = nodeMapper.selectHasChildren(nodeId);
        if (!hasChildren) {
            return null;
        }
        // Check the node permissions of all children and descendants
        List<String> subNodeIds = this.getNodeIdsInNodeTree(nodeId, -1);
        subNodeIds.remove(nodeId);

        ControlRoleDict roleDict = controlTemplate.fetchNodeRole(memberId, subNodeIds);
        ExceptionUtil.isFalse(roleDict.isEmpty(),
            TemplateException.SUB_NODE_PERMISSION_INSUFFICIENT);
        List<String> filterNodeIds = roleDict.entrySet().stream()
            .filter(entry -> entry.getValue().isGreaterThanOrEqualTo(role))
            .map(Map.Entry::getKey).collect(Collectors.toList());
        ExceptionUtil.isTrue(subNodeIds.size() == filterNodeIds.size(),
            TemplateException.SUB_NODE_PERMISSION_INSUFFICIENT);
        return subNodeIds;
    }

    @Override
    public void nodeCopyChangeset(NodeCopyEffectDTO effect) {
        if (ObjectUtil.isNotEmpty(effect.getLinkFieldIds())) {
            LoginUserDto user = LoginContext.me().getLoginUser();
            NodeCopyRo nodeCopyRo = NodeCopyRo.newBuilder()
                .addAllFieldIds(effect.getLinkFieldIds())
                .setUserId(user.getUserId().toString())
                .setUuid(user.getUuid())
                .setCopyNodeId(effect.getCopyNodeId())
                .setNodeId(effect.getNodeId())
                .build();
            BasicResult result = grpcClientService.nodeCopyChangeset(nodeCopyRo);
            if (!result.getSuccess()) {
                log.error("Copy node error [{}]", result);
            }
            ExceptionUtil.isTrue(result.getSuccess(), NodeException.COPY_NODE_LINK__FIELD_ERROR);
        }

    }

    @Override
    public void nodeDeleteChangeset(List<String> nodeIds) {
        // If the associated datasheet of the deleted datasheet is not in the deleted column, the
        // corresponding associated column in the linked datasheet is converted to a text field.
        Map<String, List<String>> map = iDatasheetService.getForeignDstIds(nodeIds, true);
        if (MapUtil.isNotEmpty(map)) {
            List<String> linkNodeId =
                map.values().stream().flatMap(List::stream).distinct().collect(Collectors.toList());
            LoginUserDto user = LoginContext.me().getLoginUser();
            NodeDeleteRo nodeDeleteRo = NodeDeleteRo.newBuilder()
                .setUserId(user.getUserId().toString())
                .setUuid(user.getUuid())
                .addAllDeleteNodeId(map.keySet())
                .addAllLinkNodeId(linkNodeId).build();
            // Middle tier deletion failed to continue to delete nodes
            this.grpcClientService.nodeDeleteChangeset(nodeDeleteRo);
        }

    }

    /**
     * Create an association between a form and a mapping datasheet.
     */
    private void createNodeRel(Long userId, String nodeId, NodeRelRo extra) {
        NodeRelRo relExtra = new NodeRelRo(extra.getViewId());
        // create node association relationship
        iNodeRelService.create(userId, extra.getDatasheetId(), nodeId,
            JSONUtil.toJsonStr(relExtra));
    }

    private void createFileMeta(Long userId, String spaceId, String nodeId, Integer type,
                                String name, NodeRelRo nodeRel) {
        switch (NodeType.toEnum(type)) {
            case DATASHEET:
                String viewName = nodeRel != null
                    ? nodeRel.getViewName() : null;
                iDatasheetService.create(userId, spaceId, nodeId, name, viewName);
                break;
            case FORM:
                // create node association relationship
                this.createNodeRel(userId, nodeId, nodeRel);
                // create resource metadata
                String extra =
                    JSONUtil.createObj().set("title", name).set("fillAnonymous", true).toString();
                iResourceMetaService.create(userId, nodeId, ResourceType.FROM.getValue(), extra);
                break;
            case DASHBOARD:
                iResourceMetaService.create(userId, nodeId, ResourceType.DASHBOARD.getValue(),
                    JSONUtil.createObj().toString());
                break;
            case MIRROR:
                // create node association relationship
                this.createNodeRel(userId, nodeId, nodeRel);
                iResourceMetaService.create(userId, nodeId, ResourceType.MIRROR.getValue(),
                    JSONUtil.createObj().toString());
                break;
            default:
                break;
        }
    }

    /**
     * Check whether the pre-node exists under the specified parent node when it is non-empty.
     */
    private String verifyPreNodeId(String preNodeId, String parentId) {
        if (StrUtil.isBlank(preNodeId)) {
            return null;
        } else {
            String id = nodeMapper.selectParentIdByNodeId(preNodeId);
            ExceptionUtil.isTrue(parentId.equals(id), PermissionException.NODE_ACCESS_DENIED);
            return preNodeId;
        }
    }

    /**
     * operate multiple excel sheet.
     *
     * @param readAll  all records
     * @param parentId parent node id
     * @param spaceId  space id
     * @param userId   user id
     * @param name     node name
     * @return node id
     */
    private String processExcels(Map<String, List<List<Object>>> readAll, String parentId,
                                 String spaceId, Long userId, String name) {
        String nodeId = this.createNode(userId, spaceId, NodeOpRo.builder()
            .type(NodeType.FOLDER.getNodeType())
            .parentId(parentId)
            .nodeName(name)
            .build());
        readAll.forEach(
            (sheetName, read) -> processExcel(read, nodeId, spaceId, userId, sheetName));
        return nodeId;
    }

    /**
     * Get the superior path, split by "/", do not retain the root node.
     */
    private Map<String, String> getSuperiorPathByParentIds(List<String> parentIds) {
        // gets all parent nodes other than the non root node
        List<NodeBaseInfoDTO> parentNodes = this.getParentPathNodes(parentIds, false);
        if (CollUtil.isEmpty(parentNodes)) {
            return null;
        }
        Map<String, NodeBaseInfoDTO> nodeIdToInfoMap =
            parentNodes.stream().collect(Collectors.toMap(NodeBaseInfoDTO::getNodeId, dto -> dto));
        Map<String, String> nodeIdToPathMap = new HashMap<>(parentIds.size());
        for (String nodeId : parentIds) {
            if (nodeIdToPathMap.get(nodeId) != null) {
                continue;
            }
            // get the node name from bottom up
            List<String> pathList = new ArrayList<>();
            String node = nodeId;
            while (nodeIdToInfoMap.get(node) != null) {
                NodeBaseInfoDTO dto = nodeIdToInfoMap.get(node);
                pathList.add(dto.getNodeName());
                node = dto.getParentId();
            }
            if (CollUtil.isEmpty(pathList)) {
                continue;
            }
            // reverse output path
            String path = StrUtil.join(" / ", CollUtil.reverse(pathList));
            nodeIdToPathMap.put(nodeId, StrUtil.addPrefixIfNot(path, "/ "));
        }
        return nodeIdToPathMap;
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public String parseExcel(Long userId, String uuid, String spaceId,
        Long memberId, String parentNodeId, String viewName, String fileName,
        String fileSuffix, InputStream inputStream) {
        ExcelReader excelReader = null;
        MultiSheetReadListener readListener =
            new MultiSheetReadListener(this, userId, uuid, spaceId, memberId,
                parentNodeId, viewName, fileName);
        ExcelReaderBuilder readerBuilder;
        ExcelTypeEnum excelType = FileSuffixConstants.XLS.equals(fileSuffix)
            ? ExcelTypeEnum.XLS : ExcelTypeEnum.XLSX;
        try {
            readerBuilder = EasyExcel.read(inputStream)
                .excelType(excelType)
                .ignoreEmptyRow(false).autoTrim(false);
            excelReader = readerBuilder.registerReadListener(readListener).build();
            List<ReadSheet> readSheets = excelReader.excelExecutor().sheetList();
            excelReader.read(readSheets);
            return readListener.getRetNodeData().getNodeId();
        } finally {
            if (excelReader != null) {
                // Don't forget to close it here.
                // Temporary files will be created when reading, and the disk will collapse.
                excelReader.finish();
            }
        }
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public String parseCsv(Long userId, String uuid, String spaceId, Long memberId,
        String parentNodeId, String viewName, String fileName, InputStream inputStream) {
        ExcelReader excelReader = null;
        CsvReadListener readListener =
            new CsvReadListener(this, userId, uuid, spaceId, memberId,
                parentNodeId, viewName, fileName);
        try {
            excelReader = EasyExcel.read(inputStream)
                .excelType(ExcelTypeEnum.CSV)
                .registerReadListener(readListener)
                .build();
            excelReader.readAll();
            return readListener.getRetNodeId();
        } finally {
            if (excelReader != null) {
                // Don't forget to close it here.
                // Temporary files will be created when reading, and the disk will collapse.
                excelReader.finish();
            }
        }
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void batchCreateDataSheet(NodeData data, List<NodeEntity> nodeEntities,
                                     List<DatasheetEntity> datasheetEntities,
                                     List<DatasheetMetaEntity> metaEntities,
                                     List<DatasheetRecordEntity> recordEntities) {

        nodeMapper.updatePreNodeIdBySelf(data.getNodeId(), null, data.getParentId());

        nodeMapper.insertBatch(nodeEntities);

        iDatasheetService.batchSave(datasheetEntities);

        iDatasheetMetaService.batchSave(metaEntities);

        iDatasheetRecordService.batchSave(recordEntities);
    }

    @Override
    public void batchSaveDstRecords(List<DatasheetRecordEntity> recordEntities) {
        iDatasheetRecordService.batchSave(recordEntities);
    }

    @Override
    public NodeExtra getNodeExtras(String nodeId, String spaceId, String extras) {
        NodeExtra extraVo = new NodeExtra();
        if (StrUtil.isBlank(spaceId)) {
            spaceId = getSpaceIdByNodeId(nodeId);
        }
        if (StrUtil.isBlank(extras)) {
            extras = nodeMapper.selectExtraByNodeId(nodeId);
        }
        NodeExtraDTO nodeExtraDTO = JSONUtil.toBean(extras, NodeExtraDTO.class);
        SocialConnectInfo connectInfo = socialServiceFacade.getConnectInfo(spaceId);
        if (connectInfo != null && connectInfo.getAppId() != null) {
            if (connectInfo.isEnabled()) {
                String suiteKey =
                    socialServiceFacade.getSuiteKeyByDingtalkSuiteId(connectInfo.getAppId());
                if (suiteKey != null) {
                    extraVo.setDingTalkSuiteKey(suiteKey);
                    extraVo.setDingTalkDaStatus(nodeExtraDTO.getDingTalkDaStatus());
                    extraVo.setDingTalkCorpId(connectInfo.getTenantId());
                }
            }
        }
        if (StrUtil.isNotBlank(nodeExtraDTO.getSourceTemplateId())) {
            extraVo.setSourceTemplateId(nodeExtraDTO.getSourceTemplateId());
        }
        extraVo.setShowTips(
            Boolean.TRUE.equals(redisTemplate.hasKey(getTemplateQuoteKey(spaceId, nodeId))));
        return extraVo;
    }

    @Override
    public NodeInfoWindowVo getNodeWindowInfo(String nodeId) {
        NodeEntity node = getByNodeId(nodeId);
        // query node creator basic information
        MemberDTO memberDto =
            memberMapper.selectMemberDtoByUserIdAndSpaceId(node.getCreatedBy(), node.getSpaceId());
        // construct node information window objects
        MemberInfo memberInfo = MemberInfo.builder()
            .time(node.getCreatedAt())
            .build();
        if (memberDto != null) {
            memberInfo.setMemberName(memberDto.getMemberName());
            memberInfo.setAvatar(memberDto.getAvatar());
            memberInfo.setIsActive(memberDto.getIsActive());
            memberInfo.setIsDeleted(memberDto.getIsDeleted());
            memberInfo.setAvatarColor(memberDto.getColor());
            memberInfo.setNickName(memberDto.getNickName());
        }
        return NodeInfoWindowVo.builder()
            .nodeId(nodeId)
            .nodeName(node.getNodeName())
            .nodeType(node.getType())
            .icon(node.getIcon())
            .creator(memberInfo)
            .build();
    }

    @Override
    public NodeFromSpaceVo nodeFromSpace(String nodeId) {
        NodeFromSpaceVo result = new NodeFromSpaceVo();
        if (StrUtil.startWithIgnoreEquals(nodeId, IdRulePrefixEnum.SHARE.getIdRulePrefixEnum())) {
            // share id
            result.setSpaceId(nodeShareSettingMapper.selectSpaceIdByShareIdIncludeDeleted(nodeId));
        } else if (StrUtil.startWithIgnoreEquals(nodeId,
            IdRulePrefixEnum.WIDGET.getIdRulePrefixEnum())) {
            // widget id
            result.setSpaceId(iWidgetService.getSpaceIdByWidgetId(nodeId));
        } else {
            // all other condition query node id
            result.setSpaceId(this.getSpaceIdByNodeIdIncludeDeleted(nodeId));
        }
        result.setNodeId(nodeId);
        return result;
    }

    @Override
    public Optional<String> getNodeName(String nodeId, Long userId) {
        // 1. query the space id and node name of the node
        UrlNodeInfoDTO urlNodeInfo = nodeMapper.selectSpaceIdAndNodeNameByNodeId(nodeId);

        if (ObjectUtil.isNull(urlNodeInfo)) {
            return Optional.empty();
        }

        try {
            // 2. Query the member Id in the space based on the user id.
            // Gets the member ID by determining whether the user is in this space.
            Long memberId = LoginContext.me().getMemberId(userId, urlNodeInfo.getSpaceId());
            // 3. Query whether the user has permissions on the node in the corresponding space
            // according to the member id. check whether there is permission under the node
            controlTemplate.fetchNodeRole(memberId, nodeId);
            return Optional.ofNullable(urlNodeInfo.getNodeName());
        } catch (BusinessException ex) {
            return Optional.empty();
        }
    }


    @Override
    public void checkEnableOperateNodeBySpaceFeature(Long memberId, String spaceId, String nodeId) {
        Integer nodeType = nodeMapper.selectNodeTypeByNodeId(nodeId);
        // 1. whether the node is the root node
        if (NodeType.toEnum(nodeType) != NodeType.ROOT) {
            return;
        }
        checkEnableOperateRootNodeBySpaceFeature(memberId, spaceId);
    }

    @Override
    public void checkEnableOperateRootNodeBySpaceFeature(Long memberId, String spaceId) {
        SpaceGlobalFeature feature = iSpaceService.getSpaceGlobalFeature(spaceId);
        Boolean rootManageable = feature.rootManageableOrDefault();
        // 1. Whether the security settings turn on the normal member
        // root directory operable permission control
        if (rootManageable) {
            return;
        }
        List<Long> adminsWithWorkbench =
            iSpaceRoleService.getSpaceAdminsWithWorkbenchManage(spaceId);
        // 2. Whether the user has the administrative permission of the workbench permission
        ExceptionUtil.isTrue(CollUtil.contains(adminsWithWorkbench, memberId),
            PermissionException.ROOT_NODE_OP_DENIED);
    }

    @Override
    public boolean isNodeBelongRootFolder(String spaceId, String nodeId) {
        String rootNodeId = nodeMapper.selectRootNodeIdBySpaceId(spaceId);
        String parentNodeId = nodeMapper.selectParentIdByNodeId(nodeId);
        return ObjectUtil.isNotNull(rootNodeId) && rootNodeId.equals(parentNodeId);
    }

    @Override
    public List<NodeSearchResult> recentList(String spaceId, Long memberId) {
        List<String> nodeIds =
            multiDatasourceAdapterTemplate.getRecentlyVisitNodeIds(memberId, NodeType.FOLDER);
        List<NodeInfoVo> nodeInfos = this.getNodeInfoByNodeIds(spaceId, memberId, nodeIds);
        return formatNodeSearchResults(nodeInfos);
    }

    @Override
    public Long getCreatedMemberId(String nodeId) {
        NodeEntity node = baseMapper.selectByNodeId(nodeId);
        if (null != node && null != node.getCreatedBy()) {
            return iMemberService.getMemberIdByUserIdAndSpaceId(node.getCreatedBy(),
                node.getSpaceId());
        }
        return null;
    }

    @Override
    public String getNodeIdByParentIdAndNodeName(String parentNodeId, String nodeName) {
        return baseMapper.selectNodeIdByParentIdAndNodeName(parentNodeId, nodeName);
    }

    private List<NodeSearchResult> formatNodeSearchResults(List<NodeInfoVo> nodeInfoList) {
        if (CollUtil.isEmpty(nodeInfoList)) {
            return new ArrayList<>();
        }
        // format the tree
        List<NodeSearchResult> results = new ArrayList<>(nodeInfoList.size());
        List<String> parentIds =
            nodeInfoList.stream().map(NodeInfoVo::getParentId).collect(Collectors.toList());
        Map<String, String> parentIdToPathMap = this.getSuperiorPathByParentIds(parentIds);
        nodeInfoList.forEach(info -> {
            NodeSearchResult result = new NodeSearchResult();
            BeanUtil.copyProperties(info, result);
            if (MapUtil.isNotEmpty(parentIdToPathMap)) {
                result.setSuperiorPath(parentIdToPathMap.get(info.getParentId()));
            }
            results.add(result);
        });
        return results;
    }

}
