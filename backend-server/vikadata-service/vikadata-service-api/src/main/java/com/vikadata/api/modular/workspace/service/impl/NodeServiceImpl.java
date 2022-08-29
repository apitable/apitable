package com.vikadata.api.modular.workspace.service.impl;

import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collection;
import java.util.Collections;
import java.util.HashMap;
import java.util.HashSet;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import java.util.Objects;
import java.util.Optional;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;

import javax.annotation.Resource;

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
import com.baomidou.mybatisplus.core.toolkit.IdWorker;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.baomidou.mybatisplus.extension.toolkit.SqlHelper;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.collections.CollectionUtils;
import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVRecord;
import org.apache.poi.EncryptedDocumentException;

import com.vikadata.api.cache.bean.LoginUserDto;
import com.vikadata.api.cache.service.UserSpaceService;
import com.vikadata.api.config.properties.LimitProperties;
import com.vikadata.api.constants.AuditConstants;
import com.vikadata.api.constants.FileSuffixConstants;
import com.vikadata.api.constants.NodeExtraConstants;
import com.vikadata.api.context.LoginContext;
import com.vikadata.api.control.ControlRoleDict;
import com.vikadata.api.control.ControlTemplate;
import com.vikadata.api.control.permission.NodePermission;
import com.vikadata.api.control.role.ControlRole;
import com.vikadata.api.enums.audit.AuditSpaceAction;
import com.vikadata.api.enums.datasheet.FieldType;
import com.vikadata.api.enums.datasheet.IdRulePrefixEnum;
import com.vikadata.api.enums.datasheet.ViewType;
import com.vikadata.api.enums.exception.ActionException;
import com.vikadata.api.enums.exception.DatabaseException;
import com.vikadata.api.enums.exception.NodeException;
import com.vikadata.api.enums.exception.ParameterException;
import com.vikadata.api.enums.exception.PermissionException;
import com.vikadata.api.enums.workbench.ResourceType;
import com.vikadata.api.event.AuditSpaceEvent;
import com.vikadata.api.event.AuditSpaceEvent.AuditSpaceArg;
import com.vikadata.api.holder.SpaceHolder;
import com.vikadata.api.lang.SpaceGlobalFeature;
import com.vikadata.api.model.dto.node.NodeBaseInfoDTO;
import com.vikadata.api.model.dto.node.UrlNodeInfoDTO;
import com.vikadata.api.model.dto.organization.MemberDto;
import com.vikadata.api.model.ro.datasheet.FieldMapRo;
import com.vikadata.api.model.ro.datasheet.MetaMapRo;
import com.vikadata.api.model.ro.datasheet.RecordDataRo;
import com.vikadata.api.model.ro.datasheet.RecordMapRo;
import com.vikadata.api.model.ro.datasheet.ViewMapRo;
import com.vikadata.api.model.ro.node.CreateDatasheetRo;
import com.vikadata.api.model.ro.node.ImportExcelOpRo;
import com.vikadata.api.model.ro.node.NodeCopyOpRo;
import com.vikadata.api.model.ro.node.NodeMoveOpRo;
import com.vikadata.api.model.ro.node.NodeOpRo;
import com.vikadata.api.model.ro.node.NodeRelRo;
import com.vikadata.api.model.ro.node.NodeUpdateOpRo;
import com.vikadata.api.model.vo.node.BaseNodeInfo;
import com.vikadata.api.model.vo.node.FieldPermissionInfo;
import com.vikadata.api.model.vo.node.NodeFromSpaceVo;
import com.vikadata.api.model.vo.node.NodeInfo;
import com.vikadata.api.model.vo.node.NodeInfoTreeVo;
import com.vikadata.api.model.vo.node.NodeInfoVo;
import com.vikadata.api.model.vo.node.NodeInfoWindowVo;
import com.vikadata.api.model.vo.node.NodeInfoWindowVo.MemberInfo;
import com.vikadata.api.model.vo.node.NodePathVo;
import com.vikadata.api.model.vo.node.NodePermissionView;
import com.vikadata.api.model.vo.node.NodeSearchResult;
import com.vikadata.api.model.vo.node.NodeShareTree;
import com.vikadata.api.model.vo.node.ShowcaseVo.NodeExtra;
import com.vikadata.api.model.vo.node.SimpleSortableNodeInfo;
import com.vikadata.api.modular.grpc.client.service.IGrpcClientService;
import com.vikadata.api.modular.organization.mapper.MemberMapper;
import com.vikadata.api.modular.social.model.TenantBindDTO;
import com.vikadata.api.modular.social.service.IDingTalkInternalIsvService;
import com.vikadata.api.modular.social.service.ISocialTenantBindService;
import com.vikadata.api.modular.social.service.ISocialTenantService;
import com.vikadata.api.modular.space.mapper.SpaceAssetMapper;
import com.vikadata.api.modular.space.service.ISpaceAssetService;
import com.vikadata.api.modular.space.service.ISpaceRoleService;
import com.vikadata.api.modular.space.service.ISpaceService;
import com.vikadata.api.modular.workspace.listener.CsvReadListener;
import com.vikadata.api.modular.workspace.listener.ExcelSheetsDataListener;
import com.vikadata.api.modular.workspace.listener.MultiSheetReadListener;
import com.vikadata.api.modular.workspace.listener.NodeData;
import com.vikadata.api.modular.workspace.mapper.DatasheetMapper;
import com.vikadata.api.modular.workspace.mapper.DatasheetMetaMapper;
import com.vikadata.api.modular.workspace.mapper.NodeMapper;
import com.vikadata.api.modular.workspace.mapper.NodeShareSettingMapper;
import com.vikadata.api.modular.workspace.mapper.WidgetMapper;
import com.vikadata.api.modular.workspace.model.CreateNodeDto;
import com.vikadata.api.modular.workspace.model.NodeCopyEffectDTO;
import com.vikadata.api.modular.workspace.model.NodeCopyOptions;
import com.vikadata.api.modular.workspace.model.NodeExtraDTO;
import com.vikadata.api.modular.workspace.service.IDatasheetMetaService;
import com.vikadata.api.modular.workspace.service.IDatasheetRecordService;
import com.vikadata.api.modular.workspace.service.IDatasheetService;
import com.vikadata.api.modular.workspace.service.IFieldRoleService;
import com.vikadata.api.modular.workspace.service.INodeDescService;
import com.vikadata.api.modular.workspace.service.INodeRelService;
import com.vikadata.api.modular.workspace.service.INodeRoleService;
import com.vikadata.api.modular.workspace.service.INodeService;
import com.vikadata.api.modular.workspace.service.IResourceMetaService;
import com.vikadata.api.util.CollectionUtil;
import com.vikadata.api.util.IdUtil;
import com.vikadata.api.util.StringUtil;
import com.vikadata.api.util.VikaStrings;
import com.vikadata.boot.autoconfigure.social.DingTalkProperties.IsvAppProperty;
import com.vikadata.boot.autoconfigure.spring.SpringContextHolder;
import com.vikadata.core.exception.BusinessException;
import com.vikadata.core.support.tree.DefaultTreeBuildFactory;
import com.vikadata.core.util.ExceptionUtil;
import com.vikadata.core.util.SqlTool;
import com.vikadata.define.constants.RedisConstants;
import com.vikadata.define.enums.NodeType;
import com.vikadata.define.utils.FileTool;
import com.vikadata.entity.DatasheetEntity;
import com.vikadata.entity.DatasheetMetaEntity;
import com.vikadata.entity.DatasheetRecordEntity;
import com.vikadata.entity.NodeDescEntity;
import com.vikadata.entity.NodeEntity;
import com.vikadata.integration.grpc.BasicResult;
import com.vikadata.integration.grpc.NodeCopyRo;
import com.vikadata.integration.grpc.NodeDeleteRo;

import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import static com.vikadata.api.constants.AssetsPublicConstants.SPACE_PREFIX;
import static com.vikadata.api.enums.exception.ActionException.FILE_EMPTY;
import static com.vikadata.api.enums.exception.NodeException.NODE_COPY_FOLDER_ERROR;
import static com.vikadata.api.enums.exception.NodeException.NOT_ALLOW;
import static com.vikadata.api.enums.exception.NodeException.ROOT_NODE_CAN_NOT_SHARE;
import static com.vikadata.api.enums.exception.NodeException.SHARE_NODE_STORE_FAIL;
import static com.vikadata.api.enums.exception.PermissionException.NODE_OPERATION_DENIED;
import static com.vikadata.api.enums.exception.PermissionException.ROOT_NODE_OP_DENIED;
import static com.vikadata.api.enums.exception.SpaceException.NOT_IN_SPACE;
import static com.vikadata.api.enums.exception.TemplateException.SUB_NODE_PERMISSION_INSUFFICIENT;
import static com.vikadata.api.util.NodeUtil.sortNode;

