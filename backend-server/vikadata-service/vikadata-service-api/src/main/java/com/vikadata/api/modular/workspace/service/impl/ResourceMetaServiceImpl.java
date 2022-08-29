package com.vikadata.api.modular.workspace.service.impl;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import javax.annotation.Resource;

import cn.hutool.core.collection.CollUtil;
import cn.hutool.core.util.ReUtil;
import cn.hutool.core.util.StrUtil;
import cn.hutool.http.HtmlUtil;
import cn.hutool.json.JSONArray;
import cn.hutool.json.JSONUtil;
import com.baomidou.mybatisplus.core.toolkit.IdWorker;
import com.baomidou.mybatisplus.extension.toolkit.SqlHelper;
import lombok.extern.slf4j.Slf4j;

import com.vikadata.api.constants.NodeDescConstants;
import com.vikadata.api.enums.exception.DatabaseException;
import com.vikadata.api.enums.workbench.ResourceType;
import com.vikadata.api.model.dto.node.NodeDescParseDTO;
import com.vikadata.api.model.dto.widget.DatasheetWidgetDTO;
import com.vikadata.api.modular.workspace.mapper.DatasheetWidgetMapper;
import com.vikadata.api.modular.workspace.mapper.ResourceMetaMapper;
import com.vikadata.api.modular.workspace.model.DashboardMeta;
import com.vikadata.api.modular.workspace.service.IDatasheetService;
import com.vikadata.api.modular.workspace.service.IResourceMetaService;
import com.vikadata.api.modular.workspace.service.IWidgetService;
import com.vikadata.api.util.IdUtil;
import com.vikadata.core.exception.BusinessException;
import com.vikadata.core.util.ExceptionUtil;
import com.vikadata.entity.ResourceMetaEntity;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import static com.vikadata.api.constants.NodeDescConstants.FORM_DESC_DESCRIPTION_CHILDREN_PREFIX;
import static com.vikadata.api.constants.NodeDescConstants.FORM_DESC_DESCRIPTION_CHILDREN_RAW_PREFIX;
import static com.vikadata.api.constants.NodeDescConstants.FORM_DESC_DESCRIPTION_CHILDREN_TEXT_PREFIX;
import static com.vikadata.api.constants.NodeDescConstants.FORM_DESC_DESCRIPTION_PREFIX;

/**
 * <p>
 * 资源元数据 服务实现类
 * </p>
 *
 * @author Chambers
 * @date 2020/12/18
 */
@Slf4j
@Service
public class ResourceMetaServiceImpl implements IResourceMetaService {

    @Resource
    private ResourceMetaMapper resourceMetaMapper;

    @Resource
    private IDatasheetService iDatasheetService;

    @Resource
    private IWidgetService iWidgetService;

