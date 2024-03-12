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

import static com.apitable.shared.component.notification.queue.QueueConfig.NOTIFICATION_EXCHANGE;
import static com.apitable.shared.constants.NotificationConstants.BODY_EXTRAS;
import static java.util.stream.Collectors.toList;

import cn.hutool.core.collection.CollUtil;
import cn.hutool.core.collection.ListUtil;
import cn.hutool.core.convert.Convert;
import cn.hutool.core.map.MapUtil;
import cn.hutool.core.util.BooleanUtil;
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
import com.apitable.internal.dto.SimpleDatasheetMetaDTO;
import com.apitable.organization.entity.TeamMemberRelEntity;
import com.apitable.organization.entity.UnitEntity;
import com.apitable.organization.enums.UnitType;
import com.apitable.organization.mapper.TeamMemberRelMapper;
import com.apitable.organization.mapper.UnitMapper;
import com.apitable.organization.service.IMemberService;
import com.apitable.organization.service.IRoleService;
import com.apitable.player.ro.NotificationCreateRo;
import com.apitable.player.service.IPlayerNotificationService;
import com.apitable.shared.cache.service.UserSpaceRemindRecordCacheService;
import com.apitable.shared.component.notification.NotificationTemplateId;
import com.apitable.shared.config.properties.LimitProperties;
import com.apitable.shared.context.LoginContext;
import com.apitable.shared.sysconfig.i18n.I18nStringsUtil;
import com.apitable.shared.util.IdUtil;
import com.apitable.starter.amqp.core.RabbitSenderService;
import com.apitable.starter.beetl.autoconfigure.BeetlTemplate;
import com.apitable.user.mapper.UserMapper;
import com.apitable.widget.service.IWidgetService;
import com.apitable.workspace.dto.DatasheetMetaDTO;
import com.apitable.workspace.dto.DatasheetWidgetDTO;
import com.apitable.workspace.dto.NodeCopyDTO;
import com.apitable.workspace.dto.NodeCopyOptions;
import com.apitable.workspace.dto.SnapshotDTO;
import com.apitable.workspace.entity.DatasheetEntity;
import com.apitable.workspace.entity.NodeEntity;
import com.apitable.workspace.enums.ButtonFieldActionType;
import com.apitable.workspace.enums.DataSheetException;
import com.apitable.workspace.enums.FieldType;
import com.apitable.workspace.enums.NodeException;
import com.apitable.workspace.mapper.DatasheetMapper;
import com.apitable.workspace.mapper.NodeMapper;
import com.apitable.workspace.model.DatasheetObject;
import com.apitable.workspace.observer.DatasheetRemindObserver;
import com.apitable.workspace.observer.remind.RemindType;
import com.apitable.workspace.ro.ButtonFieldProperty;
import com.apitable.workspace.ro.FieldMapRo;
import com.apitable.workspace.ro.LinkFieldProperty;
import com.apitable.workspace.ro.MetaMapRo;
import com.apitable.workspace.ro.MetaOpRo;
import com.apitable.workspace.ro.RecordMapRo;
import com.apitable.workspace.ro.RemindMemberRo;
import com.apitable.workspace.ro.RemindUnitRecRo;
import com.apitable.workspace.ro.SnapshotMapRo;
import com.apitable.workspace.ro.ViewMapRo;
import com.apitable.workspace.service.IDatasheetMetaService;
import com.apitable.workspace.service.IDatasheetRecordService;
import com.apitable.workspace.service.IDatasheetService;
import com.apitable.workspace.vo.BaseNodeInfo;
import com.apitable.workspace.vo.DatasheetRecordMapVo;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.baomidou.mybatisplus.extension.toolkit.SqlHelper;
import jakarta.annotation.Resource;
import java.util.ArrayList;
import java.util.Collection;
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
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Datasheet service implements.
 */
