package com.vikadata.api.modular.workspace.controller;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import javax.annotation.Resource;
import javax.validation.Valid;
import javax.validation.constraints.Max;
import javax.validation.constraints.Min;

import cn.hutool.core.collection.CollUtil;
import cn.hutool.core.util.ObjectUtil;
import cn.hutool.core.util.StrUtil;
import cn.hutool.json.JSONUtil;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiImplicitParam;
import io.swagger.annotations.ApiImplicitParams;
import io.swagger.annotations.ApiOperation;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.io.IOUtils;

import com.vikadata.api.annotation.ApiResource;
import com.vikadata.api.annotation.GetResource;
import com.vikadata.api.annotation.Notification;
import com.vikadata.api.annotation.PostResource;
import com.vikadata.api.cache.bean.OpenedSheet;
import com.vikadata.api.cache.service.SpaceCapacityCacheService;
import com.vikadata.api.cache.service.UserActiveSpaceService;
import com.vikadata.api.cache.service.UserSpaceOpenedSheetService;
import com.vikadata.api.component.notification.NotificationTemplateId;
import com.vikadata.api.config.properties.LimitProperties;
import com.vikadata.api.constants.AuditConstants;
import com.vikadata.api.constants.FileSuffixConstants;
import com.vikadata.api.constants.ParamsConstants;
import com.vikadata.api.context.LoginContext;
import com.vikadata.api.context.SessionContext;
import com.vikadata.api.control.ControlRoleDict;
import com.vikadata.api.control.ControlTemplate;
import com.vikadata.api.control.permission.NodePermission;
import com.vikadata.api.control.role.ControlRole;
import com.vikadata.api.control.role.ControlRoleManager;
import com.vikadata.api.control.role.RoleConstants.Node;
import com.vikadata.api.enums.audit.AuditSpaceAction;
import com.vikadata.api.enums.exception.ActionException;
import com.vikadata.api.enums.exception.ParameterException;
import com.vikadata.api.enums.exception.PermissionException;
import com.vikadata.api.event.AuditSpaceEvent;
import com.vikadata.api.event.AuditSpaceEvent.AuditSpaceArg;
import com.vikadata.api.holder.SpaceHolder;
import com.vikadata.api.model.dto.organization.MemberDto;
import com.vikadata.api.model.ro.datasheet.ActiveSheetsOpRo;
import com.vikadata.api.model.ro.datasheet.RemindMemberRo;
import com.vikadata.api.model.ro.datasheet.RemindUnitsNoPermissionRo;
import com.vikadata.api.model.ro.node.ImportExcelOpRo;
import com.vikadata.api.model.ro.node.NodeCopyOpRo;
import com.vikadata.api.model.ro.node.NodeDescOpRo;
import com.vikadata.api.model.ro.node.NodeMoveOpRo;
import com.vikadata.api.model.ro.node.NodeOpRo;
import com.vikadata.api.model.ro.node.NodeUpdateOpRo;
import com.vikadata.api.model.ro.node.VikaBundleOpRo;
import com.vikadata.api.model.vo.node.NodeInfo;
import com.vikadata.api.model.vo.node.NodeInfoTreeVo;
import com.vikadata.api.model.vo.node.NodeInfoVo;
import com.vikadata.api.model.vo.node.NodeInfoWindowVo;
import com.vikadata.api.model.vo.node.NodePathVo;
import com.vikadata.api.model.vo.node.NodePermissionView;
import com.vikadata.api.model.vo.node.NodeSearchResult;
import com.vikadata.api.model.vo.node.ShowcaseVo;
import com.vikadata.api.model.vo.node.ShowcaseVo.NodeExtra;
import com.vikadata.api.model.vo.node.ShowcaseVo.Social;
import com.vikadata.api.model.vo.organization.CreatedMemberInfoVo;
import com.vikadata.api.model.vo.organization.MemberBriefInfoVo;
import com.vikadata.api.modular.organization.mapper.MemberMapper;
import com.vikadata.api.modular.organization.service.IMemberService;
import com.vikadata.api.modular.organization.service.IUnitService;
import com.vikadata.api.modular.user.mapper.UserMapper;
import com.vikadata.api.modular.workspace.mapper.NodeDescMapper;
import com.vikadata.api.modular.workspace.mapper.NodeFavoriteMapper;
import com.vikadata.api.modular.workspace.mapper.NodeShareSettingMapper;
import com.vikadata.api.modular.workspace.model.NodeCopyEffectDTO;
import com.vikadata.api.modular.workspace.service.IDatasheetService;
import com.vikadata.api.modular.workspace.service.INodeDescService;
import com.vikadata.api.modular.workspace.service.INodeRelService;
import com.vikadata.api.modular.workspace.service.INodeService;
import com.vikadata.api.modular.workspace.service.VikaBundleService;
import com.vikadata.api.util.InformationUtil;
import com.vikadata.boot.autoconfigure.spring.SpringContextHolder;
import com.vikadata.core.exception.BusinessException;
import com.vikadata.core.support.ResponseData;
import com.vikadata.core.util.ExceptionUtil;
import com.vikadata.core.util.SqlTool;
import com.vikadata.define.enums.NodeType;
import com.vikadata.define.utils.FileTool;
import com.vikadata.entity.NodeEntity;

