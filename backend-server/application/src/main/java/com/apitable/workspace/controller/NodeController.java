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

package com.apitable.workspace.controller;

import static com.apitable.workspace.enums.NodeException.DUPLICATE_NODE_NAME;

import cn.hutool.core.collection.CollUtil;
import cn.hutool.core.collection.ListUtil;
import cn.hutool.core.util.NumberUtil;
import cn.hutool.core.util.ObjectUtil;
import cn.hutool.core.util.StrUtil;
import cn.hutool.json.JSONUtil;
import com.apitable.base.enums.ActionException;
import com.apitable.base.enums.ParameterException;
import com.apitable.control.infrastructure.ControlRoleDict;
import com.apitable.control.infrastructure.ControlTemplate;
import com.apitable.control.infrastructure.permission.NodePermission;
import com.apitable.control.infrastructure.role.ControlRole;
import com.apitable.control.infrastructure.role.ControlRoleManager;
import com.apitable.control.infrastructure.role.RoleConstants.Node;
import com.apitable.core.exception.BusinessException;
import com.apitable.core.support.ResponseData;
import com.apitable.core.util.ExceptionUtil;
import com.apitable.core.util.FileTool;
import com.apitable.core.util.SpringContextHolder;
import com.apitable.core.util.SqlTool;
import com.apitable.organization.dto.MemberDTO;
import com.apitable.organization.enums.UnitType;
import com.apitable.organization.mapper.MemberMapper;
import com.apitable.organization.service.IMemberService;
import com.apitable.organization.service.IUnitService;
import com.apitable.organization.vo.CreatedMemberInfoVo;
import com.apitable.organization.vo.MemberBriefInfoVo;
import com.apitable.shared.cache.bean.OpenedSheet;
import com.apitable.shared.cache.service.SpaceCapacityCacheService;
import com.apitable.shared.cache.service.UserActiveSpaceCacheService;
import com.apitable.shared.cache.service.UserSpaceOpenedSheetCacheService;
import com.apitable.shared.component.notification.NotificationTemplateId;
import com.apitable.shared.component.notification.annotation.Notification;
import com.apitable.shared.component.scanner.annotation.ApiResource;
import com.apitable.shared.component.scanner.annotation.GetResource;
import com.apitable.shared.component.scanner.annotation.PostResource;
import com.apitable.shared.config.properties.LimitProperties;
import com.apitable.shared.constants.AuditConstants;
import com.apitable.shared.constants.FileSuffixConstants;
import com.apitable.shared.constants.ParamsConstants;
import com.apitable.shared.context.LoginContext;
import com.apitable.shared.context.SessionContext;
import com.apitable.shared.holder.SpaceHolder;
import com.apitable.shared.listener.event.AuditSpaceEvent;
import com.apitable.shared.listener.event.AuditSpaceEvent.AuditSpaceArg;
import com.apitable.shared.util.information.ClientOriginInfo;
import com.apitable.shared.util.information.InformationUtil;
import com.apitable.space.enums.AuditSpaceAction;
import com.apitable.space.enums.SpaceException;
import com.apitable.template.service.ITemplateService;
import com.apitable.user.mapper.UserMapper;
import com.apitable.workspace.dto.NodeCopyEffectDTO;
import com.apitable.workspace.entity.NodeEntity;
import com.apitable.workspace.enums.NodeException;
import com.apitable.workspace.enums.NodeType;
import com.apitable.workspace.enums.PermissionException;
import com.apitable.workspace.mapper.NodeDescMapper;
import com.apitable.workspace.mapper.NodeFavoriteMapper;
import com.apitable.workspace.mapper.NodeShareSettingMapper;
import com.apitable.workspace.ro.ActiveSheetsOpRo;
import com.apitable.workspace.ro.ImportExcelOpRo;
import com.apitable.workspace.ro.NodeBundleOpRo;
import com.apitable.workspace.ro.NodeCopyOpRo;
import com.apitable.workspace.ro.NodeDescOpRo;
import com.apitable.workspace.ro.NodeMoveOpRo;
import com.apitable.workspace.ro.NodeOpRo;
import com.apitable.workspace.ro.NodeUpdateOpRo;
import com.apitable.workspace.ro.RemindMemberRo;
import com.apitable.workspace.ro.RemindUnitsNoPermissionRo;
import com.apitable.workspace.service.IDatasheetService;
import com.apitable.workspace.service.INodeDescService;
import com.apitable.workspace.service.INodeRelService;
import com.apitable.workspace.service.INodeService;
import com.apitable.workspace.service.NodeBundleService;
import com.apitable.workspace.vo.NodeInfo;
import com.apitable.workspace.vo.NodeInfoTreeVo;
import com.apitable.workspace.vo.NodeInfoVo;
import com.apitable.workspace.vo.NodeInfoWindowVo;
import com.apitable.workspace.vo.NodePathVo;
import com.apitable.workspace.vo.NodePermissionView;
import com.apitable.workspace.vo.NodeSearchResult;
import com.apitable.workspace.vo.ShowcaseVo;
import com.apitable.workspace.vo.ShowcaseVo.NodeExtra;
import com.apitable.workspace.vo.ShowcaseVo.Social;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.Parameters;
import io.swagger.v3.oas.annotations.enums.ParameterIn;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.annotation.Resource;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.Stream;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.io.IOUtils;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/**
 * Workbench - Node Api.
 */
@Tag(name = "Workbench - Node Api")
@RestController
@ApiResource(path = "/node")
@Slf4j
public class NodeController {

    @Resource
    private IMemberService memberService;

    @Resource
    private INodeService iNodeService;

    @Resource
    private INodeDescService iNodeDescService;

    @Resource
    private NodeDescMapper nodeDescMapper;

    @Resource
    private NodeFavoriteMapper nodeFavoriteMapper;

    @Resource
    private NodeBundleService nodeBundleService;

    @Resource
    private IUnitService unitService;

    @Resource
    private ControlTemplate controlTemplate;

    @Resource
    private NodeShareSettingMapper nodeShareSettingMapper;

    @Resource
    private UserSpaceOpenedSheetCacheService userSpaceOpenedSheetCacheService;

    @Resource
    private IDatasheetService datasheetService;

    @Resource
    private UserMapper userMapper;

    @Resource
    private MemberMapper memberMapper;

    @Resource
    private INodeRelService iNodeRelService;

    @Resource
    private LimitProperties limitProperties;

    @Resource
    private SpaceCapacityCacheService spaceCapacityCacheService;

    @Resource
    private UserActiveSpaceCacheService userActiveSpaceCacheService;

    @Resource
    private ITemplateService iTemplateService;

    @Resource
    private IUnitService iUnitService;

