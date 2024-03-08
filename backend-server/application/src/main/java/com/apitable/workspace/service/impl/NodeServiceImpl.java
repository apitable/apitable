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
import cn.hutool.core.util.NumberUtil;
import cn.hutool.core.util.ObjectUtil;
import cn.hutool.core.util.StrUtil;
import cn.hutool.json.JSONObject;
import cn.hutool.json.JSONUtil;
import com.alibaba.excel.EasyExcel;
import com.alibaba.excel.ExcelReader;
import com.alibaba.excel.read.builder.ExcelReaderBuilder;
import com.alibaba.excel.read.metadata.ReadSheet;
import com.alibaba.excel.support.ExcelTypeEnum;
import com.apitable.automation.entity.AutomationRobotEntity;
import com.apitable.automation.model.AutomationCopyOptions;
import com.apitable.automation.model.TriggerCopyResultDto;
import com.apitable.automation.service.IAutomationRobotService;
import com.apitable.base.enums.DatabaseException;
import com.apitable.base.enums.ParameterException;
import com.apitable.control.infrastructure.ControlRoleDict;
import com.apitable.control.infrastructure.ControlTemplate;
import com.apitable.control.infrastructure.permission.NodePermission;
import com.apitable.control.infrastructure.role.ControlRole;
import com.apitable.core.exception.BusinessException;
import com.apitable.core.support.tree.DefaultTreeBuildFactory;
import com.apitable.core.util.ExceptionUtil;
import com.apitable.core.util.SpringContextHolder;
import com.apitable.integration.grpc.BasicResult;
import com.apitable.integration.grpc.NodeCopyRo;
import com.apitable.integration.grpc.NodeDeleteRo;
import com.apitable.interfaces.ai.facade.AiServiceFacade;
import com.apitable.interfaces.ai.model.AiCreateParam;
import com.apitable.interfaces.ai.model.AiUpdateParam;
import com.apitable.interfaces.document.facade.DocumentServiceFacade;
import com.apitable.interfaces.social.model.SocialConnectInfo;
import com.apitable.organization.dto.MemberDTO;
import com.apitable.organization.enums.UnitType;
import com.apitable.organization.mapper.MemberMapper;
import com.apitable.organization.service.IMemberService;
import com.apitable.organization.service.IUnitService;
import com.apitable.shared.cache.bean.LoginUserDto;
import com.apitable.shared.component.adapter.MultiDatasourceAdapterTemplate;
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
import com.apitable.workspace.dto.NodeStatisticsDTO;
import com.apitable.workspace.dto.NodeTreeDTO;
import com.apitable.workspace.dto.UrlNodeInfoDTO;
import com.apitable.workspace.entity.DatasheetEntity;
import com.apitable.workspace.entity.DatasheetMetaEntity;
import com.apitable.workspace.entity.DatasheetRecordEntity;
import com.apitable.workspace.entity.NodeDescEntity;
import com.apitable.workspace.entity.NodeEntity;
import com.apitable.workspace.enums.IdRulePrefixEnum;
import com.apitable.workspace.enums.NodeException;
import com.apitable.workspace.enums.NodeType;
import com.apitable.workspace.enums.PermissionException;
import com.apitable.workspace.enums.ResourceType;
import com.apitable.workspace.facade.NodeFacade;
import com.apitable.workspace.listener.CsvReadListener;
import com.apitable.workspace.listener.MultiSheetReadListener;
import com.apitable.workspace.mapper.NodeMapper;
import com.apitable.workspace.mapper.NodeShareSettingMapper;
import com.apitable.workspace.model.DatasheetCreateObject;
import com.apitable.workspace.ro.CreateDatasheetRo;
import com.apitable.workspace.ro.NodeCopyOpRo;
import com.apitable.workspace.ro.NodeEmbedPageRo;
import com.apitable.workspace.ro.NodeMoveOpRo;
import com.apitable.workspace.ro.NodeOpRo;
import com.apitable.workspace.ro.NodeRelRo;
import com.apitable.workspace.ro.NodeUpdateOpRo;
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
import jakarta.annotation.Resource;
import java.io.InputStream;
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
import java.util.Optional;
import java.util.Set;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.locks.Lock;
import java.util.function.Consumer;
import java.util.stream.Collectors;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.integration.redis.util.RedisLockRegistry;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * node service implement.
 */
@Service
@Slf4j
public class NodeServiceImpl extends ServiceImpl<NodeMapper, NodeEntity> implements INodeService {

    @Resource
    private NodeFacade nodeFacade;

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
    private IFieldRoleService iFieldRoleService;

    @Resource
    private IGrpcClientService grpcClientService;

    @Resource
    private RedisTemplate<String, String> redisTemplate;

    @Resource
    private INodeDescService nodeDescService;

    @Resource
    private ISpaceRoleService iSpaceRoleService;

    @Resource
    private MultiDatasourceAdapterTemplate multiDatasourceAdapterTemplate;

    @Resource
    private IMemberService iMemberService;

    @Resource
    private IWidgetService iWidgetService;

    @Resource
    private RedisLockRegistry redisLockRegistry;

    @Resource
    private AiServiceFacade aiServiceFacade;

    @Resource
    private IAutomationRobotService iAutomationRobotService;