import org.springframework.http.MediaType;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import static com.vikadata.api.constants.NodeRoleConstants.ROLE_DESC;
import static com.vikadata.api.enums.exception.NodeException.SHARE_EXPIRE;
import static com.vikadata.api.enums.exception.PermissionException.NODE_OPERATION_DENIED;
import static com.vikadata.api.enums.exception.SpaceException.NOT_IN_SPACE;

/**
 * 工作台模块_节点管理接口
 *
 * @author Chambers
 * @since 2019/10/8
 */
@Api(tags = "工作台模块_节点管理接口")
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
    private VikaBundleService vikaBundleService;

    @Resource
    private IUnitService unitService;

    @Resource
    private ControlTemplate controlTemplate;

    @Resource
    private NodeShareSettingMapper nodeShareSettingMapper;

    @Resource
    private UserSpaceOpenedSheetService userSpaceOpenedSheetService;

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
    private UserActiveSpaceService userActiveSpaceService;

    @GetResource(path = "/search")
    @ApiOperation(value = "模糊搜索节点", notes = "输入搜索词搜索工作目录的节点" + ROLE_DESC)
    @ApiImplicitParams({
            @ApiImplicitParam(name = ParamsConstants.SPACE_ID, value = "空间ID", required = true, dataTypeClass = String.class, paramType = "header", example = "spcyQkKp9XJEl"),
            @ApiImplicitParam(name = "className", value = "高亮样式", dataTypeClass = String.class, paramType = "query", example = "highLight"),
            @ApiImplicitParam(name = "keyword", value = "搜索词", required = true, dataTypeClass = String.class, paramType = "query", example = "维格数表")
    })
    public ResponseData<List<NodeSearchResult>> searchNode(@RequestParam(name = "keyword") String keyword,
            @RequestParam(value = "className", required = false, defaultValue = "keyword") String className) {
        String spaceId = LoginContext.me().getSpaceId();
        Long memberId = LoginContext.me().getMemberId();
        List<NodeSearchResult> nodeInfos = iNodeService.searchNode(spaceId, memberId, keyword);
        nodeInfos.forEach(info -> info.setNodeName(InformationUtil.keywordHighlight(info.getNodeName(), keyword, className)));
        return ResponseData.success(nodeInfos);
    }

    @GetResource(path = "/tree")
    @ApiOperation(value = "查询节点树", notes = "查询工作台的节点树，限制查询两层" + ROLE_DESC)
    @ApiImplicitParams({
            @ApiImplicitParam(name = ParamsConstants.SPACE_ID, value = "空间ID", required = true, dataTypeClass = String.class, paramType = "header", example = "spcyQkKp9XJEl"),
            @ApiImplicitParam(name = "depth", value = "树深度, 可指定查询深度，最大2层深度", dataTypeClass = Integer.class, paramType = "query", example = "2")
    })
    public ResponseData<NodeInfoTreeVo> getTree(@RequestParam(name = "depth", defaultValue = "2") @Valid @Min(0) @Max(2) Integer depth) {
        String spaceId = LoginContext.me().getSpaceId();
        Long memberId = LoginContext.me().getMemberId();
        String rootNodeId = iNodeService.getRootNodeIdBySpaceId(spaceId);
        NodeInfoTreeVo tree = iNodeService.getNodeTree(spaceId, rootNodeId, memberId, depth);
        return ResponseData.success(tree);
    }

    @GetResource(path = "/list")
    @ApiOperation(value = "获取指定类型的节点列表", notes = "场景：查询已有的仪表盘")
    @ApiImplicitParams({
            @ApiImplicitParam(name = ParamsConstants.SPACE_ID, value = "空间ID", required = true, paramType = "header", dataTypeClass = String.class, example = "spczJrh2i3tLW"),
            @ApiImplicitParam(name = "type", value = "节点类型", required = true, dataTypeClass = Integer.class, paramType = "query", example = "2"),
            @ApiImplicitParam(name = "role", value = "角色（默认可管理）", dataTypeClass = String.class, paramType = "query", example = "manager")
    })
    public ResponseData<List<NodeInfo>> list(@RequestParam(value = "type") Integer type, @RequestParam(value = "role", required = false, defaultValue = "manager") String role) {
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

    @GetResource(path = "/get", requiredPermission = false)
    @ApiOperation(value = "查询节点信息", notes = "获取节点的相关信息" + ROLE_DESC)
    @ApiImplicitParam(name = "nodeIds", value = "节点ID集合", required = true, dataTypeClass = String.class, paramType = "query", example = "nodRTGSy43DJ9,nodRTGSy43DJ9")
    public ResponseData<List<NodeInfoVo>> getByNodeId(@RequestParam("nodeIds") List<String> nodeIds) {
        // 获取空间ID，方法包含判断节点是否存在
        String spaceId = iNodeService.getSpaceIdByNodeId(nodeIds.get(0));
        // 获取成员ID，方法包含判断用户是否在此空间
        Long memberId = LoginContext.me().getUserSpaceDto(spaceId).getMemberId();
        return ResponseData.success(iNodeService.getNodeInfoByNodeIds(spaceId, memberId, nodeIds));
    }

    @GetResource(path = "/showcase", requiredLogin = false)
    @ApiOperation(value = "文件夹预览", notes = "非模板中心的节点，做跨空间判断")
    @ApiImplicitParams({
            @ApiImplicitParam(name = "nodeId", value = "节点ID", required = true, dataTypeClass = String.class, paramType = "query", example = "nodRTGSy43DJ9"),
            @ApiImplicitParam(name = "shareId", value = "分享ID", dataTypeClass = String.class, paramType = "query", example = "shrRTGSy43DJ9")
    })
    public ResponseData<ShowcaseVo> showcase(@RequestParam("nodeId") String nodeId,
            @RequestParam(value = "shareId", required = false) String shareId) {
        // 获取节点实体，方法包含判断节点是否存在
        NodeEntity node = iNodeService.getByNodeId(nodeId);
        ControlRole role;
        boolean nodeFavorite = false;
        if (!node.getIsTemplate()) {
            if (StrUtil.isNotBlank(shareId)) {
                // 在节点分享中打开，校验分享有效性、节点是否存在分享
                String shareNodeId = nodeShareSettingMapper.selectNodeIdByShareId(shareId);
                ExceptionUtil.isNotNull(shareNodeId, SHARE_EXPIRE);
                if (!nodeId.equals(shareNodeId)) {
                    List<String> nodes = iNodeService.getPathParentNode(nodeId);
                    ExceptionUtil.isTrue(nodes.contains(shareNodeId), PermissionException.NODE_ACCESS_DENIED);
                }
                role = ControlRoleManager.parseNodeRole(Node.ANONYMOUS);
            }
            else {
                // 获取成员ID，方法包含判断用户是否在此空间
                Long memberId = LoginContext.me().getUserSpaceDto(node.getSpaceId()).getMemberId();
                role = controlTemplate.fetchNodeRole(memberId, nodeId);
                // 查询节点是否被收藏
                nodeFavorite = SqlTool.retCount(nodeFavoriteMapper.countByMemberIdAndNodeId(memberId, nodeId)) > 0;
            }
        }
        else {
            role = ControlRoleManager.parseNodeRole(Node.TEMPLATE_VISITOR);
        }
        String description = nodeDescMapper.selectDescriptionByNodeId(nodeId);
        NodePermissionView permissions = role.permissionToBean(NodePermissionView.class);
        // 查询节点创建人基础信息
        MemberDto memberDto = memberMapper.selectMemberDtoByUserIdAndSpaceId(node.getCreatedBy(), node.getSpaceId());
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
                    extra.getDingTalkCorpId());
        }
        ShowcaseVo vo = new ShowcaseVo(nodeId, node.getNodeName(), node.getType(), node.getIcon(), node.getCover(),
                description, role.getRoleTag(), permissions, nodeFavorite, createdMemberInfo, node.getUpdatedAt(),
                social, extra);
        return ResponseData.success(vo);
    }

    @GetResource(path = "/window", requiredPermission = false)
    @ApiOperation(value = "文件信息窗", notes = "非模板中心的节点，做空间判断")
    public ResponseData<NodeInfoWindowVo> showNodeInfoWindow(@RequestParam("nodeId") String nodeId) {
        // 获取空间ID，方法包含判断节点是否存在
        Long userId = SessionContext.getUserId();
        // 获取成员ID，方法包含判断用户是否在此空间
        String spaceId = iNodeService.getSpaceIdByNodeId(nodeId);
        // 校验权限
        Long memberId = LoginContext.me().getMemberId(userId, spaceId);
        controlTemplate.checkNodePermission(memberId, nodeId, NodePermission.READ_NODE,
                status -> ExceptionUtil.isTrue(status, NODE_OPERATION_DENIED));
        // 构造文件信息窗对象
        return ResponseData.success(iNodeService.getNodeWindowInfo(nodeId));
    }

    @GetResource(path = "/parents", requiredPermission = false)
    @ApiOperation(value = "查询父节点", notes = "获取指定节点的所有父节点列表" + ROLE_DESC)
    @ApiImplicitParam(name = "nodeId", value = "节点ID", required = true, dataTypeClass = String.class, paramType = "query", example = "nodRTGSy43DJ9")
    public ResponseData<List<NodePathVo>> getParentNodes(@RequestParam(name = "nodeId") String nodeId) {
        // 获取空间ID，方法包含判断节点是否存在
        String spaceId = iNodeService.getSpaceIdByNodeId(nodeId);
        // 校验是否跨空间
        LoginContext.me().getUserSpaceDto(spaceId);
        List<NodePathVo> nodePaths = iNodeService.getParentPathByNodeId(spaceId, nodeId);
        return ResponseData.success(nodePaths);
    }

    @GetResource(path = "/children", requiredPermission = false)
    @ApiOperation(value = "查询子节点", notes = "获取指定节点的子节点列表，节点分类型区分文件夹或数表" + ROLE_DESC)
    @ApiImplicitParam(name = "nodeId", value = "节点ID", required = true, dataTypeClass = String.class, paramType = "query", example = "nodRTGSy43DJ9")
    public ResponseData<List<NodeInfoVo>> getNodeChildrenList(@RequestParam(name = "nodeId") String nodeId) {
        // 获取空间ID，方法包含判断节点是否存在
        String spaceId = iNodeService.getSpaceIdByNodeId(nodeId);
        // 获取成员ID，方法包含判断用户是否在此空间
        Long memberId = LoginContext.me().getUserSpaceDto(spaceId).getMemberId();
        List<NodeInfoVo> nodeInfos = iNodeService.getChildNodesByNodeId(spaceId, memberId, nodeId);
        return ResponseData.success(nodeInfos);
    }

    @GetResource(path = "/position/{nodeId}", requiredPermission = false)
    @ApiOperation(value = "定位节点", notes = "节点ID必须" + ROLE_DESC)
    @ApiImplicitParam(name = "nodeId", value = "节点ID", required = true, dataTypeClass = String.class, paramType = "path", example = "nodRTGSy43DJ9")
    public ResponseData<NodeInfoTreeVo> position(@PathVariable("nodeId") String nodeId) {
        // 获取空间ID，方法包含判断节点是否存在
        String spaceId = iNodeService.getSpaceIdByNodeId(nodeId);
        // 获取成员ID，方法包含判断用户是否在此空间
        Long memberId = LoginContext.me().getUserSpaceDto(spaceId).getMemberId();
        // 校验节点权限
        controlTemplate.checkNodePermission(memberId, nodeId, NodePermission.READ_NODE,
                status -> ExceptionUtil.isTrue(status, NODE_OPERATION_DENIED));
        NodeInfoTreeVo treeVo = iNodeService.position(spaceId, memberId, nodeId);
        return ResponseData.success(treeVo);
    }

    @Notification(templateId = NotificationTemplateId.NODE_CREATE)
    @PostResource(path = "/create", requiredPermission = false)
    @ApiOperation(value = "添加子节点", notes = "在节点下创建新的节点" + ROLE_DESC)
    @ApiImplicitParam(name = ParamsConstants.PLAYER_SOCKET_ID, value = "用户socketId", dataTypeClass = String.class, paramType = "header", example = "QkKp9XJEl")
    public ResponseData<NodeInfoVo> create(@RequestBody @Valid NodeOpRo nodeOpRo) {
        Long userId = SessionContext.getUserId();
        // 获取空间ID，方法包含判断节点是否存在
        String spaceId = iNodeService.getSpaceIdByNodeId(nodeOpRo.getParentId());
        SpaceHolder.set(spaceId);
        // 获取成员ID，方法包含判断用户是否在此空间
        Long memberId = LoginContext.me().getMemberId(userId, spaceId);
        // 校验父级节点下是否有指定操作权限
        iNodeService.checkEnableOperateNodeBySpaceFeature(memberId, spaceId, nodeOpRo.getParentId());
        ControlRole role = controlTemplate.fetchNodeRole(memberId, nodeOpRo.getParentId());
        ExceptionUtil.isTrue(role.hasPermission(NodePermission.CREATE_NODE), NODE_OPERATION_DENIED);
        // 检查收集表、mirror 的源表是否存在，是否有指定操作权限
        iNodeService.checkSourceDatasheet(spaceId, memberId, nodeOpRo.getType(), nodeOpRo.getExtra());
        // 创建节点
        String nodeId = iNodeService.createNode(userId, spaceId, nodeOpRo);
        // 发布空间审计事件
        AuditSpaceArg arg = AuditSpaceArg.builder().action(AuditSpaceAction.CREATE_NODE).userId(userId).nodeId(nodeId).build();
        SpringContextHolder.getApplicationContext().publishEvent(new AuditSpaceEvent(this, arg));
        // 新节点默认继承父级节点权限
        return ResponseData.success(iNodeService.getNodeInfoByNodeId(spaceId, nodeId, role));
    }

    @Notification(templateId = NotificationTemplateId.NODE_UPDATE)
    @PostResource(path = "/update/{nodeId}", requiredPermission = false)
    @ApiOperation(value = "编辑节点", notes = "节点ID必须，名称、图标非必须" + ROLE_DESC)
    @ApiImplicitParams({
            @ApiImplicitParam(name = "nodeId", value = "节点ID", required = true, dataTypeClass = String.class, paramType = "path", example = "nodRTGSy43DJ9"),
            @ApiImplicitParam(name = ParamsConstants.PLAYER_SOCKET_ID, value = "用户socketId", dataTypeClass = String.class, paramType = "header", example = "QkKp9XJEl")
    })
    public ResponseData<Void> update(@PathVariable("nodeId") String nodeId, @RequestBody @Valid NodeUpdateOpRo nodeOpRo) {
        ExceptionUtil.isTrue(StrUtil.isNotBlank(nodeOpRo.getNodeName()) || ObjectUtil.isNotNull(nodeOpRo.getIcon())
                || ObjectUtil.isNotNull(nodeOpRo.getCover()) || ObjectUtil.isNotNull(nodeOpRo.getShowRecordHistory()), ParameterException.NO_ARG);
        Long userId = SessionContext.getUserId();
        // 获取空间ID，方法包含判断节点是否存在
        String spaceId = iNodeService.getSpaceIdByNodeId(nodeId);
        SpaceHolder.set(spaceId);
        // 获取成员ID，方法包含判断用户是否在此空间
        Long memberId = LoginContext.me().getMemberId(userId, spaceId);
        // 校验节点是否有指定操作权限
        controlTemplate.checkNodePermission(memberId, nodeId, NodePermission.MANAGE_NODE,
                status -> ExceptionUtil.isTrue(status, NODE_OPERATION_DENIED));
        iNodeService.edit(userId, nodeId, nodeOpRo);
        return ResponseData.success();
    }

    @Notification(templateId = NotificationTemplateId.NODE_UPDATE_DESC)
    @PostResource(path = "/updateDesc", requiredPermission = false)
    @ApiOperation(value = "编辑节点描述")
    @ApiImplicitParam(name = ParamsConstants.PLAYER_SOCKET_ID, value = "用户socketId", dataTypeClass = String.class, paramType = "header", example = "QkKp9XJEl")
    public ResponseData<Void> updateDesc(@RequestBody @Valid NodeDescOpRo opRo) {
        // 获取空间ID，方法包含判断节点是否存在
        String spaceId = iNodeService.getSpaceIdByNodeId(opRo.getNodeId());
        SpaceHolder.set(spaceId);
        // 获取成员ID，方法包含判断用户是否在此空间
        Long memberId = LoginContext.me().getUserSpaceDto(spaceId).getMemberId();
        // 校验节点下是否有指定操作权限
        controlTemplate.checkNodePermission(memberId, opRo.getNodeId(), NodePermission.EDIT_NODE_DESC,
                status -> ExceptionUtil.isTrue(status, NODE_OPERATION_DENIED));
        iNodeDescService.edit(opRo.getNodeId(), opRo.getDescription());
        // 发布空间审计事件
        AuditSpaceArg arg = AuditSpaceArg.builder().action(AuditSpaceAction.UPDATE_NODE_DESC).userId(SessionContext.getUserId()).nodeId(opRo.getNodeId()).build();
        SpringContextHolder.getApplicationContext().publishEvent(new AuditSpaceEvent(this, arg));
        return ResponseData.success();
    }

    @Notification(templateId = NotificationTemplateId.NODE_MOVE)
    @PostResource(path = "/move")
    @ApiOperation(value = "移动节点", notes = "节点ID、父节点ID必须，preNodeId非必须")
    @ApiImplicitParams({
            @ApiImplicitParam(name = ParamsConstants.SPACE_ID, value = "空间ID", required = true, dataTypeClass = String.class, paramType = "header", example = "spcyQkKp9XJEl"),
            @ApiImplicitParam(name = ParamsConstants.PLAYER_SOCKET_ID, value = "用户socketId", dataTypeClass = String.class, paramType = "header", example = "QkKp9XJEl")
    })
    public ResponseData<List<NodeInfoVo>> move(@RequestBody @Valid NodeMoveOpRo nodeOpRo) {
        Long memberId = LoginContext.me().getMemberId();
        String spaceId = LoginContext.me().getSpaceId();
        SpaceHolder.set(spaceId);
        iNodeService.checkEnableOperateNodeBySpaceFeature(memberId, spaceId, nodeOpRo.getParentId());
        iNodeService.checkNodeIfExist(spaceId, nodeOpRo.getNodeId());
        iNodeService.checkNodeIfExist(spaceId, nodeOpRo.getParentId());
        if (StrUtil.isNotBlank(nodeOpRo.getPreNodeId())) {
            iNodeService.checkNodeIfExist(spaceId, nodeOpRo.getPreNodeId());
        }
        // 本节点的可管理
        controlTemplate.checkNodePermission(memberId, nodeOpRo.getNodeId(), NodePermission.MOVE_NODE,
                status -> ExceptionUtil.isTrue(status, NODE_OPERATION_DENIED));
        // 校验移动操作
        String parentId = iNodeService.getParentIdByNodeId(nodeOpRo.getNodeId());
        iNodeService.checkEnableOperateNodeBySpaceFeature(memberId, spaceId, parentId);
        if (parentId.equals(nodeOpRo.getParentId())) {
            // 在同级下移动
            controlTemplate.checkNodePermission(memberId, nodeOpRo.getParentId(), NodePermission.MANAGE_NODE,
                    status -> ExceptionUtil.isTrue(status, NODE_OPERATION_DENIED));
        }
        else {
            // 目标文件夹的可管理
            controlTemplate.checkNodePermission(memberId, nodeOpRo.getParentId(), NodePermission.CREATE_NODE,
                    status -> ExceptionUtil.isTrue(status, NODE_OPERATION_DENIED));
        }
        Long userId = SessionContext.getUserId();
        List<String> nodeIds = iNodeService.move(userId, nodeOpRo);
        return ResponseData.success(iNodeService.getNodeInfoByNodeIds(spaceId, memberId, nodeIds));
    }

    @Notification(templateId = NotificationTemplateId.NODE_DELETE)
    @PostResource(path = "/delete/{nodeId}", method = { RequestMethod.DELETE, RequestMethod.POST }, requiredPermission = false)
    @ApiOperation(value = "删除节点", notes = "可传入ID数组，删除多个节点")
    @ApiImplicitParams({
            @ApiImplicitParam(name = "nodeId", value = "节点ID", required = true, dataTypeClass = String.class, paramType = "path", example = "nodRTGSy43DJ9"),
            @ApiImplicitParam(name = ParamsConstants.PLAYER_SOCKET_ID, value = "用户socketId", dataTypeClass = String.class, paramType = "header", example = "QkKp9XJEl")
    })
    public ResponseData<Void> delete(@PathVariable("nodeId") String nodeId) {
        // 获取空间ID，方法包含判断节点是否存在
        String spaceId = iNodeService.getSpaceIdByNodeId(nodeId);
        SpaceHolder.set(spaceId);
        // 获取成员ID，方法包含判断用户是否在此空间
        Long memberId = LoginContext.me().getUserSpaceDto(spaceId).getMemberId();
        // 不可以删除根节点
        String rootNodeId = iNodeService.getRootNodeIdBySpaceId(spaceId);
        ExceptionUtil.isFalse(nodeId.equals(rootNodeId), NODE_OPERATION_DENIED);
        // 校验节点下是否有指定操作权限
        controlTemplate.checkNodePermission(memberId, nodeId, NodePermission.REMOVE_NODE,
                status -> ExceptionUtil.isTrue(status, NODE_OPERATION_DENIED));
        iNodeService.deleteById(spaceId, memberId, nodeId);
        // 删除空间容量缓存
        spaceCapacityCacheService.del(spaceId);
        return ResponseData.success();
    }

    @Notification(templateId = NotificationTemplateId.NODE_CREATE)
    @PostResource(path = "/copy", requiredPermission = false)
    @ApiOperation(value = "复制节点", notes = "节点ID必须，是否需要复制数据非必须")
    @ApiImplicitParam(name = ParamsConstants.PLAYER_SOCKET_ID, value = "用户socketId", dataTypeClass = String.class, paramType = "header", example = "QkKp9XJEl")
    public ResponseData<NodeInfoVo> copy(@RequestBody @Valid NodeCopyOpRo nodeOpRo) {
        Long userId = SessionContext.getUserId();
        // 获取空间ID，方法包含判断节点是否存在
        String spaceId = iNodeService.getSpaceIdByNodeId(nodeOpRo.getNodeId());
        SpaceHolder.set(spaceId);
        // 获取成员ID，方法包含判断用户是否在此空间
        Long memberId = LoginContext.me().getMemberId(userId, spaceId);
        // 校验本节点权限
        controlTemplate.checkNodePermission(memberId, nodeOpRo.getNodeId(), NodePermission.COPY_NODE,
                status -> ExceptionUtil.isTrue(status, NODE_OPERATION_DENIED));
        // 复制数表需要父级节点的创建子节点权限
        String parentId = iNodeService.getParentIdByNodeId(nodeOpRo.getNodeId());
        ControlRole role = controlTemplate.fetchNodeRole(memberId, parentId);
        ExceptionUtil.isTrue(role.hasPermission(NodePermission.CREATE_NODE), NODE_OPERATION_DENIED);
        // 复制节点
        NodeCopyEffectDTO copyEffect = iNodeService.copy(userId, nodeOpRo);
        iNodeService.nodeCopyChangeset(copyEffect);
        // 发布空间审计事件
        AuditSpaceArg arg = AuditSpaceArg.builder().action(AuditSpaceAction.COPY_NODE).userId(userId).nodeId(copyEffect.getCopyNodeId())
                .info(JSONUtil.createObj().set(AuditConstants.SOURCE_NODE_ID, nodeOpRo.getNodeId()).set(AuditConstants.RECORD_COPYABLE, nodeOpRo.getData())).build();
        SpringContextHolder.getApplicationContext().publishEvent(new AuditSpaceEvent(this, arg));
        // 新节点默认继承父级节点权限
        return ResponseData.success(iNodeService.getNodeInfoByNodeId(spaceId, copyEffect.getCopyNodeId(), role));
    }

    @GetResource(path = "/exportBundle", requiredPermission = false)
    @ApiOperation(value = "导出VikaBundle")
    @ApiImplicitParams({
            @ApiImplicitParam(name = "nodeId", value = "节点ID", required = true, dataTypeClass = String.class, paramType = "query", example = "fod8mXUeiXyVo"),
            @ApiImplicitParam(name = "saveData", value = "是否保留数据", dataTypeClass = Boolean.class, paramType = "query", example = "true"),
            @ApiImplicitParam(name = "password", value = "加密密码", dataTypeClass = String.class, paramType = "query", example = "qwer1234")
    })
    public void exportBundle(@RequestParam("nodeId") String nodeId,
            @RequestParam(value = "saveData", required = false, defaultValue = "true") Boolean saveData,
            @RequestParam(value = "password", required = false) String password) {
        Long userId = SessionContext.getUserId();
        // 获取空间ID，方法包含判断节点是否存在
        String spaceId = iNodeService.getSpaceIdByNodeId(nodeId);
        SpaceHolder.set(spaceId);
        // 获取成员ID，方法包含判断用户是否在此空间
        Long memberId = LoginContext.me().getMemberId(userId, spaceId);
        // 校验节点权限
        controlTemplate.checkNodePermission(memberId, nodeId, NodePermission.MANAGE_NODE,
                status -> ExceptionUtil.isTrue(status, NODE_OPERATION_DENIED));
        // 校验所有子后代节点的权限
        iNodeService.checkSubNodePermission(memberId, nodeId, ControlRoleManager.parseNodeRole(Node.MANAGER));
        vikaBundleService.generate(nodeId, saveData, password);
    }

    @PostResource(path = "/analyzeBundle", requiredLogin = false)
    @ApiOperation(value = "解析VikaBundle", notes = "前置节点不在父节点下时保存在父节点首位；均不传时保存在一级目录首位；", produces = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseData<Void> analyzeBundle(@Valid VikaBundleOpRo opRo) {
        String parentId = opRo.getParentId();
        Long userId = SessionContext.getUserId();
        // 获取空间ID，方法包含判断节点是否存在
        String spaceId = iNodeService.getSpaceIdByNodeId(parentId);
        SpaceHolder.set(spaceId);
        // 获取成员ID，方法包含判断用户是否在此空间
        Long memberId = LoginContext.me().getMemberId(userId, spaceId);
        // 校验父节点节点权限
        if (StrUtil.isNotBlank(parentId)) {
            controlTemplate.checkNodePermission(memberId, parentId, NodePermission.CREATE_NODE,
                    status -> ExceptionUtil.isTrue(status, NODE_OPERATION_DENIED));
        }
        if (StrUtil.isBlank(parentId) && StrUtil.isBlank(opRo.getPreNodeId())) {
            parentId = iNodeService.getRootNodeIdBySpaceId(spaceId);
        }
        vikaBundleService.analyze(opRo.getFile(), opRo.getPassword(), parentId, opRo.getPreNodeId(), userId);
        return ResponseData.success();
    }

    @Notification(templateId = NotificationTemplateId.NODE_CREATE)
    @PostResource(path = "/import", requiredPermission = false)
    @ApiOperation(value = "导入数表", notes = "参数均必须")
    public ResponseData<NodeInfoVo> importExcel(@Valid ImportExcelOpRo data) throws IOException {
        ExceptionUtil.isTrue(data.getFile().getSize() <= limitProperties.getMaxFileSize(), ActionException.FILE_EXCEED_LIMIT);
        Long userId = SessionContext.getUserId();
        // 获取空间ID，方法包含判断节点是否存在
        String spaceId = iNodeService.getSpaceIdByNodeId(data.getParentId());
        SpaceHolder.set(spaceId);
        // 获取成员ID，方法包含判断用户是否在此空间
        Long memberId = LoginContext.me().getMemberId(userId, spaceId);
        // 校验节点下是否有指定操作权限
        ControlRole role = controlTemplate.fetchNodeRole(memberId, data.getParentId());
        ExceptionUtil.isTrue(role.hasPermission(NodePermission.CREATE_NODE), NODE_OPERATION_DENIED);
        // String nodeId = iNodeService.importExcel(userId, spaceId, data);
        // 新节点默认继承父级节点权限
        String uuid = userMapper.selectUuidById(userId);
        // 文件名称
        String mainName = cn.hutool.core.io.FileUtil.mainName(data.getFile().getOriginalFilename());
        if (StrUtil.isBlank(mainName)) {
            throw new BusinessException("文件名为空");
        }
        mainName = iNodeService.duplicateNameModify(data.getParentId(), NodeType.DATASHEET.getNodeType(), mainName, null);
        //文件类型后缀
        String fileSuffix = cn.hutool.core.io.FileUtil.extName(data.getFile().getOriginalFilename());
        if (StrUtil.isBlank(fileSuffix)) {
            throw new BusinessException("文件名后缀不得为空");
        }
        String createNodeId;
        if (FileSuffixConstants.CSV.equals(fileSuffix)) {
            // 识别文件编码
            String encoding = FileTool.identifyCoding(data.getFile().getInputStream());
            // 按照识别文件编码重新生成字节流
            InputStream targetInputStream =
                    new ByteArrayInputStream(IOUtils.toString(data.getFile().getInputStream(), encoding).getBytes());
            createNodeId = iNodeService.parseCsv(userId, uuid, spaceId, memberId, data.getParentId(), mainName, targetInputStream);
        }
        else {
            createNodeId = iNodeService.parseExcel(userId, uuid, spaceId, memberId, data.getParentId(), mainName, fileSuffix, data.getFile().getInputStream());
        }
        // 发布空间审计事件
        AuditSpaceArg arg = AuditSpaceArg.builder().action(AuditSpaceAction.IMPORT_NODE).userId(userId).nodeId(createNodeId).build();
        SpringContextHolder.getApplicationContext().publishEvent(new AuditSpaceEvent(this, arg));
        return ResponseData.success(iNodeService.getNodeInfoByNodeId(spaceId, createNodeId, role));
    }

    @PostResource(name = "记录活跃的节点", path = "/active", requiredPermission = false)
    @ApiOperation(value = "记录活跃的节点", notes = "节点id和视图id非必须（不传表示全关闭）")
    @ApiImplicitParam(name = ParamsConstants.SPACE_ID, value = "空间ID", required = true, dataTypeClass = String.class, paramType = "header", example = "spcBrtP3ulTXR")
    public ResponseData<Void> activeSheets(@RequestBody @Valid ActiveSheetsOpRo opRo) {
        Long userId = SessionContext.getUserId();
        String spaceId;
        if (opRo.getNodeId() == null) {
            spaceId = LoginContext.me().getSpaceId();
            userSpaceOpenedSheetService.refresh(userId, spaceId, null);
        }
        else {
            // 获取空间ID，方法包含判断节点是否存在
            spaceId = iNodeService.getSpaceIdByNodeId(opRo.getNodeId());
            OpenedSheet openedSheet = OpenedSheet.builder().nodeId(opRo.getNodeId()).viewId(opRo.getViewId()).position(opRo.getPosition()).build();
            userSpaceOpenedSheetService.refresh(userId, spaceId, openedSheet);
        }
        // check if space is spanned
        LoginContext.me().checkAcrossSpace(userId, spaceId);
        // 缓存用户最后操作激活的空间
        userActiveSpaceService.save(userId, spaceId);
        return ResponseData.success();
    }

    @PostResource(name = "成员字段提及他人记录", path = "/remind", requiredLogin = false)
    @ApiOperation(value = "成员字段提及他人记录")
    public ResponseData<Void> remind(@RequestBody @Valid RemindMemberRo ro) {
        Long userId = SessionContext.getUserIdWithoutException();
        // 获取空间ID，方法包含判断节点是否存在
        String spaceId = iNodeService.getSpaceIdByNodeId(ro.getNodeId());
        if (StrUtil.isBlank(ro.getLinkId())) {
            // 空间站内，校验是否跨空间
            LoginContext.me().getUserSpaceDto(spaceId);
        }
        else {
            // 节点分享
            String shareSpaceId = nodeShareSettingMapper.selectSpaceIdByShareId(ro.getLinkId());
            ExceptionUtil.isNotNull(shareSpaceId, SHARE_EXPIRE);
            ExceptionUtil.isTrue(shareSpaceId.equals(spaceId), NOT_IN_SPACE);
        }
        datasheetService.remindMemberRecOp(userId, spaceId, ro);
        return ResponseData.success();
    }

    @PostResource(path = "/remind/units/noPermission", requiredPermission = false)
    @ApiOperation(value = "提及人时获取对指定节点无权限的成员")
    public ResponseData<List<MemberBriefInfoVo>> postRemindUnitsNoPermission(@RequestBody @Validated RemindUnitsNoPermissionRo request) {

        // 获取组织单元下所有的成员列表
        List<Long> allMemberIds = unitService.getMembersIdByUnitIds(request.getUnitIds());
        String nodeId = request.getNodeId();
        // 没有权限的成员 ID 列表
        List<Long> noPermissionMemberIds = allMemberIds.stream()
                .filter(memberId -> !controlTemplate.hasNodePermission(memberId, nodeId, NodePermission.READ_NODE))
                .collect(Collectors.toList());

        return ResponseData.success(memberService.getMemberBriefInfo(noPermissionMemberIds));

    }

    @GetResource(path = "/checkRelNode", requiredPermission = false)
    @ApiOperation(value = "检查是否有关联节点", notes = "不要求关联节点的权限。场景：数表删除视图前检查该视图是否关联了收集表、mirror")
    @ApiImplicitParams({
            @ApiImplicitParam(name = "nodeId", value = "节点ID", required = true, dataTypeClass = String.class, paramType = "query", example = "dstU8Agt2Je9J7AKsv"),
            @ApiImplicitParam(name = "viewId", value = "视图ID（不指定全返回）", dataTypeClass = String.class, paramType = "query", example = "viwF1CqEW2GxY"),
            @ApiImplicitParam(name = "type", value = "节点类型（不指定全返回，form:3/mirror:5）", dataTypeClass = Integer.class, paramType = "query", example = "5")
    })
    public ResponseData<List<NodeInfo>> checkRelNode(@RequestParam("nodeId") String nodeId,
            @RequestParam(value = "viewId", required = false) String viewId,
            @RequestParam(value = "type", required = false) Integer type) {
        return ResponseData.success(iNodeRelService.getRelationNodeInfoByNodeId(nodeId, viewId, null, type));
    }

    @GetResource(path = "/getRelNode", requiredPermission = false)
    @ApiOperation(value = "获取关联节点", notes = "该接口要求关联节点的可读或以上权限。场景：数表内打开收集表、mirror 的展示栏")
    @ApiImplicitParams({
            @ApiImplicitParam(name = "nodeId", value = "节点ID", required = true, dataTypeClass = String.class, paramType = "query", example = "dstU8Agt2Je9J7AKsv"),
            @ApiImplicitParam(name = "viewId", value = "视图ID（不指定全返回）", dataTypeClass = String.class, paramType = "query", example = "viwF1CqEW2GxY"),
            @ApiImplicitParam(name = "type", value = "节点类型（不指定全返回，form:3/mirror:5）", dataTypeClass = Integer.class, paramType = "query", example = "5")
    })
    public ResponseData<List<NodeInfo>> getNodeRel(@RequestParam("nodeId") String nodeId,
            @RequestParam(value = "viewId", required = false) String viewId,
            @RequestParam(value = "type", required = false) Integer type) {
        Long userId = SessionContext.getUserId();
        // 获取空间ID，方法包含判断节点是否存在
        String spaceId = iNodeService.getSpaceIdByNodeId(nodeId);
        // 获取成员ID，方法包含判断用户是否在此空间
        Long memberId = LoginContext.me().getMemberId(userId, spaceId);
        // 校验节点权限
        controlTemplate.checkNodePermission(memberId, nodeId, NodePermission.READ_NODE,
                status -> ExceptionUtil.isTrue(status, NODE_OPERATION_DENIED));
        return ResponseData.success(iNodeRelService.getRelationNodeInfoByNodeId(nodeId, viewId, memberId, type));
    }

}