    private static final String ROLE_DESC = "<br/>Role Type：<br/>"
        + "1.owner can add, edit, move, sort, delete, copy folders in the specified working "
        + "directory。<br/>"
        + "2.manager can add, edit, move, sort, delete, and copy folders in the specified working "
        + "directory.<br/>"
        + "3.editor can only edit records and views of the data table, but not edit fields<br/>"
        + "4.readonly can only view the number table, you cannot make any edits and modifications, "
        + "you can only assign read-only permissions to other members。<br/>";

    /**
     * Fuzzy search node.
     */
    @GetResource(path = "/search")
    @Operation(summary = "Fuzzy search node", description =
        "Enter the search term to search for the node of the working directory." + ROLE_DESC)
    @Parameters({
        @Parameter(name = ParamsConstants.SPACE_ID, description = "space id", required = true,
            schema = @Schema(type = "string"), in = ParameterIn.HEADER, example = "spcyQkKp9XJEl"),
        @Parameter(name = "className", description = "highlight style",
            schema = @Schema(type = "string"), in = ParameterIn.QUERY, example = "highLight"),
        @Parameter(name = "keyword", description = "keyword", required = true,
            schema = @Schema(type = "string"), in = ParameterIn.QUERY, example = "datasheet"),
        @Parameter(name = "unitType", description = "unitType, 1: team, 3: member(private)",
            in = ParameterIn.QUERY, schema = @Schema(type = "integer"), example = "1"),
    })
    public ResponseData<List<NodeSearchResult>> searchNode(
        @RequestParam(name = "keyword") String keyword,
        @RequestParam(value = "className", required = false, defaultValue = "keyword")
        String className,
        @RequestParam(name = "unitType", required = false) Integer unitType) {
        String spaceId = LoginContext.me().getSpaceId();
        Long memberId = LoginContext.me().getMemberId();
        List<NodeSearchResult> nodeInfos = iNodeService.searchNode(spaceId, memberId, keyword);
        if (UnitType.TEAM.getType().equals(unitType)) {
            nodeInfos = nodeInfos.stream().filter(i -> !i.getNodePrivate()).toList();
        }
        if (UnitType.MEMBER.getType().equals(unitType)) {
            nodeInfos = nodeInfos.stream().filter(NodeInfoVo::getNodePrivate).toList();
        }
        nodeInfos.forEach(info -> info.setNodeName(
            InformationUtil.keywordHighlight(info.getNodeName(), keyword, className)));
        return ResponseData.success(nodeInfos);
    }

    /**
     * Query tree node.
     */
    @GetResource(path = "/tree")
    @Operation(summary = "Query tree node", description =
        "Query the node tree of workbench, restricted to two levels." + ROLE_DESC)
    @Parameters({
        @Parameter(name = ParamsConstants.SPACE_ID, description = "space id", required = true,
            schema = @Schema(type = "string"), in = ParameterIn.HEADER, example = "spcyQkKp9XJEl"),
        @Parameter(name = "depth", in = ParameterIn.QUERY,
            description = "tree depth, we can specify the query depth, maximum 2 layers depth.",
            schema = @Schema(type = "integer"), example = "2"),
        @Parameter(name = "unitType", in = ParameterIn.QUERY,
            description = "unitType, 1: team, 3: member(private)",
            schema = @Schema(type = "integer"), example = "3"),
    })
    public ResponseData<NodeInfoTreeVo> getTree(
        @RequestParam(name = "depth", defaultValue = "2") @Valid @Min(0) @Max(2) Integer depth,
        @RequestParam(name = "unitType", required = false) Integer unitType) {
        String spaceId = LoginContext.me().getSpaceId();
        Long memberId = LoginContext.me().getMemberId();
        String rootNodeId = iNodeService.getRootNodeIdBySpaceId(spaceId);
        NodeInfoTreeVo tree =
            null != unitType ? iNodeService.getNodeTree(spaceId, rootNodeId, memberId, depth,
                UnitType.toEnum(unitType)) :
                iNodeService.getNodeTree(spaceId, rootNodeId, memberId, depth);
        return ResponseData.success(tree);
    }

    /**
     * Get nodes of the specified type.
     */
    @GetResource(path = "/list")
    @Operation(summary = "Get nodes of the specified type",
        description = "scenario: query an existing dashboard")
    @Parameters({
        @Parameter(name = ParamsConstants.SPACE_ID, description = "space id", required = true,
            in = ParameterIn.HEADER, schema = @Schema(type = "string"), example = "spczJrh2i3tLW"),
        @Parameter(name = "type", description = "node type", required = true,
            schema = @Schema(type = "integer"), in = ParameterIn.QUERY, example = "2"),
        @Parameter(name = "role", description = "role（manageable by default）",
            schema = @Schema(type = "string"), in = ParameterIn.QUERY, example = "manager")
    })
    public ResponseData<List<NodeInfo>> list(@RequestParam(value = "type") Integer type,
                                             @RequestParam(value = "role", required = false, defaultValue = "manager")
                                             String role) {
        String spaceId = LoginContext.me().getSpaceId();
        Long memberId = LoginContext.me().getMemberId();
        List<String> nodeIds = iNodeService.getNodeIdBySpaceIdAndType(spaceId, type);
        if (nodeIds.isEmpty()) {
            return ResponseData.success(new ArrayList<>());
        }
        ControlRoleDict roleDict = controlTemplate.fetchNodeRole(memberId, nodeIds);
        if (roleDict.isEmpty()) {
            return ResponseData.success(new ArrayList<>());
        }
        ControlRole requireRole = ControlRoleManager.parseNodeRole(role);
        List<String> filterNodeIds = roleDict.entrySet().stream()
            .filter(entry -> entry.getValue().isGreaterThanOrEqualTo(requireRole))
            .map(Map.Entry::getKey).collect(Collectors.toList());
        if (CollUtil.isEmpty(filterNodeIds)) {
            return ResponseData.success(new ArrayList<>());
        }
        return ResponseData.success(iNodeService.getNodeInfoByNodeIds(filterNodeIds));
    }

    /**
     * Query nodes.
     */
    @GetResource(path = "/get", requiredPermission = false)
    @Operation(summary = "Query nodes",
        description = "obtain information about the node " + ROLE_DESC)
    @Parameter(name = "nodeIds", in = ParameterIn.QUERY, description = "node ids", required = true,
        schema = @Schema(type = "string"), example = "nodRTGSy43DJ9,nodRTGSy43DJ9")
    public ResponseData<List<NodeInfoVo>> getByNodeId(
        @RequestParam("nodeIds") List<String> nodeIds) {
        if (nodeIds.isEmpty()) {
            return ResponseData.success(ListUtil.empty());
        }
        // Obtain the space ID. The method includes determining whether the node exists.
        String spaceId = iNodeService.getSpaceIdByNodeId(nodeIds.get(0));
        // Gets the member ID by determining whether the user is in this space.
        Long memberId = LoginContext.me().getUserSpaceDto(spaceId).getMemberId();
        return ResponseData.success(iNodeService.getNodeInfoByNodeIds(spaceId, memberId, nodeIds));
    }

