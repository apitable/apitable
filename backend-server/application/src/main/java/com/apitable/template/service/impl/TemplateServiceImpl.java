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

package com.apitable.template.service.impl;

import static com.apitable.workspace.enums.NodeException.NOT_ALLOW;

import cn.hutool.core.collection.CollUtil;
import cn.hutool.core.map.MapUtil;
import cn.hutool.core.util.BooleanUtil;
import cn.hutool.core.util.StrUtil;
import cn.hutool.json.JSONUtil;
import com.apitable.automation.service.IAutomationRobotService;
import com.apitable.base.enums.DatabaseException;
import com.apitable.base.enums.SystemConfigType;
import com.apitable.base.model.SystemConfigDTO;
import com.apitable.base.service.ISystemConfigService;
import com.apitable.control.infrastructure.role.ControlRoleManager;
import com.apitable.control.infrastructure.role.RoleConstants.Node;
import com.apitable.core.exception.BusinessException;
import com.apitable.core.support.tree.DefaultTreeBuildFactory;
import com.apitable.core.util.ExceptionUtil;
import com.apitable.core.util.SqlTool;
import com.apitable.shared.cache.bean.CategoryDto;
import com.apitable.shared.cache.bean.RecommendConfig;
import com.apitable.shared.cache.bean.RecommendConfig.AlbumGroup;
import com.apitable.shared.cache.bean.RecommendConfig.TemplateGroup;
import com.apitable.shared.cache.service.TemplateConfigCacheService;
import com.apitable.shared.component.LanguageManager;
import com.apitable.shared.config.properties.ConstProperties;
import com.apitable.shared.config.properties.LimitProperties;
import com.apitable.shared.util.CollectionUtil;
import com.apitable.shared.util.IdUtil;
import com.apitable.shared.util.information.InformationUtil;
import com.apitable.template.dto.TemplateDto;
import com.apitable.template.dto.TemplateInfo;
import com.apitable.template.entity.TemplateEntity;
import com.apitable.template.enums.TemplateException;
import com.apitable.template.enums.TemplatePropertyType;
import com.apitable.template.enums.TemplateType;
import com.apitable.template.mapper.TemplateMapper;
import com.apitable.template.model.OnlineTemplateDto;
import com.apitable.template.model.TemplatePropertyDto;
import com.apitable.template.model.TemplateSearchDTO;
import com.apitable.template.ro.CreateTemplateRo;
import com.apitable.template.service.ITemplateAlbumService;
import com.apitable.template.service.ITemplatePropertyService;
import com.apitable.template.service.ITemplateService;
import com.apitable.template.vo.AlbumGroupVo;
import com.apitable.template.vo.AlbumVo;
import com.apitable.template.vo.RecommendVo;
import com.apitable.template.vo.TemplateCategoryContentVo;
import com.apitable.template.vo.TemplateCategoryMenuVo;
import com.apitable.template.vo.TemplateDirectoryVo;
import com.apitable.template.vo.TemplateGroupVo;
import com.apitable.template.vo.TemplateSearchResult;
import com.apitable.template.vo.TemplateVo;
import com.apitable.widget.service.IWidgetService;
import com.apitable.workspace.dto.NodeCopyOptions;
import com.apitable.workspace.enums.NodeType;
import com.apitable.workspace.mapper.NodeMapper;
import com.apitable.workspace.service.IDatasheetService;
import com.apitable.workspace.service.IFieldRoleService;
import com.apitable.workspace.service.INodeDescService;
import com.apitable.workspace.service.INodeRelService;
import com.apitable.workspace.service.INodeService;
import com.apitable.workspace.vo.BaseNodeInfo;
import com.apitable.workspace.vo.FieldPermissionInfo;
import com.apitable.workspace.vo.NodeShareTree;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import jakarta.annotation.Resource;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.HashSet;
import java.util.LinkedHashMap;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Template Service Implement Class.
 *
 * @author Chambers
 */
