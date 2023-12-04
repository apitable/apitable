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

import static com.apitable.shared.constants.NodeDescConstants.FORM_DESC_DESCRIPTION_CHILDREN_PREFIX;
import static com.apitable.shared.constants.NodeDescConstants.FORM_DESC_DESCRIPTION_CHILDREN_RAW_PREFIX;
import static com.apitable.shared.constants.NodeDescConstants.FORM_DESC_DESCRIPTION_CHILDREN_TEXT_PREFIX;
import static com.apitable.shared.constants.NodeDescConstants.FORM_DESC_DESCRIPTION_PREFIX;

import cn.hutool.core.collection.CollUtil;
import cn.hutool.core.util.ReUtil;
import cn.hutool.core.util.StrUtil;
import cn.hutool.http.HtmlUtil;
import cn.hutool.json.JSONArray;
import cn.hutool.json.JSONUtil;
import com.apitable.base.enums.DatabaseException;
import com.apitable.core.exception.BusinessException;
import com.apitable.core.util.ExceptionUtil;
import com.apitable.shared.constants.NodeDescConstants;
import com.apitable.shared.util.IdUtil;
import com.apitable.widget.service.IWidgetService;
import com.apitable.workspace.dto.DashboardMeta;
import com.apitable.workspace.dto.DatasheetWidgetDTO;
import com.apitable.workspace.dto.NodeDescParseDTO;
import com.apitable.workspace.entity.ResourceMetaEntity;
import com.apitable.workspace.enums.ResourceType;
import com.apitable.workspace.mapper.DatasheetWidgetMapper;
import com.apitable.workspace.mapper.ResourceMetaMapper;
import com.apitable.workspace.service.IDatasheetService;
import com.apitable.workspace.service.IResourceMetaService;
import com.baomidou.mybatisplus.core.toolkit.IdWorker;
import com.baomidou.mybatisplus.extension.toolkit.SqlHelper;
import jakarta.annotation.Resource;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * resource meta service implementation.
 */
@Slf4j
@Service
public class ResourceMetaServiceImpl implements IResourceMetaService {

    @Resource
    private ResourceMetaMapper resourceMetaMapper;

    @Resource
    private IDatasheetService iDatasheetService;

    @Resource
    private DatasheetWidgetMapper datasheetWidgetMapper;