    @Resource
    private DocumentServiceFacade documentServiceFacade;

    @Resource
    private IUnitService iUnitService;

    @Override
    public String getRootNodeIdBySpaceId(String spaceId) {
        log.info("The root node ID of the query space [{}]", spaceId);
        return baseMapper.selectRootNodeIdBySpaceId(spaceId);
    }

    @Override
    public List<String> getNodeIdBySpaceIdAndType(String spaceId, Integer type) {
        log.info("The ID of the query space [{}] node type [{}]", spaceId, type);
        return baseMapper.selectNodeIdBySpaceIdAndType(spaceId, type);
    }

    @Override
    public List<String> getNodeIdBySpaceIdAndTypeAndKeyword(String spaceId, Integer type,
                                                            String keyword) {
        log.info("The ID of the query space [{}] node types [{}] keyword [{}]", spaceId, type,
            keyword);
        return baseMapper.selectNodeIdsBySpaceIdAndTypeAndKeyword(spaceId, type, keyword);
    }

    @Override
    public NodeType getTypeByNodeId(String nodeId) {
        Integer type = baseMapper.selectNodeTypeByNodeId(nodeId);
        ExceptionUtil.isNotNull(type, PermissionException.NODE_NOT_EXIST);
        return NodeType.toEnum(type);
    }

    @Override
    public NodeEntity getByNodeId(String nodeId) {
        NodeEntity nodeEntity = baseMapper.selectByNodeId(nodeId);
        ExceptionUtil.isNotNull(nodeEntity, PermissionException.NODE_NOT_EXIST);
        return nodeEntity;
    }

    @Override
    public List<NodeEntity> getSubNodeList(String parentId) {
        return baseMapper.selectByParentId(parentId);
    }

    @Override
    public List<String> getExistNodeIdsBySelf(List<String> nodeIds) {
        return baseMapper.selectNodeIdByNodeIdIn(nodeIds);
    }

    private List<NodeEntity> getByNodeIds(Collection<String> nodeIds) {
        log.info("Batch query node:{}", nodeIds);
        List<NodeEntity> nodeEntities = baseMapper.selectByNodeIds(nodeIds);
        ExceptionUtil.isNotEmpty(nodeEntities, PermissionException.NODE_NOT_EXIST);
        return nodeEntities;
    }

    @Override
    public String getSpaceIdByNodeId(String nodeId) {
        log.info("The id of the space where the query node is located.");
        String spaceId = baseMapper.selectSpaceIdByNodeId(nodeId);
        ExceptionUtil.isNotNull(spaceId, PermissionException.NODE_NOT_EXIST);
        return spaceId;
    }

    @Override
    public String getSpaceIdByNodeIds(List<String> nodeIds) {
        List<String> spaceIds = baseMapper.selectSpaceIdsByNodeIds(nodeIds);
        ExceptionUtil.isTrue(spaceIds.size() == 1, ParameterException.INCORRECT_ARG);
        return spaceIds.get(0);
    }

    @Override
    public String getSpaceIdByNodeIdIncludeDeleted(String nodeId) {
        log.info("Query the space ID of the node [{}] including deletion", nodeId);
        return baseMapper.selectSpaceIdByNodeIdIncludeDeleted(nodeId);
    }

    @Override
    public Boolean getIsTemplateByNodeIds(List<String> nodeIds) {
        log.info("Query whether all nodes [{}] belong to templates", nodeIds);
        List<Boolean> result = baseMapper.selectIsTemplateByNodeId(nodeIds);
        ExceptionUtil.isTrue(!result.isEmpty(), PermissionException.NODE_NOT_EXIST);
        ExceptionUtil.isTrue(result.size() == 1, ParameterException.INCORRECT_ARG);
        return result.get(0);
    }

    @Override
    public String getParentIdByNodeId(String nodeId) {
        log.info("The id of the parent node of the query node [{}]", nodeId);
        return baseMapper.selectParentIdByNodeId(nodeId);
    }

    @Override
    public String getNodeNameByNodeId(String nodeId) {
        log.info("Query the node name of node [{}]", nodeId);
        return baseMapper.selectNodeNameByNodeId(nodeId);
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
        return nodeFacade.getParentPathNodes(nodeIds, includeRootNode);
    }

    @Override
    public List<NodeInfo> getNodeInfo(String spaceId, List<String> nodeIds, Long memberId) {
        log.info("Node information view of batch query [{}]", nodeIds);
        return baseMapper.selectNodeInfo(nodeIds, memberId);
    }

    @Override
    public List<NodeInfo> getNodeInfoByNodeIds(Collection<String> nodeIds) {
        log.info("Node information view of batch query [{}]", nodeIds);
        return baseMapper.selectInfoByNodeIds(nodeIds);
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
        List<NodeInfoVo> infos = baseMapper.selectNodeInfoByNodeIds(roleDict.keySet(), memberId);
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
        return checkNodeIfExist(spaceId, nodeId, null);
    }