@Slf4j
@Service
public class TemplateServiceImpl
    extends ServiceImpl<TemplateMapper, TemplateEntity>
    implements ITemplateService {

    @Resource
    private ISystemConfigService systemConfigService;

    @Resource
    private INodeService iNodeService;

    @Resource
    private NodeMapper nodeMapper;

    @Resource
    private INodeDescService iNodeDescService;

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

    @Resource
    private TemplateConfigCacheService templateConfigCacheService;

    @Resource
    private INodeRelService iNodeRelService;

    @Resource
    private IWidgetService iWidgetService;

    @Resource
    private IAutomationRobotService iAutomationRobotService;

    /**
     * Get SpaceId.
     *
     * @param templateId templateId
     * @return spaceId
     */
    @Override
    public String getSpaceId(final String templateId) {
        log.info("Get space id by template id 「{}」", templateId);
        // Check if the template exists
        String spaceId = baseMapper.selectTypeIdByTempId(templateId);
        ExceptionUtil.isNotNull(spaceId, TemplateException.TEMPLATE_INFO_ERROR);
        return spaceId;
    }

    /**
     * Check Template Foreign Node.
     *
     * @param memberId memberId
     * @param nodeId   nodeId
     */
    @Override
    public void checkTemplateForeignNode(final Long memberId,
                                         final String nodeId) {
        NodeType nodeType = iNodeService.getTypeByNodeId(nodeId);
        List<String> singletonNodeIds = Collections.singletonList(nodeId);
        switch (nodeType) {
            case FOLDER:
                // Check the permissions of all child descendant nodes
                List<String> subNodeIds =
                    iNodeService.checkSubNodePermission(memberId, nodeId,
                        ControlRoleManager.parseNodeRole(Node.MANAGER));
                if (subNodeIds == null || subNodeIds.isEmpty()) {
                    break;
                }
                // Requirements for various types of
                // nodes in the descendants of the syndrome
                this.checkFolderTemplate(subNodeIds, memberId);
                break;
            case DATASHEET:
                this.checkDatasheetTemplate(singletonNodeIds,
                    false, TemplateException.NODE_LINK_FOREIGN_NODE);
                // Check Field Permissions
                this.checkFieldPermission(memberId, nodeId);
                break;
            case FORM:
                throw new BusinessException(
                    TemplateException.SINGLE_FORM_CREATE_FAIL);
            case DASHBOARD:
                throw new BusinessException(
                    TemplateException.SINGLE_DASHBOARD_CREATE_FAIL);
            case MIRROR:
                throw new BusinessException(
                    TemplateException.SINGLE_MIRROR_CREATE_FAIL);
            case AUTOMATION:
                // Check automation whether the external data table is referenced
                iAutomationRobotService.checkAutomationReference(singletonNodeIds,
                    singletonNodeIds);
                break;
            default:
                throw new BusinessException(NOT_ALLOW);
        }
    }

    /**
     * Check Folder Template.
     *
     * @param subNodeIds subNodeIds
     * @param memberId   memberId
     */
    @Override
    public void checkFolderTemplate(final List<String> subNodeIds,
                                    final Long memberId) {
        // Requirements for various types of
        // nodes in the descendants of the syndrome
        List<BaseNodeInfo> nodeInfos =
            nodeMapper.selectBaseNodeInfoByNodeIds(subNodeIds);
        Map<Integer, List<String>> nodeTypeToNodeIdsMap = nodeInfos.stream()
            .collect(Collectors.groupingBy(BaseNodeInfo::getType,
                Collectors.mapping(BaseNodeInfo::getNodeId, Collectors.toList())));
        // If there is a number table,
        // check whether it is associated with an external number table
        if (nodeTypeToNodeIdsMap
            .containsKey(NodeType.DATASHEET.getNodeType())) {
            this.checkDatasheetTemplate(nodeTypeToNodeIdsMap.get(
                    NodeType.DATASHEET.getNodeType()), true,
                TemplateException.FOLDER_NODE_LINK_FOREIGN_NODE);
            // Check Field Permissions
            for (String subNodeId : nodeTypeToNodeIdsMap
                .get(NodeType.DATASHEET.getNodeType())) {
                this.checkFieldPermission(memberId, subNodeId);
            }
        }
        // If there is a collection table,
        // check whether it is associated with an external data table
        this.checkFormOrMirrorIsForeignNode(subNodeIds, nodeTypeToNodeIdsMap,
            NodeType.FORM.getNodeType(),
            TemplateException.FOLDER_FORM_LINK_FOREIGN_NODE);
        // If there is a dashboard, verify whether the data source of
        // the component references an external data table
        if (nodeTypeToNodeIdsMap
            .containsKey(NodeType.DASHBOARD.getNodeType())) {
            iWidgetService.checkWidgetReference(subNodeIds,
                nodeTypeToNodeIdsMap.get(NodeType.DASHBOARD.getNodeType()));
        }
        // If there is a mirror, check whether the external data table is mapped
        this.checkFormOrMirrorIsForeignNode(subNodeIds, nodeTypeToNodeIdsMap,
            NodeType.MIRROR.getNodeType(),
            TemplateException.FOLDER_MIRROR_LINK_FOREIGN_NODE);
        // Check automation whether the external data table is referenced
        iAutomationRobotService.checkAutomationReference(subNodeIds,
            nodeTypeToNodeIdsMap.get(NodeType.AUTOMATION.getNodeType()));
    }

    /**
     * Check Datasheet Template.
     *
     * @param nodeIds           nodeIds
     * @param isBuildNodeName   isBuildNodeName
     * @param templateException templateException
     */
    @Override
    public void checkDatasheetTemplate(
        final List<String> nodeIds,
        final Boolean isBuildNodeName,
        final TemplateException templateException
    ) {
        // The number table included in the template is created.
        // If an external number table is associated,
        // the template cannot be created.
        Map<String, List<String>> foreignDstIdsMap =
            iDatasheetService.getForeignFieldNames(nodeIds);
        if (foreignDstIdsMap == null) {
            return;
        }
        for (String foreignNodeId : foreignDstIdsMap.keySet()) {
            Map<String, Object> foreignMap = new HashMap<>();
            if (isBuildNodeName) {
                foreignMap.put("NODE_NAME",
                    nodeMapper.selectNodeNameByNodeId(foreignNodeId));
            }
            foreignMap.put("FOREIGN_FIELD_NAMES",
                foreignDstIdsMap.get(foreignNodeId));
            throw new BusinessException(templateException, foreignMap);
        }
    }

    /**
     * Check Form Or Mirror Is Foreign Node.
     *
     * @param subNodeIds           subNodeIds
     * @param nodeTypeToNodeIdsMap nodeTypeToNodeIdsMap
     * @param nodeType             nodeType
     * @param templateException    templateException
     */
    @Override
    public void checkFormOrMirrorIsForeignNode(
        final List<String> subNodeIds,
        final Map<Integer, List<String>> nodeTypeToNodeIdsMap,
        final int nodeType,
        final TemplateException templateException
    ) {
        if (!nodeTypeToNodeIdsMap.containsKey(nodeType)) {
            return;
        }
        Map<String, Object> foreignMap = new HashMap<>();
        List<String> nodeIds = nodeTypeToNodeIdsMap.get(nodeType);
        if (!nodeTypeToNodeIdsMap
            .containsKey(NodeType.DATASHEET.getNodeType())) {
            // get the first form id
            String firstNodeId = nodeIds.get(0);
            foreignMap.put("NODE_NAME",
                nodeMapper.selectNodeNameByNodeId(firstNodeId));
            throw new BusinessException(templateException, foreignMap);
        }
        // Batch query associated nodes corresponding to the master node
        Map<String, String> relNodeToMainNodeMap =
            iNodeRelService.getRelNodeToMainNodeMap(nodeIds);
        // Traverse slave nodes
        for (String relNode : relNodeToMainNodeMap.keySet()) {
            // Throws an exception if the primary node of
            // the associated node is not in the folder
            if (!subNodeIds.contains(relNodeToMainNodeMap.get(relNode))) {
                foreignMap.put("NODE_NAME",
                    nodeMapper.selectNodeNameByNodeId(relNode));
                throw new BusinessException(templateException, foreignMap);
            }
        }
    }

    /**
     * Check Field Permission.
     *
     * @param memberId memberId
     * @param nodeId   nodeId
     */
    @Override
    public void checkFieldPermission(final Long memberId, final String nodeId) {
        Map<String, FieldPermissionInfo> fieldPermissionMap =
            iFieldRoleService.getFieldPermissionMap(memberId, nodeId, null);
        if (MapUtil.isNotEmpty(fieldPermissionMap)) {
            FieldPermissionInfo info = fieldPermissionMap.values().stream()
                .filter(val -> !Boolean.TRUE.equals(val.getHasRole()))
                .findFirst().orElse(null);
            ExceptionUtil.isNull(info,
                TemplateException.FIELD_PERMISSION_INSUFFICIENT);
        }
    }

    /**
     * Create.
     *
     * @param userId  userId
     * @param spaceId spaceId
     * @param ro      ro
     * @return template id
     */
    @Override
    @Transactional(rollbackFor = Exception.class)
    public String create(final Long userId, final String spaceId,
                         final CreateTemplateRo ro) {
        log.info("User「{}」create template「{}」in space「{}」", userId,
            ro.getName(), spaceId);
        // If there is a template with the same name, overwrite the old template
        Long id = baseMapper.selectIdByTypeIdAndName(spaceId, ro.getName());
        TemplateEntity entity = TemplateEntity.builder()
            .id(id)
            .type(TemplateType.SPACE.getType())
            .typeId(spaceId)
            .name(ro.getName())
            .build();
        // Official template space, no quantity verification
        if (constProperties.getTemplateSpace().contains(spaceId)) {
            entity.setType(TemplateType.OFFICIAL.getType());
        } else if (id == null) {
            // Non-template space, and not covered by the same name,
            // the upper limit of the number of checks
            this.verifyNumberLimit(spaceId);
        }
        String tempId;
        NodeType nodeType = iNodeService.getTypeByNodeId(ro.getNodeId());
        String nodeId = IdUtil.createNodeId(nodeType);
        // Overwrite with the same name, delete the old map node
        if (id != null) {
            TemplateInfo info = baseMapper.selectInfoById(id);
            iNodeService.delTemplateRefNode(userId, info.getNodeId());
            tempId = info.getTemplateId();
        } else {
            tempId = IdUtil.createTemplateId();
            entity.setTemplateId(tempId);
        }
        // Back up the original node and create a mapped template node
        entity.setNodeId(nodeId);
        boolean flag = this.saveOrUpdate(entity);
        ExceptionUtil.isTrue(flag, DatabaseException.EDIT_ERROR);
        // Dump node method, there is a GRPC call,
        // if it is not an asynchronous call,
        // you need to ensure that the last call
        NodeCopyOptions options = NodeCopyOptions.builder()
            .copyData(BooleanUtil.isTrue(ro.getData()))
            .nodeId(nodeId)
            .template(true)
            .retainRecordMeta(true)
            .build();
        iNodeService.copyNodeToSpace(userId, spaceId, "template",
            ro.getNodeId(), options);
        return tempId;
    }

    /**
     * Delete.
     *
     * @param userId     userId
     * @param templateId templateId
     */
    @Override
    @Transactional(rollbackFor = Exception.class)
    public void delete(final Long userId, final String templateId) {
        log.info("User「{}」delete template「{}」", userId, templateId);
        // delete template mapped node
        String nodeId = baseMapper.selectNodeIdByTempId(templateId);
        ExceptionUtil.isNotBlank(nodeId, TemplateException.TEMPLATE_INFO_ERROR);
        iNodeService.delTemplateRefNode(userId, nodeId);
        // update template delete status
        baseMapper.updateIsDeletedByTempId(templateId);
    }

    /**
     * Get Recommend.
     *
     * @param lang language
     * @return RecommendVo
     */
    @Override
    public RecommendVo getRecommend(final String lang) {
        RecommendVo recommend = new RecommendVo();
        String recommendConfigValue = this.getRecommendConfig(lang);
        if (recommendConfigValue == null) {
            return recommend;
        }
        RecommendConfig config =
            JSONUtil.parseObj(recommendConfigValue)
                .toBean(RecommendConfig.class);
        if (config == null) {
            return recommend;
        }
        recommend.setTop(config.getTop());
        // build album group
        List<AlbumGroupVo> albumGroups =
            this.buildAlbumGroups(config.getAlbumGroups());
        recommend.setAlbumGroups(albumGroups);
        // build template group
        List<TemplateGroupVo> templateGroupVos =
            this.buildTemplateGroups(config.getTemplateGroups());
        recommend.setTemplateGroups(templateGroupVos);
        return recommend;
    }

    private String getRecommendConfig(final String lang) {
        List<SystemConfigDTO> systemConfigDTOs =
            systemConfigService.findSystemConfigDTOs(
                SystemConfigType.RECOMMEND_CONFIG);
        if (systemConfigDTOs.isEmpty()) {
            return null;
        }
        Optional<SystemConfigDTO> firstOptional = systemConfigDTOs.stream()
            .filter(i -> lang.equals(i.getI18nName()))
            .findFirst();
        if (firstOptional.isPresent()) {
            return firstOptional.get().getConfigMap();
        }
        // If the configuration with assign language is not exist,
        // return configuration of default language.
        String defaultLanguageTag =
            LanguageManager.me().getDefaultLanguageTagWithUnderLine();
        if (defaultLanguageTag.equals(lang)) {
            return null;
        }
        Optional<SystemConfigDTO> secondOptional = systemConfigDTOs.stream()
            .filter(i -> defaultLanguageTag.equals(i.getI18nName()))
            .findFirst();
        return secondOptional.map(SystemConfigDTO::getConfigMap).orElse(null);
    }

    private List<AlbumGroupVo> buildAlbumGroups(
        final List<AlbumGroup> albumGroups
    ) {
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
        List<AlbumVo> templateVoList =
            iTemplateAlbumService.getAlbumVosByAlbumIds(albumIds);
        Map<String, AlbumVo> albumIdToAlbumVoMap = templateVoList.stream()
            .collect(Collectors.toMap(AlbumVo::getAlbumId, i -> i));
        // build group vo
        for (AlbumGroup group : albumGroups) {
            List<AlbumVo> albumVos =
                new ArrayList<>(group.getAlbumIds().size());
            for (String albumId : group.getAlbumIds()) {
                if (albumIdToAlbumVoMap.containsKey(albumId)) {
                    albumVos.add(albumIdToAlbumVoMap.get(albumId));
                }
            }
            // if the album under the group does not exist, it will not return
            if (CollUtil.isNotEmpty(albumVos)) {
                AlbumGroupVo albumGroupVo =
                    new AlbumGroupVo(group.getName(), albumVos);
                albumGroupVos.add(albumGroupVo);
            }
        }
        return albumGroupVos;
    }

    private List<TemplateGroupVo> buildTemplateGroups(
        final List<TemplateGroup> templateGroups
    ) {
        // summarize template IDs under each group
        List<String> templateIds = new ArrayList<>();
        List<TemplateGroupVo> templateGroupVos =
            new ArrayList<>(templateGroups.size());
        templateGroups
            .forEach(group -> templateIds.addAll(group.getTemplateIds()));
        if (CollUtil.isEmpty(templateIds)) {
            return templateGroupVos;
        }

        // query template information uniformly
        List<TemplateVo> templateVoList =
            this.getTemplateVoList(constProperties.getTemplateSpace(),
                null, templateIds, false);
        Map<String, TemplateVo> templateIdToTemplateVoMap =
            templateVoList.stream()
                .collect(Collectors.toMap(TemplateVo::getTemplateId, i -> i));
        // build group vo
        for (TemplateGroup group : templateGroups) {
            List<TemplateVo> templateVos =
                new ArrayList<>(group.getTemplateIds().size());
            for (String templateId : group.getTemplateIds()) {
                if (templateIdToTemplateVoMap.containsKey(templateId)) {
                    templateVos.add(templateIdToTemplateVoMap.get(templateId));
                }
            }
            // if the template under the group does not exist,
            // it will not return
            if (CollUtil.isNotEmpty(templateVos)) {
                TemplateGroupVo templateGroupVo =
                    new TemplateGroupVo(group.getName(), templateVos);
                templateGroupVos.add(templateGroupVo);
            }
        }
        return templateGroupVos;
    }

    /**
     * Get Template Category List.
     *
     * @param lang language
     * @return List of TemplateCategoryMenuVo
     */
    @Override
    public List<TemplateCategoryMenuVo> getTemplateCategoryList(
        final String lang) {
        List<TemplatePropertyDto> properties =
            templatePropertyService.getTemplatePropertiesWithLangAndOrder(
                TemplatePropertyType.CATEGORY, lang);
        List<TemplateCategoryMenuVo> categoryVos = new ArrayList<>();
        for (TemplatePropertyDto property : properties) {
            TemplateCategoryMenuVo vo = new TemplateCategoryMenuVo();
            vo.setCategoryCode(property.getPropertyCode());
            vo.setCategoryName(property.getPropertyName());
            categoryVos.add(vo);
        }
        return categoryVos;
    }

    /**
     * Get Template Category Content View.
     *
     * @param categoryCode categoryCode
     * @return TemplateCategoryContentVo
     */
    @Override
    public TemplateCategoryContentVo getTemplateCategoryContentVo(
        final String categoryCode
    ) {
        TemplateCategoryContentVo contentVo = new TemplateCategoryContentVo();
        // get album views
        List<AlbumVo> albumVos =
            iTemplateAlbumService.getAlbumVosByCategoryCode(categoryCode);
        contentVo.setAlbums(albumVos);
        // get template views
        List<TemplateVo> templateVos =
            this.getTemplateVoList(constProperties.getTemplateSpace(),
                categoryCode, null, Boolean.FALSE);
        contentVo.setTemplates(templateVos);
        return contentVo;
    }

    /**
     * Get Template View List.
     *
     * @param spaceId      space id
     * @param categoryCode template category code(no require)
     * @param templateIds  template id list(no require)
     * @param isPrivate    whether it is a private template in the space station
     * @return List of TemplateVo
     */
    @Override
    public List<TemplateVo> getTemplateVoList(
        final String spaceId,
        final String categoryCode,
        final List<String> templateIds,
        final Boolean isPrivate
    ) {
        List<String> tplIds = templateIds;
        List<TemplateVo> vos = new ArrayList<>();

        if (StrUtil.isNotBlank(categoryCode)) {
            // Get template id from data
            tplIds =
                templatePropertyService.getTemplateIdsByPropertyCodeAndType(
                    categoryCode, TemplatePropertyType.CATEGORY);
            if (tplIds.isEmpty()) {
                return vos;
            }
        }
        List<TemplateDto> templateDtoList =
            baseMapper.selectDtoByTypeId(spaceId, tplIds);
        if (CollUtil.isNotEmpty(templateDtoList)) {
            // Switch to memory custom sorting
            CollectionUtil.customSequenceSort(templateDtoList,
                TemplateDto::getTemplateId, tplIds);
            List<String> templateIdList = templateDtoList.stream()
                .map(TemplateDto::getTemplateId).collect(Collectors.toList());
            Map<String, List<String>> tags =
                templatePropertyService.getTemplatesTags(templateIdList);
            // get node description
            List<String> nodeIds = templateDtoList.stream()
                .map(TemplateDto::getNodeId).collect(Collectors.toList());
            Map<String, String> nodeIdToDescMap =
                iNodeDescService.getNodeIdToDescMap(nodeIds);
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
                // The template belongs to the space station
                // and shows the creator information
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

    /**
     * Get Directory Vo.
     *
     * @param categoryCode template category code(no require)
     * @param templateId   template id
     * @param isPrivate    whether it is a private template in the space station
     * @param lang         language
     * @return TemplateDirectoryVo
     */
    @Override
    public TemplateDirectoryVo getDirectoryVo(final String categoryCode,
                                              final String templateId, final Boolean isPrivate,
                                              final String lang) {
        log.info("Get template 「{}」 directory view", templateId);
        TemplateDto templateDto = baseMapper.selectDtoByTempId(templateId);
        ExceptionUtil.isNotNull(templateDto,
            TemplateException.TEMPLATE_INFO_ERROR);
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
            List<NodeShareTree> treeByNodeIds =
                iNodeService.getSubNodes(templateDto.getNodeId());
            if (CollUtil.isNotEmpty(treeByNodeIds)) {
                List<NodeShareTree> treeList =
                    new DefaultTreeBuildFactory<NodeShareTree>(
                        templateDto.getNodeId()).doTreeBuild(treeByNodeIds);
                nodeTree.setChildren(treeList);
            }
        }
        // Template belongs to space station,
        // showing creator and space information
        if (BooleanUtil.isTrue(isPrivate)) {
            vo.setUserId(templateDto.getUuid());
            vo.setUuid(templateDto.getUuid());
            vo.setAvatar(templateDto.getAvatar());
            vo.setNickName(templateDto.getNickName());
            vo.setSpaceName(templateDto.getSpaceName());
        } else {
            // Official template, return template classification information
            this.complementCategoryInfo(categoryCode, templateId, vo, lang);
        }
        return vo;
    }

    /**
     * Get Default Template NodeId.
     *
     * @return NodeId
     */
    @Override
    public String getDefaultTemplateNodeId() {
        String quoteTemplateId = constProperties.getQuoteTemplateId();
        try {
            if (Locale.US.equals(LocaleContextHolder.getLocale())) {
                quoteTemplateId = constProperties.getQuoteEnTemplateId();
            }
        } catch (Exception e) {
            log.error("Get default en template id error", e);
        }
        return baseMapper.selectNodeIdByTempId(quoteTemplateId);
    }

    @Override
    public List<String> getTemplateNodeIds(String spaceId, List<String> templateIds) {
        List<TemplateInfo> templates =
            baseMapper.selectInfoByTypeIdAndTemplateIds(spaceId, templateIds);
        if (templates.isEmpty()) {
            return new ArrayList<>();
        }
        CollectionUtil.customSequenceSort(templates, TemplateInfo::getTemplateId, templateIds);
        return templates.stream()
            .map(TemplateInfo::getNodeId)
            .collect(Collectors.toList());
    }

    private List<TemplateSearchResult> searchTemplate(final String keyword,
                                                      final String rawLang) {
        log.info("Fuzzy Search Template. keyword:{},lang:{}", keyword, rawLang);
        String lang =
            templatePropertyService.ifNotCategoryReturnDefaultElseRaw(rawLang);
        // Get template custom IDs of all online templates
        LinkedHashSet<String> templateIds =
            templatePropertyService.getTemplateIdsByKeyWordAndLang(StrUtil.trim(keyword), lang);
        if (CollUtil.isEmpty(templateIds)) {
            return new ArrayList<>();
        }
        // Fuzzy query template name
        List<OnlineTemplateDto> results =
            baseMapper.selectByTemplateIds(templateIds);
        if (CollUtil.isEmpty(results)) {
            return new ArrayList<>();
        }
        Map<String, List<OnlineTemplateDto>> onlineTemplateMap =
            results.stream()
                .collect(
                    Collectors.groupingBy(OnlineTemplateDto::getTemplateId));
        // Guaranteed order
        LinkedHashMap<String, TemplateSearchResult> templates =
            new LinkedHashMap<>(onlineTemplateMap.size());
        for (String templateId : templateIds) {
            TemplateSearchResult searchResult = new TemplateSearchResult();
            // Get grouped
            if (templates.containsKey(templateId)) {
                searchResult = templates.get(templateId);
            }
            // A list of properties grouped by templateId
            for (OnlineTemplateDto dto : onlineTemplateMap.get(templateId)) {
                searchResult.setTemplateId(dto.getTemplateId());
                searchResult.setTemplateName(dto.getTemplateName());
                if (dto.getPropertyType()
                    .equals(TemplatePropertyType.CATEGORY.getType())) {
                    searchResult.setCategoryName(dto.getPropertyName());
                    searchResult.setCategoryCode(dto.getPropertyCode());
                }
                if (dto.getPropertyType()
                    .equals(TemplatePropertyType.TAG.getType())) {
                    List<String> tags = searchResult.getTags() != null
                        ? searchResult.getTags() : new ArrayList<>();
                    tags.add(dto.getPropertyName());
                    searchResult.setTags(tags);
                }
            }
            templates.put(templateId, searchResult);
        }
        return new ArrayList<>(templates.values());
    }

    /**
     * Global Search Template.
     *
     * @param lang      lang
     * @param keyword   keyword
     * @param className className
     * @return TemplateSearchDTO
     */
    @Override
    public TemplateSearchDTO globalSearchTemplate(final String lang,
                                                  final String keyword, final String className) {
        TemplateSearchDTO result = new TemplateSearchDTO();
        // search template
        List<TemplateSearchResult> templates =
            this.searchTemplate(keyword, lang);
        List<String> originTemplateNames = new ArrayList<>(templates.size());
        Set<String> originTagNames = new HashSet<>();
        // replace style of keyword
        templates.forEach(template -> {
            originTemplateNames.add(template.getTemplateName());
            template.setTemplateName(InformationUtil.keywordHighlight(
                template.getTemplateName(), keyword, className));
            if (template.getTags() != null) {
                List<String> tags = new ArrayList<>(template.getTags().size());
                for (String tag : template.getTags()) {
                    originTagNames.add(tag);
                    tags.add(InformationUtil.keywordHighlight(tag, keyword,
                        className));
                }
                template.setTags(tags);
            }
        });
        result.setTemplates(templates);
        result.setTemplateNames(originTemplateNames);
        result.setTagNames(originTagNames);

        // search template album
        List<AlbumVo> albumVos =
            iTemplateAlbumService.searchAlbums(lang, keyword);
        if (albumVos.isEmpty()) {
            return result;
        }
        List<String> albumNames = new ArrayList<>(albumVos.size());
        albumVos.forEach(album -> {
            albumNames.add(album.getName());
            album.setName(InformationUtil.keywordHighlight(album.getName(),
                keyword, className));
        });
        result.setAlbums(albumVos);
        result.setAlbumNames(albumNames);
        return result;
    }

    /**
     * Get Node Ids.
     *
     * @param templateId templateId
     * @return NodeIds
     */
    @Override
    public List<String> getNodeIdsByTemplateId(final String templateId) {
        // Query the node ID of the template map
        String nodeId = baseMapper.selectNodeIdByTempId(templateId);
        ExceptionUtil.isNotBlank(nodeId, TemplateException.TEMPLATE_INFO_ERROR);
        return iNodeService.getNodeIdsInNodeTree(nodeId, -1);
    }

    private void complementCategoryInfo(
        final String categoryCode,
        final String templateId,
        final TemplateDirectoryVo vo,
        final String lang
    ) {
        String val =
            templateConfigCacheService.getCategoriesListConfigCacheByLang(lang);
        if (val == null) {
            return;
        }
        List<CategoryDto> dtoList =
            JSONUtil.parseArray(val).toList(CategoryDto.class);
        for (CategoryDto category : dtoList) {
            // If the template is not under the category, skip it
            if (!category.getTemplateIds().contains(templateId)) {
                continue;
            }
            // Priority is given to
            // the information of the specified classification code
            if (category.getCategoryCode().equals(categoryCode)) {
                vo.setCategoryCode(categoryCode);
                vo.setCategoryName(category.getCategoryName());
                return;
            }
            // Then take the information of the first category
            if (vo.getCategoryName() == null) {
                vo.setCategoryCode(category.getCategoryCode());
                vo.setCategoryName(category.getCategoryName());
                // No classification code, return directly
                if (StrUtil.isBlank(categoryCode)) {
                    return;
                }
            }
        }
    }

    /**
     * Verify that the number of templates has reached the limit.
     *
     * @param spaceId spaceId
     */
    private void verifyNumberLimit(final String spaceId) {
        int count = SqlTool.retCount(baseMapper.countByTypeId(spaceId));
        ExceptionUtil.isTrue(count < limitProperties.getTemplateMaxCount(),
            TemplateException.NUMBER_LIMIT);
    }
}