    /**
     * Folder preview.
     */
    @GetResource(path = "/showcase", requiredLogin = false)
    @Operation(summary = "Folder preview", description = "Nodes that are not in the center of the"
        + " template, make cross-space judgments.")
    @Parameters({
        @Parameter(name = "nodeId", description = "node id", required = true,
            schema = @Schema(type = "string"), in = ParameterIn.QUERY, example = "nodRTGSy43DJ9"),
        @Parameter(name = "shareId", description = "share id", schema = @Schema(type = "string"),
            in = ParameterIn.QUERY, example = "shrRTGSy43DJ9")
    })
    public ResponseData<ShowcaseVo> showcase(@RequestParam("nodeId") String nodeId,
                                             @RequestParam(value = "shareId", required = false)
                                             String shareId) {
        // Obtain the node entity. The method includes determining whether the node exists.
        NodeEntity node = iNodeService.getByNodeId(nodeId);
        ControlRole role;
        boolean nodeFavorite = false;
        if (!node.getIsTemplate()) {
            if (StrUtil.isNotBlank(shareId)) {
                // Open in node sharing to verify the sharing validity and whether the node has
                // sharing.
                String shareNodeId = nodeShareSettingMapper.selectNodeIdByShareId(shareId);
                ExceptionUtil.isNotNull(shareNodeId, NodeException.SHARE_EXPIRE);
                if (!nodeId.equals(shareNodeId)) {
                    List<String> nodes = iNodeService.getPathParentNode(nodeId);
                    ExceptionUtil.isTrue(nodes.contains(shareNodeId),
                        PermissionException.NODE_ACCESS_DENIED);
                }
                role = ControlRoleManager.parseNodeRole(Node.ANONYMOUS);
            } else {
                // The method includes determining whether the user is in this space.
                Long memberId = LoginContext.me().getUserSpaceDto(node.getSpaceId()).getMemberId();
                role = controlTemplate.fetchNodeRole(memberId, nodeId);
                // query whether the node is favorite
                nodeFavorite =
                    SqlTool.retCount(nodeFavoriteMapper.countByMemberIdAndNodeId(memberId, nodeId))
                        > 0;
            }
        } else {
            role = ControlRoleManager.parseNodeRole(Node.TEMPLATE_VISITOR);
        }
        String description = nodeDescMapper.selectDescriptionByNodeId(nodeId);
        NodePermissionView permissions = role.permissionToBean(NodePermissionView.class);
        // query node creator basic information
        MemberDTO memberDto =
            memberMapper.selectMemberDtoByUserIdAndSpaceId(node.getCreatedBy(), node.getSpaceId());
        CreatedMemberInfoVo createdMemberInfo = null;
        if (null != memberDto) {
            createdMemberInfo = new CreatedMemberInfoVo();
            createdMemberInfo.setMemberName(memberDto.getMemberName());
            createdMemberInfo.setAvatar(memberDto.getAvatar());
        }
        NodeExtra extra = iNodeService.getNodeExtras(nodeId, node.getSpaceId(), node.getExtra());
        ShowcaseVo.Social social = null;
        if (StrUtil.isNotBlank(extra.getDingTalkCorpId())) {
            social = new Social(extra.getDingTalkDaStatus(), extra.getDingTalkSuiteKey(),
                extra.getDingTalkCorpId(), extra.getSourceTemplateId(), extra.getShowTips());
        }
        ShowcaseVo vo = new ShowcaseVo(nodeId, node.getNodeName(), node.getType(), node.getIcon(),
            node.getCover(),
            description, role.getRoleTag(), permissions, nodeFavorite, createdMemberInfo,
            node.getUpdatedAt(),
            social, extra);
        return ResponseData.success(vo);
    }

    /**
     * Node info window.
     */
    @GetResource(path = "/window", requiredPermission = false)
    @Operation(summary = "Node info window", description = "Nodes that are not in the center of "
        + "the template, make spatial judgments.")
    public ResponseData<NodeInfoWindowVo> showNodeInfoWindow(
        @RequestParam("nodeId") String nodeId) {
        // The method includes determining whether the user is in this space.
        Long userId = SessionContext.getUserId();
        // The method includes determining whether a node exists.
        String spaceId = iNodeService.getSpaceIdByNodeId(nodeId);
        // check permission
        Long memberId = LoginContext.me().getMemberId(userId, spaceId);
        controlTemplate.checkNodePermission(memberId, nodeId, NodePermission.READ_NODE,
            status -> ExceptionUtil.isTrue(status, PermissionException.NODE_OPERATION_DENIED));
        // build node info window
        return ResponseData.success(iNodeService.getNodeWindowInfo(nodeId));
    }

    /**
     * Get parent nodes.
     */
    @GetResource(path = "/parents", requiredPermission = false)
    @Operation(summary = "Get parent nodes", description =
        "Gets a list of all parent nodes of the specified node " + ROLE_DESC)
    @Parameter(name = "nodeId", description = "node id", required = true,
        schema = @Schema(type = "string"), in = ParameterIn.QUERY, example = "nodRTGSy43DJ9")
    public ResponseData<List<NodePathVo>> getParentNodes(
        @RequestParam(name = "nodeId") String nodeId) {
        // The method includes determining whether a node exists.
        String spaceId = iNodeService.getSpaceIdByNodeId(nodeId);
        // check whether cross space
        LoginContext.me().getUserSpaceDto(spaceId);
        List<NodePathVo> nodePaths = iNodeService.getParentPathByNodeId(spaceId, nodeId);
        return ResponseData.success(nodePaths);
    }