    @Resource
    private DatasheetWidgetMapper datasheetWidgetMapper;

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void copyBatch(Long userId, Collection<String> originResourceId, Map<String, String> newResourceMap) {
        log.info("批量复制资源元数据，userId:{},originResourceId:{},newResourceMap:{}", userId, originResourceId, newResourceMap);
        List<ResourceMetaEntity> entities = resourceMetaMapper.selectByResourceIds(originResourceId);
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
        log.info("创建资源元数据，userId:{},resourceId:{},resourceType:{},metaData:{}", userId, resourceId, resourceType, metaData);
        ResourceMetaEntity entity = ResourceMetaEntity.builder()
                .id(IdWorker.getId())
                .resourceId(resourceId)
                .resourceType(resourceType)
                .metaData(metaData)
                .createdBy(userId)
                .updatedBy(userId)
                .build();
        boolean flag = SqlHelper.retBool(resourceMetaMapper.insertBatch(Collections.singletonList(entity)));
        ExceptionUtil.isTrue(flag, DatabaseException.INSERT_ERROR);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void copyResourceMeta(Long userId, String spaceId, String originRscId, String destRscId, ResourceType type) {
        log.info("「{}」复制资源「{}」的元数据配置到新资源「{}」", userId, originRscId, destRscId);
        String metaData = resourceMetaMapper.selectMetaDataByResourceId(originRscId);
        Map<String, String> newWidgetIdMap = new HashMap<>(8);
        // 组装新的资源元数据
        String meta = this.generateResourceMeta(metaData, newWidgetIdMap, type);
        // 保存新的资源元数据
        this.create(userId, destRscId, type.getValue(), meta);
        if (newWidgetIdMap.size() == 0) {
            return;
        }
        // 查询数表组件关联信息
        List<DatasheetWidgetDTO> datasheetWidgetDTOList = datasheetWidgetMapper.selectDtoByWidgetIds(newWidgetIdMap.keySet());
        Map<String, DatasheetWidgetDTO> newWidgetIdToDstIdMap = datasheetWidgetDTOList.stream()
                .collect(Collectors.toMap(dto -> newWidgetIdMap.get(dto.getWidgetId()),
                        dto -> new DatasheetWidgetDTO(dto.getDstId(), type == ResourceType.DASHBOARD ? dto.getSourceId() : destRscId)));
        // 批量生成新的组件
        Map<String, String> newNodeMap = new HashMap<>(1);
        newNodeMap.put(originRscId, destRscId);
        iWidgetService.copyBatch(userId, spaceId, newNodeMap, newWidgetIdMap, newWidgetIdToDstIdMap);
    }

    @Override
    public void batchCopyResourceMeta(Long userId, String spaceId, List<String> originRscIds, Map<String, String> newNodeMap, ResourceType type) {
        log.info("「{}」批量复制资源「{}」的元数据", userId, originRscIds);
        List<ResourceMetaEntity> entities = resourceMetaMapper.selectByResourceIds(originRscIds);
        if (CollUtil.isEmpty(entities)) {
            return;
        }
        Map<String, String> newWidgetIdMap = new HashMap<>(8);
        List<ResourceMetaEntity> insertEntities = new ArrayList<>(entities.size());
        for (ResourceMetaEntity entity : entities) {
            // 组装新的资源元数据
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
        // 保存新的仪表盘资源元数据
        boolean flag = SqlHelper.retBool(resourceMetaMapper.insertBatch(insertEntities));
        ExceptionUtil.isTrue(flag, DatabaseException.INSERT_ERROR);

        if (newWidgetIdMap.size() == 0) {
            return;
        }
        // 查询数表组件关联信息
        List<DatasheetWidgetDTO> datasheetWidgetDTOList = datasheetWidgetMapper.selectDtoByWidgetIds(newWidgetIdMap.keySet());
        // 数据源数表也在转存之列的，才保留与组件构成新的引用关系
        Map<String, DatasheetWidgetDTO> newWidgetIdToDstMap = datasheetWidgetDTOList.stream()
                .filter(dto -> newNodeMap.containsKey(dto.getDstId()))
                .collect(Collectors.toMap(dto -> newWidgetIdMap.get(dto.getWidgetId()), dto -> {
                    String dstId = newNodeMap.get(dto.getDstId());
                    String sourceId = newNodeMap.getOrDefault(dto.getSourceId(), dstId);
                    return new DatasheetWidgetDTO(dstId, sourceId);
                }));

        // 批量生成新的组件
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
            Object childObj = JSONUtil.getByPath(JSONUtil.parse(i), FORM_DESC_DESCRIPTION_CHILDREN_PREFIX);
            if (null != childObj) {
                JSONUtil.parseArray(childObj).forEach(item -> {
                    Object text = JSONUtil.getByPath(JSONUtil.parse(item), FORM_DESC_DESCRIPTION_CHILDREN_TEXT_PREFIX);
                    if (text instanceof String) {
                        String reStr = HtmlUtil.escape(
                                ReUtil.replaceAll(text.toString(), NodeDescConstants.DESC_JSON_DATA_ESCAPE_RE, " "));
                        if (StrUtil.isNotBlank(reStr)) {
                            content.add(reStr);
                        }
                    }
                    Object raw = JSONUtil.getByPath(JSONUtil.parse(item), FORM_DESC_DESCRIPTION_CHILDREN_RAW_PREFIX);
                    if (raw instanceof String) {
                        String reStr = HtmlUtil.escape(
                                ReUtil.replaceAll(raw.toString(), NodeDescConstants.DESC_JSON_DATA_ESCAPE_RE, " "));
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
        // 解析 meta，获取组件ID 列表
        DashboardMeta meta = JSONUtil.toBean(metaData, DashboardMeta.class);
        // 不存在组件，直接创建初始配置
        if (meta == null || CollUtil.isEmpty(meta.getInstallWidgetIds())) {
            return JSONUtil.createObj().toString();
        }
        // 记录旧组件ID 与新组件ID 映射
        Map<String, String> widgetIdMap = meta.getInstallWidgetIds().stream()
                .collect(Collectors.toMap(k -> k, v -> IdUtil.createWidgetId()));
        newWidgetIdMap.putAll(widgetIdMap);
        JSONArray layout = new JSONArray(widgetIdMap.size());
        meta.getLayout().jsonIter().forEach(info -> {
            // 替换组件布局中的旧组件ID
            info.set("id", widgetIdMap.get(info.getStr("id")));
            layout.put(info);
        });
        meta.setLayout(layout);
        meta.setInstallWidgetIds(widgetIdMap.values());
        return JSONUtil.parseObj(meta).toString();
    }

    private String generateResourceMeta(String metaData, Map<String, String> newWidgetIdMap, ResourceType type) {
        String meta;
        switch (type) {
            case DASHBOARD:
                // 解析仪表盘元数据
                meta = this.parseDashboardMeta(metaData, newWidgetIdMap);
                break;
            case MIRROR:
                JSONArray panels = JSONUtil.isJsonObj(metaData) ? JSONUtil.parseObj(metaData).getJSONArray("widgetPanels") : null;
                JSONArray widgetPanels = iDatasheetService.generateWidgetPanels(panels, newWidgetIdMap);
                meta = widgetPanels.size() == 0 ? JSONUtil.createObj().toString() : JSONUtil.createObj().set("widgetPanels", widgetPanels).toString();
                break;
            default:
                throw new BusinessException("尚未处理的资源类型");
        }
        return meta;
    }
}
