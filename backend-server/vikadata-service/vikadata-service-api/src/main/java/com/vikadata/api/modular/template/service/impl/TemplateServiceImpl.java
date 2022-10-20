package com.vikadata.api.modular.template.service.impl;

import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.HashSet;
import java.util.LinkedHashMap;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

import javax.annotation.Resource;

import cn.hutool.core.collection.CollUtil;
import cn.hutool.core.map.MapUtil;
import cn.hutool.core.util.ArrayUtil;
import cn.hutool.core.util.BooleanUtil;
import cn.hutool.core.util.ObjectUtil;
import cn.hutool.core.util.StrUtil;
import cn.hutool.json.JSONUtil;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import lombok.extern.slf4j.Slf4j;

import com.vikadata.api.cache.bean.Banner;
import com.vikadata.api.cache.bean.CategoryDto;
import com.vikadata.api.cache.bean.RecommendConfig;
import com.vikadata.api.cache.bean.RecommendConfig.AlbumGroup;
import com.vikadata.api.cache.bean.RecommendConfig.TemplateGroup;
import com.vikadata.api.cache.service.ITemplateConfigService;
import com.vikadata.api.config.properties.ConstProperties;
import com.vikadata.api.config.properties.LimitProperties;
import com.vikadata.api.control.role.ControlRoleManager;
import com.vikadata.api.control.role.RoleConstants.Node;
import com.vikadata.api.enums.base.SystemConfigType;
import com.vikadata.api.enums.exception.PermissionException;
import com.vikadata.api.enums.exception.TemplateException;
import com.vikadata.api.enums.template.TemplatePropertyType;
import com.vikadata.api.enums.template.TemplateType;
import com.vikadata.api.model.dto.template.TemplateDto;
import com.vikadata.api.model.dto.template.TemplateInfo;
import com.vikadata.api.model.ro.config.TemplateConfigRo;
import com.vikadata.api.model.ro.template.CreateTemplateRo;
import com.vikadata.api.model.vo.node.BaseNodeInfo;
import com.vikadata.api.model.vo.node.FieldPermissionInfo;
import com.vikadata.api.model.vo.node.NodeShareTree;
import com.vikadata.api.model.vo.template.AlbumGroupVo;
import com.vikadata.api.model.vo.template.AlbumVo;
import com.vikadata.api.model.vo.template.RecommendVo;
import com.vikadata.api.model.vo.template.TemplateCategoryContentVo;
import com.vikadata.api.model.vo.template.TemplateCategoryMenuVo;
import com.vikadata.api.model.vo.template.TemplateDirectoryVo;
import com.vikadata.api.model.vo.template.TemplateGroupVo;
import com.vikadata.api.model.vo.template.TemplateSearchResult;
import com.vikadata.api.model.vo.template.TemplateVo;
import com.vikadata.api.modular.base.service.ISystemConfigService;
import com.vikadata.api.modular.template.mapper.TemplateMapper;
import com.vikadata.api.modular.template.model.OnlineTemplateDto;
import com.vikadata.api.modular.template.model.TemplatePropertyDto;
import com.vikadata.api.modular.template.model.TemplateSearchDTO;
import com.vikadata.api.modular.template.service.ITemplateAlbumService;
import com.vikadata.api.modular.template.service.ITemplatePropertyService;
import com.vikadata.api.modular.template.service.ITemplateService;
import com.vikadata.api.modular.workspace.mapper.NodeMapper;
import com.vikadata.api.modular.workspace.mapper.WidgetMapper;
import com.vikadata.api.modular.workspace.model.NodeCopyOptions;
import com.vikadata.api.modular.workspace.model.NodeWidgetDto;
import com.vikadata.api.modular.workspace.service.IDatasheetService;
import com.vikadata.api.modular.workspace.service.IFieldRoleService;
import com.vikadata.api.modular.workspace.service.INodeDescService;
import com.vikadata.api.modular.workspace.service.INodeRelService;
import com.vikadata.api.modular.workspace.service.INodeService;
import com.vikadata.api.util.CollectionUtil;
import com.vikadata.api.util.IdUtil;
import com.vikadata.api.util.InformationUtil;
import com.vikadata.core.exception.BusinessException;
import com.vikadata.core.support.tree.DefaultTreeBuildFactory;
import com.vikadata.core.util.ExceptionUtil;
import com.vikadata.core.util.SqlTool;
import com.vikadata.define.enums.NodeType;
import com.vikadata.entity.TemplateEntity;
import com.vikadata.integration.vika.VikaOperations;
import com.vikadata.integration.vika.model.RecommendTemplateInfo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import static com.vikadata.api.enums.exception.DatabaseException.EDIT_ERROR;
import static com.vikadata.api.enums.exception.NodeException.NOT_ALLOW;
import static com.vikadata.api.enums.exception.ParameterException.INCORRECT_ARG;
import static com.vikadata.api.enums.exception.TemplateException.FIELD_PERMISSION_INSUFFICIENT;
import static com.vikadata.api.enums.exception.TemplateException.FOLDER_DASHBOARD_LINK_FOREIGN_NODE;
import static com.vikadata.api.enums.exception.TemplateException.FOLDER_FORM_LINK_FOREIGN_NODE;
import static com.vikadata.api.enums.exception.TemplateException.FOLDER_MIRROR_LINK_FOREIGN_NODE;
import static com.vikadata.api.enums.exception.TemplateException.FOLDER_NODE_LINK_FOREIGN_NODE;
import static com.vikadata.api.enums.exception.TemplateException.NODE_LINK_FOREIGN_NODE;
import static com.vikadata.api.enums.exception.TemplateException.NUMBER_LIMIT;
import static com.vikadata.api.enums.exception.TemplateException.SINGLE_DASHBOARD_CREATE_FAIL;
import static com.vikadata.api.enums.exception.TemplateException.SINGLE_FORM_CREATE_FAIL;
import static com.vikadata.api.enums.exception.TemplateException.SINGLE_MIRROR_CREATE_FAIL;
import static com.vikadata.api.enums.exception.TemplateException.TEMPLATE_INFO_ERROR;