    @Override
    public String checkNodeIfExist(String spaceId, String nodeId, String unitId) {
        log.info("Check if the node exists");
        if (nodeId.equals(getRootNodeIdBySpaceId(spaceId))) {
            return spaceId;
        }
        // validate not root node
        NodeEntity node = baseMapper.selectSpaceIdAndUnitIdByNodeId(nodeId);
        ExceptionUtil.isNotNull(node, PermissionException.NODE_NOT_EXIST);
        ExceptionUtil.isFalse(
            null != unitId && !node.getUnitId().equals(NumberUtil.parseLong(unitId)),
            PermissionException.NODE_NOT_EXIST);
        // When the space id is not empty, check whether the space is cross-space.
        ExceptionUtil.isTrue(StrUtil.isBlank(spaceId) || node.getSpaceId().equals(spaceId),
            SpaceException.NOT_IN_SPACE);
        return node.getNodeId();
    }

    @Override
    public void checkSourceDatasheet(String spaceId, Long memberId, Integer type, String unitId,
                                     NodeRelRo extra) {
        NodeType nodeType = NodeType.toEnum(type);
        switch (nodeType) {
            case FORM:
            case MIRROR:
                ExceptionUtil.isTrue(extra != null && StrUtil.isNotBlank(extra.getDatasheetId())
                    && StrUtil.isNotBlank(extra.getViewId()), ParameterException.INCORRECT_ARG);
                // Determine whether the datasheet does not exist or is accessed across space.
                this.checkNodeIfExist(spaceId, extra.getDatasheetId(), unitId);
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
        String spaceId = baseMapper.selectSpaceIdByNodeId(nodeId);
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
        Long unitId = iUnitService.getUnitIdByRefId(memberId);
        List<Long> unitIds = CollUtil.list(false, 0L, unitId);
        // fuzzy search results
        List<String> nodeIds =
            baseMapper.selectLikeNodeName(spaceId, unitIds, StrUtil.trim(keyword));
        List<NodeInfoVo> nodeInfos = this.getNodeInfoByNodeIds(spaceId, memberId, nodeIds);
        return formatNodeSearchResults(nodeInfos);
    }

    @Override
    public NodeInfoTreeVo getNodeTree(String spaceId, String nodeId, Long memberId, int depth) {
        log.info("Query node tree ");
        // filter private workspace
        List<String> nodeIds =
            this.getNodeIdsInNodeTree(nodeId, depth, false, Collections.singletonList(0L));
        return this.getNodeInfoTreeByNodeIds(spaceId, memberId, nodeIds);
    }

    @Override
    public NodeInfoTreeVo getNodeTree(String spaceId, String nodeId, Long memberId, int depth,
                                      UnitType unitType) {
        log.info("Query node tree ");
        List<Long> unitIds = new ArrayList<>();
        if (UnitType.MEMBER.equals(unitType)) {
            unitIds.add(iUnitService.getUnitIdByRefId(memberId));
        }
        List<String> nodeIds = this.getNodeIdsInNodeTree(nodeId, depth, false, unitIds);
        if (UnitType.MEMBER.equals(unitType)) {
            // get space active member count
            long memberCount = iMemberService.getTotalActiveMemberCountBySpaceId(spaceId);
            // haven't private node
            if (memberCount < 2 && nodeIds.size() == 1) {
                return null;
            }
        }
        return getNodeInfoTreeByNodeIds(spaceId, memberId, nodeIds);
    }


    @Override
    public List<NodeShareTree> getSubNodes(String nodeId) {
        List<String> subNodeIds = this.getNodeIdsInNodeTree(nodeId, -1);
        subNodeIds.remove(nodeId);
        if (subNodeIds.isEmpty()) {
            return new ArrayList<>();
        }
        List<NodeShareTree> shareTrees = baseMapper.selectShareTree(subNodeIds);
        // node switches to memory custom sort
        CollectionUtil.customSequenceSort(shareTrees, NodeShareTree::getNodeId, subNodeIds);
        return shareTrees;
    }

    @Override
    public List<String> getNodeIdsInNodeTree(String nodeId, Integer depth) {
        return this.getNodeIdsInNodeTree(nodeId, depth, false, new ArrayList<>());
    }

    @Override
    public List<String> getNodeIdsInNodeTree(String nodeId, Integer depth, Boolean isRubbish,
                                             List<Long> unitIds) {
        return this.getNodeIdsInNodeTree(Collections.singletonList(nodeId), depth, isRubbish,
            unitIds);
    }

    private List<String> getNodeIdsInNodeTree(List<String> nodeIds, Integer depth,
                                              Boolean isRubbish, List<Long> unitIds) {
        Set<String> nodeIdSet = new LinkedHashSet<>(nodeIds);
        List<String> parentIds = nodeIds.stream()
            .filter(i -> i.startsWith(IdRulePrefixEnum.FOD.getIdRulePrefixEnum()))
            .collect(Collectors.toList());
        while (!parentIds.isEmpty() && depth != 0) {
            List<NodeTreeDTO> subNode =
                baseMapper.selectNodeTreeDTOByParentIdIn(parentIds, isRubbish, unitIds);
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
        List<NodeTreeDTO> firstNodes = sub.stream()
            .filter(i -> i.getPreNodeId() == null)
            .collect(Collectors.toList());
        Map<String, List<NodeTreeDTO>> preNodeIdToNodesMap = new LinkedHashMap<>();
        for (NodeTreeDTO node : sub) {
            String preNodeId = node.getPreNodeId();
            List<NodeTreeDTO> sufNodes =
                preNodeIdToNodesMap.computeIfAbsent(preNodeId, k -> new ArrayList<>());
            sufNodes.add(node);
        }
        List<String> nodeIds = new ArrayList<>();
        this.sufNodeRecurrence(firstNodes, nodeType, preNodeIdToNodesMap, nodeIds::add);
        if (nodeIds.size() == sub.size()) {
            return nodeIds;
        }
        List<String> subNodeIds = sub.stream().map(NodeTreeDTO::getNodeId).toList();
        sub.stream()
            .filter(i -> i.getPreNodeId() != null && !subNodeIds.contains(i.getPreNodeId()))
            .forEach(node -> {
                List<NodeTreeDTO> suffixNodes = Collections.singletonList(node);
                this.sufNodeRecurrence(suffixNodes, nodeType, preNodeIdToNodesMap, nodeIds::add);
            });
        return nodeIds;
    }

    private void sufNodeRecurrence(List<NodeTreeDTO> nodes, NodeType nodeType,
                                   Map<String, List<NodeTreeDTO>> preNodeIdToNodesMap,
                                   Consumer<String> action) {
        nodes.stream()
            .filter(i -> nodeType == null || i.getType() == nodeType.getNodeType())
            .map(NodeTreeDTO::getNodeId)
            .forEach(action);
        for (NodeTreeDTO node : nodes) {
            String nodeId = node.getNodeId();
            if (preNodeIdToNodesMap.containsKey(nodeId)) {
                List<NodeTreeDTO> sufNodes = preNodeIdToNodesMap.get(nodeId);
                this.sufNodeRecurrence(sufNodes, nodeType, preNodeIdToNodesMap, action);
            }
        }
    }

    @Override
    public List<NodeInfoVo> getChildNodesByNodeId(String spaceId, Long memberId, String nodeId,
                                                  NodeType nodeType) {
        List<Long> unitIds = CollUtil.newArrayList(0L, iUnitService.getUnitIdByRefId(memberId));
        log.info("Query the list of child nodes ");
        // Get a direct child node
        List<NodeTreeDTO> subNode =
            baseMapper.selectNodeTreeDTOByParentIdIn(Collections.singleton(nodeId), false,
                unitIds);
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
        Long unitId = baseMapper.selectUnitIdByNodeId(nodeId);
        // The parent node supplements the tree node load.
        List<NodeTreeDTO> subNode =
            baseMapper.selectNodeTreeDTOByParentIdIn(parentNodeIds, false,
                Collections.singletonList(unitId));
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
        NodeInfoVo nodeInfo = baseMapper.selectNodeInfoByNodeId(nodeId);
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
                            baseMapper.selectNodeInfoTreeByNodeIds(item, memberId);
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
    public String createDatasheetNode(Long userId, String spaceId, DatasheetCreateObject object) {
        String nodeId = IdUtil.createNodeId(object.getType());
        NodeEntity nodeEntity = NodeEntity.builder()
            .spaceId(spaceId)
            .parentId(object.getParentId())
            .nodeId(nodeId)
            .type(object.getType().getNodeType())
            .nodeName(object.getName())
            .createdBy(userId)
            .updatedBy(userId)
            .build();
        boolean flag = save(nodeEntity);
        ExceptionUtil.isTrue(flag, DatabaseException.INSERT_ERROR);
        if (object.hasDescription()) {
            NodeDescEntity descEntity = NodeDescEntity.builder()
                .id(IdWorker.getId())
                .nodeId(nodeId)
                .description(object.getDescription())
                .build();
            nodeDescService.insertBatch(Collections.singletonList(descEntity));
        }
        iDatasheetService.create(userId, nodeEntity, object.getDatasheetObject());
        return nodeId;
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public String createNode(Long userId, String spaceId, NodeOpRo nodeOpRo) {
        log.info("create children node");
        // The parent id and space id must match.
        // The parent node belongs to this space to prevent cross-space and cross-node operations.
        this.checkNodeIfExist(spaceId, nodeOpRo.getParentId(), nodeOpRo.getUnitId());
        String name =
            duplicateNameModify(nodeOpRo.getParentId(), nodeOpRo.getType(), nodeOpRo.getNodeName(),
                null, NumberUtil.parseLong(nodeOpRo.getUnitId()));
        NodeType nodeType = NodeType.toEnum(nodeOpRo.getType());
        if (!nodeType.isFolder()) {
            iSpaceService.checkFileNumOverLimit(spaceId);
        }
        String nodeId = IdUtil.createNodeId(nodeType);
        // If the new node is a file, it corresponds to the creation of a datasheet form.
        this.createFileMeta(userId, spaceId, nodeId, nodeOpRo.getType(), name, nodeOpRo.getExtra());
        // When an empty string is not passed in,
        // if the pre-node is deleted or not under the parent id, the move fails.
        String preNodeId = this.verifyPreNodeId(nodeOpRo.getPreNodeId(), nodeOpRo.getParentId());
        NodeEntity nodeEntity = NodeEntity.builder()
            .parentId(nodeOpRo.getParentId())
            .spaceId(spaceId)
            .preNodeId(preNodeId)
            .nodeName(name)
            .type(nodeOpRo.getType())
            .extra(JSONUtil.toJsonStr(nodeOpRo.getExtra()))
            .nodeId(nodeId)
            .unitId(NumberUtil.parseLong(nodeOpRo.getUnitId()))
            .build();
        // Change the front node ID of the next node to the new node ID(A <- C => B <- C)
        baseMapper.updatePreNodeIdBySelf(nodeId, preNodeId, nodeOpRo.getParentId());
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
            .unitId(dto.getUnitId())
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
            boolean flag = SqlHelper.retBool(baseMapper.insertBatch(nodeList));
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
        this.updateExtra(nodeId, NodeType.toEnum(nodeEntity.getType()), nodeEntity.getExtra(),
            opRo.getShowRecordHistory(), opRo.getEmbedPage());
    }

    private void updateNodeName(Long userId, String nodeId, String name, NodeEntity entity) {
        if (StrUtil.isBlank(name)) {
            return;
        }
        // Prevent peer directory, duplicate name modification
        String nodeName = duplicateNameModify(entity.getParentId(), entity.getType(), name, nodeId,
            entity.getUnitId());
        boolean flag = SqlHelper.retBool(baseMapper.updateNameByNodeId(nodeId, nodeName));
        ExceptionUtil.isTrue(flag, DatabaseException.EDIT_ERROR);
        // Correspondingly modify the name.
        switch (NodeType.toEnum(entity.getType())) {
            case DATASHEET:
                iDatasheetService.updateDstName(userId, nodeId, nodeName);
                break;
            case AI_CHAT_BOT:
                aiServiceFacade.updateAi(nodeId, AiUpdateParam.builder().name(nodeName).build());
                break;
            case AUTOMATION:
                iAutomationRobotService.updateNameByResourceId(nodeId, nodeName);
                break;
            default:
                break;
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
        boolean flag = SqlHelper.retBool(baseMapper.updateIconByNodeId(nodeId, icon));
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
        boolean flag = SqlHelper.retBool(baseMapper.updateCoverByNodeId(nodeId, cover));
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
        if (!nodeEntity.getParentId().equals(opRo.getParentId())
            || !nodeEntity.getUnitId().equals(NumberUtil.parseLong(opRo.getUnitId()))) {
            // move across folders
            parentId = opRo.getParentId();
            // Check whether the new parent node exists and is in the same space
            this.checkNodeIfExist(nodeEntity.getSpaceId(), parentId, opRo.getUnitId());
            name =
                this.duplicateNameModify(parentId, nodeEntity.getType(), nodeEntity.getNodeName(),
                    null, NumberUtil.parseLong(opRo.getUnitId()));
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
        // if the pre-node is deleted or not under the parent id, the move fails.
        String preNodeId = this.verifyPreNodeId(opRo.getPreNodeId(), parentId);
        // The next node that records the old and new locations
        List<String> suffixNodeIds = baseMapper.selectNodeIdByPreNodeIdIn(
            CollUtil.newArrayList(nodeEntity.getNodeId()));
        nodeIds.addAll(suffixNodeIds);
        Lock lock = redisLockRegistry.obtain(parentId);
        try {
            if (lock.tryLock(2, TimeUnit.MINUTES)) {
                // Update the front node of the latter node
                // to the front node of the node (A <- X <- C => A <- C)
                baseMapper.updatePreNodeIdBySelf(nodeEntity.getPreNodeId(),
                    nodeEntity.getNodeId(), nodeEntity.getParentId());
                // Update the sequence relationship of nodes before
                // and after the move (D <- E => D <- X <- E)
                String sufNodeId =
                    baseMapper.selectNodeIdByParentIdAndPreNodeIdAndUnitId(parentId, preNodeId,
                        nodeEntity.getUnitId());
                if (sufNodeId != null) {
                    nodeIds.add(sufNodeId);
                    baseMapper.updatePreNodeIdByNodeId(nodeEntity.getNodeId(), sufNodeId);
                }
                // Update the information of this node (the ID of the previous
                // node may be updated to null, so update By id is not used)
                baseMapper.updateInfoByNodeId(nodeEntity.getNodeId(), parentId, preNodeId, name,
                    NumberUtil.parseLong(opRo.getUnitId()));
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
        List<String> nodeIds = this.getNodeIdsInNodeTree(idList, -1, false, new ArrayList<>());
        // delete all nodes and child descendants
        if (CollUtil.isNotEmpty(nodeIds)) {
            this.nodeDeleteChangeset(nodeIds);
            iDatasheetService.updateIsDeletedStatus(userId, nodeIds, true);
            Collection<String> subNodeIds = CollUtil.disjunction(nodeIds, idList);
            if (!subNodeIds.isEmpty()) {
                boolean flag =
                    SqlHelper.retBool(baseMapper.updateIsRubbishByNodeIdIn(userId,
                        subNodeIds, true));
                ExceptionUtil.isTrue(flag, DatabaseException.DELETE_ERROR);
            }
            // disable node sharing
            nodeShareSettingMapper.disableByNodeIds(nodeIds);
            // delete the spatial attachment resource of the node
            iSpaceAssetService.updateIsDeletedByNodeIds(nodeIds, true);
            // if node is ai chat bot, auto delete
            aiServiceFacade.deleteAi(nodeIds);
            iAutomationRobotService.updateIsDeletedByResourceIds(userId, nodeIds, true);
            documentServiceFacade.remove(userId, nodeIds);
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
                    baseMapper.updatePreNodeIdByJoinSelf(nodeId, node.getParentId());
                    // Save the path of the deletion.
                    // Specify that the deleted node is attached to the parent node -1.
                    String delPath = MapUtil.isNotEmpty(parentIdToPathMap)
                        ? parentIdToPathMap.get(node.getParentId()) : null;
                    baseMapper.updateDeletedPathByNodeId(userId, nodeId, delPath);
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
            SqlHelper.retBool(baseMapper.updateIsRubbishByNodeIdIn(userId, nodeIds, true));
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
        ExceptionUtil.isFalse(nodeType.equals(NodeType.AI_CHAT_BOT), NodeException.NOT_ALLOW);
        ExceptionUtil.isFalse(nodeType.equals(NodeType.FOLDER),
            NodeException.NODE_COPY_FOLDER_ERROR);
        // Verify that the number of nodes reaches the upper limit
        // iSubscriptionService.checkSheetNums(copyNode.getSpaceId(), 1);

        Map<String, Object> param = new HashMap<>(1);
        param.put("file_name", copyNode.getNodeName());
        String nodeName = StringUtil.format(I18nStringsUtil.t("default_file_copy"), param);

        String name =
            duplicateNameModify(copyNode.getParentId(), copyNode.getType(), nodeName, null,
                copyNode.getUnitId());
        CreateNodeDto createNodeDto = CreateNodeDto.builder()
            .spaceId(copyNode.getSpaceId())
            .parentId(copyNode.getParentId())
            .nodeName(name)
            .type(copyNode.getType())
            .preNodeId(opRo.getNodeId())
            .newNodeId(IdUtil.createNodeId(nodeType))
            .icon(copyNode.getIcon())
            .cover(copyNode.getCover())
            .extra(copyNode.getExtra())
            .unitId(copyNode.getUnitId())
            .build();
        // Update the former node of the latter node to the copied node (A <- B => A <- A' <- B)
        baseMapper.updatePreNodeIdBySelf(createNodeDto.getNewNodeId(), opRo.getNodeId(),
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
            case AUTOMATION:
                AutomationCopyOptions automationCopyOptions =
                    AutomationCopyOptions.builder().sameSpace(true).removeButtonClickedInput(true)
                        .overriddenName(name).build();
                iAutomationRobotService.copy(userId,
                    Collections.singletonList(opRo.getNodeId()),
                    automationCopyOptions, newNodeMap);
                return copyEffect;
            case CUSTOM_PAGE:
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
            destParentId = baseMapper.selectRootNodeIdBySpaceId(spaceId);
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
        NodeEntity shareNode = baseMapper.selectByNodeId(sourceNodeId);
        String name = StrUtil.isNotBlank(options.getNodeName())
            ? options.getNodeName() : shareNode.getNodeName();
        NodeType nodeType = NodeType.toEnum(shareNode.getType());
        String toSaveNodeId = StrUtil.isNotBlank(options.getNodeId())
            ? options.getNodeId() : IdUtil.createNodeId(nodeType);
        if (!options.isTemplate()) {
            // check for the same name
            name = duplicateNameModify(destParentId, shareNode.getType(), name, null,
                NumberUtil.parseLong(options.getUnitId()));
            // update the original first node, and move the position one bit later,
            // that is, the pre-node is the shared node that is transferred.
            baseMapper.updatePreNodeIdBySelf(toSaveNodeId, null, destParentId);
        }

        // component node id map
        Map<String, String> newNodeMap = new HashMap<>();
        newNodeMap.put(sourceNodeId, toSaveNodeId);
        switch (nodeType) {
            case ROOT:
                throw new BusinessException(NodeException.NOT_ALLOW);
            case FOLDER:
                this.copyFolderProcess(userId, spaceId, sourceNodeId,
                    newNodeMap, options);
                break;
            case DATASHEET:
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
            case AUTOMATION:
                AutomationCopyOptions automationCopyOptions =
                    AutomationCopyOptions.builder().removeButtonClickedInput(true)
                        .overriddenName(name).build();
                iAutomationRobotService.copy(userId,
                    Collections.singletonList(sourceNodeId),
                    automationCopyOptions, newNodeMap);

                break;
            default:
                break;
        }
        NodeEntity toSaveNode = new NodeEntity();
        toSaveNode.setId(IdWorker.getId());
        toSaveNode.setNodeId(toSaveNodeId);
        toSaveNode.setNodeName(name);
        toSaveNode.setCover(shareNode.getCover());
        toSaveNode.setParentId(destParentId);
        toSaveNode.setSpaceId(spaceId);
        toSaveNode.setType(shareNode.getType());
        toSaveNode.setIcon(shareNode.getIcon());
        toSaveNode.setIsTemplate(options.isTemplate());
        toSaveNode.setUnitId(NumberUtil.parseLong(options.getUnitId()));
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
        baseMapper.insert(toSaveNode);
        // description of batch replication nodes
        iNodeDescService.copyBatch(newNodeMap);
        // Batch copy of spatial attachment resources referenced by nodes
        if (ObjectUtil.isNotNull(options) && options.isCopyData()) {
            iSpaceAssetService.copyBatch(newNodeMap, spaceId);
        }
        return toSaveNodeId;
    }

    private void copyFolderProcess(Long userId, String spaceId, String folderId,
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

        Map<String, String> originNodeToPreNodeMap = new HashMap<>(subTrees.size());
        subTrees.forEach(sub -> {
            originNodeToPreNodeMap.put(sub.getNodeId(), sub.getPreNodeId());
            // Supplement the ID mapping relationship between the original node and the new node
            if (!filterNodeIds.contains(sub.getNodeId())) {
                NodeType nodeType = NodeType.toEnum(sub.getType());
                newNodeMap.put(sub.getNodeId(), IdUtil.createNodeId(nodeType));
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
            node.setUnitId(NumberUtil.parseLong(options.getUnitId()));
            node.setParentId(newNodeMap.get(shareTree.getParentId()));
            node.setNodeId(newNodeMap.get(shareTree.getNodeId()));
            node.setNodeName(shareTree.getNodeName());
            if (StrUtil.isNotBlank(shareTree.getExtra())) {
                node.setExtra(shareTree.getExtra());
            }
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
        if (storeEntities.isEmpty()) {
            return;
        }
        boolean flag = SqlHelper.retBool(baseMapper.insertBatch(storeEntities));
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

            // Copy automation processing
            if (nodeTypeToNodeIdsMap.containsKey(NodeType.AUTOMATION.getNodeType())) {
                List<String> automationNodeIds =
                    nodeTypeToNodeIdsMap.get(NodeType.AUTOMATION.getNodeType()).stream()
                        .map(NodeShareTree::getNodeId)
                        .filter(nodeId -> !filterNodeIds.contains(nodeId))
                        .collect(Collectors.toList());
                if (CollUtil.isNotEmpty(automationNodeIds)) {
                    TriggerCopyResultDto result =
                        iAutomationRobotService.copy(userId, automationNodeIds,
                            new AutomationCopyOptions(), newNodeMap);
                    // use for rewrite button field property
                    options.setNewTriggerMap(result.getNewTriggerMap());
                }
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
    public void updateNodeBanStatus(String nodeId, Integer status) {
        log.info("Ban or unban nodes ");
        boolean flag = SqlHelper.retBool(baseMapper.updateNodeBanStatus(nodeId, status));
        ExceptionUtil.isTrue(flag, DatabaseException.EDIT_ERROR);
    }

    /**
     * duplicate name modification.
     */
    @Override
    public String duplicateNameModify(String parentId, int nodeType, String nodeName,
                                      String nodeId, Long unitId) {
        List<String> nameList = baseMapper.selectNameList(parentId, nodeType, nodeId, unitId);
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
        boolean hasChildren = baseMapper.selectHasChildren(nodeId);
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
            .map(Map.Entry::getKey).toList();
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
            case AI_CHAT_BOT:
                iSpaceService.checkChatBotNumsOverLimit(spaceId);
                aiServiceFacade.createAi(AiCreateParam.builder()
                    .spaceId(spaceId)
                    .aiId(nodeId)
                    .aiName(name)
                    .build()
                );
                break;
            case AUTOMATION:
                iAutomationRobotService.create(AutomationRobotEntity.builder()
                    .resourceId(nodeId)
                    .robotId(IdUtil.createAutomationRobotId())
                    .name(name)
                    .createdBy(userId)
                    .build());
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
            String id = baseMapper.selectParentIdByNodeId(preNodeId);
            ExceptionUtil.isTrue(parentId.equals(id), PermissionException.NODE_ACCESS_DENIED);
            return preNodeId;
        }
    }

    /**
     * Get the superior path, split by "/", do not retain the root node.
     */
    private Map<String, String> getSuperiorPathByParentIds(List<String> parentIds) {
        // gets all parent nodes other than the root node
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
                             Long memberId, String parentNodeId, Long unitId, String viewName,
                             String fileName, String fileSuffix, InputStream inputStream) {
        MultiSheetReadListener readListener =
            new MultiSheetReadListener(this, userId, uuid, spaceId, memberId,
                parentNodeId, unitId, viewName, fileName);
        ExcelTypeEnum excelType = FileSuffixConstants.XLS.equals(fileSuffix)
            ? ExcelTypeEnum.XLS : ExcelTypeEnum.XLSX;
        ExcelReaderBuilder readerBuilder = EasyExcel.read(inputStream)
            .excelType(excelType)
            .ignoreEmptyRow(false).autoTrim(false);
        try (ExcelReader excelReader = readerBuilder.registerReadListener(readListener).build()) {
            List<ReadSheet> readSheets = excelReader.excelExecutor().sheetList();
            excelReader.read(readSheets);
            return readListener.getRetNodeData().getNodeId();
        }
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public String parseCsv(Long userId, String uuid, String spaceId, Long memberId,
                           String parentNodeId, Long unitId, String viewName, String fileName,
                           InputStream inputStream) {
        CsvReadListener readListener =
            new CsvReadListener(this, userId, uuid, spaceId, memberId,
                parentNodeId, unitId, viewName, fileName);
        try (ExcelReader excelReader = EasyExcel.read(inputStream).excelType(ExcelTypeEnum.CSV)
            .registerReadListener(readListener).build()) {
            excelReader.readAll();
            return readListener.getRetNodeId();
        }
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void batchCreateDataSheet(NodeData data, List<NodeEntity> nodeEntities,
                                     List<DatasheetEntity> datasheetEntities,
                                     List<DatasheetMetaEntity> metaEntities,
                                     List<DatasheetRecordEntity> recordEntities) {

        baseMapper.updatePreNodeIdBySelf(data.getNodeId(), null, data.getParentId());

        baseMapper.insertBatch(nodeEntities);

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
            extras = baseMapper.selectExtraByNodeId(nodeId);
        }
        NodeExtraDTO nodeExtraDTO = JSONUtil.toBean(extras, NodeExtraDTO.class);
        SocialConnectInfo connectInfo = iSpaceService.getSocialConnectInfo(spaceId);
        if (connectInfo != null && connectInfo.getAppId() != null) {
            if (connectInfo.isEnabled()) {
                String suiteKey = iSpaceService.getSocialSuiteKeyByAppId(connectInfo.getAppId());
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
        UrlNodeInfoDTO urlNodeInfo = baseMapper.selectSpaceIdAndNodeNameByNodeId(nodeId);

        if (ObjectUtil.isNull(urlNodeInfo)) {
            return Optional.empty();
        }

        try {
            // 2. Query the member id in the space based on the user id.
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
        Integer nodeType = baseMapper.selectNodeTypeByNodeId(nodeId);
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
        String rootNodeId = baseMapper.selectRootNodeIdBySpaceId(spaceId);
        String parentNodeId = baseMapper.selectParentIdByNodeId(nodeId);
        return ObjectUtil.isNotNull(rootNodeId) && rootNodeId.equals(parentNodeId);
    }

    @Override
    public List<NodeSearchResult> recentList(String spaceId, Long memberId) {
        List<String> nodeIds =
            multiDatasourceAdapterTemplate.getRecentlyVisitNodeIds(memberId, NodeType.FOLDER);
        List<NodeInfoVo> nodeInfos = this.getNodeInfoByNodeIds(spaceId, memberId, nodeIds).stream()
            .filter(i -> !i.getNodePrivate()).toList();
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
    public Optional<NodeEntity> findSameNameInSameLevel(String parentNodeId,
                                                        String nodeName) {
        List<NodeEntity> nodeEntities = getSubNodeList(parentNodeId);
        return nodeEntities.stream()
            .filter(node -> node.getNodeName().equals(nodeName))
            .findFirst();
    }

    @Override
    public void deleteMembersNodes(List<Long> unitIds) {
        baseMapper.updateIsDeletedByUnitIds(unitIds, true);
    }

    @Override
    public void restoreMembersNodes(List<Long> unitIds) {
        baseMapper.updateIsDeletedByUnitIds(unitIds, false);
    }

    @Override
    public Map<Long, Integer> getCountByUnitIds(List<Long> unitIds) {
        if (unitIds.isEmpty()) {
            return new HashMap<>(0);
        }
        List<NodeStatisticsDTO> privateNodes = baseMapper.selectCountByUnitIds(unitIds);
        return privateNodes.stream().collect(
            Collectors.toMap(NodeStatisticsDTO::getUnitId, NodeStatisticsDTO::getNodeCount));
    }

    @Override
    public Long getUnitIdByNodeId(String nodeId) {
        return baseMapper.selectUnitIdByNodeId(nodeId);
    }

    @Override
    public boolean nodePrivate(String nodeId) {
        Long unitId = getUnitIdByNodeId(nodeId);
        return !unitId.equals(0L);
    }

    @Override
    public boolean privateNodeOperation(Long userId, String nodeId) {
        Long nodeUnit = getUnitIdByNodeId(nodeId);
        // not private node
        if (nodeUnit.equals(0L)) {
            return true;
        }
        // check private user equals
        Long memberId = getMemberIdByUserIdAndNodeId(userId, nodeId);
        Long unitId = iUnitService.getUnitIdByRefId(memberId);
        return nodeUnit.equals(unitId);
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

    private boolean updateExtra(String nodeId, NodeType nodeType, String oldExtra,
                                Integer showRecordHistory,
                                NodeEmbedPageRo embedPage) {
        if (null == showRecordHistory && null == embedPage) {
            // dont need to update
            return true;
        }
        Dict extra = Dict.create();
        // Modify whether to display the history of the record
        if (ObjectUtil.isNotNull(showRecordHistory) && NodeType.DATASHEET.equals(nodeType)) {
            extra.set(NodeExtraConstants.SHOW_RECORD_HISTORY, showRecordHistory);
        }
        // embed page info
        if (ObjectUtil.isNotNull(embedPage) && NodeType.CUSTOM_PAGE.equals(nodeType)) {
            extra.set(NodeExtraConstants.EMBED_PAGE, embedPage);
        }
        if (null == oldExtra) {
            return SqlHelper.retBool(
                baseMapper.insertExtraByNodeId(nodeId, JSONUtil.toJsonStr(extra)));
        } else {
            return SqlHelper.retBool(
                baseMapper.updateExtraByNodeId(nodeId, JSONUtil.toJsonStr(extra)));
        }
    }

}
