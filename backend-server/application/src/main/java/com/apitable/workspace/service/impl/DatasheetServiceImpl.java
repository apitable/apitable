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

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.function.Predicate;
import java.util.stream.Collectors;

import javax.annotation.Resource;

import cn.hutool.core.collection.CollUtil;
import cn.hutool.core.collection.ListUtil;
import cn.hutool.core.convert.Convert;
import cn.hutool.core.date.DatePattern;
import cn.hutool.core.date.DateTime;
import cn.hutool.core.date.DateUtil;
import cn.hutool.core.map.MapUtil;
import cn.hutool.core.util.BooleanUtil;
import cn.hutool.core.util.NumberUtil;
import cn.hutool.core.util.ObjectUtil;
import cn.hutool.core.util.StrUtil;
import cn.hutool.http.HtmlUtil;
import cn.hutool.json.JSONArray;
import cn.hutool.json.JSONObject;
import cn.hutool.json.JSONUtil;
import com.apitable.base.enums.DatabaseException;
import com.apitable.base.enums.ParameterException;
import com.apitable.control.infrastructure.ControlTemplate;
import com.apitable.control.infrastructure.permission.NodePermission;
import com.apitable.core.exception.BusinessException;
import com.apitable.core.util.ExceptionUtil;
import com.apitable.interfaces.social.event.NotificationEvent;
import com.apitable.interfaces.social.facade.SocialServiceFacade;
import com.apitable.interfaces.social.model.SocialConnectInfo;
import com.apitable.internal.dto.SimpleDatasheetMetaDTO;
import com.apitable.organization.entity.TeamMemberRelEntity;
import com.apitable.organization.entity.UnitEntity;
import com.apitable.organization.enums.UnitType;
import com.apitable.organization.mapper.MemberMapper;
import com.apitable.organization.mapper.TeamMemberRelMapper;
import com.apitable.organization.mapper.UnitMapper;
import com.apitable.organization.service.IRoleService;
import com.apitable.player.ro.NotificationCreateRo;
import com.apitable.player.service.IPlayerNotificationService;
import com.apitable.shared.cache.service.UserSpaceRemindRecordCacheService;
import com.apitable.shared.component.notification.NotificationTemplateId;
import com.apitable.shared.config.properties.LimitProperties;
import com.apitable.shared.sysconfig.i18n.I18nStringsUtil;
import com.apitable.shared.util.IdUtil;
import com.apitable.starter.beetl.autoconfigure.BeetlTemplate;
import com.apitable.user.mapper.UserMapper;
import com.apitable.widget.service.IWidgetService;
import com.apitable.workspace.dto.DataSheetRecordDTO;
import com.apitable.workspace.dto.DatasheetMetaDTO;
import com.apitable.workspace.dto.DatasheetWidgetDTO;
import com.apitable.workspace.dto.NodeCopyDTO;
import com.apitable.workspace.dto.NodeCopyOptions;
import com.apitable.workspace.dto.SnapshotDTO;
import com.apitable.workspace.entity.DatasheetEntity;
import com.apitable.workspace.entity.DatasheetRecordEntity;
import com.apitable.workspace.enums.CellType;
import com.apitable.workspace.enums.DataSheetException;
import com.apitable.workspace.enums.DateFormat;
import com.apitable.workspace.enums.FieldType;
import com.apitable.workspace.enums.NodeException;
import com.apitable.workspace.enums.TimeFormat;
import com.apitable.workspace.mapper.DatasheetMapper;
import com.apitable.workspace.mapper.DatasheetMetaMapper;
import com.apitable.workspace.mapper.DatasheetRecordMapper;
import com.apitable.workspace.mapper.NodeMapper;
import com.apitable.workspace.observer.DatasheetRemindObserver;
import com.apitable.workspace.observer.RemindMemberOpSubject;
import com.apitable.workspace.observer.remind.MailRemind;
import com.apitable.workspace.observer.remind.NotifyDataSheetMeta;
import com.apitable.workspace.observer.remind.RemindType;
import com.apitable.workspace.ro.DateFieldProperty;
import com.apitable.workspace.ro.FieldMapRo;
import com.apitable.workspace.ro.LinkFieldProperty;
import com.apitable.workspace.ro.MetaMapRo;
import com.apitable.workspace.ro.MetaOpRo;
import com.apitable.workspace.ro.RecordMapRo;
import com.apitable.workspace.ro.RemindMemberRo;
import com.apitable.workspace.ro.SnapshotMapRo;
import com.apitable.workspace.ro.ViewMapRo;
import com.apitable.workspace.service.IDatasheetMetaService;
import com.apitable.workspace.service.IDatasheetRecordService;
import com.apitable.workspace.service.IDatasheetService;
import com.apitable.workspace.vo.DatasheetRecordMapVo;
import com.apitable.workspace.vo.DatasheetRecordVo;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.baomidou.mybatisplus.extension.toolkit.SqlHelper;
import lombok.extern.slf4j.Slf4j;

import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import static com.apitable.shared.constants.NotificationConstants.BODY_EXTRAS;
import static java.util.stream.Collectors.toList;

@Service
@Slf4j
public class DatasheetServiceImpl extends ServiceImpl<DatasheetMapper, DatasheetEntity> implements IDatasheetService {

    @Resource
    private IDatasheetMetaService datasheetMetaService;

    @Resource
    private IDatasheetMetaService iDatasheetMetaService;

    @Resource
    private DatasheetMetaMapper datasheetMetaMapper;

    @Resource
    private IDatasheetRecordService datasheetRecordService;

    @Resource
    private DatasheetRecordMapper datasheetRecordMapper;

    @Resource
    private MemberMapper memberMapper;

    @Resource
    private BeetlTemplate beetlTemplate;

    @Resource
    private ControlTemplate controlTemplate;

    @Resource
    private UserMapper userMapper;

    @Resource
    private NodeMapper nodeMapper;

    @Resource
    private UnitMapper unitMapper;

    @Resource
    private TeamMemberRelMapper teamMemberRelMapper;

    @Resource
    private UserSpaceRemindRecordCacheService userSpaceRemindRecordCacheService;

    @Resource
    private IPlayerNotificationService playerNotificationService;

    @Resource
    private LimitProperties limitProperties;

    @Resource
    private Map<String, DatasheetRemindObserver> datasheetRemindObservers;

    @Resource
    private IRoleService iRoleService;

    @Resource
    private SocialServiceFacade socialServiceFacade;

    @Resource
    private IWidgetService iWidgetService;