/**
 * <p>
 * 模板中心-模版 服务实现类
 * </p>
 *
 * @author Chambers
 * @date 2020/5/12
 */
@Slf4j
@Service
public class TemplateServiceImpl extends ServiceImpl<TemplateMapper, TemplateEntity> implements ITemplateService {

    @Resource
    private INodeService iNodeService;

    @Resource
    private NodeMapper nodeMapper;

    @Resource
    private INodeDescService iNodeDescService;

    @Resource
    private WidgetMapper widgetMapper;

    @Resource
    private IDatasheetService iDatasheetService;

    @Resource
    private LimitProperties limitProperties;

    @Resource
    private ConstProperties constProperties;

    @Resource
    private IFieldRoleService iFieldRoleService;

    @Resource
    private ITemplatePropertyService templatePropertyService;

    @Resource
    private ITemplateAlbumService iTemplateAlbumService;

    @Autowired(required = false)
    private VikaOperations vikaOperations;

    @Resource
    private ISystemConfigService systemConfigService;

    @Resource
    private ITemplateConfigService templateConfigService;

    @Resource
    private INodeRelService iNodeRelService;

    @Override
    public String getSpaceId(String templateId) {
        log.info("获取空间ID，templateId：{}", templateId);
        // 校验模板是否存在
        String spaceId = baseMapper.selectTypeIdByTempId(templateId);
        ExceptionUtil.isNotNull(spaceId, TEMPLATE_INFO_ERROR);
        return spaceId;
    }

    @Override
    public void checkTemplateForeignNode(Long memberId, String nodeId) {
        NodeType nodeType = iNodeService.getTypeByNodeId(nodeId);
        switch (nodeType) {
            case FOLDER:
                // 校验所有子后代节点的权限
                List<String> subNodeIds = iNodeService.checkSubNodePermission(memberId, nodeId, ControlRoleManager.parseNodeRole(Node.MANAGER));
                if (subNodeIds == null || subNodeIds.isEmpty()) {
                    break;
                }
                // 校验子后代各种类型节点的要求
                this.checkFolderTemplate(subNodeIds, memberId);
                break;
            case DATASHEET:
                this.checkDatasheetTemplate(Collections.singletonList(nodeId), false, NODE_LINK_FOREIGN_NODE);
                // 检验字段权限
                this.checkFieldPermission(memberId, nodeId);
                break;
            case FORM:
                throw new BusinessException(SINGLE_FORM_CREATE_FAIL);
            case DASHBOARD:
                throw new BusinessException(SINGLE_DASHBOARD_CREATE_FAIL);
            case MIRROR:
                throw new BusinessException(SINGLE_MIRROR_CREATE_FAIL);
            default:
                throw new BusinessException(NOT_ALLOW);
        }
    }

    @Override
    public void checkFolderTemplate(List<String> subNodeIds, Long memberId) {
        // 校验子后代各种类型节点的要求
        List<BaseNodeInfo> nodeInfos = nodeMapper.selectBaseNodeInfoByNodeIds(subNodeIds);
        Map<Integer, List<String>> nodeTypeToNodeIdsMap = nodeInfos.stream()
                .collect(Collectors.groupingBy(BaseNodeInfo::getType, Collectors.mapping(BaseNodeInfo::getNodeId, Collectors.toList())));
        // 若存在数表，校验是否关联了外部的数表
        if (nodeTypeToNodeIdsMap.containsKey(NodeType.DATASHEET.getNodeType())) {
            this.checkDatasheetTemplate(nodeTypeToNodeIdsMap.get(NodeType.DATASHEET.getNodeType()), true, FOLDER_NODE_LINK_FOREIGN_NODE);
            // 检验字段权限
            for (String subNodeId : nodeTypeToNodeIdsMap.get(NodeType.DATASHEET.getNodeType())) {
                this.checkFieldPermission(memberId, subNodeId);
            }
        }
        // 若存在收集表，校验是否关联了外部的数表
        this.checkFormOrMirrorIsForeignNode(subNodeIds, nodeTypeToNodeIdsMap, NodeType.FORM.getNodeType(), FOLDER_FORM_LINK_FOREIGN_NODE);
        // 若存在仪表盘，校验组件的数据源是否引用了外部的数表
        if (nodeTypeToNodeIdsMap.containsKey(NodeType.DASHBOARD.getNodeType())) {
            // 批量查询仪表盘包含的组件信息
            List<NodeWidgetDto> widgetInfos = widgetMapper.selectNodeWidgetDtoByNodeIds(nodeTypeToNodeIdsMap.get(NodeType.DASHBOARD.getNodeType()));
            // 根据仪表盘nodeId分组
            Map<String, List<NodeWidgetDto>> dashboardNodeMap = widgetInfos.stream().collect(Collectors.groupingBy(NodeWidgetDto::getNodeId));
            // 遍历仪表盘nodeId
            for (String dashboardNodeId : dashboardNodeMap.keySet()) {
                // 遍历widget
                for (NodeWidgetDto widgetInfo : dashboardNodeMap.get(dashboardNodeId)) {
                    // 如果widget关联外部数表，则抛出异常
                    if (!subNodeIds.contains(widgetInfo.getDstId())) {
                        Map<String, Object> foreignMap = new HashMap<>();
                        foreignMap.put("NODE_NAME", nodeMapper.selectNodeNameByNodeId(dashboardNodeId));
                        foreignMap.put("FOREIGN_WIDGET_NAME", widgetInfo.getWidgetName());
                        throw new BusinessException(FOLDER_DASHBOARD_LINK_FOREIGN_NODE, foreignMap);
                    }
                }
            }
        }
        // 若存在镜像，校验是否映射了外部的数表
        this.checkFormOrMirrorIsForeignNode(subNodeIds, nodeTypeToNodeIdsMap, NodeType.MIRROR.getNodeType(), FOLDER_MIRROR_LINK_FOREIGN_NODE);
    }