    /**
     * Get child nodes.
     */
    @GetResource(path = "/children", requiredPermission = false)
    @Operation(summary = "Get child nodes",
        description = "Obtain the list of child nodes of the specified node."
            + " The nodes are classified into folders or datasheet by type " + ROLE_DESC)
    @Parameters({
        @Parameter(name = "nodeId", description = "node id", required = true,
            schema = @Schema(type = "string"), in = ParameterIn.QUERY, example = "nodRTGSy43DJ9"),
        @Parameter(name = "nodeType", description = "node type 1:folder,2:datasheet",
            schema = @Schema(type = "integer"), in = ParameterIn.QUERY, example = "1"),
        @Parameter(name = "unitType", in = ParameterIn.QUERY,
            description = "unitType, 3: member(private)",
            schema = @Schema(type = "integer"), example = "3")
    })
    public ResponseData<List<NodeInfoVo>> getNodeChildrenList(
        @RequestParam(name = "nodeId") String nodeId,
        @RequestParam(name = "nodeType", required = false) Integer nodeType,
        @RequestParam(name = "unitType", required = false) Integer unitType) {
        // get the space ID, the method includes judging whether the node exists
        String spaceId = iNodeService.getSpaceIdByNodeId(nodeId);
        NodeType nodeTypeEnum = null;
        if (null != nodeType) {
            nodeTypeEnum = NodeType.toEnum(nodeType);
        }
        // The method includes determining whether the user is in this space.
        Long memberId = LoginContext.me().getUserSpaceDto(spaceId).getMemberId();
        List<NodeInfoVo> nodeInfos =
            iNodeService.getChildNodesByNodeId(spaceId, memberId, nodeId, nodeTypeEnum);
        nodeInfos = nodeInfos.stream()
            .filter(i -> {
                if (UnitType.MEMBER.getType().equals(unitType)) {
                    return i.getNodePrivate();
                } else {
                    return !i.getNodePrivate();
                }
            })
            .collect(Collectors.toList());
        return ResponseData.success(nodeInfos);
    }

    /**
     * Position node.
     */
    @GetResource(path = "/position/{nodeId}", requiredPermission = false)
    @Operation(summary = "Position node", description = "node in must " + ROLE_DESC)
    @Parameter(name = "nodeId", description = "node id", required = true,
        schema = @Schema(type = "string"), in = ParameterIn.PATH, example = "nodRTGSy43DJ9")
    public ResponseData<NodeInfoTreeVo> position(@PathVariable("nodeId") String nodeId) {
        // The method includes determining whether a node exists.
        String spaceId = iNodeService.getSpaceIdByNodeId(nodeId);
        // The method includes determining whether the user is in this space.
        Long memberId = LoginContext.me().getUserSpaceDto(spaceId).getMemberId();
        // check node permissions
        controlTemplate.checkNodePermission(memberId, nodeId, NodePermission.READ_NODE,
            status -> ExceptionUtil.isTrue(status, PermissionException.NODE_OPERATION_DENIED));
        NodeInfoTreeVo treeVo = iNodeService.position(spaceId, memberId, nodeId);
        return ResponseData.success(treeVo);
    }

    /**
     * Create child node.
     */
    @Notification(templateId = NotificationTemplateId.NODE_CREATE)
    @PostResource(path = "/create", requiredPermission = false)
    @Operation(summary = "Create child node",
        description = "create a new node under the node" + ROLE_DESC)
    @Parameter(name = ParamsConstants.PLAYER_SOCKET_ID, description = "user socket id",
        schema = @Schema(type = "string"), in = ParameterIn.HEADER, example = "QkKp9XJEl")
    public ResponseData<NodeInfoVo> create(@RequestBody @Valid NodeOpRo nodeOpRo) {
        Long userId = SessionContext.getUserId();
        // The method includes determining whether a node exists.
        String spaceId = iNodeService.getSpaceIdByNodeId(nodeOpRo.getParentId());
        SpaceHolder.set(spaceId);
        // The method includes determining whether the user is in this space.
        Long memberId = LoginContext.me().getMemberId(userId, spaceId);
        // Check whether the parent node has the specified operation permission
        iNodeService.checkEnableOperateNodeBySpaceFeature(memberId, spaceId,
            nodeOpRo.getParentId());
        ControlRole role = controlTemplate.fetchNodeRole(memberId, nodeOpRo.getParentId());
        ExceptionUtil.isTrue(role.hasPermission(NodePermission.CREATE_NODE),
            PermissionException.NODE_OPERATION_DENIED);
        // Check whether the source tables of form and mirror exist and whether they have the
        // specified operation permissions.
        iNodeService.checkSourceDatasheet(spaceId, memberId, nodeOpRo.getType(),
            nodeOpRo.getUnitId(), nodeOpRo.getExtra());
        if (Boolean.TRUE.equals(nodeOpRo.getCheckDuplicateName())
            && StrUtil.isNotBlank(nodeOpRo.getNodeName())) {
            Optional<NodeEntity> nodeOptional = iNodeService.findSameNameInSameLevel(
                nodeOpRo.getParentId(), nodeOpRo.getNodeName());
            if (nodeOptional.isPresent()) {
                return ResponseData.status(false, DUPLICATE_NODE_NAME.getCode(),
                        DUPLICATE_NODE_NAME.getMessage())
                    .data(iNodeService.getNodeInfoByNodeId(spaceId, nodeOptional.get().getNodeId(),
                        role));
            }
        }
        iUnitService.checkUnit(memberId, nodeOpRo.getUnitId());
        String nodeId = iNodeService.createNode(userId, spaceId, nodeOpRo);
        // publish space audit events
        ClientOriginInfo clientOriginInfo = InformationUtil
            .getClientOriginInfoInCurrentHttpContext(true, false);
        AuditSpaceArg arg =
            AuditSpaceArg.builder().action(AuditSpaceAction.CREATE_NODE).userId(userId)
                .nodeId(nodeId)
                .requestIp(clientOriginInfo.getIp())
                .requestUserAgent(clientOriginInfo.getUserAgent())
                .build();
        SpringContextHolder.getApplicationContext().publishEvent(new AuditSpaceEvent(this, arg));
        // The new node inherits parent node permissions by default
        return ResponseData.success(iNodeService.getNodeInfoByNodeId(spaceId, nodeId, role));
    }