    @Resource
    private IWidgetService iWidgetService;

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void copyBatch(Long userId, Collection<String> originResourceId,
                          Map<String, String> newResourceMap) {
        log.info("batch copy resource metadata，userId:{},originResourceId:{},newResourceMap:{}",
            userId, originResourceId, newResourceMap);
        List<ResourceMetaEntity> entities =
            resourceMetaMapper.selectByResourceIds(originResourceId);
        if (CollUtil.isEmpty(entities)) {
            return;
        }
        List<ResourceMetaEntity> insertEntities = new ArrayList<>(entities.size());
        for (ResourceMetaEntity entity : entities) {
            ResourceMetaEntity resourceMeta = ResourceMetaEntity.builder()
                .id(IdWorker.getId())
                .resourceId(newResourceMap.get(entity.getResourceId()))
                .resourceType(entity.getResourceType())
                .metaData(entity.getMetaData())
                .createdBy(userId)
                .updatedBy(userId)
                .build();
            insertEntities.add(resourceMeta);
        }
        boolean flag = SqlHelper.retBool(resourceMetaMapper.insertBatch(insertEntities));
        ExceptionUtil.isTrue(flag, DatabaseException.INSERT_ERROR);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void create(Long userId, String resourceId, Integer resourceType, String metaData) {
        log.info("create resource metadata，userId:{},resourceId:{},resourceType:{},metaData:{}",
            userId, resourceId, resourceType, metaData);
        ResourceMetaEntity entity = ResourceMetaEntity.builder()
            .id(IdWorker.getId())
            .resourceId(resourceId)
            .resourceType(resourceType)
            .metaData(metaData)
            .createdBy(userId)
            .updatedBy(userId)
            .build();
        boolean flag =
            SqlHelper.retBool(resourceMetaMapper.insertBatch(Collections.singletonList(entity)));
        ExceptionUtil.isTrue(flag, DatabaseException.INSERT_ERROR);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void copyResourceMeta(Long userId, String spaceId, String originRscId, String destRscId,
                                 ResourceType type) {
        log.info("[{}] copy metadata configuration of resource [{}] to new resource [{}]", userId,
            originRscId, destRscId);
        String metaData = resourceMetaMapper.selectMetaDataByResourceId(originRscId);
        Map<String, String> newWidgetIdMap = new HashMap<>(8);
        // assemble new resource metadata
        String meta = this.generateResourceMeta(metaData, newWidgetIdMap, type);
        // save new resource metadata
        this.create(userId, destRscId, type.getValue(), meta);
        if (newWidgetIdMap.isEmpty()) {
            return;
        }
        // Query table component association information
        List<DatasheetWidgetDTO> datasheetWidgetDTOList =
            datasheetWidgetMapper.selectDtoByWidgetIds(newWidgetIdMap.keySet());
        Map<String, DatasheetWidgetDTO> newWidgetIdToDstIdMap = datasheetWidgetDTOList.stream()
            .collect(Collectors.toMap(dto -> newWidgetIdMap.get(dto.getWidgetId()),
                dto -> new DatasheetWidgetDTO(dto.getDstId(),
                    type == ResourceType.DASHBOARD ? dto.getSourceId() : destRscId)));
        // batch generation of new components
        Map<String, String> newNodeMap = new HashMap<>(1);
        newNodeMap.put(originRscId, destRscId);
        iWidgetService.copyBatch(userId, spaceId, newNodeMap, newWidgetIdMap,
            newWidgetIdToDstIdMap);
    }

    @Override
    public void batchCopyResourceMeta(Long userId, String spaceId, List<String> originRscIds,
                                      Map<String, String> newNodeMap, ResourceType type) {
        List<ResourceMetaEntity> entities = resourceMetaMapper.selectByResourceIds(originRscIds);
        if (CollUtil.isEmpty(entities)) {
            return;
        }
        Map<String, String> newWidgetIdMap = new HashMap<>(8);
        List<ResourceMetaEntity> insertEntities = new ArrayList<>(entities.size());
        for (ResourceMetaEntity entity : entities) {
            // assemble new resource metadata
            String meta = this.generateResourceMeta(entity.getMetaData(), newWidgetIdMap, type);
            ResourceMetaEntity resourceMeta = ResourceMetaEntity.builder()
                .id(IdWorker.getId())
                .resourceId(newNodeMap.get(entity.getResourceId()))
                .resourceType(entity.getResourceType())
                .metaData(meta)
                .createdBy(userId)
                .updatedBy(userId)
                .build();
            insertEntities.add(resourceMeta);
        }
        // save new dashboard resource metadata
        boolean flag = SqlHelper.retBool(resourceMetaMapper.insertBatch(insertEntities));
        ExceptionUtil.isTrue(flag, DatabaseException.INSERT_ERROR);

        if (newWidgetIdMap.isEmpty()) {
            return;
        }
        // Query number table component association information
        List<DatasheetWidgetDTO> datasheetWidgetDTOList =
            datasheetWidgetMapper.selectDtoByWidgetIds(newWidgetIdMap.keySet());
        // The data source number table is also listed in the dump, and the new reference relationship with the component is retained.
        Map<String, DatasheetWidgetDTO> newWidgetIdToDstMap = datasheetWidgetDTOList.stream()
            .filter(dto -> newNodeMap.containsKey(dto.getDstId()))
            .collect(Collectors.toMap(dto -> newWidgetIdMap.get(dto.getWidgetId()), dto -> {
                String dstId = newNodeMap.get(dto.getDstId());
                String sourceId = newNodeMap.getOrDefault(dto.getSourceId(), dstId);
                return new DatasheetWidgetDTO(dstId, sourceId);
            }));

        // batch generation of new components
        iWidgetService.copyBatch(userId, spaceId, newNodeMap, newWidgetIdMap, newWidgetIdToDstMap);
    }

    @Override
    public NodeDescParseDTO parseFormDescByFormId(String formId) {
        List<String> content = new ArrayList<>();
        List<String> imageUrl = new ArrayList<>();
        String metaStr = resourceMetaMapper.selectMetaDataByResourceId(formId);
        Object descObj = JSONUtil.getByPath(JSONUtil.parse(metaStr), FORM_DESC_DESCRIPTION_PREFIX);
        if (null == descObj) {
            return NodeDescParseDTO.builder().content(content).imageUrl(imageUrl).build();
        }
        JSONUtil.parseArray(descObj).forEach(i -> {
            Object childObj =
                JSONUtil.getByPath(JSONUtil.parse(i), FORM_DESC_DESCRIPTION_CHILDREN_PREFIX);
            if (null != childObj) {
                JSONUtil.parseArray(childObj).forEach(item -> {
                    Object text = JSONUtil.getByPath(JSONUtil.parse(item),
                        FORM_DESC_DESCRIPTION_CHILDREN_TEXT_PREFIX);
                    if (text instanceof String) {
                        String reStr = HtmlUtil.escape(
                            ReUtil.replaceAll(text.toString(),
                                NodeDescConstants.DESC_JSON_DATA_ESCAPE_RE, " "));
                        if (StrUtil.isNotBlank(reStr)) {
                            content.add(reStr);
                        }
                    }
                    Object raw = JSONUtil.getByPath(JSONUtil.parse(item),
                        FORM_DESC_DESCRIPTION_CHILDREN_RAW_PREFIX);
                    if (raw instanceof String) {
                        String reStr = HtmlUtil.escape(
                            ReUtil.replaceAll(raw.toString(),
                                NodeDescConstants.DESC_JSON_DATA_ESCAPE_RE, " "));
                        if (StrUtil.isNotBlank(reStr)) {
                            content.add(reStr);
                        }
                    }
                });
            }
        });
        return NodeDescParseDTO.builder().content(content).imageUrl(imageUrl).build();
    }

    private String parseDashboardMeta(String metaData, Map<String, String> newWidgetIdMap) {
        // Parse meta to get a list of component IDs
        DashboardMeta meta = JSONUtil.toBean(metaData, DashboardMeta.class);
        if (meta == null || meta.getLayout() == null || meta.getLayout().isEmpty()) {
            return JSONUtil.createObj().toString();
        }
        // build new layout object, and record old to new widget id mapping
        JSONArray layout = new JSONArray(meta.getLayout().size());
        meta.getLayout().jsonIter().forEach(info -> {
            String widgetId = IdUtil.createWidgetId();
            newWidgetIdMap.put(info.getStr("id"), widgetId);
            info.set("id", widgetId);
            layout.put(info);
        });
        meta.setLayout(layout);
        return JSONUtil.parseObj(meta).toString();
    }

    private String generateResourceMeta(String metaData, Map<String, String> newWidgetIdMap,
                                        ResourceType type) {
        String meta;
        switch (type) {
            case DASHBOARD:
                // parsing dashboard metadata
                meta = this.parseDashboardMeta(metaData, newWidgetIdMap);
                break;
            case MIRROR:
                JSONArray panels = JSONUtil.isTypeJSONObject(metaData)
                    ? JSONUtil.parseObj(metaData).getJSONArray("widgetPanels") : null;
                JSONArray widgetPanels =
                    iDatasheetService.generateWidgetPanels(panels, newWidgetIdMap);
                meta = widgetPanels.isEmpty() ? JSONUtil.createObj().toString() :
                    JSONUtil.createObj().set("widgetPanels", widgetPanels).toString();
                break;
            default:
                throw new BusinessException("Types of resources that have not yet been processed.");
        }
        return meta;
    }
}