@Service
@Slf4j
public class DatasheetServiceImpl extends ServiceImpl<DatasheetMapper, DatasheetEntity>
    implements IDatasheetService {

    @Resource
    private IDatasheetMetaService iDatasheetMetaService;

    @Resource
    private IDatasheetRecordService iDatasheetRecordService;

    @Resource
    private IMemberService iMemberService;

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

    @Autowired(required = false)
    private RabbitSenderService rabbitSenderService;

    @Resource
    private IWidgetService iWidgetService;

    @Override
    public DatasheetEntity getByDstId(String dstId) {
        return baseMapper.selectByDstId(dstId);
    }

    @Override
    public Long getRevisionByDstId(String dstId) {
        DatasheetEntity datasheet = getByDstId(dstId);
        return datasheet != null ? datasheet.getRevision() : null;
    }

    @Override
    public void batchSave(List<DatasheetEntity> entities) {
        if (CollUtil.isEmpty(entities)) {
            return;
        }
        baseMapper.insertBatch(entities);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void create(Long userId, NodeEntity nodeEntity, DatasheetObject datasheetObject) {
        DatasheetEntity datasheet = DatasheetEntity.builder()
            .spaceId(nodeEntity.getSpaceId())
            .nodeId(nodeEntity.getNodeId())
            .dstId(nodeEntity.getNodeId())
            .dstName(nodeEntity.getNodeName())
            .createdBy(userId)
            .updatedBy(userId)
            .build();
        boolean flag = this.save(datasheet);
        ExceptionUtil.isTrue(flag, DataSheetException.CREATE_FAIL);
        iDatasheetMetaService.create(userId, datasheet.getDstId(),
            datasheetObject.getMeta().toJsonString());
        // save records
        iDatasheetRecordService.createRecords(userId, datasheet.getDstId(),
            datasheetObject.getRecords());

    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void create(
        final Long creator,
        final String spaceId,
        final String dstId,
        final String dstName,
        final String viewName
    ) {
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
        SnapshotMapRo snapshot = initialize(viewName);
        // Save Meta information
        String meta = JSONUtil.parseObj(snapshot.getMeta()).toString();
        iDatasheetMetaService.create(creator, datasheet.getDstId(), meta);
        // Save record information
        iDatasheetRecordService.saveBatch(creator, snapshot.getRecordMap(), dstId);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void create(Long userId, String spaceId, String nodeId, String name, MetaMapRo metaMapRo,
                       JSONObject recordMap) {
        DatasheetEntity datasheet = DatasheetEntity.builder()
            .dstName(name)
            .dstId(nodeId)
            .nodeId(nodeId)
            .spaceId(spaceId)
            .build();
        // Save Meta information
        iDatasheetMetaService.create(userId, datasheet.getDstId(),
            JSONUtil.parseObj(metaMapRo).toString());
        if (!recordMap.isEmpty()) {
            // Save record information
            iDatasheetRecordService.saveBatch(userId, recordMap, datasheet.getDstId());
        }

        boolean flag = this.save(datasheet);
        ExceptionUtil.isTrue(flag, DatabaseException.INSERT_ERROR);
    }

    @Override
    public void updateDstName(Long userId, String dstId, String dstName) {
        ExceptionUtil.isTrue(StrUtil.isNotBlank(dstId) && StrUtil.isNotBlank(dstName),
            ParameterException.INCORRECT_ARG);
        log.info("Edit datasheet name");
        boolean flag = SqlHelper.retBool(baseMapper.updateNameByDstId(userId, dstId, dstName));
        ExceptionUtil.isTrue(flag, DatabaseException.EDIT_ERROR);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void updateIsDeletedStatus(Long userId, List<String> nodeIds, Boolean isDel) {
        log.info("Change the logical deletion status of the datasheet and meta");
        baseMapper.updateIsDeletedByNodeIds(userId, nodeIds, isDel);
        iDatasheetMetaService.batchRemove(nodeIds, isDel, userId);
    }

    private SnapshotMapRo initialize(final String viewName) {
        // get language
        String lang = LoginContext.me().getLoginUser().getLocale();
        Locale currentLang = lang == null ? LocaleContextHolder.getLocale()
            : Locale.forLanguageTag(lang);
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
        String defaultViewName =
            StrUtil.isNotBlank(viewName) ? viewName
                : I18nStringsUtil.t("default_view", currentLang);
        metaMap.put("defaultView", defaultViewName);
        // Datasheet title column
        metaMap.put("defaultDatasheetTitle",
            I18nStringsUtil.t("default_datasheet_title", currentLang));
        // Datasheet options column
        metaMap.put("defaultDatasheetOptions",
            I18nStringsUtil.t("default_datasheet_options", currentLang));
        // Datasheet attachments column
        metaMap.put("defaultDatasheetAttachments",
            I18nStringsUtil.t("default_datasheet_attachments", currentLang));
        // internationalization elements
        String snapshotJson =
            beetlTemplate.render("datasheet/datasheet-meta-blank-tpl.btl", metaMap);
        return new JSONObject(snapshotJson).toBean(SnapshotMapRo.class);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public List<String> copy(Long userId, String spaceId, String sourceDstId, String destDstId,
                             String destDstName, NodeCopyOptions options,
                             Map<String, String> newNodeMap) {
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
        NodeCopyDTO nodeCopyDTO =
            this.processMeta(userId, spaceId, sourceDstId, destDstId, options, newNodeMap);
        MetaMapRo metaMapRo = nodeCopyDTO.getMetaMapRo();
        // save record
        if (ObjectUtil.isNotNull(options) && options.isCopyData()) {
            iDatasheetRecordService.copyRecords(userId, sourceDstId, datasheet.getDstId(),
                nodeCopyDTO, options.isRetainRecordMeta());
        } else {
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
            RecordMapRo recordMapRo =
                RecordMapRo.builder().id(recordId).data(JSONUtil.createObj()).build();
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
            iDatasheetRecordService.saveBatch(userId, recordMap, datasheet.getDstId());
        }
        // Save Meta information
        iDatasheetMetaService.create(userId, datasheet.getDstId(),
            JSONUtil.parseObj(metaMapRo).toString());
        return nodeCopyDTO.getLinkFieldIds();
    }

    private NodeCopyDTO processMeta(Long userId, String spaceId, String sourceDstId,
                                    String destDstId, NodeCopyOptions options,
                                    Map<String, String> newNodeMap) {
        List<String> delFieldIds = new ArrayList<>();
        List<String> autoNumberFieldIds = new ArrayList<>();

        // Obtain the information of the original node correspondence datasheet.
        SimpleDatasheetMetaDTO metaVo = iDatasheetMetaService.findByDstId(sourceDstId);
        MetaMapRo metaMapRo = metaVo.getMeta().toBean(MetaMapRo.class);
        // gets the space id of the original node.
        // If it is inconsistent with the space after replication and storage,
        // you need to clear the data related to the member field.
        String sourceSpaceId = nodeMapper.selectSpaceIdByNodeId(sourceDstId);
        boolean sameSpace = spaceId.equals(sourceSpaceId);
        // start processing
        List<String> delFieldIdsInView = new ArrayList<>();
        List<String> linkFieldIds = new ArrayList<>();
        boolean filterPermissionField = options.isFilterPermissionField()
            && MapUtil.isNotEmpty(options.getDstPermissionFieldsMap());
        JSONObject fieldMap = JSONUtil.createObj();
        String uuid = userMapper.selectUuidById(userId);
        for (Object field : metaMapRo.getFieldMap().values()) {
            FieldMapRo fieldMapRo = JSONUtil.parseObj(field).toBean(FieldMapRo.class);
            // Determine whether column permissions are enabled for a field in this datasheet.
            if (filterPermissionField) {
                List<String> permissionFieldIds =
                    options.getDstPermissionFieldsMap().get(sourceDstId);
                if (permissionFieldIds != null && permissionFieldIds.contains(fieldMapRo.getId())) {
                    delFieldIds.add(fieldMapRo.getId());
                    delFieldIdsInView.add(fieldMapRo.getId());
                    continue;
                }
            }
            FieldType type = FieldType.create(fieldMapRo.getType());
            Object originDstId = Optional.ofNullable(fieldMapRo.getProperty())
                .orElseGet(JSONObject::new).get("datasheetId");
            switch (type) {
                case ONE_WAY_LINK:
                case LINK:
                    LinkFieldProperty property =
                        fieldMapRo.getProperty().toBean(LinkFieldProperty.class);
                    String foreignDstId = property.getForeignDatasheetId();
                    if (ObjectUtil.isNotNull(newNodeMap) && ObjectUtil.isNotNull(
                        newNodeMap.get(foreignDstId))) {
                        // Determine whether column permissions are enabled for the associated
                        // field corresponding to the associated datasheet.
                        if (filterPermissionField) {
                            List<String> permissionFieldIds =
                                options.getDstPermissionFieldsMap().get(foreignDstId);
                            if (permissionFieldIds != null && permissionFieldIds.contains(
                                property.getBrotherFieldId())) {
                                delFieldIds.add(fieldMapRo.getId());
                                delFieldIdsInView.add(fieldMapRo.getId());
                                continue;
                            }
                        }
                        // The associated datasheet is stored together, and the associated
                        // datasheet ID is replaced with the copied associated datasheet ID.
                        property.setForeignDatasheetId(newNodeMap.get(foreignDstId));
                    } else if (ObjectUtil.isNotNull(options) && options.isAddColumn()) {
                        // Determine whether the columns of the associated datasheet exceed the
                        // limit.
                        SimpleDatasheetMetaDTO meta =
                            iDatasheetMetaService.findByDstId(foreignDstId);
                        MetaMapRo mapRo = meta.getMeta().toBean(MetaMapRo.class);
                        // Check whether the number of columns in the associated datasheet
                        // exceeds the 200 column limit
                        ExceptionUtil.isTrue(
                            mapRo.getFieldMap().size() < limitProperties.getMaxColumnCount(),
                            NodeException.LINK_DATASHEET_COLUMN_EXCEED_LIMIT);
                        // Convert to text, put room-server to modify columns, and fill in data
                        fieldMapRo.setType(FieldType.TEXT.getFieldType());
                        linkFieldIds.add(fieldMapRo.getId());
                        property = null;
                    } else {
                        // The associated datasheet is not saved together. Delete the associated
                        // column.
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
                    if (originDstId != null) {
                        fieldMapRo.getProperty()
                            .set("datasheetId", newNodeMap.get(originDstId.toString()));
                    }
                    break;
                case CASCADER:
                    fieldMapRo.getProperty().set("linkedDatasheetId", "");
                    fieldMapRo.getProperty().set("linkedViewId", "");
                    fieldMapRo.getProperty().set("linkedFields", new ArrayList<>());
                    fieldMapRo.getProperty().set("fullLinkedFields", new ArrayList<>());
                    fieldMapRo.getProperty().set("showAll", false);
                    break;
                case AUTO_NUMBER:
                    autoNumberFieldIds.add(fieldMapRo.getId());
                    if (originDstId != null) {
                        fieldMapRo.getProperty()
                            .set("datasheetId", newNodeMap.get(originDstId.toString()));
                    }
                    if (!options.isCopyData()) {
                        // When the record data is not copied, a blank line is automatically
                        // filled, so the next value of the self-increment field is 2.
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
                    if (originDstId != null) {
                        fieldMapRo.getProperty()
                            .set("datasheetId", newNodeMap.get(originDstId.toString()));
                    }
                    if (!options.isRetainRecordMeta()) {
                        fieldMapRo.getProperty().set("uuids", Collections.singletonList(uuid));
                    }
                    break;
                case WORK_DOC:
                    delFieldIds.add(fieldMapRo.getId());
                    break;
                case BUTTON:
                    ButtonFieldProperty buttonProperty =
                        fieldMapRo.getProperty().toBean(ButtonFieldProperty.class, true);
                    ButtonFieldProperty.ButtonFieldAction action =
                        getButtonFieldPropertyAction(buttonProperty.getAction(), newNodeMap,
                            options.getNewTriggerMap());
                    fieldMapRo.getProperty().set("action", action);
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
        // If there is a delete column,
        // the corresponding to delete processing is columns in the view.
        this.delViewFieldId(metaMapRo, delFieldIdsInView, delFieldIds);
        // copy panel
        this.copyWidgetPanels(userId, spaceId, destDstId, metaMapRo, newNodeMap);
        return new NodeCopyDTO(metaMapRo, delFieldIds, autoNumberFieldIds, linkFieldIds);
    }

    /**
     * Deletes the view that contains the attribute information of the specified field id.
     */
    private void delViewFieldId(MetaMapRo metaMapRo, List<String> delFieldIds,
                                List<String> delFieldIdsInFilter) {
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
                    if (!conditions.isEmpty()) {
                        filterInfo.set("conditions", conditions);
                        viewMapRo.setFilterInfo(filterInfo);
                    } else {
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
     * Deletes the object containing the specified field id from the object array.
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
     * copy panel.
     */
    private void copyWidgetPanels(Long userId, String spaceId, String destDstId,
                                  MetaMapRo metaMapRo, Map<String, String> newNodeMap) {
        // construct a new component panel
        Map<String, String> newWidgetIdMap = new HashMap<>(8);
        JSONArray newWidgetPanels =
            this.generateWidgetPanels(metaMapRo.getWidgetPanels(), newWidgetIdMap);
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
    public JSONArray generateWidgetPanels(JSONArray widgetPanels,
                                          Map<String, String> newWidgetIdMap) {
        // construct a new component panel
        JSONArray newWidgetPanels = JSONUtil.createArray();
        if (widgetPanels == null || widgetPanels.isEmpty()) {
            return newWidgetPanels;
        }
        for (JSONObject widgetPanel : widgetPanels.jsonIter()) {
            JSONArray widgets = widgetPanel.getJSONArray("widgets");
            if (widgets == null || widgets.isEmpty()) {
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
    public List<BaseNodeInfo> getForeignDstIdsFilterSelf(final List<String> nodeIds) {
        Map<String, List<String>> dstIdToForeignIdsMap = this.getForeignDstIds(nodeIds, true);
        if (MapUtil.isEmpty(dstIdToForeignIdsMap)) {
            return new ArrayList<>();
        }
        List<String> filters = CollUtil.newArrayList();
        Collection<List<String>> foreignDstIdLists = dstIdToForeignIdsMap.values();
        for (List<String> foreignDstIdList : foreignDstIdLists) {
            filters.addAll(foreignDstIdList);
        }
        return nodeMapper.selectBaseNodeInfoByNodeIds(filters);
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
                    if (fieldMapRo.getType().equals(FieldType.LINK.getFieldType())
                        || fieldMapRo.getType().equals(FieldType.ONE_WAY_LINK.getFieldType())) {
                        LinkFieldProperty property =
                            fieldMapRo.getProperty().toBean(LinkFieldProperty.class);
                        // whether to filter dst id list
                        if (filter) {
                            if (!dstIdList.contains(property.getForeignDatasheetId())) {
                                dstIds.add(property.getForeignDatasheetId());
                            }
                        } else {
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
    public SnapshotMapRo delFieldIfLinkDstId(Long userId, String dstId, List<String> linkDstIds,
                                             boolean saveDb) {
        log.info("Delete the field of the specified association datasheet ");
        if (CollUtil.isNotEmpty(linkDstIds)) {
            // get datasheet information
            SimpleDatasheetMetaDTO meta = iDatasheetMetaService.findByDstId(dstId);
            MetaMapRo metaMapRo = meta.getMeta().toBean(MetaMapRo.class);
            List<String> delFieldIds = new ArrayList<>();
            // find the field id of the associated datasheet
            metaMapRo.getFieldMap().values().forEach(field -> {
                FieldMapRo fieldMapRo = JSONUtil.parseObj(field).toBean(FieldMapRo.class);
                if (fieldMapRo.getType().equals(FieldType.LINK.getFieldType())
                    || fieldMapRo.getType().equals(FieldType.ONE_WAY_LINK.getFieldType())) {
                    LinkFieldProperty property =
                        fieldMapRo.getProperty().toBean(LinkFieldProperty.class);
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
                iDatasheetMetaService.edit(userId, dstId,
                    MetaOpRo.builder().meta(JSONUtil.parseObj(metaMapRo)).build());
            }
            // record processing
            DatasheetRecordMapVo recordMapVo =
                iDatasheetRecordService.delFieldData(dstId, delFieldIds, saveDb);
            return SnapshotMapRo.builder().meta(JSONUtil.parseObj(metaMapRo))
                .recordMap(recordMapVo.getRecordMap()).build();
        }
        return null;
    }

    @Override
    public Map<String, SnapshotMapRo> findSnapshotMapByDstIds(List<String> dstIds,
                                                              boolean hasRecordMap) {
        log.info("Get multiple datasheets and corresponding snapshot ");
        List<SnapshotDTO> dtoList = new ArrayList<>();
        List<DatasheetMetaDTO> metaList = iDatasheetMetaService.findMetaDtoByDstIds(dstIds);
        if (CollUtil.isNotEmpty(metaList)) {
            Map<String, String> dstIdToMetaMap = metaList.stream().collect(
                Collectors.toMap(DatasheetMetaDTO::getDstId,
                    com.apitable.workspace.dto.DatasheetMetaDTO::getMetaData));
            Map<String, JSONObject> dstIdToRecordMapMap = new HashMap<>(dstIdToMetaMap.size());
            if (hasRecordMap) {
                List<DatasheetRecordMapVo> mapByDstIds =
                    iDatasheetRecordService.findMapByDstIds(dstIdToMetaMap.keySet());
                dstIdToRecordMapMap = mapByDstIds.stream().collect(
                    Collectors.toMap(DatasheetRecordMapVo::getDstId,
                        DatasheetRecordMapVo::getRecordMap));
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
        return dtoList.stream()
            .collect(Collectors.toMap(SnapshotDTO::getDstId, SnapshotDTO::getSnapshot));
    }

    @Override
    public List<String> replaceFieldDstId(Long userId, boolean sameSpace, MetaMapRo metaMapRo,
                                          Map<String, String> newNodeIdMap) {
        log.info("Replace the datasheet ID in the field attribute ");
        JSONObject fieldMap = JSONUtil.createObj();
        List<String> delFieldIds = new ArrayList<>();
        List<String> delFieldIdsInView = new ArrayList<>();
        String uuid = userMapper.selectUuidById(userId);
        for (Object field : metaMapRo.getFieldMap().values()) {
            FieldMapRo fieldMapRo = JSONUtil.parseObj(field).toBean(FieldMapRo.class);
            FieldType type = FieldType.create(fieldMapRo.getType());
            String originDstId = fieldMapRo.getProperty() != null
                ? fieldMapRo.getProperty().getStr("datasheetId") : null;
            switch (type) {
                case ONE_WAY_LINK:
                case LINK:
                    assert fieldMapRo.getProperty() != null;
                    LinkFieldProperty property =
                        fieldMapRo.getProperty().toBean(LinkFieldProperty.class);
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
                    if (originDstId != null) {
                        fieldMapRo.getProperty()
                            .set("datasheetId", newNodeIdMap.get(originDstId));
                    }
                    break;
                case MEMBER:
                    if (!sameSpace) {
                        assert fieldMapRo.getProperty() != null;
                        fieldMapRo.getProperty().set("unitIds", new ArrayList<>());
                        delFieldIds.add(fieldMapRo.getId());
                    }
                    break;
                case CREATED_BY:
                case LAST_MODIFIED_BY:
                    if (originDstId != null) {
                        fieldMapRo.getProperty()
                            .set("datasheetId", newNodeIdMap.get(originDstId));
                    }
                    assert fieldMapRo.getProperty() != null;
                    fieldMapRo.getProperty().set("uuids", Collections.singletonList(uuid));
                    break;
                default:
                    break;
            }
            fieldMap.set(fieldMapRo.getId(), JSONUtil.parseObj(fieldMapRo));
        }
        metaMapRo.setFieldMap(fieldMap);
        // If there is a delete column,
        // the corresponding to delete processing is columns in the view.
        this.delViewFieldId(metaMapRo, delFieldIdsInView, delFieldIds);
        return delFieldIds;
    }

    @Override
    public void remindMemberRecOp(Long userId, String spaceId, RemindMemberRo ro) {
        log.info("Member field mentions other people's record operation");
        boolean notify = BooleanUtil.isTrue(ro.getIsNotify());
        if (notify) {
            ExceptionUtil.isTrue(StrUtil.isNotBlank(ro.getNodeId())
                && StrUtil.isNotBlank(ro.getViewId()), ParameterException.INCORRECT_ARG);
        }
        Set<Long> unitIds = new HashSet<>();
        ro.getUnitRecs().forEach(remindUnitRecRo -> {
            ExceptionUtil.isNotEmpty(remindUnitRecRo.getUnitIds(),
                ParameterException.INCORRECT_ARG);
            unitIds.addAll(remindUnitRecRo.getUnitIds());
        });
        List<UnitEntity> units = unitMapper.selectBatchIds(unitIds);
        units.stream().filter(unit -> unit.getSpaceId().equals(spaceId)).findFirst()
            .orElseThrow(() -> new BusinessException("submit data across spaces"));
        // refresh the mentioned member record cache
        userSpaceRemindRecordCacheService.refresh(userId, spaceId, CollUtil.newArrayList(unitIds));
        if (!notify) {
            return;
        }
        // split roles into members and teams
        Map<Long, List<Long>> roleUnitIdToRoleMemberUnitIds = getRoleMemberUnits(units);
        // self don't need to send notifications, filter
        Long memberId =
            null == userId ? null : iMemberService.getMemberIdByUserIdAndSpaceId(userId, spaceId);
        // Gets the organizational unit of the member type, the corresponding member.
        Map<Long, Long> unitIdToMemberIdMap = units.stream()
            .filter(unit -> unit.getUnitType().equals(UnitType.MEMBER.getType())
                && unit.getSpaceId().equals(spaceId) && !unit.getUnitRefId().equals(memberId))
            // Only members with read permission to the node send notifications
            .filter(unitEntity -> controlTemplate.hasNodePermission(unitEntity.getUnitRefId(),
                ro.getNodeId(), NodePermission.READ_NODE))
            .collect(Collectors.toMap(UnitEntity::getId, UnitEntity::getUnitRefId));
        List<Long> memberIds = new ArrayList<>(unitIdToMemberIdMap.values());
        // Obtain the organizational unit of the department type and the list of members.
        Map<Long, List<Long>> unitIdToMemberIdsMap = MapUtil.newHashMap();
        Map<Long, Long> teamIdToUnitIdMap =
            units.stream().filter(unit -> unit.getUnitType().equals(UnitType.TEAM.getType())
                    && unit.getSpaceId().equals(spaceId))
                .collect(Collectors.toMap(UnitEntity::getUnitRefId, UnitEntity::getId));
        List<Long> teamIds = new ArrayList<>(teamIdToUnitIdMap.keySet());
        if (CollUtil.isNotEmpty(teamIds)) {
            List<TeamMemberRelEntity> teamMemberRelEntities =
                teamMemberRelMapper.selectByTeamIds(teamIds);
            teamMemberRelEntities.stream()
                .filter(rel -> !rel.getMemberId().equals(memberId))
                // Only members with read permission to the node send notifications
                .filter(
                    rel -> controlTemplate.hasNodePermission(rel.getMemberId(), ro.getNodeId(),
                        NodePermission.READ_NODE))
                .forEach(rel -> {
                    Long unitId = teamIdToUnitIdMap.get(rel.getTeamId());
                    List<Long> members = unitIdToMemberIdsMap.get(unitId);
                    if (CollUtil.isNotEmpty(members)) {
                        members.add(rel.getMemberId());
                    } else {
                        unitIdToMemberIdsMap.put(unitId,
                            CollUtil.newArrayList(rel.getMemberId()));
                    }
                });
            unitIdToMemberIdsMap.values().forEach(memberIds::addAll);
        }

        if (CollUtil.isNotEmpty(roleUnitIdToRoleMemberUnitIds)) {
            getRoleMemberIds(roleUnitIdToRoleMemberUnitIds, unitIdToMemberIdMap,
                unitIdToMemberIdsMap);
        }

        if (CollUtil.isEmpty(memberIds)) {
            return;
        }
        // distinct, build notification message
        List<Long> distinctMemberIds = CollUtil.distinct(memberIds);
        List<Long> userIds = iMemberService.getUserIdsByMemberIds(distinctMemberIds);
        CollUtil.removeNull(userIds);
        if (CollUtil.isEmpty(userIds)) {
            return;
        }
        for (RemindUnitRecRo remindUnitRecRo : ro.getUnitRecs()) {
            String recordTitle = StrUtil.blankToDefault(remindUnitRecRo.getRecordTitle(),
                I18nStringsUtil.t("record_unnamed"));
            List<Long> toMemberIds = new ArrayList<>();
            remindUnitRecRo.getUnitIds().forEach(unitId -> {
                if (unitIdToMemberIdMap.get(unitId) != null) {
                    toMemberIds.add(unitIdToMemberIdMap.get(unitId));
                } else if (unitIdToMemberIdsMap.get(unitId) != null) {
                    toMemberIds.addAll(unitIdToMemberIdsMap.get(unitId));
                }
            });
            if (CollUtil.isEmpty(remindUnitRecRo.getRecordIds())
                || CollUtil.isEmpty(toMemberIds)) {
                continue;
            }
            JSONObject body = JSONUtil.createObj();
            JSONObject extras = JSONUtil.createObj()
                .set("fieldName", remindUnitRecRo.getFieldName())
                .set("recordTitle", recordTitle)
                .set("viewId", ro.getViewId())
                .set("recordIds", remindUnitRecRo.getRecordIds());
            if (null != ro.getExtra() && null != ro.getExtra().getContent()) {
                // comments
                extras.set("commentContent",
                    HtmlUtil.unescape(HtmlUtil.cleanHtmlTag(ro.getExtra().getContent())));
            }
            body.set(BODY_EXTRAS, extras);
            // send notification
            NotificationCreateRo notifyRo = new NotificationCreateRo();
            notifyRo.setToMemberId(ListUtil.toList(Convert.toStrArray(toMemberIds)));
            if (null != userId) {
                notifyRo.setFromUserId(userId.toString());
            }
            notifyRo.setNodeId(ro.getNodeId());
            notifyRo.setSpaceId(spaceId);
            // used to mark message jump read
            String notifyId = cn.hutool.core.util.IdUtil.simpleUUID();
            notifyRo.setNotifyId(notifyId);
            String templateId = RemindType.MEMBER.getRemindType() == ro.getType()
                ? NotificationTemplateId.SINGLE_RECORD_MEMBER_MENTION.getValue()
                : NotificationTemplateId.SINGLE_RECORD_COMMENT_MENTIONED.getValue();
            notifyRo.setTemplateId(templateId);
            notifyRo.setBody(body);
            rabbitSenderService.topicSend(NOTIFICATION_EXCHANGE, "notification.#", notifyRo);
        }
    }

    private void getRoleMemberIds(Map<Long, List<Long>> roleUnitIdToRoleMemberUnitIds,
                                  Map<Long, Long> unitIdToMemberIdMap,
                                  Map<Long, List<Long>> unitIdToMemberIdsMap) {
        roleUnitIdToRoleMemberUnitIds.forEach((key, value) -> {
            HashSet<Long> readyAddMemberIds = CollUtil.newHashSet();
            value.forEach((unitId) -> {
                if (unitIdToMemberIdMap.get(unitId) != null) {
                    readyAddMemberIds.add(unitIdToMemberIdMap.get(unitId));
                } else if (unitIdToMemberIdsMap.get(unitId) != null) {
                    readyAddMemberIds.addAll(unitIdToMemberIdsMap.get(unitId));
                }
            });
            unitIdToMemberIdsMap.put(key, CollUtil.newArrayList(readyAddMemberIds));
        });
    }

    private Map<Long, List<Long>> getRoleMemberUnits(List<UnitEntity> units) {
        Predicate<UnitEntity> roleEntityMatcher =
            unit -> UnitType.ROLE.getType().equals(unit.getUnitType());
        List<Long> roleIds = units.stream().filter(roleEntityMatcher).map(UnitEntity::getUnitRefId)
            .collect(toList());
        units.removeIf(roleEntityMatcher);
        Map<Long, List<Long>> unitIdToUnitIds = iRoleService.flatMapToRoleMemberUnitIds(roleIds);
        List<Long> roleMemberUnitIds =
            unitIdToUnitIds.values().stream().flatMap(List::stream).distinct().collect(toList());
        if (CollUtil.isEmpty(roleMemberUnitIds)) {
            return new HashMap<>(0);
        }
        List<UnitEntity> roleMemberUnit = unitMapper.selectByUnitIds(roleMemberUnitIds);
        units.addAll(roleMemberUnit);
        return unitIdToUnitIds;
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
                    if (fieldMapRo.getType().equals(FieldType.LINK.getFieldType())
                        || fieldMapRo.getType().equals(FieldType.ONE_WAY_LINK.getFieldType())) {
                        LinkFieldProperty property =
                            fieldMapRo.getProperty().toBean(LinkFieldProperty.class);
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

    private ButtonFieldProperty.ButtonFieldAction getButtonFieldPropertyAction(
        ButtonFieldProperty.ButtonFieldAction action,
        Map<String, String> newNodeMap,
        Map<String, String> newTriggerMap) {
        if (null == newTriggerMap) {
            newTriggerMap = new HashMap<>();
        }
        if (ObjectUtil.equals(action.getType(),
            ButtonFieldActionType.TRIGGER_AUTOMATION.getType())) {
            if (null != action.getAutomation()) {
                ButtonFieldProperty.ButtonFieldActionAutomation automation = action.getAutomation();
                if (newTriggerMap.containsKey(automation.getTriggerId())) {
                    ButtonFieldProperty.ButtonFieldActionAutomation newAutomation =
                        ButtonFieldProperty.ButtonFieldActionAutomation.builder()
                            .automationId(newNodeMap.get(automation.getAutomationId()))
                            .triggerId(newTriggerMap.get(automation.getTriggerId()))
                            .build();
                    return ButtonFieldProperty.ButtonFieldAction.builder()
                        .automation(newAutomation)
                        .type(ButtonFieldActionType.TRIGGER_AUTOMATION.getType())
                        .build();
                }
                return ButtonFieldProperty.ButtonFieldAction.builder().build();
            }
            return ButtonFieldProperty.ButtonFieldAction.builder().build();
        }
        return action;
    }
}