    /**
     * Edit node.
     */
    @Notification(templateId = NotificationTemplateId.NODE_UPDATE)
    @PostResource(path = "/update/{nodeId}", requiredPermission = false)
    @Operation(summary = "Edit node",
        description = "node id must. name, icon is not required" + ROLE_DESC)
    @Parameters({
        @Parameter(name = "nodeId", description = "node id", required = true,
            schema = @Schema(type = "string"), in = ParameterIn.PATH, example = "nodRTGSy43DJ9"),
        @Parameter(name = ParamsConstants.PLAYER_SOCKET_ID, description = "user socket id",
            schema = @Schema(type = "string"), in = ParameterIn.HEADER, example = "QkKp9XJEl")
    })
    public ResponseData<NodeInfoVo> update(@PathVariable("nodeId") String nodeId,
                                           @RequestBody @Valid NodeUpdateOpRo nodeOpRo) {
        ExceptionUtil.isTrue(
            StrUtil.isNotBlank(nodeOpRo.getNodeName()) || ObjectUtil.isNotNull(nodeOpRo.getIcon())
                || ObjectUtil.isNotNull(nodeOpRo.getCover())
                || ObjectUtil.isNotNull(nodeOpRo.getShowRecordHistory())
                || ObjectUtil.isNotNull(nodeOpRo.getEmbedPage()), ParameterException.NO_ARG);
        Long userId = SessionContext.getUserId();
        // The method includes determining whether a node exists.
        String spaceId = iNodeService.getSpaceIdByNodeId(nodeId);
        SpaceHolder.set(spaceId);
        // The method includes determining whether the user is in this space.
        Long memberId = LoginContext.me().getMemberId(userId, spaceId);
        NodePermission nodePermission =
            NodeType.CUSTOM_PAGE.equals(iNodeService.getTypeByNodeId(nodeId))
                ? NodePermission.EDIT_CELL
                : NodePermission.MANAGE_NODE;
        // check whether the node has the specified operation permission
        controlTemplate.checkNodePermission(memberId, nodeId, nodePermission,
            status -> ExceptionUtil.isTrue(status, PermissionException.NODE_OPERATION_DENIED));
        iNodeService.edit(userId, nodeId, nodeOpRo);
        return ResponseData.success(
            iNodeService.getNodeInfoByNodeIds(spaceId, memberId, ListUtil.toList(nodeId)).stream()
                .findFirst().orElse(null));
    }

    /**
     * Update node description.
     */
    @Notification(templateId = NotificationTemplateId.NODE_UPDATE_DESC)
    @PostResource(path = "/updateDesc", requiredPermission = false)
    @Operation(summary = "Update node description")
    @Parameter(name = ParamsConstants.PLAYER_SOCKET_ID, description = "user socket id",
        schema = @Schema(type = "string"), in = ParameterIn.HEADER, example = "QkKp9XJEl")
    public ResponseData<Void> updateDesc(@RequestBody @Valid NodeDescOpRo opRo) {
        // The method includes determining whether a node exists.
        String spaceId = iNodeService.getSpaceIdByNodeId(opRo.getNodeId());
        SpaceHolder.set(spaceId);
        // The method includes determining whether the user is in this space.
        Long memberId = LoginContext.me().getUserSpaceDto(spaceId).getMemberId();
        // Check whether there is a specified operation permission under the node.
        controlTemplate.checkNodePermission(memberId, opRo.getNodeId(),
            NodePermission.EDIT_NODE_DESC,
            status -> ExceptionUtil.isTrue(status, PermissionException.NODE_OPERATION_DENIED));
        iNodeDescService.edit(opRo.getNodeId(), opRo.getDescription());
        // publish space audit events
        ClientOriginInfo clientOriginInfo = InformationUtil
            .getClientOriginInfoInCurrentHttpContext(true, false);
        AuditSpaceArg arg = AuditSpaceArg.builder().action(AuditSpaceAction.UPDATE_NODE_DESC)
            .requestIp(clientOriginInfo.getIp())
            .requestUserAgent(clientOriginInfo.getUserAgent())
            .userId(SessionContext.getUserId()).nodeId(opRo.getNodeId()).build();
        SpringContextHolder.getApplicationContext().publishEvent(new AuditSpaceEvent(this, arg));
        return ResponseData.success();
    }

    /**
     * Move node.
     */
    @Notification(templateId = NotificationTemplateId.NODE_MOVE)
    @PostResource(path = "/move")
    @Operation(summary = "Move node",
        description = "Node ID and parent node ID are required, and pre Node Id is not required.")
    @Parameters({
        @Parameter(name = ParamsConstants.SPACE_ID, description = "space id", required = true,
            schema = @Schema(type = "string"), in = ParameterIn.HEADER, example = "spcyQkKp9XJEl"),
        @Parameter(name = ParamsConstants.PLAYER_SOCKET_ID, description = "user socket id",
            schema = @Schema(type = "string"), in = ParameterIn.HEADER, example = "QkKp9XJEl")
    })
    public ResponseData<List<NodeInfoVo>> move(@RequestBody @Valid NodeMoveOpRo nodeOpRo) {
        Long memberId = LoginContext.me().getMemberId();
        String spaceId = LoginContext.me().getSpaceId();
        SpaceHolder.set(spaceId);
        iNodeService.checkEnableOperateNodeBySpaceFeature(memberId, spaceId,
            nodeOpRo.getParentId());
        iNodeService.checkNodeIfExist(spaceId, nodeOpRo.getNodeId());
        iNodeService.checkNodeIfExist(spaceId, nodeOpRo.getParentId());
        if (StrUtil.isNotBlank(nodeOpRo.getPreNodeId())) {
            iNodeService.checkNodeIfExist(spaceId, nodeOpRo.getPreNodeId());
        }
        // manageable for this node
        controlTemplate.checkNodePermission(memberId, nodeOpRo.getNodeId(),
            NodePermission.MOVE_NODE,
            status -> ExceptionUtil.isTrue(status, PermissionException.NODE_OPERATION_DENIED));
        // check movement operation
        String parentId = iNodeService.getParentIdByNodeId(nodeOpRo.getNodeId());
        iNodeService.checkEnableOperateNodeBySpaceFeature(memberId, spaceId, parentId);
        if (parentId.equals(nodeOpRo.getParentId())) {
            // move under sibling
            controlTemplate.checkNodePermission(memberId, nodeOpRo.getParentId(),
                NodePermission.MANAGE_NODE,
                status -> ExceptionUtil.isTrue(status, PermissionException.NODE_OPERATION_DENIED));
        } else {
            // manageable destination folder
            controlTemplate.checkNodePermission(memberId, nodeOpRo.getParentId(),
                NodePermission.CREATE_NODE,
                status -> ExceptionUtil.isTrue(status, PermissionException.NODE_OPERATION_DENIED));
        }
        Long userId = SessionContext.getUserId();
        // if node is private check foreign link
        if (iNodeService.nodePrivate(nodeOpRo.getNodeId()) && null == nodeOpRo.getUnitId()) {
            iTemplateService.checkTemplateForeignNode(memberId, nodeOpRo.getNodeId());
        }
        List<String> nodeIds = iNodeService.move(userId, nodeOpRo);
        List<NodeInfoVo> nodes = iNodeService.getNodeInfoByNodeIds(spaceId, memberId, nodeIds);
        if (null != nodeOpRo.getUnitId()) {
            nodes = nodes.stream().filter(NodeInfoVo::getNodePrivate).toList();
        } else {
            nodes = nodes.stream().filter(i -> !i.getNodePrivate()).toList();
        }
        return ResponseData.success(nodes);
    }