    @Override
    public void checkDatasheetTemplate(List<String> nodeIds, Boolean isBuildNodeName, TemplateException templateException) {
        // 制作模板所包含的数表，若关联了外部的数表，不能创建模板
        Map<String, List<String>> foreignDstIdsMap = iDatasheetService.getForeignFieldNames(nodeIds);
        if (foreignDstIdsMap != null) {
            for (String foreignNodeId : foreignDstIdsMap.keySet()) {
                Map<String, Object> foreignMap = new HashMap<>();
                if (isBuildNodeName) {
                    foreignMap.put("NODE_NAME", nodeMapper.selectNodeNameByNodeId(foreignNodeId));
                }
                foreignMap.put("FOREIGN_FIELD_NAMES", foreignDstIdsMap.get(foreignNodeId));
                throw new BusinessException(templateException, foreignMap);
            }
        }
    }

    @Override
    public void checkFormOrMirrorIsForeignNode(List<String> subNodeIds, Map<Integer, List<String>> nodeTypeToNodeIdsMap, int nodeType, TemplateException templateException) {
        if (nodeTypeToNodeIdsMap.containsKey(nodeType)) {
            // 构建返回对象
            Map<String, Object> foreignMap = new HashMap<>();
            if (!nodeTypeToNodeIdsMap.containsKey(NodeType.DATASHEET.getNodeType())) {
                // 获取第一个表单id
                String firstNodeId = nodeTypeToNodeIdsMap.get(nodeType).get(0);
                foreignMap.put("NODE_NAME", nodeMapper.selectNodeNameByNodeId(firstNodeId));
                throw new BusinessException(templateException, foreignMap);
            }
            // 批量查询关联节点对应主节点
            Map<String, String> relNodeToMainNodeMap = iNodeRelService.getRelNodeToMainNodeMap(nodeTypeToNodeIdsMap.get(nodeType));
            // 遍历从节点
            for (String relNode : relNodeToMainNodeMap.keySet()) {
                // 如果关联节点的主节点不在文件夹内，则抛出异常
                if (!subNodeIds.contains(relNodeToMainNodeMap.get(relNode))) {
                    foreignMap.put("NODE_NAME", nodeMapper.selectNodeNameByNodeId(relNode));
                    throw new BusinessException(templateException, foreignMap);
                }
            }
        }
    }