/**
 * <p>
 * 数据表格表 服务实现类
 * </p>
 *
 * @author Chambers
 * @since 2019-10-07
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
    private DatasheetMetaMapper datasheetMetaMapper;

    @Resource
    private DatasheetMapper datasheetMapper;

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
    private WidgetMapper widgetMapper;

    @Resource
    private LimitProperties limitProperties;

    @Resource
    private IFieldRoleService iFieldRoleService;

    @Resource
    private IGrpcClientService grpcClientService;

    @Resource
    private ISocialTenantBindService iSocialTenantBindService;

    @Resource
    private ISocialTenantService iSocialTenantService;

    @Resource
    private IDingTalkInternalIsvService iDingTalkInternalIsvService;

    @Resource
    private RedisTemplate<String, String> redisTemplate;

    @Resource
    private INodeDescService nodeDescService;

    @Resource
    private ISpaceRoleService iSpaceRoleService;

    @Resource
    private UserSpaceService userSpaceService;

    @Override
    public String getRootNodeIdBySpaceId(String spaceId) {
        log.info("查询空间「{}」的根节点ID", spaceId);
        return nodeMapper.selectRootNodeIdBySpaceId(spaceId);
    }

    @Override
    public List<String> getNodeIdBySpaceIdAndType(String spaceId, Integer type) {
        log.info("查询空间「{}」节点类型为「{}」的节点ID", spaceId, type);
        return nodeMapper.selectNodeIdBySpaceIdAndType(spaceId, type);
    }

    @Override
    public NodeType getTypeByNodeId(String nodeId) {
        Integer type = nodeMapper.selectNodeTypeByNodeId(nodeId);
        ExceptionUtil.isNotNull(type, PermissionException.NODE_NOT_EXIST);
        return NodeType.toEnum(type);
    }

    @Override
    public NodeEntity getByNodeId(String nodeId) {
        log.info("查询节点:{}", nodeId);
        NodeEntity nodeEntity = nodeMapper.selectByNodeId(nodeId);
        ExceptionUtil.isNotNull(nodeEntity, PermissionException.NODE_NOT_EXIST);
        return nodeEntity;
    }

    @Override
    public List<String> getExistNodeIdsBySelf(List<String> nodeIds) {
        return nodeMapper.selectNodeIdByNodeIdIn(nodeIds);
    }

    private List<NodeEntity> getByNodeIds(Collection<String> nodeIds) {
        log.info("批量查询节点:{}", nodeIds);
        List<NodeEntity> nodeEntities = nodeMapper.selectByNodeIds(nodeIds);
        ExceptionUtil.isNotEmpty(nodeEntities, PermissionException.NODE_NOT_EXIST);
        return nodeEntities;
    }

    @Override
    public String getSpaceIdByNodeId(String nodeId) {
        log.info("查询节点所在空间ID");
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
        log.info("查询包含删除在内的节点「{}」所在的空间ID", nodeId);
        return nodeMapper.selectSpaceIdByNodeIdIncludeDeleted(nodeId);
    }

    @Override
    public Boolean getIsTemplateByNodeIds(List<String> nodeIds) {
        log.info("查询节点「{}」是否都属于模板", nodeIds);
        List<Boolean> result = nodeMapper.selectIsTemplateByNodeId(nodeIds);
        ExceptionUtil.isTrue(result.size() == 1, ParameterException.INCORRECT_ARG);
        return result.get(0);
    }

    @Override
    public String getParentIdByNodeId(String nodeId) {
        log.info("查询节点「{}」的父级节点ID", nodeId);
        return nodeMapper.selectParentIdByNodeId(nodeId);
    }

    @Override
    public String getNodeNameByNodeId(String nodeId) {
        log.info("查询节点「{}」的节点名称", nodeId);
        return nodeMapper.selectNodeNameByNodeId(nodeId);
    }

    @Override
    public List<String> getPathParentNode(String nodeId) {
        log.info("查询节点「{}」的节点路径", nodeId);
        return nodeMapper.selectParentNodePath(nodeId);
    }

    @Override
    public List<NodeInfo> getNodeInfoByNodeIds(Collection<String> nodeIds) {
        log.info("批量查询「{}」的节点信息视图", nodeIds);
        return nodeMapper.selectInfoByNodeIds(nodeIds);
    }

    @Override
    public String checkNodeIfExist(String spaceId, String nodeId) {
        log.info("检查节点是否存在");
        String nodeSpaceId = nodeMapper.selectSpaceIdByNodeId(nodeId);
        ExceptionUtil.isNotNull(nodeSpaceId, PermissionException.NODE_NOT_EXIST);
        // spaceId不为空时，校验是否跨空间
        ExceptionUtil.isTrue(StrUtil.isBlank(spaceId) || nodeSpaceId.equals(spaceId), NOT_IN_SPACE);
        return nodeSpaceId;
    }

    @Override
    public void checkSourceDatasheet(String spaceId, Long memberId, Integer type, NodeRelRo extra) {
        NodeType nodeType = NodeType.toEnum(type);
        switch (nodeType) {
            case FORM:
            case MIRROR:
                ExceptionUtil.isTrue(extra != null && StrUtil.isNotBlank(extra.getDatasheetId()) &&
                        StrUtil.isNotBlank(extra.getViewId()), ParameterException.INCORRECT_ARG);
                // 判断数表是否不存在或跨空间访问
                this.checkNodeIfExist(spaceId, extra.getDatasheetId());
                // 检查数表指定视图是否存在
                iDatasheetMetaService.checkViewIfExist(extra.getDatasheetId(), extra.getViewId());
                // 收集表要求源表的可编辑权限，mirror 要求可管理
                NodePermission permission = nodeType.equals(NodeType.FORM) ? NodePermission.EDIT_NODE : NodePermission.MANAGE_NODE;
                // 校验数表是否有指定操作权限
                controlTemplate.checkNodePermission(memberId, extra.getDatasheetId(), permission,
                        status -> ExceptionUtil.isTrue(status, NODE_OPERATION_DENIED));
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
        log.info("模糊搜索节点");
        if (StrUtil.isBlank(StrUtil.trim(keyword))) {
            return new ArrayList<>();
        }
        //模糊搜索结果
        List<String> nodeIds = nodeMapper.selectLikeNodeName(spaceId, StrUtil.trim(keyword));
        List<NodeInfoVo> nodeInfos = this.getNodeInfoByNodeIds(spaceId, memberId, nodeIds);
        if (CollUtil.isEmpty(nodeInfos)) {
            return new ArrayList<>();
        }
        // 写入上级路径
        List<NodeSearchResult> results = new ArrayList<>(nodeInfos.size());
        List<String> parentIds = nodeInfos.stream().map(NodeInfoVo::getParentId).collect(Collectors.toList());
        Map<String, String> parentIdToPathMap = this.getSuperiorPathByParentIds(spaceId, parentIds);
        nodeInfos.forEach(info -> {
            NodeSearchResult result = new NodeSearchResult();
            BeanUtil.copyProperties(info, result);
            if (MapUtil.isNotEmpty(parentIdToPathMap)) {
                result.setSuperiorPath(parentIdToPathMap.get(info.getParentId()));
            }
            results.add(result);
        });
        return results;
    }

    @Override
    public NodeInfoTreeVo getNodeTree(String spaceId, String nodeId, Long memberId, int depth) {
        log.info("查询节点树");
        List<String> nodeIds = nodeMapper.selectSubNodesByOrder(spaceId, nodeId, depth);
        return this.getNodeInfoTreeByNodeIds(spaceId, memberId, nodeIds);
    }

    @Override
    public List<NodeInfoVo> getChildNodesByNodeId(String spaceId, Long memberId, String nodeId) {
        log.info("查询子节点列表");
        // 获取直属子节点
        List<String> subNodeIds = nodeMapper.selectOrderSubNodeIds(nodeId);
        return this.getNodeInfoByNodeIds(spaceId, memberId, subNodeIds);
    }

    @Override
    public List<NodePathVo> getParentPathByNodeId(String spaceId, String nodeId) {
        log.info("获取节点父级路径");
        return nodeMapper.selectParentNodeListByNodeId(spaceId, nodeId);
    }

    @Override
    public NodeInfoTreeVo position(String spaceId, Long memberId, String nodeId) {
        log.info("定位节点");
        // 获取节点的所有父级节点, 假设节点结构如下
        // root
        // -- a
        // ---- b
        // ------ c
        // 此时获取c节点时，应该返回[c,b,a]
        List<String> parentNodeIds = nodeMapper.selectParentNodePath(nodeId);
        // 没有父节点应该要报错，但定位节点可不需要，直接返回空
        if (parentNodeIds.isEmpty()) {
            return null;
        }
        // 校验父节点权限是否有权限访问，否则不予定位
        ControlRoleDict roleDict = controlTemplate.fetchNodeRole(memberId, parentNodeIds);
        if (roleDict.isEmpty()) {
            return null;
        }
        for (String parentNode : parentNodeIds) {
            if (!roleDict.containsKey(parentNode)) {
                return null;
            }
        }
        // 查询根节点
        String rootNodeId = getRootNodeIdBySpaceId(spaceId);
        // 查询根节点下的第一层节点
        List<String> firstLevelNodes = nodeMapper.selectSubNodeIds(rootNodeId);
        // 父节点补充树节点加载
        List<String> viewNodeIds = new ArrayList<>(firstLevelNodes);
        viewNodeIds.add(rootNodeId);
        for (int i = 0; i < parentNodeIds.size() - 1; i++) {
            List<SimpleSortableNodeInfo> subNodeList = nodeMapper.selectSubNodeInfo(parentNodeIds.get(i));
            List<SimpleSortableNodeInfo> sortedNodeList = sortNode(subNodeList);
            List<String> subNodeIds = sortedNodeList.stream().map(SimpleSortableNodeInfo::getNodeId).collect(Collectors.toList());
            viewNodeIds.addAll(subNodeIds);
        }
        return this.getNodeInfoTreeByNodeIds(spaceId, memberId, viewNodeIds);
    }

    @Override
    public NodeInfoVo getNodeInfoByNodeId(String spaceId, String nodeId, ControlRole role) {
        log.info("查询节点信息");
        NodeInfoVo nodeInfo = nodeMapper.selectNodeInfoByNodeId(nodeId);
        SpaceGlobalFeature feature = iSpaceService.getSpaceGlobalFeature(spaceId);
        nodeInfo.setRole(role.getRoleTag());
        nodeInfo.setPermissions(role.permissionToBean(NodePermissionView.class, feature));
        return nodeInfo;
    }

    @Override
    public List<NodeInfoVo> getNodeInfoByNodeIds(String spaceId, Long memberId, List<String> nodeIds) {
        log.info("查询多个节点的视图信息");
        if (CollUtil.isEmpty(nodeIds)) {
            return new ArrayList<>();
        }
        ControlRoleDict roleDict = controlTemplate.fetchNodeRole(memberId, nodeIds);
        if (roleDict.isEmpty()) {
            return new ArrayList<>();
        }
        // 批量查询节点信息
        List<NodeInfoVo> infos = nodeMapper.selectNodeInfoByNodeIds(roleDict.keySet(), memberId);
        Map<String, NodeInfoVo> nodeIdToInfoMap = infos.stream().collect(Collectors.toMap(NodeInfoVo::getNodeId, vo -> vo));
        // 构建有序集合
        List<NodeInfoVo> nodeInfos = new ArrayList<>();
        roleDict.keySet().stream().filter(nodeIdToInfoMap::containsKey).forEach(nodeId -> nodeInfos.add(nodeIdToInfoMap.get(nodeId)));
        SpaceGlobalFeature feature = iSpaceService.getSpaceGlobalFeature(spaceId);
        setRole(nodeInfos, roleDict, feature);
        return nodeInfos;
    }

    @Override
    public NodeInfoTreeVo getNodeInfoTreeByNodeIds(String spaceId, Long memberId, List<String> nodeIds) {
        log.info("查询多个节点的视图并构造成树形结构");
        // 构造树形需要数据结构支持才能构造树形，先把树形构造出来，再整合删除
        ControlRoleDict roleDict = controlTemplate.fetchNodeTreeNode(memberId, nodeIds);
        ExceptionUtil.isFalse(roleDict.isEmpty(), PermissionException.NODE_ACCESS_DENIED);
        List<NodeInfoTreeVo> treeList = nodeMapper.selectNodeInfoTreeByNodeIds(roleDict.keySet(), memberId);
        // 节点切换成内存自定义排序
        CollectionUtil.customSequenceSort(treeList, NodeInfoTreeVo::getNodeId, new ArrayList<>(roleDict.keySet()));
        SpaceGlobalFeature feature = iSpaceService.getSpaceGlobalFeature(spaceId);
        setRole(treeList, roleDict, feature);
        List<NodeInfoTreeVo> nodeTrees = new DefaultTreeBuildFactory<NodeInfoTreeVo>().doTreeBuild(treeList);
        return CollUtil.isNotEmpty(nodeTrees) ? nodeTrees.get(0) : null;
    }

    private <T extends NodeInfoVo> void setRole(List<T> list, ControlRoleDict roleDict, SpaceGlobalFeature feature) {
        list.forEach(node -> {
            node.setRole(roleDict.get(node.getNodeId()).getRoleTag());
            node.setPermissions(roleDict.get(node.getNodeId()).permissionToBean(NodePermissionView.class, feature));
        });
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public String createNode(Long userId, String spaceId, NodeOpRo nodeOpRo) {
        log.info("新增节点");
        // if (nodeOpRo.getType() != NodeType.FOLDER.getNodeType()) {
        //     //验证节点数量是否到达上限
        //     iSubscriptionService.checkSheetNums(spaceId, 1);
        // }
        //parent_id和space_id必须是匹配，父节点是属于这个空间的，防止跨空间跨节点操作行为
        this.checkNodeIfExist(spaceId, nodeOpRo.getParentId());
        String name = duplicateNameModify(nodeOpRo.getParentId(), nodeOpRo.getType(), nodeOpRo.getNodeName(), null);
        String nodeId = IdUtil.createNodeId(nodeOpRo.getType());
        // 新增节点若是文件，对应创建数表/收集表
        this.createFileMeta(userId, spaceId, nodeId, nodeOpRo.getType(), name, nodeOpRo.getExtra());
        //防止传入空字符串，前置节点不为null时，若被删除或不在parentId下，移动失败
        String preNodeId = this.verifyPreNodeId(nodeOpRo.getPreNodeId(), nodeOpRo.getParentId());
        NodeEntity nodeEntity = NodeEntity.builder()
                .parentId(nodeOpRo.getParentId())
                .spaceId(spaceId)
                .preNodeId(preNodeId)
                .nodeName(name)
                .type(nodeOpRo.getType())
                .nodeId(nodeId)
                .build();
        // 将后一位节点的前置节点ID改为新增节点ID(A <- C  =>  B <- C)
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
        // 创建节点
        String nodeId = createNode(userId, spaceId, nodeOpRo);

        // 添加描述信息
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
        log.info("批量新增节点");
        if (CollUtil.isNotEmpty(nodeList)) {
            if (dstCount == null) {
                dstCount = 0;
                for (NodeEntity node : nodeList) {
                    if (node.getType() == NodeType.DATASHEET.getNodeType()) {
                        dstCount++;
                    }
                }
            }
            // 验证节点数量是否到达上限
            // iSubscriptionService.checkSheetNums(nodeList.get(0).getSpaceId(), dstCount);
            boolean flag = SqlHelper.retBool(nodeMapper.insertBatch(nodeList));
            ExceptionUtil.isTrue(flag, DatabaseException.INSERT_ERROR);
        }
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void edit(Long userId, String nodeId, NodeUpdateOpRo opRo) {
        log.info("编辑节点");
        NodeEntity nodeEntity = this.getByNodeId(nodeId);
        ExceptionUtil.isFalse(nodeEntity.getType().equals(NodeType.ROOT.getNodeType()), NOT_ALLOW);
        // 修改名称
        this.updateNodeName(userId, nodeId, opRo.getNodeName(), nodeEntity);

        // 修改图标
        this.updateNodeIcon(userId, nodeId, opRo.getIcon(), nodeEntity.getIcon());

        // 修改封面图
        this.updateNodeCover(userId, nodeId, opRo.getCover(), nodeEntity.getCover());

        // 修改是否展示记录的历史
        if (ObjectUtil.isNotNull(opRo.getShowRecordHistory()) && nodeEntity.getType() == NodeType.DATASHEET.getNodeType()) {
            boolean flag;
            String newValue = JSONUtil.toJsonStr(Dict.create().set(NodeExtraConstants.SHOW_RECORD_HISTORY, opRo.getShowRecordHistory()));
            if (ObjectUtil.isNotNull(nodeEntity.getExtra())) {
                flag = SqlHelper.retBool(nodeMapper.updateExtraShowRecordHistoryByNodeId(nodeId, opRo.getShowRecordHistory()));
            }
            else {
                flag = SqlHelper.retBool(nodeMapper.updateExtraByNodeId(nodeId, newValue));
            }
            ExceptionUtil.isTrue(flag, DatabaseException.EDIT_ERROR);
        }
    }

    private void updateNodeName(Long userId, String nodeId, String name, NodeEntity entity) {
        if (StrUtil.isBlank(name)) {
            return;
        }
        // 防止同级目录，重复名称修改
        String nodeName = duplicateNameModify(entity.getParentId(), entity.getType(), name, nodeId);
        boolean flag = SqlHelper.retBool(nodeMapper.updateNameByNodeId(nodeId, nodeName));
        ExceptionUtil.isTrue(flag, DatabaseException.EDIT_ERROR);
        // 数表节点，对应修改
        if (entity.getType() == NodeType.DATASHEET.getNodeType()) {
            iDatasheetService.updateDstName(userId, nodeId, nodeName);
        }
        // 发布空间审计事件
        JSONObject info = JSONUtil.createObj();
        info.set(AuditConstants.OLD_NODE_NAME, StrUtil.nullToEmpty(entity.getNodeName()));
        info.set(AuditConstants.NODE_NAME, nodeName);
        AuditSpaceArg arg = AuditSpaceArg.builder().action(AuditSpaceAction.RENAME_NODE).userId(userId).nodeId(nodeId).info(info).build();
        SpringContextHolder.getApplicationContext().publishEvent(new AuditSpaceEvent(this, arg));
    }

    private void updateNodeIcon(Long userId, String nodeId, String icon, String oldNodeIcon) {
        if (icon == null) {
            return;
        }
        // 图标重置
        if (icon.trim().equals(StrUtil.EMPTY)) {
            icon = StrUtil.EMPTY;
        }
        boolean flag = SqlHelper.retBool(nodeMapper.updateIconByNodeId(nodeId, icon));
        ExceptionUtil.isTrue(flag, DatabaseException.EDIT_ERROR);
        // 发布空间审计事件
        JSONObject info = JSONUtil.createObj();
        info.set(AuditConstants.OLD_NODE_ICON, StrUtil.nullToEmpty(oldNodeIcon));
        info.set(AuditConstants.NODE_ICON, icon);
        AuditSpaceArg arg = AuditSpaceArg.builder().action(AuditSpaceAction.UPDATE_NODE_ICON).userId(userId).nodeId(nodeId).info(info).build();
        SpringContextHolder.getApplicationContext().publishEvent(new AuditSpaceEvent(this, arg));
    }

    private void updateNodeCover(Long userId, String nodeId, String cover, String oldNodeCover) {
        if (StrUtil.isBlank(cover)) {
            return;
        }
        // 可以重置封面图为空
        if ("null".equalsIgnoreCase(cover) || "undefined".equalsIgnoreCase(cover)) {
            cover = null;
        }
        boolean flag = SqlHelper.retBool(nodeMapper.updateCoverByNodeId(nodeId, cover));
        ExceptionUtil.isTrue(flag, DatabaseException.EDIT_ERROR);
        // 旧封面图降低引用数
        if (StrUtil.startWith(oldNodeCover, SPACE_PREFIX)) {
            spaceAssetMapper.updateCiteByNodeIdAndToken(nodeId, oldNodeCover, -1);
        }
        // 发布空间审计事件
        JSONObject info = JSONUtil.createObj();
        info.set(AuditConstants.OLD_NODE_COVER, StrUtil.nullToEmpty(oldNodeCover));
        info.set(AuditConstants.NODE_COVER, StrUtil.nullToEmpty(cover));
        AuditSpaceArg arg = AuditSpaceArg.builder().action(AuditSpaceAction.UPDATE_NODE_COVER).userId(userId).nodeId(nodeId).info(info).build();
        SpringContextHolder.getApplicationContext().publishEvent(new AuditSpaceEvent(this, arg));
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public List<String> move(Long userId, NodeMoveOpRo opRo) {
        log.info("移动节点");
        NodeEntity nodeEntity = this.getByNodeId(opRo.getNodeId());
        ExceptionUtil.isFalse(nodeEntity.getType().equals(NodeType.ROOT.getNodeType()), NOT_ALLOW);
        //传入参数，节点ID与前置节点ID相同
        ExceptionUtil.isFalse(nodeEntity.getNodeId().equals(opRo.getPreNodeId()), ParameterException.INCORRECT_ARG);
        ExceptionUtil.isFalse(nodeEntity.getNodeId().equals(opRo.getParentId()), ParameterException.INCORRECT_ARG);
        //该节点是文件夹时，防止移入到子后代节点里
        if (nodeEntity.getType().equals(NodeType.FOLDER.getNodeType())) {
            List<String> subNodeIds = nodeMapper.selectAllSubNodeIds(nodeEntity.getNodeId());
            ExceptionUtil.isFalse(CollUtil.isNotEmpty(subNodeIds) && subNodeIds.contains(opRo.getParentId()), NodeException.MOVE_FAILURE);
        }
        AuditSpaceAction action = AuditSpaceAction.MOVE_NODE;
        JSONObject info = JSONUtil.createObj();
        info.set(AuditConstants.OLD_PRE_NODE_ID, StrUtil.nullToEmpty(nodeEntity.getPreNodeId()));
        String name = nodeEntity.getNodeName();
        String parentId = nodeEntity.getParentId();
        //记录数据有变化的节点（前端要求）
        List<String> nodeIds = CollUtil.newArrayList(nodeEntity.getNodeId());
        if (!nodeEntity.getParentId().equals(opRo.getParentId())) {
            //跨文件夹移动
            parentId = opRo.getParentId();
            //校验新的父级节点是否存在以及在同一个空间中
            this.checkNodeIfExist(nodeEntity.getSpaceId(), parentId);
            name = this.duplicateNameModify(parentId, nodeEntity.getType(), nodeEntity.getNodeName(), null);
            //节点是数表，名称发生改变对应修改
            if (nodeEntity.getType() == NodeType.DATASHEET.getNodeType() && !nodeEntity.getNodeName().equals(name)) {
                iDatasheetService.updateDstName(userId, nodeEntity.getNodeId(), name);
            }
            //记录新旧位置的父级节点
            nodeIds.add(nodeEntity.getParentId());
            nodeIds.add(opRo.getParentId());
            info.set(AuditConstants.OLD_PARENT_ID, nodeEntity.getParentId());
        }
        else {
            //同级排序，新旧前置节点相同，即未发生移动
            if (Optional.ofNullable(opRo.getPreNodeId()).orElse("").equals(Optional.ofNullable(nodeEntity.getPreNodeId()).orElse(""))) {
                return new ArrayList<>();
            }
            action = AuditSpaceAction.SORT_NODE;
        }
        //防止传入空字符串，前置节点不为null时，若被删除或不在parentId下，移动失败
        String preNodeId = this.verifyPreNodeId(opRo.getPreNodeId(), parentId);
        //记录新旧位置的后一个节点
        List<String> suffixNodeIds = nodeMapper.selectNodeIdByPreNodeIdIn(CollUtil.newArrayList(nodeEntity.getNodeId(), preNodeId));
        nodeIds.addAll(suffixNodeIds);
        //将后一个节点的前置节点更新为该节点的前节点 (A <- B <- C  =>  A <- C)
        nodeMapper.updatePreNodeIdBySelf(nodeEntity.getPreNodeId(), nodeEntity.getNodeId(), nodeEntity.getParentId());
        //更新移动后前后节点顺序关系 (D <- E  =>  D <- B <- E)
        nodeMapper.updatePreNodeIdBySelf(nodeEntity.getNodeId(), preNodeId, parentId);
        //更新该节点的信息（前一个节点ID可能更新为null，故不使用updateById）
        nodeMapper.updateInfoByNodeId(nodeEntity.getNodeId(), parentId, preNodeId, name);
        // 发布空间审计事件
        info.set(AuditConstants.MOVE_EFFECT_SUFFIX_NODES, CollUtil.emptyIfNull(suffixNodeIds));
        AuditSpaceArg arg = AuditSpaceArg.builder().action(action).userId(userId).nodeId(opRo.getNodeId()).info(info).build();
        SpringContextHolder.getApplicationContext().publishEvent(new AuditSpaceEvent(this, arg));
        return nodeIds;
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void deleteById(String spaceId, Long memberId, String... ids) {
        log.info("删除节点");
        Long userId = memberMapper.selectUserIdByMemberId(memberId);
        List<String> idList = Arrays.asList(ids);
        List<NodeEntity> list = this.getByNodeIds(new HashSet<>(idList));
        // 校验根节点
        long count = list.stream().filter(node -> node.getType().equals(NodeType.ROOT.getNodeType())).count();
        ExceptionUtil.isFalse(count > 0, NOT_ALLOW);
        // 获取上级路径
        List<String> parentIds = list.stream().map(NodeEntity::getParentId).collect(Collectors.toList());
        Map<String, String> parentIdToPathMap = this.getSuperiorPathByParentIds(spaceId, parentIds);
        // 赋予删除节点角色
        iNodeRoleService.copyExtendNodeRoleIfExtend(userId, spaceId, memberId, new HashSet<>(idList));
        //获取节点及子后代的节点ID和对应的数表ID集合
        List<String> nodeIds = nodeMapper.selectBatchAllSubNodeIds(idList, false);
        // 删除节点及子后代所有节点
        if (CollUtil.isNotEmpty(nodeIds)) {
            this.nodeDeleteChangeset(nodeIds);
            iDatasheetService.updateIsDeletedStatus(userId, nodeIds, true);
            boolean flag = SqlHelper.retBool(nodeMapper.updateIsRubbishByNodeIdIn(userId, nodeIds, true));
            ExceptionUtil.isTrue(flag, DatabaseException.DELETE_ERROR);
            // 禁用节点分享
            nodeShareSettingMapper.disableByNodeIds(nodeIds);
            // 删除节点的空间附件资源
            iSpaceAssetService.updateIsDeletedByNodeIds(nodeIds, true);
        }
        list.forEach(nodeEntity -> {
            // 更新 后一个节点对应的前节点（大表处理时间较长，nodeEntity.getPreNodeId()可能已发生变化，故不直接使用 updatePreNodeIdBySelf）
            nodeMapper.updatePreNodeIdByJoinSelf(nodeEntity.getNodeId(), nodeEntity.getParentId());
            // 保存删除时的路径，指定删除的节点挂靠在父节点-1
            String delPath = MapUtil.isNotEmpty(parentIdToPathMap) ? parentIdToPathMap.get(nodeEntity.getParentId()) : null;
            nodeMapper.updateDeletedPathByNodeId(nodeEntity.getNodeId(), delPath);
            // 发布空间审计事件
            AuditSpaceArg arg = AuditSpaceArg.builder().action(AuditSpaceAction.DELETE_NODE).userId(userId).nodeId(nodeEntity.getNodeId()).build();
            SpringContextHolder.getApplicationContext().publishEvent(new AuditSpaceEvent(this, arg));
        });
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void delTemplateRefNode(Long userId, String... nodeIds) {
        log.info("删除模板映射节点");
        // 获取节点及子后代的节点ID
        List<String> subNodeIds = nodeMapper.selectBatchAllSubNodeIds(Arrays.asList(nodeIds), false);
        if (CollUtil.isNotEmpty(subNodeIds)) {
            // 删除节点、数表信息
            boolean flag = SqlHelper.retBool(nodeMapper.updateIsRubbishByNodeIdIn(userId, subNodeIds, true));
            ExceptionUtil.isTrue(flag, DatabaseException.DELETE_ERROR);
            iDatasheetService.updateIsDeletedStatus(userId, subNodeIds, true);
            // 删除节点的空间附件资源
            iSpaceAssetService.updateIsDeletedByNodeIds(subNodeIds, true);
        }
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public NodeCopyEffectDTO copy(Long userId, NodeCopyOpRo opRo) {
        log.info("复制节点");
        NodeEntity copyNode = this.getByNodeId(opRo.getNodeId());
        NodeType nodeType = NodeType.toEnum(copyNode.getType());
        // 限制复制根节点、文件夹
        ExceptionUtil.isFalse(nodeType.equals(NodeType.ROOT), NOT_ALLOW);
        ExceptionUtil.isFalse(nodeType.equals(NodeType.FOLDER), NODE_COPY_FOLDER_ERROR);
        // 验证节点数量是否到达上限
        // iSubscriptionService.checkSheetNums(copyNode.getSpaceId(), 1);

        Map<String, Object> param = new HashMap<>(1);
        param.put("file_name", copyNode.getNodeName());
        String nodeName = StringUtil.format(VikaStrings.t("default_file_copy"), param);

        String name = duplicateNameModify(copyNode.getParentId(), copyNode.getType(), nodeName, null);
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
        // 将后一个节点的前节点更新为复制出来的节点 (A <- B  =>  A <- A' <- B)
        nodeMapper.updatePreNodeIdBySelf(createNodeDto.getNewNodeId(), opRo.getNodeId(), copyNode.getParentId());
        // 保存节点
        String copyNodeId = createChildNode(userId, createNodeDto);
        // 组成节点ID Map
        Map<String, String> newNodeMap = new HashMap<>(1);
        newNodeMap.put(copyNode.getNodeId(), copyNodeId);
        NodeCopyEffectDTO copyEffect = NodeCopyEffectDTO.builder().nodeId(opRo.getNodeId()).copyNodeId(copyNodeId).build();
        // 不同类型节点处理
        switch (nodeType) {
            case FORM:
                // 复制收集表
                iNodeRelService.copy(userId, opRo.getNodeId(), copyNodeId);
                iResourceMetaService.copyBatch(userId, Collections.singletonList(opRo.getNodeId()), newNodeMap);
                iSpaceAssetService.copyBatch(newNodeMap, copyNode.getSpaceId());
                return copyEffect;
            case DASHBOARD:
                // 复制仪表盘
                iResourceMetaService.copyResourceMeta(userId, copyNode.getSpaceId(), opRo.getNodeId(), copyNodeId, ResourceType.DASHBOARD);
                return copyEffect;
            case MIRROR:
                // 复制镜像
                iNodeRelService.copy(userId, opRo.getNodeId(), copyNodeId);
                iResourceMetaService.copyResourceMeta(userId, copyNode.getSpaceId(), opRo.getNodeId(), copyNodeId, ResourceType.MIRROR);
                return copyEffect;
            default:
                break;
        }
        //复制对应的数表、meta和record
        boolean copyData = BooleanUtil.isTrue(opRo.getData());
        NodeCopyOptions options = NodeCopyOptions.create(copyData, true);
        // 获取数表所有字段的权限
        Long memberId = memberMapper.selectIdByUserIdAndSpaceId(userId, copyNode.getSpaceId());
        Map<String, FieldPermissionInfo> fieldPermissionMap = iFieldRoleService.getFieldPermissionMap(memberId, copyNode.getNodeId(), null);
        if (MapUtil.isNotEmpty(fieldPermissionMap)) {
            // 过滤无字段权限的字段
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
        List<String> linkFieldIds = iDatasheetService.copy(userId, copyNode.getSpaceId(), copyNode.getNodeId(),
                createNodeDto.getNewNodeId(), createNodeDto.getNodeName(), options, newNodeMap);
        if (copyData) {
            //选择复制数据时，同时复制节点引用的空间附件资源
            iSpaceAssetService.copyBatch(newNodeMap, copyNode.getSpaceId());
        }
        // 复制节点描述
        iNodeDescService.copyBatch(newNodeMap);
        copyEffect.setLinkFieldIds(linkFieldIds);
        return copyEffect;
    }

    @Override
    public List<BaseNodeInfo> getForeignSheet(String nodeId) {
        log.info("查询节点的关联数表信息");
        //无论是文件夹还是数表，如果有关联数表，需全部查询出来
        NodeType nodeType = NodeType.toEnum(SqlTool.retCount(nodeMapper.selectNodeTypeByNodeId(nodeId)));
        ExceptionUtil.isTrue(nodeType != NodeType.ROOT, ROOT_NODE_CAN_NOT_SHARE);
        List<BaseNodeInfo> nodes = new ArrayList<>();
        if (nodeType == NodeType.FOLDER) {
            //文件夹
            List<String> subNodeIds = nodeMapper.selectAllSubNodeIdsByNodeType(nodeId, NodeType.DATASHEET.getNodeType());
            if (CollUtil.isNotEmpty(subNodeIds)) {
                getForeignDstIdsFilterSelf(nodes, subNodeIds);
            }
        }
        else if (nodeType == NodeType.DATASHEET) {
            //数表
            getForeignDstIdsFilterSelf(nodes, Collections.singletonList(nodeId));
        }
        return nodes;
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public String copyNodeToSpace(Long userId, String spaceId, String destParentId, String sourceNodeId, NodeCopyOptions options) {
        log.info("复制节点到空间");
        // 未指定父节点，取根节点作为父节点
        if (StrUtil.isBlank(destParentId)) {
            destParentId = nodeMapper.selectRootNodeIdBySpaceId(spaceId);
        }
        NodeEntity shareNode = nodeMapper.selectByNodeId(sourceNodeId);
        String name = StrUtil.isNotBlank(options.getNodeName()) ? options.getNodeName() : shareNode.getNodeName();
        String toSaveNodeId = StrUtil.isNotBlank(options.getNodeId()) ? options.getNodeId() : IdUtil.createNodeId(shareNode.getType());
        // 组成节点ID Map
        Map<String, String> newNodeMap = CollUtil.newHashMap();
        newNodeMap.put(sourceNodeId, toSaveNodeId);

        if (!options.isTemplate()) {
            // 检查重名
            name = duplicateNameModify(destParentId, shareNode.getType(), name, null);
            // 更新原首位的节点，位置后移一位，即设置前置节点是转存的分享节点
            nodeMapper.updatePreNodeIdBySelf(toSaveNodeId, null, destParentId);
        }

        NodeType nodeType = NodeType.toEnum(shareNode.getType());
        switch (nodeType) {
            case ROOT:
                throw new BusinessException(NOT_ALLOW);
            case FOLDER:
                this.copyFolderProcess(userId, spaceId, shareNode.getSpaceId(), sourceNodeId, newNodeMap, options);
                break;
            case DATASHEET:
                // if (options.isVerifyNodeCount()) {
                //     // 验证节点数量是否到达上限
                //     // iSubscriptionService.checkSheetNums(spaceId, 1);
                // }
                if (options.isFilterPermissionField()) {
                    // 获取开启列权限的字段
                    List<String> permissionFieldIds = iFieldRoleService.getPermissionFieldIds(sourceNodeId);
                    if (!permissionFieldIds.isEmpty()) {
                        Map<String, List<String>> dstPermissionFieldsMap = new HashMap<>(1);
                        dstPermissionFieldsMap.put(sourceNodeId, permissionFieldIds);
                        options.setDstPermissionFieldsMap(dstPermissionFieldsMap);
                    }
                }
                // 复制数表数据
                iDatasheetService.copy(userId, spaceId, sourceNodeId, toSaveNodeId, name, options, newNodeMap);
                break;
            case FORM:
            case DASHBOARD:
            case MIRROR:
                throw new BusinessException(SHARE_NODE_STORE_FAIL);
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
            // 保存缓存用于在客户端展示tips
            redisTemplate.opsForValue().set(RedisConstants.getTemplateQuoteKey(spaceId, toSaveNodeId),
                    options.getSourceTemplateId(), 2, TimeUnit.MINUTES);
        }
        else {
            extraObj.remove(NodeExtraConstants.SOURCE_TEMPLATE_ID);
        }
        if (StrUtil.isNotBlank(options.getDingTalkDaTemplateKey())) {
            extraObj.set(NodeExtraConstants.DING_TALK_DA_STATUS, 1);
            extraObj.set(NodeExtraConstants.DING_TALK_DA_TEMPLATE_KEY, options.getDingTalkDaTemplateKey());
        }
        else {
            // 为了防止别人转存share的钉钉搭模版
            extraObj.remove(NodeExtraConstants.DING_TALK_DA_STATUS);
            extraObj.remove(NodeExtraConstants.DING_TALK_DA_TEMPLATE_KEY);
        }
        toSaveNode.setExtra(JSONUtil.toJsonStr(extraObj));
        toSaveNode.setCreatedBy(userId);
        toSaveNode.setUpdatedBy(userId);
        this.save(toSaveNode);
        // 批量复制节点描述
        iNodeDescService.copyBatch(newNodeMap);
        // 批量复制节点引用的空间附件资源
        if (ObjectUtil.isNotNull(options) && options.isCopyData()) {
            iSpaceAssetService.copyBatch(newNodeMap, spaceId);
        }
        return toSaveNodeId;
    }

    private void copyFolderProcess(Long userId, String spaceId, String originSpaceId, String folderId,
            Map<String, String> newNodeMap, NodeCopyOptions options) {
        List<NodeShareTree> subTrees = nodeMapper.selectShareTreeByNodeId(originSpaceId, folderId);
        if (CollUtil.isEmpty(subTrees)) {
            return;
        }
        // 按节点类型分组
        Map<Integer, List<NodeShareTree>> nodeTypeToNodeIdsMap = subTrees.stream()
                .collect(Collectors.groupingBy(NodeShareTree::getType));
        // 需要过滤的节点ID 集合
        List<String> filterNodeIds = CollUtil.isEmpty(options.getFilterNodeIds()) ? new ArrayList<>() : options.getFilterNodeIds();
        // 收集表、镜像预处理，过滤跳过转存的部分
        this.processNodeHasSourceDatasheet(NodeType.FORM.getNodeType(), filterNodeIds, nodeTypeToNodeIdsMap);
        this.processNodeHasSourceDatasheet(NodeType.MIRROR.getNodeType(), filterNodeIds, nodeTypeToNodeIdsMap);

        // 验证节点数量是否到达上限
        // if (options.isVerifyNodeCount()) {
        //     int subCount;
        //     if (nodeTypeToNodeIdsMap.containsKey(NodeType.FOLDER.getNodeType())) {
        //         List<String> fodIds = nodeTypeToNodeIdsMap.get(NodeType.FOLDER.getNodeType()).stream()
        //                 .map(NodeShareTree::getNodeId).collect(Collectors.toList());
        //         // 取去重并集，避免部分文件夹已在过滤之列
        //         subCount = CollUtil.unionDistinct(fodIds, filterNodeIds).size();
        //     }
        //     else {
        //         subCount = filterNodeIds.size();
        //     }
        //     if (subTrees.size() > subCount) {
        //         iSubscriptionService.checkSheetNums(spaceId, subTrees.size() - subCount);
        //     }
        // }
        // 原节点 -> 前置节点 MAP
        Map<String, String> originNodeToPreNodeMap = new HashMap<>(subTrees.size());
        subTrees.forEach(sub -> {
            originNodeToPreNodeMap.put(sub.getNodeId(), sub.getPreNodeId());
            // 补充原节点、新节点ID 映射关系
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
                // 原前置节点ID，若在过滤之列，向前递归直至找到转存的节点或到首位结束
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
        // 批量插入节点
        boolean flag = SqlHelper.retBool(nodeMapper.insertBatch(storeEntities));
        ExceptionUtil.isTrue(flag, SHARE_NODE_STORE_FAIL);
        // 复制数表处理
        if (nodeTypeToNodeIdsMap.containsKey(NodeType.DATASHEET.getNodeType())) {
            if (options.isFilterPermissionField()) {
                // 获取数表及对应开启列权限的字段集
                Map<String, List<String>> dstPermissionFieldsMap = new HashMap<>(16);
                nodeTypeToNodeIdsMap.get(NodeType.DATASHEET.getNodeType()).stream()
                        .filter(subNode -> !filterNodeIds.contains(subNode.getNodeId()))
                        .forEach(subNode -> {
                            List<String> permissionFieldIds = iFieldRoleService.getPermissionFieldIds(subNode.getNodeId());
                            if (!permissionFieldIds.isEmpty()) {
                                dstPermissionFieldsMap.put(subNode.getNodeId(), permissionFieldIds);
                            }
                        });
                options.setDstPermissionFieldsMap(dstPermissionFieldsMap);
            }
            for (NodeShareTree subNode : nodeTypeToNodeIdsMap.get(NodeType.DATASHEET.getNodeType())) {
                if (filterNodeIds.contains(subNode.getNodeId())) {
                    continue;
                }
                iDatasheetService.copy(userId, spaceId, subNode.getNodeId(), newNodeMap.get(subNode.getNodeId()), subNode.getNodeName(), options, newNodeMap);
            }
        }
        // 复制收集表处理
        if (nodeTypeToNodeIdsMap.containsKey(NodeType.FORM.getNodeType())) {
            List<String> formIds = nodeTypeToNodeIdsMap.get(NodeType.FORM.getNodeType()).stream()
                    .map(NodeShareTree::getNodeId)
                    .filter(nodeId -> !filterNodeIds.contains(nodeId)).collect(Collectors.toList());
            if (CollUtil.isNotEmpty(formIds)) {
                iNodeRelService.copyBatch(userId, formIds, newNodeMap);
                iResourceMetaService.copyBatch(userId, formIds, newNodeMap);
            }
        }
        // 复制仪表盘处理
        if (nodeTypeToNodeIdsMap.containsKey(NodeType.DASHBOARD.getNodeType())) {
            List<String> dashboardIds = nodeTypeToNodeIdsMap.get(NodeType.DASHBOARD.getNodeType()).stream()
                    .map(NodeShareTree::getNodeId)
                    .filter(nodeId -> !filterNodeIds.contains(nodeId))
                    .collect(Collectors.toList());
            if (CollUtil.isNotEmpty(dashboardIds)) {
                iResourceMetaService.batchCopyResourceMeta(userId, spaceId, dashboardIds, newNodeMap, ResourceType.DASHBOARD);
            }
        }
        // 复制镜像处理
        if (nodeTypeToNodeIdsMap.containsKey(NodeType.MIRROR.getNodeType())) {
            List<String> mirrorIds = nodeTypeToNodeIdsMap.get(NodeType.MIRROR.getNodeType()).stream()
                    .map(NodeShareTree::getNodeId)
                    .filter(nodeId -> !filterNodeIds.contains(nodeId)).collect(Collectors.toList());
            if (CollUtil.isNotEmpty(mirrorIds)) {
                iNodeRelService.copyBatch(userId, mirrorIds, newNodeMap);
                iResourceMetaService.batchCopyResourceMeta(userId, spaceId, mirrorIds, newNodeMap, ResourceType.MIRROR);
            }
        }
    }

    public void processNodeHasSourceDatasheet(Integer nodeType, List<String> filterNodeIds, Map<Integer, List<NodeShareTree>> nodeTypeToNodeIdsMap) {
        if (!nodeTypeToNodeIdsMap.containsKey(nodeType)) {
            return;
        }
        List<String> allFormIds = nodeTypeToNodeIdsMap.get(nodeType).stream()
                .map(NodeShareTree::getNodeId).collect(Collectors.toList());
        // 取所有 收集表/镜像 和过滤节点的差集
        List<String> nodeIds = CollUtil.subtractToList(allFormIds, filterNodeIds);
        // 若差集为空，即所有 收集表/镜像 全部已被过滤
        if (CollUtil.isEmpty(nodeIds)) {
            nodeTypeToNodeIdsMap.remove(nodeType);
            return;
        }
        // 若转存文件中无数表，即 收集表/镜像 全部跳过转存
        if (!nodeTypeToNodeIdsMap.containsKey(NodeType.DATASHEET.getNodeType())) {
            filterNodeIds.addAll(nodeIds);
            return;
        }
        List<String> dstIds = nodeTypeToNodeIdsMap.get(NodeType.DATASHEET.getNodeType()).stream()
                .map(NodeShareTree::getNodeId).collect(Collectors.toList());
        // 全部数表都在过滤之列，同理 收集表/镜像 全部跳过转存
        if (filterNodeIds.containsAll(dstIds)) {
            filterNodeIds.addAll(nodeIds);
            nodeTypeToNodeIdsMap.remove(NodeType.DATASHEET.getNodeType());
            return;
        }
        // 获取 收集表/镜像 及映射的数表 MAP
        Map<String, String> nodeIdToSourceDatasheetIdMap = iNodeRelService.getRelNodeToMainNodeMap(nodeIds);
        for (String nodeId : nodeIds) {
            String datasheet = nodeIdToSourceDatasheetIdMap.get(nodeId);
            // 映射的数表在过滤之列，或者不在转存文件中，该 收集表/镜像 跳过转存
            if (filterNodeIds.contains(datasheet) || !dstIds.contains(datasheet)) {
                filterNodeIds.add(nodeId);
            }
        }
    }

    @Override
    public String importExcel(Long userId, String spaceId, ImportExcelOpRo opRo) throws IOException {
        log.info("导入新节点");
        // 验证节点数量是否到达上限
        // iSubscriptionService.checkSheetNums(spaceId, 1);
        MultipartFile file = opRo.getFile();
        ExceptionUtil.isNotNull(file, FILE_EMPTY);
        ExceptionUtil.isNotBlank(file.getOriginalFilename(), FILE_EMPTY);
        ExceptionUtil.isTrue(file.getSize() <= limitProperties.getMaxFileSize(), ActionException.FILE_EXCEED_LIMIT);
        // 文件名称
        String mainName = cn.hutool.core.io.FileUtil.mainName(file.getOriginalFilename());
        if (StrUtil.isBlank(mainName)) {
            throw new BusinessException("文件名为空");
        }
        mainName = duplicateNameModify(opRo.getParentId(), NodeType.DATASHEET.getNodeType(), mainName, null);
        //文件类型后缀
        String fileSuffix = cn.hutool.core.io.FileUtil.extName(file.getOriginalFilename());
        if (StrUtil.isBlank(fileSuffix)) {
            throw new BusinessException("文件名为空");
        }
        // 导入节点时，上传文件为CSV格式
        if (fileSuffix.equals(FileSuffixConstants.CSV)) {
            //识别文件编码
            String charset = FileTool.identifyCoding(file.getInputStream());
            Iterable<CSVRecord> csvRecords = CSVFormat.DEFAULT.withNullString("").parse(
                    new InputStreamReader(file.getInputStream(), charset)
            );
            List<List<Object>> readAll = new ArrayList<>();
            for (CSVRecord csvRecord : csvRecords) {
                // 创建csvRow存储每行数据
                List<Object> csvRow = new ArrayList<>();
                for (int i = 0; i < csvRecord.size(); i++) {
                    String value = csvRecord.get(i);
                    if (StrUtil.isBlank(value)) {
                        csvRow.add("");
                    }
                    else {
                        csvRow.add(value);
                    }
                }
                readAll.add(csvRow);
            }
            return this.processExcel(readAll, opRo.getParentId(), spaceId, userId, mainName);
        }
        // 导入节点时，上传文件为XLS或者XLSX格式
        if (fileSuffix.equals(FileSuffixConstants.XLS) || fileSuffix.equals(FileSuffixConstants.XLSX)) {
            ExcelReader excelReader = null;
            try {
                // Excel监听器（不能交给spring容器管理）
                ExcelSheetsDataListener sheetsDataListener = new ExcelSheetsDataListener();
                excelReader = EasyExcel.read(file.getInputStream(), null, sheetsDataListener).build();
                List<ReadSheet> readSheets = excelReader.excelExecutor().sheetList();
                // 如果存在WPS隐藏表格，移除不做处理
                readSheets.removeIf(readSheet -> "WpsReserved_CellImgList".equals(readSheet.getSheetName()));
                // Excel只包含一个工作表
                if (readSheets.size() == 1) {
                    List<List<Object>> read = this.importSingleSheetByEasyExcel(excelReader, sheetsDataListener, readSheets.get(0));
                    return this.processExcel(read, opRo.getParentId(), spaceId, userId, mainName);
                }
                // Excel包含多个工作表
                Map<String, List<List<Object>>> readAll = this.importMultipleSheetsByEasyExcel(excelReader, sheetsDataListener, readSheets);
                return this.processExcels(readAll, opRo.getParentId(), spaceId, userId, mainName);
            }
            catch (EncryptedDocumentException e) {
                throw new BusinessException(ActionException.FILE_HAS_PASSWORD);
            }
            finally {
                if (Objects.nonNull(excelReader)) {
                    excelReader.finish();
                }
            }
        }
        else {
            throw new BusinessException(ActionException.FILE_ERROR_FORMAT);
        }
    }

    @Override
    public Map<String, List<List<Object>>> importMultipleSheetsByEasyExcel(ExcelReader excelReader, ExcelSheetsDataListener sheetsDataListener, List<ReadSheet> readSheets) {
        Map<String, List<List<Object>>> readAll = new LinkedHashMap<>(readSheets.size());
        // 反转Excel Sheet
        Collections.reverse(readSheets);
        for (ReadSheet readSheet : readSheets) {
            // 逐个工作表读取
            excelReader.read(readSheet);
            // 读取表头
            List<Object> sheetHeader = sheetsDataListener.getSheetHeader();
            // 读取表格数据
            List<List<Object>> sheetsData = sheetsDataListener.getSheetData();
            List<List<Object>> assembleData = new ArrayList<>();
            // 组装表头和表格数据
            if (CollectionUtils.isNotEmpty(sheetHeader)) {
                assembleData.add(sheetHeader);
            }
            if (CollectionUtils.isNotEmpty(sheetsData)) {
                assembleData.addAll(sheetsData);
            }
            readAll.put(readSheet.getSheetName(), assembleData);
            // 清空监听器中的表头和表格对象，读取下一张工作表
            sheetsDataListener.setSheetHeader(new ArrayList<>());
            sheetsDataListener.setSheetData(new ArrayList<>());
        }
        return readAll;
    }

    @Override
    public List<List<Object>> importSingleSheetByEasyExcel(ExcelReader excelReader, ExcelSheetsDataListener sheetsDataListener, ReadSheet readSheet) {
        excelReader.read(readSheet);
        List<Object> sheetHeader = sheetsDataListener.getSheetHeader();
        List<List<Object>> sheetData = sheetsDataListener.getSheetData();
        List<List<Object>> assembleData = new ArrayList<>();
        if (CollectionUtils.isNotEmpty(sheetHeader)) {
            assembleData.add(sheetHeader);
        }
        if (CollectionUtils.isNotEmpty(sheetData)) {
            assembleData.addAll(sheetData);
        }
        return assembleData;
    }

    @Override
    public void updateNodeBanStatus(String nodeId, Integer status) {
        log.info("封禁或解封节点");
        boolean flag = SqlHelper.retBool(nodeMapper.updateNodeBanStatus(nodeId, status));
        ExceptionUtil.isTrue(flag, DatabaseException.EDIT_ERROR);
    }

    /**
     * 处理Excel数据
     */
    private String processExcel(List<List<Object>> readAll, String parentId, String spaceId, Long userId, String name) {
        Long memberId = userSpaceService.getMemberId(userId, spaceId);
        checkEnableOperateNodeBySpaceFeature(memberId, spaceId, parentId);
        // long maxRowLimit = iSubscriptionService.getPlanMaxRows(spaceId);
        // ExceptionUtil.isTrue(readAll != null && readAll.size() <= maxRowLimit + 1, SubscribeFunctionException.ROW_LIMIT);
        //如果表格为空，创建一个初始化表格
        if (readAll.size() == 0) {
            return this.createNode(userId, spaceId, NodeOpRo.builder()
                    .type(NodeType.DATASHEET.getNodeType())
                    .parentId(parentId)
                    .nodeName(name)
                    .build());
        }
        else {
            boolean first = true;
            JSONObject recordMap = JSONUtil.createObj();
            JSONObject fieldMap = JSONUtil.createObj();
            ViewMapRo viewMapRo = new ViewMapRo();
            JSONArray columns = JSONUtil.createArray();
            JSONArray rows = JSONUtil.createArray();
            List<String> fieldIds = null;
            List<String> fldNameList = new ArrayList<>();
            //遍历行、首行作为field属性
            for (List<Object> list : readAll) {
                //处理excel格式问题导致的末尾空字符列
                if (ObjectUtil.isNull(CollUtil.getLast(list)) || CollUtil.getLast(list) == "") {
                    int i;
                    for (i = list.size() - 1; i >= 0; i--) {
                        if (ObjectUtil.isNotNull(list.get(i)) && list.get(i) != "") {
                            break;
                        }
                    }
                    list = CollUtil.sub(list, 0, i + 1);
                }
                ExceptionUtil.isTrue(list.size() <= limitProperties.getMaxColumnCount(), ActionException.COLUMN_EXCEED_LIMIT);
                if (first) {
                    fieldIds = new ArrayList<>(list.size());
                    first = false;
                    int i = 1;
                    for (Object fieldName : list) {
                        this.addField(fieldIds, columns, fieldMap, null == fieldName ? null : fieldName.toString(), i, fldNameList);
                        i++;
                    }
                    viewMapRo = ViewMapRo.builder()
                            .id(IdUtil.createViewId())
                            .name(VikaStrings.t("default_view"))
                            .type(ViewType.GRID.getType())
                            .columns(columns)
                            .frozenColumnCount(1)
                            .build();
                    if (readAll.size() == 1) {
                        //只有一行充当字段情况、填补一行空行
                        this.addRecord(recordMap, rows, null, null, null, null, null, fldNameList);
                    }
                }
                else {
                    //处理record
                    this.addRecord(recordMap, rows, list, fieldIds, columns, fieldMap, viewMapRo, fldNameList);
                }
            }
            viewMapRo.setRows(rows);
            JSONArray views = JSONUtil.createArray();
            views.add(viewMapRo);
            MetaMapRo metaMapRo = MetaMapRo.builder().fieldMap(fieldMap).views(views).build();
            String nodeId = IdUtil.createDstId();
            //将原首位节点的前置节点ID改为导入的节点ID
            nodeMapper.updatePreNodeIdBySelf(nodeId, null, parentId);
            //创建节点数表
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
     * 增加记录
     */
    private void addRecord(JSONObject recordMap, JSONArray rows, List<Object> list, List<String> fieldIds, JSONArray columns, JSONObject fieldMap, ViewMapRo viewMapRo, List<String> fldNameList) {
        String recordId = IdUtil.createRecordId();
        JSONObject recordJson = JSONUtil.createObj();
        recordJson.set("recordId", recordId);
        rows.add(recordJson);
        JSONObject data = JSONUtil.createObj();
        if (CollUtil.isNotEmpty(list)) {
            int i = 0;
            for (Object text : list) {
                if (i >= fieldIds.size()) {
                    //列数超过首行列表，填补field
                    this.addField(fieldIds, columns, fieldMap, null, i + 1, fldNameList);
                    viewMapRo.setColumns(columns);
                }
                if (ObjectUtil.isNotNull(text) && text != "") {
                    JSONArray filedArray = JSONUtil.createArray();
                    filedArray.add(RecordDataRo.builder().text(text.toString()).type(FieldType.TEXT.getFieldType()).build());
                    data.set(fieldIds.get(i), filedArray);
                }
                i++;
            }
        }
        recordMap.set(recordId, RecordMapRo.builder().id(recordId).data(data).build());
    }

    /**
     * 增加字段
     */
    private void addField(List<String> fieldIds, JSONArray columns, JSONObject fieldMap, String fieldName, int i, List<String> fldNameList) {
        String fieldId = IdUtil.createFieldId();
        fieldIds.add(fieldId);
        JSONObject fieldJson = JSONUtil.createObj();
        fieldJson.set("fieldId", fieldId);
        if (i == 1) {
            // 首列添加统计记录总数
            fieldJson.set("statType", 1);
        }
        columns.add(fieldJson);
        if (StrUtil.isBlank(fieldName)) {
            fieldName = "Field " + i;
        }
        // 保证字段名称唯一
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
     * 重复名称修改
     */
    @Override
    public String duplicateNameModify(String parentId, int nodeType, String nodeName, String nodeId) {
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
    public boolean judgeAllSubNodeContainMemberFld(String nodeId) {
        NodeType nodeType = this.getTypeByNodeId(nodeId);
        ExceptionUtil.isTrue(nodeType != NodeType.ROOT, ROOT_NODE_CAN_NOT_SHARE);
        String keyword = "\"type\": 13";
        if (nodeType == NodeType.FOLDER) {
            // 文件夹
            List<String> subNodeIds = nodeMapper.selectAllSubNodeIdsByNodeType(nodeId, NodeType.DATASHEET.getNodeType());
            if (CollUtil.isNotEmpty(subNodeIds)) {
                return SqlTool.retCount(datasheetMetaMapper.countByMetaData(subNodeIds, keyword)) > 0;
            }
        }
        else if (nodeType == NodeType.DATASHEET) {
            // 数表
            return SqlTool.retCount(datasheetMetaMapper.countByMetaData(Collections.singletonList(nodeId), keyword)) > 0;
        }
        return false;
    }

    @Override
    public List<String> checkSubNodePermission(Long memberId, String nodeId, ControlRole role) {
        boolean hasChildren = nodeMapper.selectHasChildren(nodeId);
        if (!hasChildren) {
            return null;
        }
        // 校验所有子后代的节点权限
        List<String> subNodeIds = nodeMapper.selectAllSubNodeIds(nodeId);
        ControlRoleDict roleDict = controlTemplate.fetchNodeRole(memberId, subNodeIds);
        ExceptionUtil.isFalse(roleDict.isEmpty(), SUB_NODE_PERMISSION_INSUFFICIENT);
        List<String> filterNodeIds = roleDict.entrySet().stream()
                .filter(entry -> entry.getValue().isGreaterThanOrEqualTo(role))
                .map(Map.Entry::getKey).collect(Collectors.toList());
        ExceptionUtil.isTrue(subNodeIds.size() == filterNodeIds.size(), SUB_NODE_PERMISSION_INSUFFICIENT);
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
                log.error("复制节点错误[{}]", result);
            }
            ExceptionUtil.isTrue(result.getSuccess(), NodeException.COPY_NODE_LINK__FIELD_ERROR);
        }

    }

    @Override
    public void nodeDeleteChangeset(List<String> nodeIds) {
        // 删除数表的关联数表若不在删除之列，则把关联数表中对应的关联列转换为文本字段
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
            // 中间层删除失败继续删除节点
            this.grpcClientService.nodeDeleteChangeset(nodeDeleteRo);
        }

    }

    /**
     * 创建收集表和映射数表的关联
     */
    private void createNodeRel(Long userId, String nodeId, NodeRelRo extra) {
        NodeRelRo relExtra = new NodeRelRo(extra.getViewId());
        // 创建节点关联关系
        iNodeRelService.create(userId, extra.getDatasheetId(), nodeId, JSONUtil.toJsonStr(relExtra));
    }

    private void createFileMeta(Long userId, String spaceId, String nodeId, Integer type, String name, NodeRelRo nodeRel) {
        switch (NodeType.toEnum(type)) {
            case DATASHEET:
                iDatasheetService.create(spaceId, nodeId, name, userId);
                break;
            case FORM:
                // 创建节点关联关系
                this.createNodeRel(userId, nodeId, nodeRel);
                // 创建资源元数据
                String extra = JSONUtil.createObj().set("title", name).set("fillAnonymous", true).toString();
                iResourceMetaService.create(userId, nodeId, ResourceType.FROM.getValue(), extra);
                break;
            case DASHBOARD:
                iResourceMetaService.create(userId, nodeId, ResourceType.DASHBOARD.getValue(), JSONUtil.createObj().toString());
                break;
            case MIRROR:
                // 创建节点关联关系
                this.createNodeRel(userId, nodeId, nodeRel);
                iResourceMetaService.create(userId, nodeId, ResourceType.MIRROR.getValue(), JSONUtil.createObj().toString());
                break;
            default:
                break;
        }
    }

    /**
     * 校验前置节点非空时，在指定父级节点下是否存在
     */
    private String verifyPreNodeId(String preNodeId, String parentId) {
        if (StrUtil.isBlank(preNodeId)) {
            return null;
        }
        else {
            String id = nodeMapper.selectParentIdByNodeId(preNodeId);
            ExceptionUtil.isTrue(parentId.equals(id), PermissionException.NODE_ACCESS_DENIED);
            return preNodeId;
        }
    }

    private void getForeignDstIdsFilterSelf(List<BaseNodeInfo> nodes, List<String> nodeIds) {
        Map<String, List<String>> map = iDatasheetService.getForeignDstIds(nodeIds, true);
        if (MapUtil.isNotEmpty(map)) {
            List<String> filters = CollUtil.newArrayList();
            Collection<List<String>> foreignDstIdLists = map.values();
            for (List<String> foreignDstIdList : foreignDstIdLists) {
                filters.addAll(foreignDstIdList);
            }
            nodes.addAll(nodeMapper.selectBaseNodeInfoByNodeIds(filters));
        }
    }

    /**
     * 操作多个excel的sheet
     *
     * @param readAll 全部记录
     * @param parentId 父节点ID
     * @param spaceId 空间ID
     * @param userId 用户ID
     * @param name 节点名称
     * @return 节点ID
     */
    private String processExcels(Map<String, List<List<Object>>> readAll, String parentId, String spaceId, Long userId, String name) {
        String nodeId = this.createNode(userId, spaceId, NodeOpRo.builder()
                .type(NodeType.FOLDER.getNodeType())
                .parentId(parentId)
                .nodeName(name)
                .build());
        readAll.forEach((sheetName, read) -> processExcel(read, nodeId, spaceId, userId, sheetName));
        return nodeId;
    }

    /**
     * 获取上级路径，已"/"分割，不保留根节点
     */
    private Map<String, String> getSuperiorPathByParentIds(String spaceId, List<String> parentIds) {
        // 获取非根节点之外的所有上级节点
        List<NodeBaseInfoDTO> parentNodes = nodeMapper.selectParentNodeByNodeIds(spaceId, parentIds);
        if (CollUtil.isEmpty(parentNodes)) {
            return null;
        }
        Map<String, NodeBaseInfoDTO> nodeIdToInfoMap = parentNodes.stream().collect(Collectors.toMap(NodeBaseInfoDTO::getNodeId, dto -> dto));
        Map<String, String> nodeIdToPathMap = new HashMap<>(parentIds.size());
        for (String nodeId : parentIds) {
            if (nodeIdToPathMap.get(nodeId) != null) {
                continue;
            }
            // 从下向上获取节点名称
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
            // 逆向输出路径
            String path = StrUtil.join(" / ", CollUtil.reverse(pathList));
            nodeIdToPathMap.put(nodeId, StrUtil.addPrefixIfNot(path, "/ "));
        }
        return nodeIdToPathMap;
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public String parseExcel(Long userId, String uuid, String spaceId, Long memberId, String parentNodeId, String fileName, String fileSuffix, InputStream inputStream) {
        ExcelReader excelReader = null;
        MultiSheetReadListener readListener = new MultiSheetReadListener(this, userId, uuid, spaceId, memberId, parentNodeId, fileName);
        ExcelReaderBuilder readerBuilder;
        ExcelTypeEnum excelType = FileSuffixConstants.XLS.equals(fileSuffix) ?
                ExcelTypeEnum.XLS :
                ExcelTypeEnum.XLSX;
        try {
            readerBuilder = EasyExcel.read(inputStream)
                    .excelType(excelType)
                    .ignoreEmptyRow(false).autoTrim(false);
            excelReader = readerBuilder.registerReadListener(readListener).build();
            List<ReadSheet> readSheets = excelReader.excelExecutor().sheetList();
            excelReader.read(readSheets);
            return readListener.getRetNodeData().getNodeId();
        }
        finally {
            if (excelReader != null) {
                // 这里千万别忘记关闭，读的时候会创建临时文件，到时磁盘会崩的
                excelReader.finish();
            }
        }
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public String parseCsv(Long userId, String uuid, String spaceId, Long memberId, String parentNodeId, String fileName, InputStream inputStream) {
        ExcelReader excelReader = null;
        CsvReadListener readListener = new CsvReadListener(this, userId, uuid, spaceId, memberId, parentNodeId, fileName);
        try {
            excelReader = EasyExcel.read(inputStream)
                    .excelType(ExcelTypeEnum.CSV)
                    .registerReadListener(readListener)
                    .build();
            excelReader.readAll();
            return readListener.getRetNodeId();
        }
        finally {
            if (excelReader != null) {
                // 这里千万别忘记关闭，读的时候会创建临时文件，到时磁盘会崩的
                excelReader.finish();
            }
        }
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void batchCreateDataSheet(NodeData data, List<NodeEntity> nodeEntities, List<DatasheetEntity> datasheetEntities, List<DatasheetMetaEntity> metaEntities, List<DatasheetRecordEntity> recordEntities) {

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
        TenantBindDTO bindInfo = iSocialTenantBindService.getTenantBindInfoBySpaceId(spaceId);
        if (bindInfo != null && bindInfo.getAppId() != null) {
            if (iSocialTenantService.isTenantActive(bindInfo.getTenantId(), bindInfo.getAppId())) {
                IsvAppProperty app = iDingTalkInternalIsvService.getIsvAppConfig(bindInfo.getAppId());
                if (app != null) {
                    extraVo.setDingTalkSuiteKey(app.getSuiteKey());
                    extraVo.setDingTalkDaStatus(nodeExtraDTO.getDingTalkDaStatus());
                    extraVo.setDingTalkCorpId(bindInfo.getTenantId());
                }
            }
        }
        if (StrUtil.isNotBlank(nodeExtraDTO.getSourceTemplateId())) {
            extraVo.setSourceTemplateId(nodeExtraDTO.getSourceTemplateId());
        }
        extraVo.setShowTips(Boolean.TRUE.equals(redisTemplate.hasKey(RedisConstants.getTemplateQuoteKey(spaceId, nodeId))));
        return extraVo;
    }

    @Override
    public NodeInfoWindowVo getNodeWindowInfo(String nodeId) {
        // 获取节点实体
        NodeEntity node = getByNodeId(nodeId);
        // 查询节点创建人基础信息
        MemberDto memberDto = memberMapper.selectMemberDtoByUserIdAndSpaceId(node.getCreatedBy(), node.getSpaceId());
        // 构造节点信息窗对象
        MemberInfo memberInfo = MemberInfo.builder()
                .time(node.getCreatedAt())
                .build();
        if (memberDto != null) {
            memberInfo.setMemberName(memberDto.getMemberName());
            memberInfo.setAvatar(memberDto.getAvatar());
            memberInfo.setIsActive(memberDto.getIsActive());
            memberInfo.setIsDeleted(memberDto.getIsDeleted());
        }
        return NodeInfoWindowVo.builder()
                .nodeId(nodeId)
                .nodeName(node.getNodeName())
                .nodeType(node.getType())
                .icon(node.getIcon())
                .creator(memberInfo)
                .build();
    }

    private MemberInfo getNodeLastUpdateInfo(NodeEntity node) {
        // 查询节点的数表信息
        DatasheetEntity datasheet = datasheetMapper.selectByDstId(node.getNodeId());
        // 取节点信息最新的那个，获取成员ID
        Long memberId = node.getUpdatedAt().isAfter(datasheet.getUpdatedAt()) ?
                node.getUpdatedBy() : datasheet.getUpdatedBy();
        // 获取最新修改时间
        LocalDateTime modifyDateTime = node.getUpdatedAt().isAfter(datasheet.getUpdatedAt()) ?
                node.getUpdatedAt() : datasheet.getUpdatedAt();
        // 查询成员信息
        MemberDto memberDto = memberMapper.selectMemberDtoByUserIdAndSpaceId(memberId, node.getSpaceId());
        // 构造成员信息对象
        return MemberInfo.builder()
                .memberName(memberDto.getMemberName())
                .avatar(memberDto.getAvatar())
                .time(modifyDateTime)
                .isActive(memberDto.getIsActive())
                .isDeleted(memberDto.getIsDeleted())
                .build();
    }

    @Override
    public NodeFromSpaceVo nodeFromSpace(String nodeId) {
        NodeFromSpaceVo result = new NodeFromSpaceVo();
        if (StrUtil.startWithIgnoreEquals(nodeId, IdRulePrefixEnum.SHARE.getIdRulePrefixEnum())) {
            // 分享ID
            result.setSpaceId(nodeShareSettingMapper.selectSpaceIdByShareIdIncludeDeleted(nodeId));
        }
        else if (StrUtil.startWithIgnoreEquals(nodeId, IdRulePrefixEnum.WIDGET.getIdRulePrefixEnum())) {
            // 组件ID
            result.setSpaceId(widgetMapper.selectSpaceIdByWidgetIdIncludeDeleted(nodeId));
        }
        else {
            // 其余情况都查询节点Id
            result.setSpaceId(this.getSpaceIdByNodeIdIncludeDeleted(nodeId));
        }
        result.setNodeId(nodeId);
        return result;
    }

    @Override
    public Optional<String> getNodeName(String nodeId, Long userId) {
        // 1. 查询节点所在空间id和节点名称。
        UrlNodeInfoDTO urlNodeInfo = nodeMapper.selectSpaceIdAndNodeNameByNodeId(nodeId);

        if (ObjectUtil.isNull(urlNodeInfo)) {
            return Optional.empty();
        }

        try {
            // 2. 根据用户id查询在空间下的memberId。
            // 获取成员ID，方法包含判断用户是否在此空间
            Long memberId = LoginContext.me().getMemberId(userId, urlNodeInfo.getSpaceId());
            // 3. 根据memberId查询对应空间下用户是否对节点有权限。
            // 校验节点下是否有权限
            controlTemplate.fetchNodeRole(memberId, nodeId);
            return Optional.ofNullable(urlNodeInfo.getNodeName());
        }
        catch (BusinessException ex) {
            return Optional.empty();
        }
    }



    @Override
    public void checkEnableOperateNodeBySpaceFeature(Long memberId, String spaceId, String nodeId) {
        Integer nodeType = nodeMapper.selectNodeTypeByNodeId(nodeId);
        // 1. 节点是否为根节点
        if (NodeType.toEnum(nodeType) != NodeType.ROOT) {
            return;
        }
        checkEnableOperateRootNodeBySpaceFeature(memberId, spaceId);
    }

    @Override
    public void checkEnableOperateRootNodeBySpaceFeature(Long memberId, String spaceId) {
        SpaceGlobalFeature feature = iSpaceService.getSpaceGlobalFeature(spaceId);
        Boolean rootManageable = feature.getRootManageable();
        // 1. 安全设置是否开启普通成员根目录可操作权限控制
        if (rootManageable) {
            return;
        }
        List<Long> adminsWithWorkbench = iSpaceRoleService.getSpaceAdminsWithWorkbenchManage(spaceId);
        // 2. 用户是否有工作台权限的管理权限
        ExceptionUtil.isTrue(CollUtil.contains(adminsWithWorkbench, memberId), ROOT_NODE_OP_DENIED);
    }

    @Override
    public boolean isNodeBelongRootFolder(String spaceId, String nodeId) {
        String rootNodeId = nodeMapper.selectRootNodeIdBySpaceId(spaceId);
        String parentNodeId = nodeMapper.selectParentIdByNodeId(nodeId);
        return ObjectUtil.isNotNull(rootNodeId) && rootNodeId.equals(parentNodeId);
    }

}