    /**
     * Delete node.
     */
    @Notification(templateId = NotificationTemplateId.NODE_DELETE)
    @PostResource(path = "/delete/{nodeId}",
        method = {RequestMethod.DELETE, RequestMethod.POST}, requiredPermission = false)
    @Operation(summary = "Delete node",
        description = "You can pass in an ID array and delete multiple nodes.")
    @Parameters({
        @Parameter(name = "nodeId", description = "node id", required = true,
            schema = @Schema(type = "string"), in = ParameterIn.PATH, example = "nodRTGSy43DJ9"),
        @Parameter(name = ParamsConstants.PLAYER_SOCKET_ID, description = "user socket id",
            schema = @Schema(type = "string"), in = ParameterIn.HEADER, example = "QkKp9XJEl")
    })
    public ResponseData<Void> delete(@PathVariable("nodeId") String nodeId) {
        // The method includes determining whether a node exists.
        String spaceId = iNodeService.getSpaceIdByNodeId(nodeId);
        SpaceHolder.set(spaceId);
        // The method includes determining whether the user is in this space.
        Long memberId = LoginContext.me().getUserSpaceDto(spaceId).getMemberId();
        // root node cannot be deleted
        String rootNodeId = iNodeService.getRootNodeIdBySpaceId(spaceId);
        ExceptionUtil.isFalse(nodeId.equals(rootNodeId), PermissionException.NODE_OPERATION_DENIED);
        // Check whether there is a specified operation permission under the node.
        controlTemplate.checkNodePermission(memberId, nodeId, NodePermission.REMOVE_NODE,
            status -> ExceptionUtil.isTrue(status, PermissionException.NODE_OPERATION_DENIED));
        iNodeService.deleteById(spaceId, memberId, nodeId);
        // delete space capacity cache
        spaceCapacityCacheService.del(spaceId);
        return ResponseData.success();
    }

    /**
     * Copy node.
     */
    @Notification(templateId = NotificationTemplateId.NODE_CREATE)
    @PostResource(path = "/copy", requiredPermission = false)
    @Operation(summary = "Copy node",
        description = "node id is required, whether to copy data is not required.")
    @Parameter(name = ParamsConstants.PLAYER_SOCKET_ID, description = "user socket id",
        schema = @Schema(type = "string"), in = ParameterIn.HEADER, example = "QkKp9XJEl")
    public ResponseData<NodeInfoVo> copy(@RequestBody @Valid NodeCopyOpRo nodeOpRo) {
        Long userId = SessionContext.getUserId();
        // The method includes determining whether a node exists.
        String spaceId = iNodeService.getSpaceIdByNodeId(nodeOpRo.getNodeId());
        SpaceHolder.set(spaceId);
        // The method includes determining whether the user is in this space.
        Long memberId = LoginContext.me().getMemberId(userId, spaceId);
        // Verify the permissions of this node
        controlTemplate.checkNodePermission(memberId, nodeOpRo.getNodeId(),
            NodePermission.COPY_NODE,
            status -> ExceptionUtil.isTrue(status, PermissionException.NODE_OPERATION_DENIED));
        // Copy the datasheet requires the parent node's permission to create child nodes.
        String parentId = iNodeService.getParentIdByNodeId(nodeOpRo.getNodeId());
        ControlRole role = controlTemplate.fetchNodeRole(memberId, parentId);
        ExceptionUtil.isTrue(role.hasPermission(NodePermission.CREATE_NODE),
            PermissionException.NODE_OPERATION_DENIED);
        // replication node
        NodeCopyEffectDTO copyEffect = iNodeService.copy(userId, nodeOpRo);
        iNodeService.nodeCopyChangeset(copyEffect);
        // publish space audit events
        ClientOriginInfo clientOriginInfo = InformationUtil
            .getClientOriginInfoInCurrentHttpContext(true, false);
        AuditSpaceArg arg =
            AuditSpaceArg.builder().action(AuditSpaceAction.COPY_NODE).userId(userId)
                .nodeId(copyEffect.getCopyNodeId())
                .requestIp(clientOriginInfo.getIp())
                .requestUserAgent(clientOriginInfo.getUserAgent())
                .info(JSONUtil.createObj().set(AuditConstants.SOURCE_NODE_ID, nodeOpRo.getNodeId())
                    .set(AuditConstants.RECORD_COPYABLE, nodeOpRo.getData())).build();
        SpringContextHolder.getApplicationContext().publishEvent(new AuditSpaceEvent(this, arg));
        // The new node inherits parent node permissions by default
        return ResponseData.success(
            iNodeService.getNodeInfoByNodeId(spaceId, copyEffect.getCopyNodeId(), role));
    }

    /**
     * Export Bundle.
     */
    @GetResource(path = "/exportBundle", requiredPermission = false)
    @Operation(summary = "Export Bundle")
    @Parameters({
        @Parameter(name = "nodeId", description = "node id", required = true,
            schema = @Schema(type = "string"), in = ParameterIn.QUERY, example = "fod8mXUeiXyVo"),
        @Parameter(name = "saveData", description = "whether to retain data",
            schema = @Schema(type = "boolean"), in = ParameterIn.QUERY, example = "true"),
        @Parameter(name = "password", description = "encrypted password",
            schema = @Schema(type = "string"), in = ParameterIn.QUERY, example = "qwer1234")
    })
    public void exportBundle(@RequestParam("nodeId") String nodeId,
                             @RequestParam(value = "saveData", required = false, defaultValue = "true")
                             Boolean saveData,
                             @RequestParam(value = "password", required = false) String password) {
        Long userId = SessionContext.getUserId();
        // The method includes determining whether a node exists.
        String spaceId = iNodeService.getSpaceIdByNodeId(nodeId);
        SpaceHolder.set(spaceId);
        // The method includes determining whether the user is in this space.
        Long memberId = LoginContext.me().getMemberId(userId, spaceId);
        // check node permissions
        controlTemplate.checkNodePermission(memberId, nodeId, NodePermission.MANAGE_NODE,
            status -> ExceptionUtil.isTrue(status, PermissionException.NODE_OPERATION_DENIED));
        // Verify the permissions of all child and descendant nodes
        iNodeService.checkSubNodePermission(memberId, nodeId,
            ControlRoleManager.parseNodeRole(Node.MANAGER));
        nodeBundleService.generate(nodeId, saveData, password);
    }