    @Override
    public void batchSave(List<DatasheetEntity> entities) {
        if (CollUtil.isEmpty(entities)) {
            return;
        }
        baseMapper.insertBatch(entities);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void create(String spaceId, String dstId, String dstName, Long creator) {
        log.info("Create datasheet");
        DatasheetEntity datasheet = DatasheetEntity.builder()
                .spaceId(spaceId)
                .nodeId(dstId)
                .dstId(dstId)
                .dstName(dstName)
                .createdBy(creator)
                .updatedBy(creator)
                .build();
        boolean flag = this.save(datasheet);
        ExceptionUtil.isTrue(flag, DataSheetException.CREATE_FAIL);
        // Initialize datasheet information
        SnapshotMapRo snapshot = initialize();
        // Save Meta information
        datasheetMetaService.create(creator, datasheet.getDstId(), JSONUtil.parseObj(snapshot.getMeta()).toString());
        // Save record information
        datasheetRecordService.saveBatch(creator, snapshot.getRecordMap(), datasheet.getDstId());
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void create(Long userId, String spaceId, String nodeId, String name, MetaMapRo metaMapRo, JSONObject recordMap) {
        DatasheetEntity datasheet = DatasheetEntity.builder()
                .dstName(name)
                .dstId(nodeId)
                .nodeId(nodeId)
                .spaceId(spaceId)
                .build();
        // Save Meta information
        datasheetMetaService.create(userId, datasheet.getDstId(), JSONUtil.parseObj(metaMapRo).toString());
        if (recordMap.size() > 0) {
            // Save record information
            datasheetRecordService.saveBatch(userId, recordMap, datasheet.getDstId());
        }

        boolean flag = this.save(datasheet);
        ExceptionUtil.isTrue(flag, DatabaseException.INSERT_ERROR);
    }

    @Override
    public void updateDstName(Long userId, String dstId, String dstName) {
        ExceptionUtil.isTrue(StrUtil.isNotBlank(dstId) && StrUtil.isNotBlank(dstName), ParameterException.INCORRECT_ARG);
        log.info("Edit datasheet name");
        boolean flag = SqlHelper.retBool(baseMapper.updateNameByDstId(userId, dstId, dstName));
        ExceptionUtil.isTrue(flag, DatabaseException.EDIT_ERROR);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void updateIsDeletedStatus(Long userId, List<String> nodeIds, Boolean isDel) {
        log.info("Change the logical deletion status of the datasheet and meta");
        baseMapper.updateIsDeletedByNodeIds(userId, nodeIds, isDel);
        datasheetMetaMapper.updateIsDeletedByNodeId(userId, nodeIds, isDel);
    }

    private SnapshotMapRo initialize() {
        // get language
        Locale currentLang = LocaleContextHolder.getLocale();
        // call the template to get the snapshot
        Map<String, Object> metaMap = MapUtil.newHashMap();

        int initLength = 4;
        for (int i = 0; i < initLength; i++) {
            String fieldId = IdUtil.createFieldId();
            // template binding dynamic parameters
            metaMap.put("fieldId" + i, fieldId);
            String recordId = IdUtil.createRecordId();
            metaMap.put("recordId" + i, recordId);
        }

        String viewId = IdUtil.createViewId();
        metaMap.put("viewId", viewId);
        // internationalization elements
        // view name
        metaMap.put("defaultView", I18nStringsUtil.t("default_view", currentLang));
        // Datasheet title column
        metaMap.put("defaultDatasheetTitle", I18nStringsUtil.t("default_datasheet_title", currentLang));
        // Datasheet options column
        metaMap.put("defaultDatasheetOptions", I18nStringsUtil.t("default_datasheet_options", currentLang));
        // Datasheet attachments column
        metaMap.put("defaultDatasheetAttachments", I18nStringsUtil.t("default_datasheet_attachments", currentLang));
        // internationalization elements
        String snapshotJson = beetlTemplate.render("datasheet/datasheet-meta-blank-tpl.btl", metaMap);
        return new JSONObject(snapshotJson).toBean(SnapshotMapRo.class);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public List<String> copy(Long userId, String spaceId, String sourceDstId, String destDstId, String destDstName,
            NodeCopyOptions options, Map<String, String> newNodeMap) {
        log.info("Copy datasheet");
        // Copy the datasheet, meta, and record.
        DatasheetEntity datasheet = DatasheetEntity.builder()
                .dstName(destDstName)
                .dstId(destDstId)
                .nodeId(destDstId)
                .spaceId(spaceId)
                .createdBy(userId)
                .updatedBy(userId)
                .build();
        this.save(datasheet);
        // handle metaData
        NodeCopyDTO nodeCopyDTO = this.processMeta(userId, spaceId, sourceDstId, destDstId, options, newNodeMap);
        MetaMapRo metaMapRo = nodeCopyDTO.getMetaMapRo();
        // save record
        if (ObjectUtil.isNotNull(options) && options.isCopyData()) {
            datasheetRecordService.copyRecords(userId, sourceDstId, datasheet.getDstId(), nodeCopyDTO, options.isRetainRecordMeta());
        }
        else {
            // Remove the original record id in each view rows and fill in a blank line.
            JSONArray rows = JSONUtil.createArray();
            String recordId = IdUtil.createRecordId();
            JSONObject recordJson = JSONUtil.createObj();
            recordJson.set("recordId", recordId);
            rows.add(recordJson);
            JSONArray views = new JSONArray();
            metaMapRo.getViews().jsonIter().forEach(json -> {
                ViewMapRo viewMapRo = JSONUtil.toBean(json, ViewMapRo.class);
                viewMapRo.setRows(rows);
                views.add(viewMapRo);
            });
            metaMapRo.setViews(views);
            // save record information
            JSONObject recordMap = JSONUtil.createObj();
            // Supplement the self-increasing field data in this row.
            RecordMapRo recordMapRo = RecordMapRo.builder().id(recordId).data(JSONUtil.createObj()).build();
            if (!nodeCopyDTO.getAutoNumberFieldIds().isEmpty()) {
                JSONObject fieldUpdatedMap = JSONUtil.createObj();
                JSONObject autoNumber = JSONUtil.createObj();
                autoNumber.set("autoNumber", 1);
                for (String fieldId : nodeCopyDTO.getAutoNumberFieldIds()) {
                    fieldUpdatedMap.set(fieldId, autoNumber);
                }
                recordMapRo.setFieldUpdatedMap(fieldUpdatedMap);
            }
            recordMap.set(recordId, recordMapRo);
            datasheetRecordService.saveBatch(userId, recordMap, datasheet.getDstId());
        }
        // Save Meta information
        datasheetMetaService.create(userId, datasheet.getDstId(), JSONUtil.parseObj(metaMapRo).toString());
        return nodeCopyDTO.getLinkFieldIds();
    }

    private NodeCopyDTO processMeta(Long userId, String spaceId, String sourceDstId, String destDstId, NodeCopyOptions options, Map<String, String> newNodeMap) {
        List<String> delFieldIds = new ArrayList<>();
        List<String> autoNumberFieldIds = new ArrayList<>();
        // Obtain the information of the original node correspondence datasheet.
        SimpleDatasheetMetaDTO metaVo = datasheetMetaService.findByDstId(sourceDstId);
        MetaMapRo metaMapRo = metaVo.getMeta().toBean(MetaMapRo.class);
        // gets the space id of the original node.
        // If it is inconsistent with the space after replication and storage, you need to clear the data related to the member field.
        String sourceSpaceId = nodeMapper.selectSpaceIdByNodeId(sourceDstId);
        boolean sameSpace = spaceId.equals(sourceSpaceId);
        // start processing
        List<String> delFieldIdsInView = new ArrayList<>();
        List<String> linkFieldIds = new ArrayList<>();
        boolean filterPermissionField = options.isFilterPermissionField() && MapUtil.isNotEmpty(options.getDstPermissionFieldsMap());
        JSONObject fieldMap = JSONUtil.createObj();
        String uuid = userMapper.selectUuidById(userId);
        for (Object field : metaMapRo.getFieldMap().values()) {
            FieldMapRo fieldMapRo = JSONUtil.parseObj(field).toBean(FieldMapRo.class);
            // Determine whether column permissions are enabled for a field in this datasheet.
            if (filterPermissionField) {
                List<String> permissionFieldIds = options.getDstPermissionFieldsMap().get(sourceDstId);
                if (permissionFieldIds != null && permissionFieldIds.contains(fieldMapRo.getId())) {
                    delFieldIds.add(fieldMapRo.getId());
                    delFieldIdsInView.add(fieldMapRo.getId());
                    continue;
                }
            }
            FieldType type = FieldType.create(fieldMapRo.getType());
            switch (type) {
                case LINK:
                    LinkFieldProperty property = fieldMapRo.getProperty().toBean(LinkFieldProperty.class);
                    String foreignDstId = property.getForeignDatasheetId();
                    if (ObjectUtil.isNotNull(newNodeMap) && ObjectUtil.isNotNull(newNodeMap.get(foreignDstId))) {
                        // Determine whether column permissions are enabled for the associated field corresponding to the associated datasheet.
                        if (filterPermissionField) {
                            List<String> permissionFieldIds = options.getDstPermissionFieldsMap().get(foreignDstId);
                            if (permissionFieldIds != null && permissionFieldIds.contains(property.getBrotherFieldId())) {
                                delFieldIds.add(fieldMapRo.getId());
                                delFieldIdsInView.add(fieldMapRo.getId());
                                continue;
                            }
                        }
                        // The associated datasheet is stored together, and the associated datasheet ID is replaced with the copied associated datasheet ID.
                        property.setForeignDatasheetId(newNodeMap.get(foreignDstId));
                    }
                    else if (ObjectUtil.isNotNull(options) && options.isAddColumn()) {
                        // Determine whether the columns of the associated datasheet exceed the limit.
                        SimpleDatasheetMetaDTO meta = datasheetMetaService.findByDstId(foreignDstId);
                        MetaMapRo mapRo = meta.getMeta().toBean(MetaMapRo.class);
                        // Check whether the number of columns in the associated datasheet exceeds the 200 column limit
                        ExceptionUtil.isTrue(mapRo.getFieldMap().size() < limitProperties.getMaxColumnCount(), NodeException.LINK_DATASHEET_COLUMN_EXCEED_LIMIT);
                        // Convert to text, put room-server to modify columns, and fill in data
                        fieldMapRo.setType(FieldType.TEXT.getFieldType());
                        linkFieldIds.add(fieldMapRo.getId());
                        property = null;
                    }
                    else {
                        // The associated datasheet is not saved together. Delete the associated column.
                        delFieldIds.add(fieldMapRo.getId());
                        delFieldIdsInView.add(fieldMapRo.getId());
                        continue;
                    }
                    fieldMapRo.setProperty(JSONUtil.parseObj(property));
                    break;
                case LOOKUP:
                case FORMULA:
                case CREATED_TIME:
                case LAST_MODIFIED_TIME:
                    Object originDstId = fieldMapRo.getProperty().get("datasheetId");
                    if (originDstId != null) {
                        fieldMapRo.getProperty().set("datasheetId", newNodeMap.get(originDstId.toString()));
                    }
                    break;
                case AUTO_NUMBER:
                    autoNumberFieldIds.add(fieldMapRo.getId());
                    originDstId = fieldMapRo.getProperty().get("datasheetId");
                    if (originDstId != null) {
                        fieldMapRo.getProperty().set("datasheetId", newNodeMap.get(originDstId.toString()));
                    }
                    if (!options.isCopyData()) {
                        // When the record data is not copied, a blank line is automatically filled, so the next value of the self-increment field is 2.
                        fieldMapRo.getProperty().set("nextId", 2);
                    }
                    break;
                case MEMBER:
                    if (!sameSpace) {
                        fieldMapRo.getProperty().set("unitIds", new ArrayList<>());
                        delFieldIds.add(fieldMapRo.getId());
                    }
                    break;
                case CREATED_BY:
                case LAST_MODIFIED_BY:
                    originDstId = fieldMapRo.getProperty().get("datasheetId");
                    if (originDstId != null) {
                        fieldMapRo.getProperty().set("datasheetId", newNodeMap.get(originDstId.toString()));
                    }
                    if (!options.isRetainRecordMeta()) {
                        fieldMapRo.getProperty().set("uuids", Collections.singletonList(uuid));
                    }
                    break;
                default:
                    break;
            }
            FieldMapRo fieldMapRo1 = FieldMapRo.builder()
                    .id(fieldMapRo.getId())
                    .name(fieldMapRo.getName())
                    .desc(fieldMapRo.getDesc())
                    .type(fieldMapRo.getType())
                    .property(fieldMapRo.getProperty())
                    .required(fieldMapRo.getRequired())
                    .build();
            fieldMap.set(fieldMapRo.getId(), JSONUtil.parseObj(fieldMapRo1));
        }
        metaMapRo.setFieldMap(fieldMap);
        // If there is a delete column, the corresponding to delete processing is columns in the view.
        this.delViewFieldId(metaMapRo, delFieldIdsInView, delFieldIds);
        // copy panel
        this.copyWidgetPanels(userId, spaceId, destDstId, metaMapRo, newNodeMap);
        return new NodeCopyDTO(metaMapRo, delFieldIds, autoNumberFieldIds, linkFieldIds);
    }

    /**
     * Deletes the view that contains the attribute information of the specified field id
     */
    private void delViewFieldId(MetaMapRo metaMapRo, List<String> delFieldIds, List<String> delFieldIdsInFilter) {
        if (CollUtil.isNotEmpty(delFieldIds) || CollUtil.isNotEmpty(delFieldIdsInFilter)) {
            JSONArray views = JSONUtil.createArray();
            metaMapRo.getViews().jsonIter().forEach(view -> {
                ViewMapRo viewMapRo = JSONUtil.toBean(view, ViewMapRo.class);
                // columns processing
                JSONArray columns = delInfoIfExistFieldId(delFieldIds, viewMapRo.getColumns());
                viewMapRo.setColumns(columns);
                // filterInfo processing
                JSONObject filterInfo = viewMapRo.getFilterInfo();
                if (!JSONUtil.isNull(filterInfo)) {
                    JSONArray array = JSONUtil.parseArray(filterInfo.get("conditions").toString());
                    JSONArray conditions = delInfoIfExistFieldId(delFieldIdsInFilter, array);
                    if (conditions.size() > 0) {
                        filterInfo.set("conditions", conditions);
                        viewMapRo.setFilterInfo(filterInfo);
                    }
                    else {
                        viewMapRo.setFilterInfo(null);
                    }
                }
                // sortInfo processing
                JSONArray sortInfo = delInfoIfExistFieldId(delFieldIds, viewMapRo.getSortInfo());
                viewMapRo.setSortInfo(sortInfo);
                // groupInfo processing
                JSONArray groupInfo = delInfoIfExistFieldId(delFieldIds, viewMapRo.getGroupInfo());
                viewMapRo.setGroupInfo(groupInfo);
                //style processing
                JSONObject style = viewMapRo.getStyle();
                if (!JSONUtil.isNull(style)) {
                    Object object = style.get("coverFieldId");
                    if (object != null && delFieldIds.contains(object.toString())) {
                        style.set("coverFieldId", null);
                        viewMapRo.setStyle(style);
                    }
                    Object object1 = style.get("kanbanFieldId");
                    if (object1 != null && delFieldIds.contains(object1.toString())) {
                        style.set("kanbanFieldId", null);
                        viewMapRo.setStyle(style);
                    }
                    Object object2 = style.get("startFieldId");
                    if (object2 != null && delFieldIds.contains(object2.toString())) {
                        style.set("startFieldId", null);
                        viewMapRo.setStyle(style);
                    }
                    Object object3 = style.get("endFieldId");
                    if (object3 != null && delFieldIds.contains(object3.toString())) {
                        style.set("endFieldId", null);
                        viewMapRo.setStyle(style);
                    }
                    Object object4 = style.get("linkFieldId");
                    if (object4 != null && delFieldIds.contains(object4.toString())) {
                        style.set("linkFieldId", null);
                        viewMapRo.setStyle(style);
                    }
                }
                views.add(viewMapRo);
            });
            metaMapRo.setViews(views);
        }
    }

    /**
     * Deletes the object containing the specified field id from the object array
     */
    private JSONArray delInfoIfExistFieldId(List<String> delFieldIds, JSONArray filterInfo) {
        if (!JSONUtil.isNull(filterInfo)) {
            JSONArray array = JSONUtil.createArray();
            filterInfo.jsonIter().forEach(info -> {
                Object fieldId = info.get("fieldId");
                if (fieldId != null && !delFieldIds.contains(fieldId.toString())) {
                    array.add(info);
                }
            });
            return array;
        }
        return filterInfo;
    }

    /**
     * copy panel
     */
    private void copyWidgetPanels(Long userId, String spaceId, String destDstId, MetaMapRo metaMapRo, Map<String, String> newNodeMap) {
        // construct a new component panel
        Map<String, String> newWidgetIdMap = new HashMap<>(8);
        JSONArray newWidgetPanels = this.generateWidgetPanels(metaMapRo.getWidgetPanels(), newWidgetIdMap);
        if (newWidgetIdMap.isEmpty()) {
            return;
        }

        // Newly Created Component ID-Data Source datasheet ID MAP
        DatasheetWidgetDTO datasheetWidgetDTO = new DatasheetWidgetDTO(destDstId, destDstId);
        Map<String, DatasheetWidgetDTO> newWidgetIdToDstMap = newWidgetIdMap.values().stream()
                .collect(Collectors.toMap(id -> id, id -> datasheetWidgetDTO));

        metaMapRo.setWidgetPanels(newWidgetPanels);
        // batch generation of new components
        iWidgetService.copyBatch(userId, spaceId, newNodeMap, newWidgetIdMap, newWidgetIdToDstMap);
    }

    @Override
    public JSONArray generateWidgetPanels(JSONArray widgetPanels, Map<String, String> newWidgetIdMap) {
        // construct a new component panel
        JSONArray newWidgetPanels = JSONUtil.createArray();
        if (widgetPanels == null || widgetPanels.size() == 0) {
            return newWidgetPanels;
        }
        for (JSONObject widgetPanel : widgetPanels.jsonIter()) {
            JSONArray widgets = widgetPanel.getJSONArray("widgets");
            if (widgets == null || widgets.size() == 0) {
                newWidgetPanels.add(widgetPanel);
                continue;
            }
            // construct new component information
            JSONArray newWidgets = JSONUtil.createArray();
            for (JSONObject widget : widgets.jsonIter()) {
                String widgetId = widget.getStr("id");
                if (widgetId == null) {
                    newWidgets.add(widget);
                    continue;
                }
                // Record the mapping between the old component ID and the new component ID.
                String newWidgetId = IdUtil.createWidgetId();
                newWidgetIdMap.put(widgetId, newWidgetId);
                widget.set("id", newWidgetId);
                newWidgets.add(widget);
            }
            widgetPanel.set("widgets", newWidgets);
            newWidgetPanels.add(widgetPanel);
        }
        return newWidgetPanels;
    }

    @Override
    public Map<String, List<String>> getForeignDstIds(List<String> dstIdList, boolean filter) {
        log.info("Query the associated datasheet ID ");
        List<DatasheetMetaDTO> metaList = iDatasheetMetaService.findMetaDtoByDstIds(dstIdList);
        if (CollUtil.isNotEmpty(metaList)) {
            Map<String, List<String>> map = new HashMap<>(metaList.size());
            metaList.forEach(meta -> {
                MetaMapRo metaMapRo = JSONUtil.parseObj(meta.getMetaData()).toBean(MetaMapRo.class);
                List<String> dstIds = new ArrayList<>();
                metaMapRo.getFieldMap().values().forEach(field -> {
                    FieldMapRo fieldMapRo = JSONUtil.parseObj(field).toBean(FieldMapRo.class);
                    if (fieldMapRo.getType().equals(FieldType.LINK.getFieldType())) {
                        LinkFieldProperty property = fieldMapRo.getProperty().toBean(LinkFieldProperty.class);
                        // whether to filter dst id list
                        if (filter) {
                            if (!dstIdList.contains(property.getForeignDatasheetId())) {
                                dstIds.add(property.getForeignDatasheetId());
                            }
                        }
                        else {
                            dstIds.add(property.getForeignDatasheetId());
                        }
                    }
                });
                if (CollUtil.isNotEmpty(dstIds)) {
                    map.put(meta.getDstId(), dstIds);
                }
            });
            return map;
        }
        return null;
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public SnapshotMapRo delFieldIfLinkDstId(Long userId, String dstId, List<String> linkDstIds, boolean saveDb) {
        log.info("Delete the field of the specified association datasheet ");
        if (CollUtil.isNotEmpty(linkDstIds)) {
            // get datasheet information
            SimpleDatasheetMetaDTO meta = datasheetMetaService.findByDstId(dstId);
            MetaMapRo metaMapRo = meta.getMeta().toBean(MetaMapRo.class);
            List<String> delFieldIds = new ArrayList<>();
            // find the field id of the associated datasheet
            metaMapRo.getFieldMap().values().forEach(field -> {
                FieldMapRo fieldMapRo = JSONUtil.parseObj(field).toBean(FieldMapRo.class);
                if (fieldMapRo.getType().equals(FieldType.LINK.getFieldType())) {
                    LinkFieldProperty property = fieldMapRo.getProperty().toBean(LinkFieldProperty.class);
                    String foreignDstId = property.getForeignDatasheetId();
                    if (linkDstIds.contains(foreignDstId)) {
                        delFieldIds.add(fieldMapRo.getId());
                    }
                }
            });
            // fieldMap processing
            delFieldIds.forEach(fieldId -> metaMapRo.getFieldMap().remove(fieldId));
            // view attribute processing
            this.delViewFieldId(metaMapRo, delFieldIds, delFieldIds);
            if (saveDb && CollUtil.isNotEmpty(delFieldIds)) {
                // save changes
                datasheetMetaService.edit(userId, dstId, MetaOpRo.builder().meta(JSONUtil.parseObj(metaMapRo)).build());
            }
            // record processing
            DatasheetRecordMapVo recordMapVo = datasheetRecordService.delFieldData(dstId, delFieldIds, saveDb);
            return SnapshotMapRo.builder().meta(JSONUtil.parseObj(metaMapRo)).recordMap(recordMapVo.getRecordMap()).build();
        }
        return null;
    }

    @Override
    public Map<String, SnapshotMapRo> findSnapshotMapByDstIds(List<String> dstIds, boolean hasRecordMap) {
        log.info("Get multiple datasheets and corresponding snapshot ");
        List<SnapshotDTO> dtoList = new ArrayList<>();
        List<DatasheetMetaDTO> metaList = iDatasheetMetaService.findMetaDtoByDstIds(dstIds);
        if (CollUtil.isNotEmpty(metaList)) {
            Map<String, String> dstIdToMetaMap = metaList.stream().collect(Collectors.toMap(DatasheetMetaDTO::getDstId, com.apitable.workspace.dto.DatasheetMetaDTO::getMetaData));
            Map<String, JSONObject> dstIdToRecordMapMap = new HashMap<>(dstIdToMetaMap.size());
            if (hasRecordMap) {
                List<DatasheetRecordMapVo> mapByDstIds = datasheetRecordService.findMapByDstIds(dstIdToMetaMap.keySet());
                dstIdToRecordMapMap = mapByDstIds.stream().collect(Collectors.toMap(DatasheetRecordMapVo::getDstId, DatasheetRecordMapVo::getRecordMap));
            }
            Map<String, JSONObject> finalDstIdToRecordMapMap = dstIdToRecordMapMap;
            dstIdToMetaMap.keySet().forEach(dstId -> {
                // get snapshot
                JSONObject recordMap = finalDstIdToRecordMapMap.get(dstId);
                SnapshotMapRo snapshotMapRo = SnapshotMapRo.builder()
                        .meta(JSONUtil.parseObj(dstIdToMetaMap.get(dstId)))
                        .recordMap(Optional.ofNullable(recordMap).orElse(JSONUtil.createObj()))
                        .build();
                dtoList.add(new SnapshotDTO(dstId, snapshotMapRo));
            });
        }
        return dtoList.stream().collect(Collectors.toMap(SnapshotDTO::getDstId, SnapshotDTO::getSnapshot));
    }

    @Override
    public List<String> replaceFieldDstId(Long userId, boolean sameSpace, MetaMapRo metaMapRo, Map<String, String> newNodeIdMap) {
        log.info("Replace the datasheet ID in the field attribute ");
        JSONObject fieldMap = JSONUtil.createObj();
        List<String> delFieldIds = new ArrayList<>();
        List<String> delFieldIdsInView = new ArrayList<>();
        String uuid = userMapper.selectUuidById(userId);
        for (Object field : metaMapRo.getFieldMap().values()) {
            FieldMapRo fieldMapRo = JSONUtil.parseObj(field).toBean(FieldMapRo.class);
            FieldType type = FieldType.create(fieldMapRo.getType());
            switch (type) {
                case LINK:
                    LinkFieldProperty property = fieldMapRo.getProperty().toBean(LinkFieldProperty.class);
                    String foreignDstId = property.getForeignDatasheetId();
                    String nodeId = newNodeIdMap.get(foreignDstId);
                    if (nodeId == null) {
                        // cannot find replaceable delete column
                        delFieldIds.add(fieldMapRo.getId());
                        delFieldIdsInView.add(fieldMapRo.getId());
                        continue;
                    }
                    property.setForeignDatasheetId(nodeId);
                    fieldMapRo.setProperty(JSONUtil.parseObj(property));
                    break;
                case LOOKUP:
                case FORMULA:
                case CREATED_TIME:
                case LAST_MODIFIED_TIME:
                    Object originDstId = fieldMapRo.getProperty().get("datasheetId");
                    if (originDstId != null) {
                        fieldMapRo.getProperty().set("datasheetId", newNodeIdMap.get(originDstId.toString()));
                    }
                    break;
                case MEMBER:
                    if (!sameSpace) {
                        fieldMapRo.getProperty().set("unitIds", new ArrayList<>());
                        delFieldIds.add(fieldMapRo.getId());
                    }
                    break;
                case CREATED_BY:
                case LAST_MODIFIED_BY:
                    originDstId = fieldMapRo.getProperty().get("datasheetId");
                    if (originDstId != null) {
                        fieldMapRo.getProperty().set("datasheetId", newNodeIdMap.get(originDstId.toString()));
                    }
                    fieldMapRo.getProperty().set("uuids", Collections.singletonList(uuid));
                    break;
                default:
                    break;
            }
            fieldMap.set(fieldMapRo.getId(), JSONUtil.parseObj(fieldMapRo));
        }
        metaMapRo.setFieldMap(fieldMap);
        // If there is a delete column, the corresponding to delete processing is columns in the view.
        this.delViewFieldId(metaMapRo, delFieldIdsInView, delFieldIds);
        return delFieldIds;
    }

    @Override
    public void remindMemberRecOp(Long userId, String spaceId, RemindMemberRo ro) {
        log.info("Member field mentions other people's record operation");
        boolean notify = BooleanUtil.isTrue(ro.getIsNotify());
        if (notify) {
            ExceptionUtil.isTrue(StrUtil.isNotBlank(ro.getNodeId()) && StrUtil.isNotBlank(ro.getViewId()), ParameterException.INCORRECT_ARG);
        }
        Set<Long> unitIds = new HashSet<>();
        ro.getUnitRecs().forEach(remindUnitRecRo -> {
            ExceptionUtil.isNotEmpty(remindUnitRecRo.getUnitIds(), ParameterException.INCORRECT_ARG);
            unitIds.addAll(remindUnitRecRo.getUnitIds());
        });
        List<UnitEntity> units = unitMapper.selectBatchIds(unitIds);
        units.stream().filter(unit -> unit.getSpaceId().equals(spaceId)).findFirst()
                .orElseThrow(() -> new BusinessException("submit data across spaces"));
        // refresh the mentioned member record cache
        userSpaceRemindRecordCacheService.refresh(userId, spaceId, CollUtil.newArrayList(unitIds));
        if (notify) {
            // split roles into members and teams
            Map<Long, List<Long>> roleUnitIdToRoleMemberUnitIds = getRoleMemberUnits(units);
            // self don't need to send notifications, filter
            Long memberId = userId == null ? -2L : memberMapper.selectIdByUserIdAndSpaceId(userId, spaceId);
            // Gets the organizational unit of the member type, the corresponding member.
            Map<Long, Long> unitIdToMemberIdMap = units.stream()
                    .filter(unit -> unit.getUnitType().equals(UnitType.MEMBER.getType())
                            && unit.getSpaceId().equals(spaceId) && !unit.getUnitRefId().equals(memberId))
                    // Only members with read permission to the node send notifications
                    .filter(unitEntity -> controlTemplate.hasNodePermission(unitEntity.getUnitRefId(), ro.getNodeId(), NodePermission.READ_NODE))
                    .collect(Collectors.toMap(UnitEntity::getId, UnitEntity::getUnitRefId));
            List<Long> memberIds = new ArrayList<>(unitIdToMemberIdMap.values());
            // Obtain the organizational unit of the department type and the list of members.
            Map<Long, List<Long>> unitIdToMemberIdsMap = MapUtil.newHashMap();
            Map<Long, Long> teamIdToUnitIdMap = units.stream().filter(unit -> unit.getUnitType().equals(UnitType.TEAM.getType())
                    && unit.getSpaceId().equals(spaceId)).collect(Collectors.toMap(UnitEntity::getUnitRefId, UnitEntity::getId));
            List<Long> teamIds = new ArrayList<>(teamIdToUnitIdMap.keySet());
            if (CollUtil.isNotEmpty(teamIds)) {
                List<TeamMemberRelEntity> teamMemberRelEntities = teamMemberRelMapper.selectByTeamIds(teamIds);
                teamMemberRelEntities.stream()
                        .filter(rel -> !rel.getMemberId().equals(memberId))
                        // Only members with read permission to the node send notifications
                        .filter(rel -> controlTemplate.hasNodePermission(rel.getMemberId(), ro.getNodeId(), NodePermission.READ_NODE))
                        .forEach(rel -> {
                            Long unitId = teamIdToUnitIdMap.get(rel.getTeamId());
                            List<Long> members = unitIdToMemberIdsMap.get(unitId);
                            if (CollUtil.isNotEmpty(members)) {
                                members.add(rel.getMemberId());
                            }
                            else {
                                unitIdToMemberIdsMap.put(unitId, CollUtil.newArrayList(rel.getMemberId()));
                            }
                        });
                unitIdToMemberIdsMap.values().forEach(memberIds::addAll);
            }

            if (CollUtil.isNotEmpty(roleUnitIdToRoleMemberUnitIds)) {
                getRoleMemberIds(roleUnitIdToRoleMemberUnitIds, unitIdToMemberIdMap, unitIdToMemberIdsMap);
            }

            if (CollUtil.isEmpty(memberIds)) {
                return;
            }
            // distinct, build notification message
            List<Long> distinctMemberIds = CollUtil.distinct(memberIds);
            List<Long> userIds = memberMapper.selectUserIdsByMemberIds(distinctMemberIds);
            CollUtil.removeNull(userIds);
            if (CollUtil.isEmpty(userIds)) {
                return;
            }
            ro.getUnitRecs().forEach(remindUnitRecRo -> {
                String recordTitle = StrUtil.blankToDefault(remindUnitRecRo.getRecordTitle(), I18nStringsUtil.t("record_unnamed"));
                List<Long> toMemberIds = new ArrayList<>();
                remindUnitRecRo.getUnitIds().forEach(unitId -> {
                    if (unitIdToMemberIdMap.get(unitId) != null) {
                        toMemberIds.add(unitIdToMemberIdMap.get(unitId));
                    }
                    else if (unitIdToMemberIdsMap.get(unitId) != null) {
                        toMemberIds.addAll(unitIdToMemberIdsMap.get(unitId));
                    }
                });
                if (CollUtil.isNotEmpty(remindUnitRecRo.getRecordIds()) && CollUtil.isNotEmpty(toMemberIds)) {
                    JSONObject body = JSONUtil.createObj();
                    JSONObject extras = JSONUtil.createObj()
                            .set("fieldName", remindUnitRecRo.getFieldName())
                            .set("recordTitle", recordTitle)
                            .set("viewId", ro.getViewId())
                            .set("recordIds", remindUnitRecRo.getRecordIds());
                    if (null != ro.getExtra() && null != ro.getExtra().getContent()) {
                        // comments
                        extras.set("commentContent", HtmlUtil.unescape(HtmlUtil.cleanHtmlTag(ro.getExtra().getContent())));
                    }
                    body.set(BODY_EXTRAS, extras);
                    // send notification
                    NotificationCreateRo notifyRo = new NotificationCreateRo();
                    notifyRo.setToMemberId(ListUtil.toList(Convert.toStrArray(toMemberIds)));
                    notifyRo.setFromUserId(userId == null ? "-2" : userId.toString());
                    notifyRo.setNodeId(ro.getNodeId());
                    notifyRo.setSpaceId(spaceId);
                    // used to mark message jump read
                    String notifyId = cn.hutool.core.util.IdUtil.simpleUUID();
                    notifyRo.setNotifyId(notifyId);
                    String templateId;
                    if (RemindType.MEMBER.getRemindType() == ro.getType() && remindUnitRecRo.getRecordIds().size() == 1) {
                        templateId = NotificationTemplateId.SINGLE_RECORD_MEMBER_MENTION.getValue();
                    }
                    else if (RemindType.MEMBER.getRemindType() == ro.getType()) {
                        templateId = NotificationTemplateId.USER_FIELD.getValue();
                    }
                    else {
                        templateId = NotificationTemplateId.SINGLE_RECORD_COMMENT_MENTIONED.getValue();
                    }
                    notifyRo.setTemplateId(templateId);
                    notifyRo.setBody(body);
                    // save notification record
                    playerNotificationService.batchCreateNotify(CollUtil.newArrayList(notifyRo));
                    NotifyDataSheetMeta meta = new NotifyDataSheetMeta()
                            .setRemindType(RemindType.of(ro.getType()))
                            .setSpaceId(spaceId)
                            .setNodeId(ro.getNodeId())
                            .setViewId(ro.getViewId())
                            .setRecordId(remindUnitRecRo.getRecordIds().get(0))
                            .setFieldName(remindUnitRecRo.getFieldName())
                            .setCreatedAt(LocalDateTime.now().format(DateTimeFormatter.ofPattern(DatePattern.NORM_DATETIME_MINUTE_PATTERN)))
                            .setExtra(ro.getExtra())
                            .setFromMemberId(memberId)
                            .setToMemberIds(toMemberIds)
                            .setNotifyId(notifyId)
                            .setFromUserId(ObjectUtil.defaultIfNull(userId, -2L))
                            .setRecordTitle(recordTitle);

                    RemindMemberOpSubject remindMemberOpSubject = new RemindMemberOpSubject();
                    // Default-Subscribe to Mail Notifications
                    if (!templateId.equals(NotificationTemplateId.SINGLE_RECORD_MEMBER_MENTION.getValue())) {
                        remindMemberOpSubject.registerObserver(datasheetRemindObservers.get(StrUtil.lowerFirst(MailRemind.class.getSimpleName())));
                    }
                    // Check whether the space is bound to third-party integration
                    SocialConnectInfo connectInfo = socialServiceFacade.getConnectInfo(spaceId);
                    if (connectInfo != null && connectInfo.isEnabled() && StrUtil.isNotBlank(connectInfo.getAppId())) {
                        // transform social connect app type, register remind observer
                        socialServiceFacade.eventCall(new NotificationEvent(notifyRo));
                    }
                    // message pushed to observer
                    remindMemberOpSubject.sendNotify(meta);
                }
            });
        }
    }

    private void getRoleMemberIds(Map<Long, List<Long>> roleUnitIdToRoleMemberUnitIds, Map<Long, Long> unitIdToMemberIdMap, Map<Long, List<Long>> unitIdToMemberIdsMap) {
        roleUnitIdToRoleMemberUnitIds.forEach((key, value) -> {
            HashSet<Long> readyAddMemberIds = CollUtil.newHashSet();
            value.forEach((unitId) -> {
                if (unitIdToMemberIdMap.get(unitId) != null) {
                    readyAddMemberIds.add(unitIdToMemberIdMap.get(unitId));
                }
                else if (unitIdToMemberIdsMap.get(unitId) != null) {
                    readyAddMemberIds.addAll(unitIdToMemberIdsMap.get(unitId));
                }
            });
            unitIdToMemberIdsMap.put(key, CollUtil.newArrayList(readyAddMemberIds));
        });
    }

    private Map<Long, List<Long>> getRoleMemberUnits(List<UnitEntity> units) {
        Predicate<UnitEntity> roleEntityMatcher = unit -> UnitType.ROLE.getType().equals(unit.getUnitType());
        List<Long> roleIds = units.stream().filter(roleEntityMatcher).map(UnitEntity::getUnitRefId).collect(toList());
        units.removeIf(roleEntityMatcher);
        Map<Long, List<Long>> unitIdToUnitIds = iRoleService.flatMapToRoleMemberUnitIds(roleIds);
        List<Long> roleMemberUnitIds = unitIdToUnitIds.values().stream().flatMap(List::stream).distinct().collect(toList());
        if (CollUtil.isEmpty(roleMemberUnitIds)) {
            return new HashMap<>(0);
        }
        List<UnitEntity> roleMemberUnit = unitMapper.selectByUnitIds(roleMemberUnitIds);
        units.addAll(roleMemberUnit);
        return unitIdToUnitIds;
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void transformDeletedLinkField(Long userId, Map<String, List<String>> dstIdToDelDstIdsMap) {
        log.info("convert the deleted associated field");
        if (MapUtil.isNotEmpty(dstIdToDelDstIdsMap)) {
            // gets the snapshot of all datasheets
            List<String> nodeIds = CollUtil.newArrayList(dstIdToDelDstIdsMap.keySet());
            Map<String, SnapshotMapRo> snapshotMap = this.findSnapshotMapByDstIds(nodeIds, false);
            // The snapshot recordMap does not have the record datasheet ID, and the change needs to be obtained separately.
            List<DataSheetRecordDTO> dataSheetRecordDTOList = datasheetRecordMapper.selectDtoByDstIds(nodeIds);
            Map<String, List<DataSheetRecordDTO>> recordDtoMap = dataSheetRecordDTOList.stream().collect(Collectors.groupingBy(DataSheetRecordDTO::getDstId));
            // process the datasheet.
            // Obtain the relationship between the associated fields of each datasheet and the associated datasheet ID.
            // The set of record rows that need to be modified for each datasheet.
            // Each association datasheet corresponds to the set of records to be used.
            Map<String, Map<String, String>> dstIdToFldLinkDstIdMap = MapUtil.newHashMap();
            Map<String, Set<String>> dstIdToUpdateRecIdsMap = MapUtil.newHashMap();
            Map<String, Set<String>> linkDstIdToRecIdsMap = MapUtil.newHashMap();
            for (Map.Entry<String, List<String>> entry : dstIdToDelDstIdsMap.entrySet()) {
                String dstId = entry.getKey();
                List<String> linkDstIds = entry.getValue();
                SnapshotMapRo snapshotMapRo = snapshotMap.get(dstId);
                // prevent dirty data and delete failure
                if (snapshotMapRo == null) {
                    continue;
                }
                MetaMapRo metaMapRo = JSONUtil.parseObj(snapshotMapRo.getMeta()).toBean(MetaMapRo.class);
                Map<String, String> fldIdToLinkDstIdMap = MapUtil.newHashMap();
                // find the field id of the associated datasheet
                metaMapRo.getFieldMap().values().forEach(field -> {
                    FieldMapRo fieldMapRo = JSONUtil.parseObj(field).toBean(FieldMapRo.class);
                    if (fieldMapRo.getType().equals(FieldType.LINK.getFieldType())) {
                        LinkFieldProperty property = fieldMapRo.getProperty().toBean(LinkFieldProperty.class);
                        String foreignDstId = property.getForeignDatasheetId();
                        if (linkDstIds.contains(foreignDstId)) {
                            // Record the associated number table corresponding to the column and convert the column to a text field.
                            fldIdToLinkDstIdMap.put(fieldMapRo.getId(), foreignDstId);
                            FieldMapRo fieldMapRo1 = FieldMapRo.builder()
                                    .id(fieldMapRo.getId())
                                    .name(fieldMapRo.getName())
                                    .desc(fieldMapRo.getDesc())
                                    .type(FieldType.TEXT.getFieldType()).build();
                            metaMapRo.getFieldMap().set(fieldMapRo.getId(), JSONUtil.parseObj(fieldMapRo1));
                        }
                    }
                });
                // save changes
                datasheetMetaService.edit(userId, dstId, MetaOpRo.builder().meta(JSONUtil.parseObj(metaMapRo)).build());
                // traversal record map.
                // The record datasheet corresponds to the set of recordId that needs to be modified, and the associated datasheet corresponds to the set of recordId that is used.
                Set<String> updateRecIds = new HashSet<>();
                List<DataSheetRecordDTO> recordMap = recordDtoMap.get(dstId);
                // There is no record in this datasheet and there is no cell data to be converted.
                if (CollUtil.isEmpty(recordMap)) {
                    continue;
                }
                recordMap.forEach(recordDto -> fldIdToLinkDstIdMap.forEach((fldId, linkDstId) -> {
                    Object cellVal = recordDto.getData().get(fldId);
                    if (cellVal != null) {
                        Set<String> recIds = CollUtil.newHashSet(JSONUtil.parseArray(cellVal).toList(String.class));
                        Set<String> recordIds = linkDstIdToRecIdsMap.get(linkDstId);
                        if (recordIds != null) {
                            recordIds.addAll(recIds);
                        }
                        else {
                            linkDstIdToRecIdsMap.put(linkDstId, recIds);
                        }
                        updateRecIds.add(recordDto.getRecordId());
                    }
                }));
                if (CollUtil.isNotEmpty(updateRecIds)) {
                    dstIdToUpdateRecIdsMap.put(dstId, updateRecIds);
                    dstIdToFldLinkDstIdMap.put(dstId, fldIdToLinkDstIdMap);
                }
            }
            // process deleted associated field column data
            this.processDeletedLinkFieldData(recordDtoMap, dstIdToFldLinkDstIdMap, dstIdToUpdateRecIdsMap, linkDstIdToRecIdsMap);
        }
    }

    /**
     * process deleted associated field column data
     *
     * @param recordDtoMap           datasheet-> recordDto set
     * @param dstIdToFldLinkDstIdMap datasheet-> (association field-> association datasheet ID)
     * @param dstIdToUpdateRecIdsMap datasheet-> set of recordId to be modified
     * @param linkDstIdToRecIdsMap   Association datasheet-> used recordId collection
     */
    private void processDeletedLinkFieldData(Map<String, List<DataSheetRecordDTO>> recordDtoMap, Map<String, Map<String, String>> dstIdToFldLinkDstIdMap,
            Map<String, Set<String>> dstIdToUpdateRecIdsMap, Map<String, Set<String>> linkDstIdToRecIdsMap) {
        if (MapUtil.isEmpty(linkDstIdToRecIdsMap)) {
            return;
        }
        // The associated field has associated data, and the processing obtains the relationship between the corresponding record mapping data used by each associated datasheet.
        Map<String, Map<String, String>> linkDstIdToRecValMap = new HashMap<>(linkDstIdToRecIdsMap.size());
        List<String> linkDstIds = CollUtil.newArrayList(linkDstIdToRecIdsMap.keySet());
        Map<String, SnapshotMapRo> linkSnapshotMap = this.findSnapshotMapByDstIds(linkDstIds, true);
        for (Map.Entry<String, Set<String>> linkDstIdToRecIds : linkDstIdToRecIdsMap.entrySet()) {
            String linkDstId = linkDstIdToRecIds.getKey();
            Set<String> recIds = linkDstIdToRecIds.getValue();
            SnapshotMapRo snapshotMapRo = linkSnapshotMap.get(linkDstId);
            if (snapshotMapRo == null) {
                continue;
            }
            // Find the field ID of the first column from the properties of the view.
            MetaMapRo metaMapRo = JSONUtil.parseObj(snapshotMapRo.getMeta()).toBean(MetaMapRo.class);
            ViewMapRo viewMapRo = JSONUtil.parseObj(metaMapRo.getViews().get(0)).toBean(ViewMapRo.class);
            String firstColumnId = JSONUtil.parseObj(viewMapRo.getColumns().get(0)).get("fieldId").toString();
            // Gets the properties of the first column field
            FieldMapRo fieldMapRo = JSONUtil.parseObj(metaMapRo.getFieldMap().get(firstColumnId)).toBean(FieldMapRo.class);
            FieldType fieldType = FieldType.create(fieldMapRo.getType());
            // Traversing the set of recordId used to make up the MAP of the record ID and data.
            Map<String, String> recIdToValMap = MapUtil.newHashMap();
            JSONObject recordMap = snapshotMapRo.getRecordMap();
            recIds.forEach(recId -> {
                Object recordVo = recordMap.get(recId);
                if (recordVo != null) {
                    DatasheetRecordVo vo = JSONUtil.parseObj(recordVo).toBean(DatasheetRecordVo.class);
                    Object cellVal = vo.getData().get(firstColumnId);
                    String val = this.parseCellData(fieldType, fieldMapRo.getProperty(), cellVal);
                    recIdToValMap.put(recId, val);
                }
            });
            linkDstIdToRecValMap.put(linkDstId, recIdToValMap);
        }
        // Replace cell data in the associated column of the original datasheet
        List<DatasheetRecordEntity> entities = new ArrayList<>();
        dstIdToUpdateRecIdsMap.forEach((dstId, recIds) -> {
            Map<String, String> fldIdToLinkDstIdMap = dstIdToFldLinkDstIdMap.get(dstId);
            Map<String, DataSheetRecordDTO> recIdToDtoMap = recordDtoMap.get(dstId).stream().collect(Collectors.toMap(DataSheetRecordDTO::getRecordId, record -> record));
            recIds.forEach(recId -> {
                DataSheetRecordDTO recordDto = recIdToDtoMap.get(recId);
                JSONObject data = recordDto.getData();
                boolean change = false;
                for (Map.Entry<String, String> entry : fldIdToLinkDstIdMap.entrySet()) {
                    String fldId = entry.getKey();
                    Object cellVal = data.get(fldId);
                    if (cellVal != null) {
                        StringBuilder strBuilder = new StringBuilder();
                        Map<String, String> recIdToValMap = linkDstIdToRecValMap.get(entry.getValue());
                        List<String> cellRecIds = JSONUtil.parseArray(cellVal).toList(String.class);
                        cellRecIds.forEach(cellRecId -> {
                            if (strBuilder.length() > 0) {
                                strBuilder.append(",");
                            }
                            if (MapUtil.isEmpty(recIdToValMap) || recIdToValMap.get(cellRecId) == null) {
                                strBuilder.append("Unnamed record ");
                            }
                            else {
                                strBuilder.append(recIdToValMap.get(cellRecId));
                            }
                        });
                        JSONObject obj = JSONUtil.createObj();
                        obj.set("type", CellType.TEXT.getType());
                        obj.set("text", strBuilder.toString());
                        JSONArray array = JSONUtil.createArray();
                        array.add(obj);
                        data.set(fldId, array);
                        change = true;
                    }
                }
                if (change) {
                    DatasheetRecordEntity entity = DatasheetRecordEntity.builder().id(recordDto.getId()).data(StrUtil.toString(data)).build();
                    entities.add(entity);
                }
            });
        });
        // save changes
        if (CollUtil.isNotEmpty(entities)) {
            datasheetRecordService.updateBatchById(entities, entities.size());
        }
    }

    @Override
    public String parseCellData(FieldType fieldType, JSONObject property, Object cellVal) {
        log.info("Analyze the cell data of the datasheet ");
        if (cellVal != null) {
            switch (fieldType) {
                case AUTO_NUMBER:
                    return cellVal.toString();
                case SINGLE_TEXT:
                case TEXT:
                case URL:
                case EMAIL:
                case PHONE:
                    StringBuilder strBuilder = new StringBuilder();
                    JSONArray array = JSONUtil.parseArray(cellVal);
                    array.forEach(json -> strBuilder.append(JSONUtil.parseObj(json).get("text")));
                    return strBuilder.toString();
                case NUMBER:
                    int precision = Integer.parseInt(property.get("precision").toString());
                    return NumberUtil.round(cellVal.toString(), precision).toString();
                case CURRENCY:
                    String symbol = property.get("symbol").toString();
                    precision = Integer.parseInt(property.get("precision").toString());
                    return symbol + NumberUtil.round(cellVal.toString(), precision).toString();
                case PERCENT:
                    precision = Integer.parseInt(property.get("precision").toString());
                    BigDecimal val = NumberUtil.mul(cellVal.toString(), "100");
                    return NumberUtil.round(val, precision).toString() + "%";
                case DATETIME:
                    DateFieldProperty dateFieldProperty = property.toBean(DateFieldProperty.class);
                    String format = DateFormat.getPattern(dateFieldProperty.getDateFormat());
                    if (dateFieldProperty.isIncludeTime()) {
                        format = StrUtil.format("{} {}", format, TimeFormat.getPattern(dateFieldProperty.getTimeFormat()));
                    }
                    DateTime date = DateUtil.date(Long.parseLong(cellVal.toString()));
                    return DateUtil.format(date, format);
                default:
                    break;
            }
        }
        return null;
    }

    @Override
    public Map<String, List<String>> getForeignFieldNames(List<String> dstIdList) {
        // batch acquisition of datasheet metadata
        List<DatasheetMetaDTO> metaList = iDatasheetMetaService.findMetaDtoByDstIds(dstIdList);
        if (CollUtil.isNotEmpty(metaList)) {
            // traversal datasheet metadata
            for (DatasheetMetaDTO meta : metaList) {
                // Build the return body, node ID, and associated field name.
                Map<String, List<String>> map = new HashMap<>();
                List<String> foreignFieldNames = new ArrayList<>();
                MetaMapRo metaMapRo = JSONUtil.parseObj(meta.getMetaData()).toBean(MetaMapRo.class);
                for (Object field : metaMapRo.getFieldMap().values()) {
                    FieldMapRo fieldMapRo = JSONUtil.parseObj(field).toBean(FieldMapRo.class);
                    // determine if there is an associated field
                    if (fieldMapRo.getType().equals(FieldType.LINK.getFieldType())) {
                        LinkFieldProperty property = fieldMapRo.getProperty().toBean(LinkFieldProperty.class);
                        // Determine whether the associated field is associated with the appearance.
                        if (!dstIdList.contains(property.getForeignDatasheetId())) {
                            foreignFieldNames.add(fieldMapRo.getName());
                        }
                    }
                }
                if (CollUtil.isNotEmpty(foreignFieldNames)) {
                    map.put(meta.getDstId(), foreignFieldNames);
                    return map;
                }
            }
        }
        return null;
    }

}