    @Override
    public void checkFieldPermission(Long memberId, String nodeId) {
        Map<String, FieldPermissionInfo> fieldPermissionMap = iFieldRoleService.getFieldPermissionMap(memberId, nodeId, null);
        if (MapUtil.isNotEmpty(fieldPermissionMap)) {
            FieldPermissionInfo info = fieldPermissionMap.values().stream()
                    .filter(val -> !Boolean.TRUE.equals(val.getHasRole()))
                    .findFirst().orElse(null);
            ExceptionUtil.isNull(info, FIELD_PERMISSION_INSUFFICIENT);
        }
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public String create(Long userId, String spaceId, CreateTemplateRo ro) {
        log.info("创建模版");
        // 若有相同名称的模版，覆盖旧模板
        Long id = baseMapper.selectIdByTypeIdAndName(spaceId, ro.getName());
        TemplateEntity entity = TemplateEntity.builder().id(id).type(TemplateType.SPACE.getType()).typeId(spaceId).name(ro.getName()).build();
        // 官方模板空间，不做数量校验
        if (constProperties.getTemplateSpace().contains(spaceId)) {
            entity.setType(TemplateType.OFFICIAL.getType());
        }
        else if (id == null) {
            // 非模板空间，且不是同名覆盖，校验数量上限
            this.verifyNumberLimit(spaceId);
        }
        String tempId;
        NodeType nodeType = iNodeService.getTypeByNodeId(ro.getNodeId());
        String nodeId = IdUtil.createNodeId(nodeType.getNodeType());
        NodeCopyOptions options = NodeCopyOptions.builder()
                .copyData(BooleanUtil.isTrue(ro.getData()))
                .nodeId(nodeId)
                .template(true)
                .retainRecordMeta(true)
                .build();
        // 同名覆盖，删除旧的映射节点
        if (id != null) {
            TemplateInfo info = baseMapper.selectInfoById(id);
            iNodeService.delTemplateRefNode(userId, info.getNodeId());
            tempId = info.getTemplateId();
        }
        else {
            tempId = IdUtil.createTemplateId();
            entity.setTemplateId(tempId);
        }
        // 备份原节点，创建映射的模版节点
        entity.setNodeId(nodeId);
        boolean flag = this.saveOrUpdate(entity);
        ExceptionUtil.isTrue(flag, EDIT_ERROR);
        // 转存节点方法，存在GRPC调用，若非异步调用，需保证最后调用
        iNodeService.copyNodeToSpace(userId, spaceId, "template", ro.getNodeId(), options);
        return tempId;
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void delete(Long userId, String templateId) {
        log.info("用户「{}」创建模版「{}」", userId, templateId);
        // 删除模板映射的节点
        String nodeId = baseMapper.selectNodeIdByTempId(templateId);
        ExceptionUtil.isNotBlank(nodeId, TEMPLATE_INFO_ERROR);
        iNodeService.delTemplateRefNode(userId, nodeId);
        // 逻辑删除模板
        baseMapper.updateIsDeletedByTempId(templateId);
    }

    @Override
    public RecommendVo getRecommend(String lang) {
        RecommendVo recommend = new RecommendVo();
        String recommendConfigValue = templateConfigService.getRecommendConfigCacheByLang(lang);
        if (recommendConfigValue == null) {
            return recommend;
        }
        RecommendConfig config = JSONUtil.parseObj(recommendConfigValue).toBean(RecommendConfig.class);
        if (config == null) {
            return recommend;
        }
        recommend.setTop(config.getTop());
        // build album group
        List<AlbumGroupVo> albumGroups = this.buildAlbumGroups(config.getAlbumGroups());
        recommend.setAlbumGroups(albumGroups);
        // build template group
        List<TemplateGroupVo> templateGroupVos = this.buildTemplateGroups(config.getTemplateGroups());
        recommend.setCategories(templateGroupVos);
        recommend.setTemplateGroups(templateGroupVos);
        return recommend;
    }

    private List<AlbumGroupVo> buildAlbumGroups(List<AlbumGroup> albumGroups) {
        if (CollUtil.isEmpty(albumGroups)) {
            return new ArrayList<>();
        }
        // summarize albums IDs under each group
        List<String> albumIds = new ArrayList<>();
        List<AlbumGroupVo> albumGroupVos = new ArrayList<>(albumGroups.size());
        albumGroups.forEach(group -> albumIds.addAll(group.getAlbumIds()));
        if (CollUtil.isEmpty(albumIds)) {
            return albumGroupVos;
        }

        // query album information uniformly
        List<AlbumVo> templateVoList = iTemplateAlbumService.getAlbumVosByAlbumIds(albumIds);
        Map<String, AlbumVo> albumIdToAlbumVoMap = templateVoList.stream().collect(Collectors.toMap(AlbumVo::getAlbumId, i -> i));
        // build group vo
        for (AlbumGroup group : albumGroups) {
            List<AlbumVo> albumVos = new ArrayList<>(group.getAlbumIds().size());
            for (String albumId : group.getAlbumIds()) {
                if (albumIdToAlbumVoMap.containsKey(albumId)) {
                    albumVos.add(albumIdToAlbumVoMap.get(albumId));
                }
            }
            // if the album under the group does not exist, it will not return
            if (CollUtil.isNotEmpty(albumVos)) {
                AlbumGroupVo albumGroupVo = new AlbumGroupVo(group.getName(), albumVos);
                albumGroupVos.add(albumGroupVo);
            }
        }
        return albumGroupVos;
    }

    private List<TemplateGroupVo> buildTemplateGroups(List<TemplateGroup> templateGroups) {
        // summarize template IDs under each group
        List<String> templateIds = new ArrayList<>();
        List<TemplateGroupVo> templateGroupVos = new ArrayList<>(templateGroups.size());
        templateGroups.forEach(group -> templateIds.addAll(group.getTemplateIds()));
        if (CollUtil.isEmpty(templateIds)) {
            return templateGroupVos;
        }

        // query template information uniformly
        List<TemplateVo> templateVoList = this.getTemplateVoList(constProperties.getTemplateSpace(), null, templateIds, false);
        Map<String, TemplateVo> templateIdToTemplateVoMap = templateVoList.stream().collect(Collectors.toMap(TemplateVo::getTemplateId, i -> i));
        // build group vo
        for (TemplateGroup group : templateGroups) {
            List<TemplateVo> templateVos = new ArrayList<>(group.getTemplateIds().size());
            for (String templateId : group.getTemplateIds()) {
                if (templateIdToTemplateVoMap.containsKey(templateId)) {
                    templateVos.add(templateIdToTemplateVoMap.get(templateId));
                }
            }
            // if the template under the group does not exist, it will not return
            if (CollUtil.isNotEmpty(templateVos)) {
                TemplateGroupVo templateGroupVo = new TemplateGroupVo(group.getName(), templateVos);
                templateGroupVos.add(templateGroupVo);
            }
        }
        return templateGroupVos;
    }

    @Override
    public List<TemplateCategoryMenuVo> getTemplateCategoryList(String lang) {
        log.info("获取官方模版分类列表");
        List<TemplatePropertyDto> properties =
                templatePropertyService.getTemplatePropertiesWithLangAndOrder(TemplatePropertyType.CATEGORY, lang);
        List<TemplateCategoryMenuVo> categoryVos = new ArrayList<>();
        for (TemplatePropertyDto property : properties) {
            TemplateCategoryMenuVo vo = new TemplateCategoryMenuVo();
            vo.setCategoryCode(property.getPropertyCode());
            vo.setCategoryName(property.getPropertyName());
            categoryVos.add(vo);
        }
        return categoryVos;
    }

    @Override
    public TemplateCategoryContentVo getTemplateCategoryContentVo(String categoryCode) {
        TemplateCategoryContentVo contentVo = new TemplateCategoryContentVo();
        // get album views
        List<AlbumVo> albumVos = iTemplateAlbumService.getAlbumVosByCategoryCode(categoryCode);
        contentVo.setAlbums(albumVos);
        // get template views
        List<TemplateVo> templateVos = this.getTemplateVoList(constProperties.getTemplateSpace(), null, null, Boolean.FALSE);
        contentVo.setTemplates(templateVos);
        return contentVo;
    }

    @Override
    public List<TemplateVo> getTemplateVoList(String spaceId, String categoryCode, List<String> templateIds, Boolean isPrivate) {
        log.info("获取模板视图列表");
        List<TemplateVo> vos = new ArrayList<>();

        // 官方模版
        if (StrUtil.isNotBlank(categoryCode)) {
            // 从数据中获取模版ID
            templateIds = templatePropertyService.getTemplateIdsByPropertyCodeAndType(categoryCode,
                    TemplatePropertyType.CATEGORY);
            if (templateIds.isEmpty()) {
                return vos;
            }
        }
        List<TemplateDto> templateDtoList = baseMapper.selectDtoByTypeId(spaceId, templateIds);
        if (CollUtil.isNotEmpty(templateDtoList)) {
            // 切换成内存自定义排序
            CollectionUtil.customSequenceSort(templateDtoList, TemplateDto::getTemplateId, templateIds);
            List<String> templateIdList = templateDtoList.stream().map(TemplateDto::getTemplateId).collect(Collectors.toList());
            Map<String, List<String>> tags = templatePropertyService.getTemplatesTags(templateIdList);
            // 获取节点描述
            List<String> nodeIds = templateDtoList.stream().map(TemplateDto::getNodeId).collect(Collectors.toList());
            Map<String, String> nodeIdToDescMap = iNodeDescService.getNodeIdToDescMap(nodeIds);
            templateDtoList.forEach(dto -> {
                TemplateVo vo = TemplateVo.builder()
                        .templateId(dto.getTemplateId())
                        .templateName(dto.getName())
                        .nodeId(dto.getNodeId())
                        .nodeType(dto.getType())
                        .cover(dto.getCover())
                        .description(nodeIdToDescMap.get(dto.getNodeId()))
                        .tags(tags.get(dto.getTemplateId()))
                        .build();
                // 模板属于空间站，显示创建者信息
                if (BooleanUtil.isTrue(isPrivate)) {
                    vo.setUserId(dto.getUuid());
                    vo.setUuid(dto.getUuid());
                    vo.setAvatar(dto.getAvatar());
                    vo.setNickName(dto.getNickName());
                    vo.setIsNickNameModified(dto.getIsNickNameModified());
                }
                vos.add(vo);
            });
        }
        return vos;
    }

    @Override
    public TemplateDirectoryVo getDirectoryVo(String categoryCode, String templateId, Boolean isPrivate, String lang) {
        log.info("获取模板目录信息");
        TemplateDto templateDto = baseMapper.selectDtoByTempId(templateId);
        ExceptionUtil.isNotNull(templateDto, TEMPLATE_INFO_ERROR);
        NodeShareTree nodeTree = new NodeShareTree();
        nodeTree.setNodeId(templateDto.getNodeId());
        nodeTree.setNodeName(templateDto.getNodeName());
        nodeTree.setType(templateDto.getType());
        nodeTree.setIcon(templateDto.getIcon());
        TemplateDirectoryVo vo = TemplateDirectoryVo.builder()
                .templateId(templateId)
                .templateName(templateDto.getName())
                .nodeTree(nodeTree)
                .build();
        if (templateDto.getType() == NodeType.FOLDER.getNodeType()) {
            List<NodeShareTree> treeByNodeIds = nodeMapper.selectShareTreeByNodeId(templateDto.getTypeId(), templateDto.getNodeId());
            if (CollUtil.isNotEmpty(treeByNodeIds)) {
                List<NodeShareTree> treeList = new DefaultTreeBuildFactory<NodeShareTree>(templateDto.getNodeId()).doTreeBuild(treeByNodeIds);
                nodeTree.setChildren(treeList);
            }
        }
        // 模板属于空间站，显示创建者和空间信息
        if (BooleanUtil.isTrue(isPrivate)) {
            vo.setUserId(templateDto.getUuid());
            vo.setUuid(templateDto.getUuid());
            vo.setAvatar(templateDto.getAvatar());
            vo.setNickName(templateDto.getNickName());
            vo.setSpaceName(templateDto.getSpaceName());
        }
        else {
            // 官方模板，返回模板分类信息
            this.complementCategoryInfo(categoryCode, templateId, vo, lang);
        }
        return vo;
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public String oneClickGenerate(Long userId, String spaceId, Long memberId, String nodeId) {
        log.info("一键生成模板");
        List<String> subNodeIds = nodeMapper.selectSubNodeIds(nodeId);
        if (CollUtil.isEmpty(subNodeIds)) {
            throw new BusinessException("无子节点");
        }
        boolean official = constProperties.getTemplateSpace().contains(spaceId);
        if (subNodeIds.size() > limitProperties.getTemplateMaxCount() && !official) {
            throw new BusinessException("超过模板数量上限");
        }
        // 获取当前空间的模板，存在同名保留使用 templateId，其余删除
        List<TemplateInfo> templateInfos = baseMapper.selectInfoByTypeId(spaceId);
        Map<String, TemplateInfo> tplNameToInfoMap = templateInfos.stream().collect(Collectors.toMap(TemplateInfo::getName, info -> info));
        // 删除原映射的节点
        String[] delNodeIds = new String[templateInfos.size()];
        for (int i = 0; i < templateInfos.size(); i++) {
            delNodeIds[i] = templateInfos.get(i).getNodeId();
        }
        if (ArrayUtil.isNotEmpty(delNodeIds)) {
            iNodeService.delTemplateRefNode(userId, delNodeIds);
        }
        // 开始生成
        StringBuilder strBuilder = new StringBuilder();
        Integer type = official ? TemplateType.OFFICIAL.getType() : TemplateType.SPACE.getType();
        List<BaseNodeInfo> nodeInfos = nodeMapper.selectBaseNodeInfoByNodeIds(subNodeIds);
        List<TemplateEntity> insertList = new ArrayList<>();
        for (BaseNodeInfo sub : nodeInfos) {
            // 校验各种类型节点的要求
            try {
                this.checkTemplateForeignNode(memberId, sub.getNodeId());
            }
            catch (BusinessException e) {
                strBuilder.append(sub.getNodeName()).append(e.getMessage());
                continue;
            }
            // 备份原节点，创建映射的模版节点
            String relatedNodeId = iNodeService.copyNodeToSpace(userId, spaceId, "template", sub.getNodeId(),
                    NodeCopyOptions.builder().copyData(true).template(true).retainRecordMeta(true).build());
            String name = sub.getNodeName();
            TemplateEntity entity = TemplateEntity.builder()
                    .type(type)
                    .nodeId(relatedNodeId).build();
            TemplateInfo templateInfo = tplNameToInfoMap.get(name);
            if (templateInfo == null) {
                entity.setTemplateId(IdUtil.createTemplateId());
                entity.setTypeId(spaceId);
                entity.setName(name);
                insertList.add(entity);
            }
            else {
                // 同名覆更新信息
                entity.setUpdatedBy(userId);
                baseMapper.updateInfoById(entity, templateInfo.getId());
                strBuilder.append(" 同名覆盖的模板：").append(name);
                tplNameToInfoMap.remove(name);
            }
        }
        if (CollUtil.isNotEmpty(insertList)) {
            this.saveBatch(insertList, insertList.size());
            strBuilder.append(" 新增部分：").append(insertList.stream().map(TemplateEntity::getName).collect(Collectors.toList()));
        }
        if (MapUtil.isNotEmpty(tplNameToInfoMap)) {
            List<Long> delIds = tplNameToInfoMap.values().stream().map(TemplateInfo::getId).collect(Collectors.toList());
            removeByIds(delIds);
            strBuilder.append(" 删除部分：").append(tplNameToInfoMap.keySet());
        }
        return strBuilder.toString();
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void config(Long userId, TemplateConfigRo ro) {
        log.info("生成模板中心相关的配置");

        // 获取节点所在空间站
        String spaceId = getSpaceIdByNodeId(ro.getNodeId());

        // 所有的官方模板的name为键，id为值存储到map中
        Map<String, String> nameToTplIdMap = getNameToTplIdMap(spaceId);

        // 根据模版的类型进行配置信息存储
        if (ro.getType() == 1) {

            // 使用【维格表API】获取模板推荐配置表配置信息
            List<RecommendTemplateInfo> list = vikaOperations.getRecommendTemplateConfiguration(ro.getNodeId(), ro.getNodeView(), ro.getLang());
            if (list.size() < 1) {
                throw new BusinessException("配置表无记录存在");
            }
            // 将表信息转为推荐配置对象
            RecommendConfig recommendConfig = this.configHotRecommend(list, nameToTplIdMap);
            // 保存推荐配置对象recommendConfig到数据库
            systemConfigService.saveOrUpdate(userId, SystemConfigType.RECOMMEND_CONFIG, ro.getLang(), JSONUtil.toJsonStr(recommendConfig));
            // 清除缓存
            templateConfigService.deleteRecommendConfigCacheByLang(ro.getLang());
        }
        else {
            String categoryDatasheetId = ro.getCategoryDatasheetId();
            String categoryDatasheetView = ro.getCategoryDatasheetView();
            if (ObjectUtil.isNull(categoryDatasheetId) || ObjectUtil.isNull(categoryDatasheetView)) {
                throw new BusinessException("没有传入模板的分类表id或分类视图");
            }
            // 使用【维格表API】获取上架模板分类表
            List<String> templateCategoryNames = vikaOperations.getTemplateCategoryName(categoryDatasheetId, categoryDatasheetView, ro.getLang());
            templatePropertyService.configOnlineTemplate(ro.getNodeId(), nameToTplIdMap, userId, ro.getLang(), templateCategoryNames);
            // 清除缓存
            templateConfigService.deleteCategoriesListConfigCacheByLang(ro.getLang());
        }
    }

    @Override
    public String getDefaultTemplateNodeId() {
        if (Locale.US.equals(LocaleContextHolder.getLocale())) {
            return baseMapper.selectNodeIdByTempId(constProperties.getQuoteEnTemplateId());
        }
        return baseMapper.selectNodeIdByTempId(constProperties.getQuoteTemplateId());
    }

    @Override
    public List<TemplateSearchResult> searchTemplate(String keyword, String rawLang) {
        log.info("模糊搜索模板，keyword:{},lang:{}", keyword, rawLang);
        String lang = templatePropertyService.ifNotCategoryReturnDefaultElseRaw(rawLang);
        // 获取所有上线模板的模板自定义ID
        LinkedHashSet<String> templateIds =
                templatePropertyService.getTemplateIdsByKeyWordAndLang(StrUtil.trim(keyword), lang);
        if (CollUtil.isEmpty(templateIds)) {
            return new ArrayList<>();
        }
        // 模糊查询模板名称
        List<OnlineTemplateDto> results = baseMapper.selectByTemplateIds(templateIds);
        if (CollUtil.isEmpty(results)) {
            return new ArrayList<>();
        }
        Map<String, List<OnlineTemplateDto>> onlineTemplateMap =
                results.stream().collect(Collectors.groupingBy(OnlineTemplateDto::getTemplateId));
        // 保证顺序
        LinkedHashMap<String, TemplateSearchResult> templates = new LinkedHashMap<>(onlineTemplateMap.size());
        for (String templateId : templateIds) {
            TemplateSearchResult searchResult = new TemplateSearchResult();
            // 获取已经分好组的
            if (templates.containsKey(templateId)) {
                searchResult = templates.get(templateId);
            }
            // templateId分组组成的属性列表
            for (OnlineTemplateDto dto : onlineTemplateMap.get(templateId)) {
                searchResult.setTemplateId(dto.getTemplateId());
                searchResult.setTemplateName(dto.getTemplateName());
                if (dto.getPropertyType().equals(TemplatePropertyType.CATEGORY.getType())) {
                    searchResult.setCategoryName(dto.getPropertyName());
                    searchResult.setCategoryCode(dto.getPropertyCode());
                }
                if (dto.getPropertyType().equals(TemplatePropertyType.TAG.getType())) {
                    List<String> tags = searchResult.getTags() != null ? searchResult.getTags() : new ArrayList<>();
                    tags.add(dto.getPropertyName());
                    searchResult.setTags(tags);
                }
            }
            templates.put(templateId, searchResult);
        }
        return new ArrayList<>(templates.values());
    }

    @Override
    public TemplateSearchDTO globalSearchTemplate(String lang, String keyword, String className) {
        TemplateSearchDTO result = new TemplateSearchDTO();
        // search template
        List<TemplateSearchResult> templates = this.searchTemplate(keyword, lang);
        List<String> originTemplateNames = new ArrayList<>(templates.size());
        Set<String> originTagNames = new HashSet<>();
        // replace style of keyword
        templates.forEach(template -> {
            originTemplateNames.add(template.getTemplateName());
            template.setTemplateName(InformationUtil.keywordHighlight(template.getTemplateName(), keyword, className));
            if (template.getTags() != null) {
                List<String> tags = new ArrayList<>(template.getTags().size());
                for (String tag : template.getTags()) {
                    originTagNames.add(tag);
                    tags.add(InformationUtil.keywordHighlight(tag, keyword, className));
                }
                template.setTags(tags);
            }
        });
        result.setTemplates(templates);
        result.setTemplateNames(originTemplateNames);
        result.setTagNames(originTagNames);

        // search template album
        List<AlbumVo> albumVos = iTemplateAlbumService.searchAlbums(lang, keyword);
        if (albumVos.isEmpty()) {
            return result;
        }
        List<String> albumNames = new ArrayList<>(albumVos.size());
        albumVos.forEach(album -> {
            albumNames.add(album.getName());
            album.setName(InformationUtil.keywordHighlight(album.getName(), keyword, className));
        });
        result.setAlbums(albumVos);
        result.setAlbumNames(albumNames);
        return result;
    }

    @Override
    public List<String> getNodeIdsByTemplateId(String templateId) {
        // 查询模板映射的节点ID
        String nodeId = baseMapper.selectNodeIdByTempId(templateId);
        ExceptionUtil.isNotBlank(nodeId, TEMPLATE_INFO_ERROR);

        List<String> nodeIds = new ArrayList<>();
        nodeIds.add(nodeId);
        // 判断节点类型
        NodeType nodeType = iNodeService.getTypeByNodeId(nodeId);
        if (nodeType == NodeType.FOLDER) {
            // 查找所有的子节点
            List<String> subNodeIds = nodeMapper.selectAllSubNodeIds(nodeId);
            if (!subNodeIds.isEmpty()) {
                nodeIds.addAll(subNodeIds);
            }
        }
        return nodeIds;
    }

    private RecommendConfig configHotRecommend(List<RecommendTemplateInfo> recommends, Map<String, String> nameToTplIdMap) {
        // 校验模板名称是否在空间有对应的tpcId。
        for (RecommendTemplateInfo template : recommends) {
            String templateName = template.getTemplateName();
            String tplId = nameToTplIdMap.get(templateName);
            if (ObjectUtil.isNull(tplId)) {
                throw new BusinessException("模版名称不正确:" + templateName);
            }
        }

        // 模板信息列表存储结构转化RecommendConfig。
        RecommendConfig recommendConfig = templateList2i18nToRecommendConfigMap(recommends, nameToTplIdMap);

        int headerCount = 3;
        // 校验各语言下top3是否符合标准，自定义分组是否大于1
        if (recommendConfig.getTop().size() != headerCount) {
            throw new BusinessException("Top3 分组的配置不足或超过三个");
        }
        if (recommendConfig.getCategories().size() < 1) {
            throw new BusinessException("自定义分组的配置不存在");
        }

        return recommendConfig;
    }

    private RecommendConfig templateList2i18nToRecommendConfigMap(List<RecommendTemplateInfo> recommends, Map<String, String> nameToTplIdMap) {
        RecommendConfig recommendConfig = new RecommendConfig(new ArrayList<>(), new ArrayList<>());
        // 空间换时间，不需要每次去找template在RecommendConfig哪个类别列表中。
        Map<String, CategoryDto> categoryNameToCategory = new HashMap<>(2);
        for (RecommendTemplateInfo template : recommends) {

            // 获取模板所在分类
            String categoryName = template.getCustomCategory();
            final String bannerKey = "Top3";
            if (categoryName.equals(bannerKey)) {
                // 模板类别属于top3
                List<Banner> banners = recommendConfig.getTop();
                String tplId = nameToTplIdMap.get(template.getTemplateName());
                Banner banner = new Banner(tplId, template.getBanners().get(0).getToken(),
                        template.getTitle(), template.getDescription(), template.getColor());
                banners.add(banner);
            }
            else {
                // 模板为普通类别下的模板
                CategoryDto category = categoryNameToCategory.computeIfAbsent(categoryName, value ->
                        CategoryDto.builder().categoryName(categoryName).templateIds(new ArrayList<>()).build());
                String templateName = template.getTemplateName();
                String tplId = nameToTplIdMap.get(templateName);
                category.getTemplateIds().add(tplId);
            }
        }

        recommendConfig.getCategories().addAll(categoryNameToCategory.values());

        return recommendConfig;
    }

    private void complementCategoryInfo(String categoryCode, String templateId, TemplateDirectoryVo vo, String lang) {
        String val = templateConfigService.getCategoriesListConfigCacheByLang(lang);
        if (val == null) {
            return;
        }
        List<CategoryDto> dtoList = JSONUtil.parseArray(val).toList(CategoryDto.class);
        for (CategoryDto category : dtoList) {
            // 模板若不在分类下，跳过
            if (!category.getTemplateIds().contains(templateId)) {
                continue;
            }
            // 优先取指定分类code的信息
            if (category.getCategoryCode().equals(categoryCode)) {
                vo.setCategoryCode(categoryCode);
                vo.setCategoryName(category.getCategoryName());
                return;
            }
            // 再则取第一个分类的信息
            if (vo.getCategoryName() == null) {
                vo.setCategoryCode(category.getCategoryCode());
                vo.setCategoryName(category.getCategoryName());
                // 无分类code，直接返回
                if (StrUtil.isBlank(categoryCode)) {
                    return;
                }
            }
        }
    }

    /**
     * 验证模板数量是否到达上限
     */
    private void verifyNumberLimit(String spaceId) {
        int count = SqlTool.retCount(baseMapper.countByTypeId(spaceId));
        ExceptionUtil.isTrue(count < limitProperties.getTemplateMaxCount(), NUMBER_LIMIT);
    }


    private Map<String, String> getNameToTplIdMap(String spaceId) {
        List<TemplateInfo> templateInfos = baseMapper.selectInfoByTypeId(spaceId);
        if (templateInfos.size() < 1) {
            throw new BusinessException("当前空间无模板");
        }
        return templateInfos.stream().collect(Collectors.toMap(TemplateInfo::getName, TemplateInfo::getTemplateId));
    }

    private String getSpaceIdByNodeId(String nodeId) {
        // 配置表不能为空
        ExceptionUtil.isNotBlank(nodeId, INCORRECT_ARG);
        // 配置表需要在某个空间下
        String spaceId = nodeMapper.selectSpaceIdByNodeId(nodeId);
        ExceptionUtil.isNotNull(spaceId, PermissionException.NODE_ACCESS_DENIED);
        // 空间需要是官网指定的配置信息空间
        if (!constProperties.getTemplateSpace().contains(spaceId)) {
            throw new BusinessException("当前空间不是模板空间");
        }
        return spaceId;
    }

}