    /**
     * Analyze Bundle.
     */
    @PostResource(path = "/analyzeBundle", requiredLogin = false)
    @Operation(summary = "Analyze Bundle", description = "The front node is saved in the first "
        + "place of the parent node when it is not under the parent node. Save in the first place"
        + " of the first level directory when it is not transmitted.")
    public ResponseData<Void> analyzeBundle(@Valid NodeBundleOpRo opRo) {
        String parentId = opRo.getParentId();
        Long userId = SessionContext.getUserId();
        // The method includes determining whether a node exists.
        String spaceId = iNodeService.getSpaceIdByNodeId(parentId);
        SpaceHolder.set(spaceId);
        // The method includes determining whether the user is in this space.
        Long memberId = LoginContext.me().getMemberId(userId, spaceId);
        // verify parent node permissions
        if (StrUtil.isNotBlank(parentId)) {
            controlTemplate.checkNodePermission(memberId, parentId, NodePermission.CREATE_NODE,
                status -> ExceptionUtil.isTrue(status, PermissionException.NODE_OPERATION_DENIED));
        }
        if (StrUtil.isBlank(parentId) && StrUtil.isBlank(opRo.getPreNodeId())) {
            parentId = iNodeService.getRootNodeIdBySpaceId(spaceId);
        }
        iUnitService.checkUnit(memberId, opRo.getUnitId());
        nodeBundleService.analyze(opRo.getFile(), opRo.getPassword(), parentId, opRo.getPreNodeId(),
            userId, NumberUtil.parseLong(opRo.getUnitId()));
        return ResponseData.success();
    }

    /**
     * Import excel.
     */
    @Notification(templateId = NotificationTemplateId.NODE_CREATE)
    @PostResource(path = {"/import", "/{parentId}/importExcel"}, requiredPermission = false)
    @Operation(summary = "Import excel", description = "all parameters must be")
    @Parameter(name = "parentId", description = "Parent Node ID", required = true,
        schema = @Schema(type = "string"), in = ParameterIn.PATH, example = "fodNwmWE5QWPs")
    public ResponseData<NodeInfoVo> importExcel(@Valid ImportExcelOpRo data) throws IOException {
        ExceptionUtil.isTrue(data.getFile().getSize() <= limitProperties.getMaxFileSize(),
            ActionException.FILE_EXCEED_LIMIT);
        Long userId = SessionContext.getUserId();
        // The method includes determining whether a node exists.
        String spaceId = iNodeService.getSpaceIdByNodeId(data.getParentId());
        SpaceHolder.set(spaceId);
        // The method includes determining whether the user is in this space.
        Long memberId = LoginContext.me().getMemberId(userId, spaceId);
        // Check whether there is a specified operation permission under the node.
        ControlRole role = controlTemplate.fetchNodeRole(memberId, data.getParentId());
        ExceptionUtil.isTrue(role.hasPermission(NodePermission.CREATE_NODE),
            PermissionException.NODE_OPERATION_DENIED);
        // String nodeId = iNodeService.importExcel(userId, spaceId, data);
        // The new node inherits parent node permissions by default
        String uuid = userMapper.selectUuidById(userId);
        // fileName
        String mainName = cn.hutool.core.io.FileUtil.mainName(data.getFile().getOriginalFilename());
        if (StrUtil.isBlank(mainName)) {
            throw new BusinessException("file name is empty");
        }
        mainName =
            iNodeService.duplicateNameModify(data.getParentId(), NodeType.DATASHEET.getNodeType(),
                mainName, null, NumberUtil.parseLong(data.getUnitId()));
        // file type suffix
        String fileSuffix =
            cn.hutool.core.io.FileUtil.extName(data.getFile().getOriginalFilename());
        if (StrUtil.isBlank(fileSuffix)) {
            throw new BusinessException("file name suffix must not be empty");
        }
        iUnitService.checkUnit(memberId, data.getUnitId());
        String createNodeId;
        if (FileSuffixConstants.CSV.equals(fileSuffix)) {
            // identification file code
            String encoding = FileTool.identifyCoding(data.getFile().getInputStream());
            // Regenerate the byte stream according to the identification file encoding
            InputStream targetInputStream =
                new ByteArrayInputStream(
                    IOUtils.toString(data.getFile().getInputStream(), encoding).getBytes());
            createNodeId =
                iNodeService.parseCsv(userId, uuid, spaceId, memberId, data.getParentId(),
                    NumberUtil.parseLong(data.getUnitId()), data.getViewName(), mainName,
                    targetInputStream);
        } else if (fileSuffix.equals(FileSuffixConstants.XLS)
            || fileSuffix.equals(FileSuffixConstants.XLSX)) {
            createNodeId =
                iNodeService.parseExcel(userId, uuid, spaceId, memberId, data.getParentId(),
                    NumberUtil.parseLong(data.getUnitId()), data.getViewName(), mainName,
                    fileSuffix,
                    data.getFile().getInputStream());
        } else {
            throw new BusinessException(ActionException.FILE_ERROR_FORMAT);
        }
        // publish space audit events
        ClientOriginInfo clientOriginInfo = InformationUtil
            .getClientOriginInfoInCurrentHttpContext(true, false);
        AuditSpaceArg arg =
            AuditSpaceArg.builder().action(AuditSpaceAction.IMPORT_NODE).userId(userId)
                .requestIp(clientOriginInfo.getIp())
                .requestUserAgent(clientOriginInfo.getUserAgent())
                .nodeId(createNodeId).build();
        SpringContextHolder.getApplicationContext().publishEvent(new AuditSpaceEvent(this, arg));
        return ResponseData.success(iNodeService.getNodeInfoByNodeId(spaceId, createNodeId, role));
    }

    /**
     * Record active node.
     */
    @PostResource(path = "/active", requiredPermission = false)
    @Operation(summary = "Record active node",
        description = "node id and view id are not required（do not pass means all closed）")
    @Parameter(name = ParamsConstants.SPACE_ID, description = "space id", required = true,
        schema = @Schema(type = "string"), in = ParameterIn.HEADER, example = "spcBrtP3ulTXR")
    public ResponseData<Void> activeSheets(@RequestBody @Valid ActiveSheetsOpRo opRo) {
        Long userId = SessionContext.getUserId();
        String spaceId;
        if (opRo.getNodeId() == null) {
            spaceId = LoginContext.me().getSpaceId();
            userSpaceOpenedSheetCacheService.refresh(userId, spaceId, null);
        } else {
            // The method includes determining whether a node exists.
            spaceId = iNodeService.getSpaceIdByNodeId(opRo.getNodeId());
            OpenedSheet openedSheet =
                OpenedSheet.builder().nodeId(opRo.getNodeId()).viewId(opRo.getViewId())
                    .position(opRo.getPosition()).build();
            userSpaceOpenedSheetCacheService.refresh(userId, spaceId, openedSheet);
        }
        // check if space is spanned
        LoginContext.me().checkAcrossSpace(userId, spaceId);
        // Cache the space activated by the user's last operation
        userActiveSpaceCacheService.save(userId, spaceId);
        return ResponseData.success();
    }

    /**
     * Remind notification.
     */
    @PostResource(path = "/remind", requiredLogin = false)
    @Operation(summary = "Remind notification")
    public ResponseData<Void> remind(@RequestBody @Valid RemindMemberRo ro) {
        Long userId = SessionContext.getUserIdWithoutException();
        // Obtain the space ID. The method includes determining whether the node exists.
        String spaceId = iNodeService.getSpaceIdByNodeId(ro.getNodeId());
        if (StrUtil.isBlank(ro.getLinkId())) {
            // In the space station, check whether it crosses space
            LoginContext.me().getUserSpaceDto(spaceId);
        } else {
            // node sharing
            String shareSpaceId = nodeShareSettingMapper.selectSpaceIdByShareId(ro.getLinkId());
            ExceptionUtil.isNotNull(shareSpaceId, NodeException.SHARE_EXPIRE);
            ExceptionUtil.isTrue(shareSpaceId.equals(spaceId), SpaceException.NOT_IN_SPACE);
        }
        if (iNodeService.nodePrivate(ro.getNodeId())) {
            return ResponseData.success();
        }
        datasheetService.remindMemberRecOp(userId, spaceId, ro);
        return ResponseData.success();
    }

    /**
     * Gets no permission member before remind.
     */
    @PostResource(path = "/remind/units/noPermission", requiredPermission = false)
    @Operation(summary = "Gets no permission member before remind")
    public ResponseData<List<MemberBriefInfoVo>> postRemindUnitsNoPermission(
        @RequestBody @Validated RemindUnitsNoPermissionRo request) {

        // Get a list of all members under the organizational unit
        List<Long> allMemberIds = unitService.getMembersIdByUnitIds(request.getUnitIds());
        String nodeId = request.getNodeId();
        // list of member ids without permissions
        List<Long> noPermissionMemberIds = allMemberIds.stream()
            .filter(memberId -> !controlTemplate.hasNodePermission(memberId, nodeId,
                NodePermission.READ_NODE))
            .collect(Collectors.toList());

        return ResponseData.success(memberService.getMemberBriefInfo(noPermissionMemberIds));

    }

    /**
     * Check for associated nodes.
     */
    @GetResource(path = "/checkRelNode", requiredPermission = false)
    @Operation(summary = "check for associated nodes",
        description = "permission of the associated node is not required."
            + " Scenario: Check whether the view associated mirror before deleting the table.")
    @Parameters({
        @Parameter(name = "nodeId", description = "node id", required = true,
            schema = @Schema(type = "string"), in = ParameterIn.QUERY, example = "dstU8Agt2"),
        @Parameter(name = "viewId", description = "view id（do not specify full return）",
            schema = @Schema(type = "string"), in = ParameterIn.QUERY, example = "viwF1CqEW2GxY"),
        @Parameter(name = "type", in = ParameterIn.QUERY,
            description = "node type（do not specify full return，form:3/mirror:5）",
            schema = @Schema(type = "integer"), example = "5")
    })
    public ResponseData<List<NodeInfo>> checkRelNode(@RequestParam("nodeId") String nodeId,
                                                     @RequestParam(value = "viewId", required = false)
                                                     String viewId,
                                                     @RequestParam(value = "type", required = false)
                                                     Integer type) {
        return ResponseData.success(
            iNodeRelService.getRelationNodeInfoByNodeId(nodeId, viewId, null, type));
    }

    /**
     * Get associated node.
     */
    @GetResource(path = "/getRelNode", requiredPermission = false)
    @Operation(summary = "Get associated node",
        description = "This interface requires readable or above permissions of the associated"
            + " node. Scenario: Open the display columns of form and mirror in the datasheet.")
    @Parameters({
        @Parameter(name = "nodeId", description = "node id", required = true,
            schema = @Schema(type = "string"), in = ParameterIn.QUERY, example = "dstU8Agt2Jv"),
        @Parameter(name = "viewId", description = "view id（do not specify full return）",
            schema = @Schema(type = "string"), in = ParameterIn.QUERY, example = "viwF1CqEW2GxY"),
        @Parameter(name = "type", in = ParameterIn.QUERY,
            description = "node type（do not specify full return，form:3/mirror:5）",
            schema = @Schema(type = "integer"), example = "5")
    })
    public ResponseData<List<NodeInfo>> getNodeRel(@RequestParam("nodeId") String nodeId,
                                                   @RequestParam(value = "viewId", required = false)
                                                   String viewId,
                                                   @RequestParam(value = "type", required = false)
                                                   Integer type) {
        Long userId = SessionContext.getUserId();
        // The method includes determining whether a node exists.
        String spaceId = iNodeService.getSpaceIdByNodeId(nodeId);
        // The method includes determining whether the user is in this space.
        Long memberId = LoginContext.me().getMemberId(userId, spaceId);
        // check node permissions
        controlTemplate.checkNodePermission(memberId, nodeId, NodePermission.READ_NODE,
            status -> ExceptionUtil.isTrue(status, PermissionException.NODE_OPERATION_DENIED));
        return ResponseData.success(
            iNodeRelService.getRelationNodeInfoByNodeId(nodeId, viewId, memberId, type));
    }

    /**
     * Member recent open node list.
     */
    @GetResource(path = "/recentList", requiredPermission = false)
    @Operation(summary = "member recent open node list",
        description = "member recent open node list")
    @Parameter(name = ParamsConstants.SPACE_ID, description = "space id", required = true,
        schema = @Schema(type = "string"), in = ParameterIn.HEADER, example = "spcyQkKp9XJEl")
    public ResponseData<List<NodeSearchResult>> recentList() {
        String spaceId = LoginContext.me().getSpaceId();
        Long memberId = LoginContext.me().getMemberId();
        List<NodeSearchResult> nodeInfos = iNodeService.recentList(spaceId, memberId);
        return ResponseData.success(nodeInfos);
    }


    /**
     * get node description.
     */
    @GetResource(path = "/{nodeId}/description", requiredPermission = false)
    @Operation(summary = "Get node description")
    @Parameter(name = "nodeId", description = "node id", required = true,
        schema = @Schema(type = "string"), in = ParameterIn.PATH, example = "nodRTGSy43DJ9")
    public ResponseData<String> getNodeDescription(@PathVariable("nodeId") String nodeId) {
        // The method includes determining whether a node exists.
        String desc =
            iNodeDescService.getNodeIdToDescMap(Stream.of(nodeId).toList())
                .getOrDefault(nodeId, "");

        return ResponseData.success(desc);
    }

}
