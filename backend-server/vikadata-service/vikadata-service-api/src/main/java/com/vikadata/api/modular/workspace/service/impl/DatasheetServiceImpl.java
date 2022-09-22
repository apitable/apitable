package com.vikadata.api.modular.workspace.service.impl;

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
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.baomidou.mybatisplus.extension.toolkit.SqlHelper;
import lombok.extern.slf4j.Slf4j;

import com.vikadata.api.cache.service.UserSpaceRemindRecordService;
import com.vikadata.api.component.notification.NotificationTemplateId;
import com.vikadata.api.config.properties.LimitProperties;
import com.vikadata.api.control.ControlTemplate;
import com.vikadata.api.control.permission.NodePermission;
import com.vikadata.api.enums.datasheet.DateFormat;
import com.vikadata.api.enums.datasheet.FieldType;
import com.vikadata.api.enums.datasheet.RemindType;
import com.vikadata.api.enums.datasheet.SegmentType;
import com.vikadata.api.enums.datasheet.TimeFormat;
import com.vikadata.api.enums.exception.DataSheetException;
import com.vikadata.api.enums.exception.DatabaseException;
import com.vikadata.api.enums.exception.NodeException;
import com.vikadata.api.enums.organization.UnitType;
import com.vikadata.api.enums.social.SocialPlatformType;
import com.vikadata.api.model.dto.datasheet.DataSheetRecordDto;
import com.vikadata.api.model.dto.datasheet.DatasheetMetaDTO;
import com.vikadata.api.model.dto.datasheet.SnapshotDto;
import com.vikadata.api.model.dto.widget.DatasheetWidgetDTO;
import com.vikadata.api.model.ro.datasheet.DateFieldProperty;
import com.vikadata.api.model.ro.datasheet.FieldMapRo;
import com.vikadata.api.model.ro.datasheet.LinkFieldProperty;
import com.vikadata.api.model.ro.datasheet.MetaMapRo;
import com.vikadata.api.model.ro.datasheet.MetaOpRo;
import com.vikadata.api.model.ro.datasheet.RecordMapRo;
import com.vikadata.api.model.ro.datasheet.RemindMemberRo;
import com.vikadata.api.model.ro.datasheet.SnapshotMapRo;
import com.vikadata.api.model.ro.datasheet.ViewMapRo;
import com.vikadata.api.model.ro.player.NotificationCreateRo;
import com.vikadata.api.model.vo.datasheet.DatasheetMetaVo;
import com.vikadata.api.model.vo.datasheet.DatasheetRecordMapVo;
import com.vikadata.api.model.vo.datasheet.DatasheetRecordVo;
import com.vikadata.api.modular.organization.mapper.MemberMapper;
import com.vikadata.api.modular.organization.mapper.TeamMemberRelMapper;
import com.vikadata.api.modular.organization.mapper.UnitMapper;
import com.vikadata.api.modular.organization.service.IRoleService;
import com.vikadata.api.modular.player.service.IPlayerNotificationService;
import com.vikadata.api.modular.social.model.TenantBindDTO;
import com.vikadata.api.modular.social.service.ISocialTenantBindService;
import com.vikadata.api.modular.social.service.ISocialTenantService;
import com.vikadata.api.modular.user.mapper.UserMapper;
import com.vikadata.api.modular.workspace.mapper.DatasheetMapper;
import com.vikadata.api.modular.workspace.mapper.DatasheetMetaMapper;
import com.vikadata.api.modular.workspace.mapper.DatasheetRecordMapper;
import com.vikadata.api.modular.workspace.mapper.NodeMapper;
import com.vikadata.api.modular.workspace.model.NodeCopyDTO;
import com.vikadata.api.modular.workspace.model.NodeCopyOptions;
import com.vikadata.api.modular.workspace.observer.DatasheetObserver;
import com.vikadata.api.modular.workspace.observer.DatasheetRemindObserver;
import com.vikadata.api.modular.workspace.observer.RemindMemberOpSubject;
import com.vikadata.api.modular.workspace.observer.remind.NotifyDataSheetMeta;
import com.vikadata.api.modular.workspace.observer.remind.RemindSubjectType;
import com.vikadata.api.modular.workspace.service.IDatasheetMetaService;
import com.vikadata.api.modular.workspace.service.IDatasheetRecordService;
import com.vikadata.api.modular.workspace.service.IDatasheetService;
import com.vikadata.api.modular.workspace.service.IWidgetService;
import com.vikadata.api.util.IdUtil;
import com.vikadata.api.util.VikaStrings;
import com.vikadata.boot.autoconfigure.beetl.BeetlTemplate;
import com.vikadata.core.exception.BusinessException;
import com.vikadata.core.util.ExceptionUtil;
import com.vikadata.entity.DatasheetEntity;
import com.vikadata.entity.DatasheetRecordEntity;
import com.vikadata.entity.SocialTenantEntity;
import com.vikadata.entity.TeamMemberRelEntity;
import com.vikadata.entity.UnitEntity;

import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import static com.vikadata.api.constants.NotificationConstants.BODY_EXTRAS;
import static com.vikadata.api.enums.exception.ParameterException.INCORRECT_ARG;
import static java.util.stream.Collectors.toList;

/**
 * <p>
 * 数据表格表 服务实现类
 * </p>
 *
 * @author Benson Cheung
 * @since 2019-09-20
 */
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
    private UserSpaceRemindRecordService userSpaceRemindRecordService;

    @Resource
    private IPlayerNotificationService playerNotificationService;

    @Resource
    private ISocialTenantService iSocialTenantService;

    @Resource
    private ISocialTenantBindService iSocialTenantBindService;

    @Resource
    private IWidgetService iWidgetService;

    @Resource
    private LimitProperties limitProperties;

    @Resource
    private Map<String, DatasheetRemindObserver> datasheetRemindObservers;

    @Resource
    private IRoleService iRoleService;


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
        log.info("创建数表");
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
        //初始化数表信息
        SnapshotMapRo snapshot = initialize();
        //保存Meta信息
        datasheetMetaService.create(creator, datasheet.getDstId(), JSONUtil.parseObj(snapshot.getMeta()).toString());
        //保存Record信息
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
        //保存Meta信息
        datasheetMetaService.create(userId, datasheet.getDstId(), JSONUtil.parseObj(metaMapRo).toString());
        if (recordMap.size() > 0) {
            //保存record信息
            datasheetRecordService.saveBatch(userId, recordMap, datasheet.getDstId());
        }

        boolean flag = this.save(datasheet);
        ExceptionUtil.isTrue(flag, DatabaseException.INSERT_ERROR);
    }

    @Override
    public void updateDstName(Long userId, String dstId, String dstName) {
        ExceptionUtil.isTrue(StrUtil.isNotBlank(dstId) && StrUtil.isNotBlank(dstName), INCORRECT_ARG);
        log.info("编辑数表名称");
        boolean flag = SqlHelper.retBool(baseMapper.updateNameByDstId(userId, dstId, dstName));
        ExceptionUtil.isTrue(flag, DatabaseException.EDIT_ERROR);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void updateIsDeletedStatus(Long userId, List<String> nodeIds, Boolean isDel) {
        log.info("更改数表和meta的逻辑删除状态");
        baseMapper.updateIsDeletedByNodeIds(userId, nodeIds, isDel);
        datasheetMetaMapper.updateIsDeletedByNodeId(userId, nodeIds, isDel);
    }

    private SnapshotMapRo initialize() {
        // 获取语言
        Locale currentLang = LocaleContextHolder.getLocale();
        //调用模板获取Snapshot
        Map<String, Object> metaMap = MapUtil.newHashMap();

        int initLength = 4;
        for (int i = 0; i < initLength; i++) {
            String fieldId = IdUtil.createFieldId();
            //模板绑定动态参数
            metaMap.put("fieldId" + i, fieldId);
            String recordId = IdUtil.createRecordId();
            metaMap.put("recordId" + i, recordId);
        }

        String viewId = IdUtil.createViewId();
        metaMap.put("viewId", viewId);
        // 国际化-元素
        // 视图名称
        metaMap.put("defaultView", VikaStrings.t("default_view", currentLang));
        // Datasheet标题列
        metaMap.put("defaultDatasheetTitle", VikaStrings.t("default_datasheet_title", currentLang));
        // Datasheet选项列
        metaMap.put("defaultDatasheetOptions", VikaStrings.t("default_datasheet_options", currentLang));
        // Datasheet附件列
        metaMap.put("defaultDatasheetAttachments", VikaStrings.t("default_datasheet_attachments", currentLang));
        // 国际化-元素
        String snapshotJson = beetlTemplate.render("datasheet-meta-blank-tpl.btl", metaMap);
        return new JSONObject(snapshotJson).toBean(SnapshotMapRo.class);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public List<String> copy(Long userId, String spaceId, String sourceDstId, String destDstId, String destDstName,
            NodeCopyOptions options, Map<String, String> newNodeMap) {
        log.info("复制数表");
        //复制对应的数表、meta和record
        DatasheetEntity datasheet = DatasheetEntity.builder()
                .dstName(destDstName)
                .dstId(destDstId)
                .nodeId(destDstId)
                .spaceId(spaceId)
                .createdBy(userId)
                .updatedBy(userId)
                .build();
        this.save(datasheet);
        //处理metaData
        NodeCopyDTO nodeCopyDTO = this.processMeta(userId, spaceId, sourceDstId, destDstId, options, newNodeMap);
        MetaMapRo metaMapRo = nodeCopyDTO.getMetaMapRo();
        //保存record
        if (ObjectUtil.isNotNull(options) && options.isCopyData()) {
            datasheetRecordService.copyRecords(userId, sourceDstId, datasheet.getDstId(), nodeCopyDTO, options.isRetainRecordMeta());
        }
        else {
            //移除各个视图rows内的原来recordId、填补一行空行
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
            //保存record信息
            JSONObject recordMap = JSONUtil.createObj();
            // 补充这一行中的自增字段数据
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
        //保存Meta信息
        datasheetMetaService.create(userId, datasheet.getDstId(), JSONUtil.parseObj(metaMapRo).toString());
        return nodeCopyDTO.getLinkFieldIds();
    }

    private NodeCopyDTO processMeta(Long userId, String spaceId, String sourceDstId, String destDstId, NodeCopyOptions options, Map<String, String> newNodeMap) {
        List<String> delFieldIds = new ArrayList<>();
        List<String> autoNumberFieldIds = new ArrayList<>();
        // 获取原节点对应数表信息
        DatasheetMetaVo metaVo = datasheetMetaService.findByDstId(sourceDstId);
        MetaMapRo metaMapRo = metaVo.getMeta().toBean(MetaMapRo.class);
        // 获取原节点所属的空间ID，若与复制/转存后的空间不一致，则需清除成员字段相关的数据
        String sourceSpaceId = nodeMapper.selectSpaceIdByNodeId(sourceDstId);
        boolean sameSpace = spaceId.equals(sourceSpaceId);
        // 开始处理
        List<String> delFieldIdsInView = new ArrayList<>();
        List<String> linkFieldIds = new ArrayList<>();
        boolean filterPermissionField = options.isFilterPermissionField() && MapUtil.isNotEmpty(options.getDstPermissionFieldsMap());
        JSONObject fieldMap = JSONUtil.createObj();
        String uuid = userMapper.selectUuidById(userId);
        for (Object field : metaMapRo.getFieldMap().values()) {
            FieldMapRo fieldMapRo = JSONUtil.parseObj(field).toBean(FieldMapRo.class);
            // 判断本表字段是否开启了列权限，若是过滤删除该字段
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
                        // 判断关联表对应的关联字段是否开启了列权限，若是过滤删除该字段
                        if (filterPermissionField) {
                            List<String> permissionFieldIds = options.getDstPermissionFieldsMap().get(foreignDstId);
                            if (permissionFieldIds != null && permissionFieldIds.contains(property.getBrotherFieldId())) {
                                delFieldIds.add(fieldMapRo.getId());
                                delFieldIdsInView.add(fieldMapRo.getId());
                                continue;
                            }
                        }
                        // 关联表一起转存，关联的数表ID替换成复制出来的关联表ID
                        property.setForeignDatasheetId(newNodeMap.get(foreignDstId));
                    }
                    else if (ObjectUtil.isNotNull(options) && options.isAddColumn()) {
                        // 判断关联表的列是否超出限制
                        DatasheetMetaVo meta = datasheetMetaService.findByDstId(foreignDstId);
                        MetaMapRo mapRo = meta.getMeta().toBean(MetaMapRo.class);
                        // 校验关联表的列数是否超过 200列限制
                        ExceptionUtil.isTrue(mapRo.getFieldMap().size() < limitProperties.getMaxColumnCount(), NodeException.LINK_DATASHEET_COLUMN_EXCEED_LIMIT);
                        // 转换成文本，放room-server去修改列,并且填入数据
                        fieldMapRo.setType(FieldType.TEXT.getFieldType());
                        linkFieldIds.add(fieldMapRo.getId());
                        property = null;
                    }
                    else {
                        // 关联表未一起转存，删除该关联列
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
                        // 未复制记录数据时，自动填补一行空行，所以自增字段下一个值为2
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
        // 若存在删除列，视图中columns对应删除处理
        this.delViewFieldId(metaMapRo, delFieldIdsInView, delFieldIds);
        // 复制组件面板
        this.copyWidgetPanels(userId, spaceId, destDstId, metaMapRo, newNodeMap);
        return new NodeCopyDTO(metaMapRo, delFieldIds, autoNumberFieldIds, linkFieldIds);
    }

    /**
     * 在数表增加列处理
     */
    private void addColumn(MetaMapRo metaMapRo, FieldMapRo fieldMapRo) {
        // filedMap处理
        JSONObject fieldMap1 = metaMapRo.getFieldMap();
        fieldMap1.set(fieldMapRo.getId(), JSONUtil.parseObj(fieldMapRo));
        metaMapRo.setFieldMap(fieldMap1);
        // 视图中columns处理
        JSONObject fieldJson = JSONUtil.createObj();
        fieldJson.set("fieldId", fieldMapRo.getId());
        JSONArray views = JSONUtil.createArray();
        metaMapRo.getViews().jsonIter().forEach(view -> {
            ViewMapRo viewMapRo = JSONUtil.toBean(view, ViewMapRo.class);
            JSONArray columns = viewMapRo.getColumns();
            columns.add(fieldJson);
            viewMapRo.setColumns(columns);
            views.add(viewMapRo);
        });
        metaMapRo.setViews(views);
    }

    /**
     * 删除视图中，包含指定的fieldId的属性信息
     */
    private void delViewFieldId(MetaMapRo metaMapRo, List<String> delFieldIds, List<String> delFieldIdsInFilter) {
        if (CollUtil.isNotEmpty(delFieldIds) || CollUtil.isNotEmpty(delFieldIdsInFilter)) {
            JSONArray views = JSONUtil.createArray();
            metaMapRo.getViews().jsonIter().forEach(view -> {
                ViewMapRo viewMapRo = JSONUtil.toBean(view, ViewMapRo.class);
                // columns处理
                JSONArray columns = delInfoIfExistFieldId(delFieldIds, viewMapRo.getColumns());
                viewMapRo.setColumns(columns);
                // filterInfo处理
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
                // sortInfo处理
                JSONArray sortInfo = delInfoIfExistFieldId(delFieldIds, viewMapRo.getSortInfo());
                viewMapRo.setSortInfo(sortInfo);
                // groupInfo处理
                JSONArray groupInfo = delInfoIfExistFieldId(delFieldIds, viewMapRo.getGroupInfo());
                viewMapRo.setGroupInfo(groupInfo);
                //style处理
                JSONObject style = viewMapRo.getStyle();
                if(!JSONUtil.isNull(style)){
                    Object object = style.get("coverFieldId");
                    if(object != null && delFieldIds.contains(object.toString())){
                        style.set("coverFieldId", null);
                        viewMapRo.setStyle(style);
                    }
                    Object object1 = style.get("kanbanFieldId");
                    if(object1 != null && delFieldIds.contains(object1.toString())){
                        style.set("kanbanFieldId", null);
                        viewMapRo.setStyle(style);
                    }
                    Object object2 = style.get("startFieldId");
                    if (object2 != null && delFieldIds.contains(object2.toString())){
                        style.set("startFieldId", null);
                        viewMapRo.setStyle(style);
                    }
                    Object object3 = style.get("endFieldId");
                    if(object3 != null && delFieldIds.contains(object3.toString())){
                        style.set("endFieldId", null);
                        viewMapRo.setStyle(style);
                    }
                    Object object4 = style.get("linkFieldId");
                    if(object4 != null && delFieldIds.contains(object4.toString())){
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
     * 删除对象数组中，包含指定fieldId的对象
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
     * 复制组件面板
     */
    private void copyWidgetPanels(Long userId, String spaceId, String destDstId, MetaMapRo metaMapRo, Map<String, String> newNodeMap) {
        // 构造新的组件面板
        Map<String, String> newWidgetIdMap = new HashMap<>(8);
        JSONArray newWidgetPanels = this.generateWidgetPanels(metaMapRo.getWidgetPanels(), newWidgetIdMap);
        if (newWidgetIdMap.isEmpty()) {
            return;
        }

        // 新创建组件ID-数据源数表ID MAP
        DatasheetWidgetDTO datasheetWidgetDTO = new DatasheetWidgetDTO(destDstId, destDstId);
        Map<String, DatasheetWidgetDTO> newWidgetIdToDstMap = newWidgetIdMap.values().stream()
                .collect(Collectors.toMap(id -> id, id -> datasheetWidgetDTO));

        metaMapRo.setWidgetPanels(newWidgetPanels);
        // 批量生成新的组件
        iWidgetService.copyBatch(userId, spaceId, newNodeMap, newWidgetIdMap, newWidgetIdToDstMap);
    }

    @Override
    public JSONArray generateWidgetPanels(JSONArray widgetPanels, Map<String, String> newWidgetIdMap) {
        // 构造新的组件面板
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
            // 构造新的组件信息
            JSONArray newWidgets = JSONUtil.createArray();
            for (JSONObject widget : widgets.jsonIter()) {
                String widgetId = widget.getStr("id");
                if (widgetId == null) {
                    newWidgets.add(widget);
                    continue;
                }
                // 记录旧组件ID 与新组件ID 映射
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
        log.info("查询关联数表ID");
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
                        // 是否过滤dstIdList
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
        log.info("删除指定关联数表的字段");
        if (CollUtil.isNotEmpty(linkDstIds)) {
            // 获取数表信息
            DatasheetMetaVo meta = datasheetMetaService.findByDstId(dstId);
            MetaMapRo metaMapRo = meta.getMeta().toBean(MetaMapRo.class);
            List<String> delFieldIds = new ArrayList<>();
            // 找到关联数表的字段ID
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
            // fieldMap处理
            delFieldIds.forEach(fieldId -> metaMapRo.getFieldMap().remove(fieldId));
            // view的属性处理
            this.delViewFieldId(metaMapRo, delFieldIds, delFieldIds);
            if (saveDb && CollUtil.isNotEmpty(delFieldIds)) {
                // 保存更改
                datasheetMetaService.edit(userId, dstId, MetaOpRo.builder().meta(JSONUtil.parseObj(metaMapRo)).build());
            }
            // record处理
            DatasheetRecordMapVo recordMapVo = datasheetRecordService.delFieldData(dstId, delFieldIds, saveDb);
            return SnapshotMapRo.builder().meta(JSONUtil.parseObj(metaMapRo)).recordMap(recordMapVo.getRecordMap()).build();
        }
        return null;
    }

    @Override
    public Map<String, SnapshotMapRo> findSnapshotMapByDstIds(List<String> dstIds, boolean hasRecordMap) {
        log.info("获取多个数表及对应的snapshot");
        List<SnapshotDto> dtoList = new ArrayList<>();
        List<DatasheetMetaDTO> metaList = iDatasheetMetaService.findMetaDtoByDstIds(dstIds);
        if (CollUtil.isNotEmpty(metaList)) {
            Map<String, String> dstIdToMetaMap = metaList.stream().collect(Collectors.toMap(DatasheetMetaDTO::getDstId, DatasheetMetaDTO::getMetaData));
            Map<String, JSONObject> dstIdToRecordMapMap = new HashMap<>(dstIdToMetaMap.size());
            if (hasRecordMap) {
                List<DatasheetRecordMapVo> mapByDstIds = datasheetRecordService.findMapByDstIds(dstIdToMetaMap.keySet());
                dstIdToRecordMapMap = mapByDstIds.stream().collect(Collectors.toMap(DatasheetRecordMapVo::getDstId, DatasheetRecordMapVo::getRecordMap));
            }
            Map<String, JSONObject> finalDstIdToRecordMapMap = dstIdToRecordMapMap;
            dstIdToMetaMap.keySet().forEach(dstId -> {
                // 获取snapshot
                JSONObject recordMap = finalDstIdToRecordMapMap.get(dstId);
                SnapshotMapRo snapshotMapRo = SnapshotMapRo.builder()
                        .meta(JSONUtil.parseObj(dstIdToMetaMap.get(dstId)))
                        .recordMap(Optional.ofNullable(recordMap).orElse(JSONUtil.createObj()))
                        .build();
                dtoList.add(new SnapshotDto(dstId, snapshotMapRo));
            });
        }
        return dtoList.stream().collect(Collectors.toMap(SnapshotDto::getDstId, SnapshotDto::getSnapshot));
    }

    @Override
    public List<String> replaceFieldDstId(Long userId, boolean sameSpace, MetaMapRo metaMapRo, Map<String, String> newNodeIdMap) {
        log.info("替换字段属性中的数表ID");
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
                        // 找不到可替换的，删除列
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
        // 若存在删除列，视图中columns对应删除处理
        this.delViewFieldId(metaMapRo, delFieldIdsInView, delFieldIds);
        return delFieldIds;
    }

    @Override
    public void remindMemberRecOp(Long userId, String spaceId, RemindMemberRo ro) {
        log.info("成员字段提及他人记录操作");
        boolean notify = BooleanUtil.isTrue(ro.getIsNotify());
        if (notify) {
            ExceptionUtil.isTrue(StrUtil.isNotBlank(ro.getNodeId()) && StrUtil.isNotBlank(ro.getViewId()), INCORRECT_ARG);
        }
        Set<Long> unitIds = new HashSet<>();
        ro.getUnitRecs().forEach(remindUnitRecRo -> {
            ExceptionUtil.isNotEmpty(remindUnitRecRo.getUnitIds(), INCORRECT_ARG);
            unitIds.addAll(remindUnitRecRo.getUnitIds());
        });
        List<UnitEntity> units = unitMapper.selectBatchIds(unitIds);
        units.stream().filter(unit -> unit.getSpaceId().equals(spaceId)).findFirst()
                .orElseThrow(() -> new BusinessException("跨空间提交数据"));
        // 刷新提及的成员记录缓存
        userSpaceRemindRecordService.refresh(userId, spaceId, CollUtil.newArrayList(unitIds));
        if (notify) {
            // split roles into members and teams
            Map<Long, List<Long>> roleUnitIdToRoleMemberUnitIds = getRoleMemberUnits(units);
            // 自己无须发送通知，过滤
            Long memberId = userId == null ? -2L : memberMapper.selectIdByUserIdAndSpaceId(userId, spaceId);
            // 获取成员类型的组织单元，对应的成员
            Map<Long, Long> unitIdToMemberIdMap = units.stream()
                    .filter(unit -> unit.getUnitType().equals(UnitType.MEMBER.getType())
                            && unit.getSpaceId().equals(spaceId) && !unit.getUnitRefId().equals(memberId))
                    // 对节点拥有读取权限的成员才发送通知
                    .filter(unitEntity -> controlTemplate.hasNodePermission(unitEntity.getUnitRefId(), ro.getNodeId(), NodePermission.READ_NODE))
                    .collect(Collectors.toMap(UnitEntity::getId, UnitEntity::getUnitRefId));
            List<Long> memberIds = new ArrayList<>(unitIdToMemberIdMap.values());
            // 获取部门类型的组织单元，对应的成员列表
            Map<Long, List<Long>> unitIdToMemberIdsMap = MapUtil.newHashMap();
            Map<Long, Long> teamIdToUnitIdMap = units.stream().filter(unit -> unit.getUnitType().equals(UnitType.TEAM.getType())
                    && unit.getSpaceId().equals(spaceId)).collect(Collectors.toMap(UnitEntity::getUnitRefId, UnitEntity::getId));
            List<Long> teamIds = new ArrayList<>(teamIdToUnitIdMap.keySet());
            if (CollUtil.isNotEmpty(teamIds)) {
                List<TeamMemberRelEntity> teamMemberRelEntities = teamMemberRelMapper.selectByTeamIds(teamIds);
                teamMemberRelEntities.stream()
                        .filter(rel -> !rel.getMemberId().equals(memberId))
                        // 对节点拥有读取权限的成员才发送通知
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
            // 去重，构建通知消息
            List<Long> distinctMemberIds = CollUtil.distinct(memberIds);
            List<Long> userIds = memberMapper.selectUserIdsByMemberIds(distinctMemberIds);
            CollUtil.removeNull(userIds);
            if (CollUtil.isEmpty(userIds)) {
                return;
            }
            ro.getUnitRecs().forEach(remindUnitRecRo -> {
                String recordTitle = StrUtil.blankToDefault(remindUnitRecRo.getRecordTitle(), VikaStrings.t("record_unnamed"));
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
                        // 评论内容
                        extras.set("commentContent", HtmlUtil.unescape(HtmlUtil.cleanHtmlTag(ro.getExtra().getContent())));
                    }
                    body.set(BODY_EXTRAS, extras);
                    // 发送通知
                    NotificationCreateRo notifyRo = new NotificationCreateRo();
                    notifyRo.setToMemberId(ListUtil.toList(Convert.toStrArray(toMemberIds)));
                    notifyRo.setFromUserId(userId == null ? "-2" : userId.toString());
                    notifyRo.setNodeId(ro.getNodeId());
                    notifyRo.setSpaceId(spaceId);
                    // 用于标记邮件跳转已读
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
                    // 保存通知记录
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
                    // 默认 - 订阅邮件通知
                    if (!templateId.equals(NotificationTemplateId.SINGLE_RECORD_MEMBER_MENTION.getValue())) {
                        remindMemberOpSubject.registerObserver(datasheetRemindObservers.get(RemindSubjectType.EMIL));
                    }
                    // 检查空间是否绑定第三方集成
                    TenantBindDTO bindInfo = iSocialTenantBindService.getTenantBindInfoBySpaceId(meta.getSpaceId());
                    if (bindInfo != null) {
                        String appId = bindInfo.getAppId();
                        if (StrUtil.isBlank(appId)) {
                            log.warn("[提及通知]-第三方IM配置缺失，TenantId：{}，缺失AppId请检查!", bindInfo.getTenantId());
                        }
                        else {
                            SocialTenantEntity tenantEntity = iSocialTenantService.getByAppIdAndTenantId(appId, bindInfo.getTenantId());
                            SocialPlatformType platform = tenantEntity != null ? SocialPlatformType.toEnum(tenantEntity.getPlatform()) : null;
                            String remindSubjectType = RemindSubjectType.transform2ImSubject(platform);
                            if (StrUtil.isBlank(remindSubjectType)) {
                                log.warn("[提及通知]-第三方IM「{}」未订阅推送服务", platform);
                            }
                            else {
                                DatasheetObserver observer = datasheetRemindObservers.get(remindSubjectType);
                                if (null == observer) {
                                    log.warn("[提及通知]-第三方IM「{}」订阅推送服务未启用", platform);
                                }
                                else {
                                    meta.setSocialTenantId(bindInfo.getTenantId())
                                            .setSocialAppId(appId)
                                            .setAppType(Optional.ofNullable(tenantEntity)
                                                    .map(SocialTenantEntity::getAppType)
                                                    .orElse(null));
                                    // 订阅第三方IM通知
                                    remindMemberOpSubject.registerObserver(observer);
                                }
                            }
                        }
                    }
                    // 推送给观察者消息
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
        log.info("转换被删除的关联字段");
        if (MapUtil.isNotEmpty(dstIdToDelDstIdsMap)) {
            // 获取所有数表的snapshot
            List<String> nodeIds = CollUtil.newArrayList(dstIdToDelDstIdsMap.keySet());
            Map<String, SnapshotMapRo> snapshotMap = this.findSnapshotMapByDstIds(nodeIds, false);
            // snapshot 的 recordMap 不带记录表ID，更改需要，分开获取
            List<DataSheetRecordDto> dataSheetRecordDtoList = datasheetRecordMapper.selectDtoByDstIds(nodeIds);
            Map<String, List<DataSheetRecordDto>> recordDtoMap = dataSheetRecordDtoList.stream().collect(Collectors.groupingBy(DataSheetRecordDto::getDstId));
            // 处理数表，获得各数表的关联字段映射关联表ID的关系，各数表需要修改的记录行集合；各关联表，对应被使用的记录行集合
            Map<String, Map<String, String>> dstIdToFldLinkDstIdMap = MapUtil.newHashMap();
            Map<String, Set<String>> dstIdToUpdateRecIdsMap = MapUtil.newHashMap();
            Map<String, Set<String>> linkDstIdToRecIdsMap = MapUtil.newHashMap();
            for (Map.Entry<String, List<String>> entry : dstIdToDelDstIdsMap.entrySet()) {
                String dstId = entry.getKey();
                List<String> linkDstIds = entry.getValue();
                SnapshotMapRo snapshotMapRo = snapshotMap.get(dstId);
                // 防止脏数据，造成删除失败
                if (snapshotMapRo == null) {
                    continue;
                }
                MetaMapRo metaMapRo = JSONUtil.parseObj(snapshotMapRo.getMeta()).toBean(MetaMapRo.class);
                Map<String, String> fldIdToLinkDstIdMap = MapUtil.newHashMap();
                // 找到关联数表的字段ID
                metaMapRo.getFieldMap().values().forEach(field -> {
                    FieldMapRo fieldMapRo = JSONUtil.parseObj(field).toBean(FieldMapRo.class);
                    if (fieldMapRo.getType().equals(FieldType.LINK.getFieldType())) {
                        LinkFieldProperty property = fieldMapRo.getProperty().toBean(LinkFieldProperty.class);
                        String foreignDstId = property.getForeignDatasheetId();
                        if (linkDstIds.contains(foreignDstId)) {
                            // 记录该列对应的关联数表，将该列转换为文本字段
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
                // 保存更改
                datasheetMetaService.edit(userId, dstId, MetaOpRo.builder().meta(JSONUtil.parseObj(metaMapRo)).build());
                // 遍历recordMap，记录数表对应需要修改的recordId 集合、关联表对应被使用的 recordId 集合
                Set<String> updateRecIds = new HashSet<>();
                List<DataSheetRecordDto> recordMap = recordDtoMap.get(dstId);
                // 本表没有记录，无需要转换的单元格数据
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
            // 处理被删除的关联字段列数据
            this.processDeletedLinkFieldData(recordDtoMap, dstIdToFldLinkDstIdMap, dstIdToUpdateRecIdsMap, linkDstIdToRecIdsMap);
        }
    }

    /**
     * 处理被删除的关联字段列数据
     *
     * @param recordDtoMap           数表 -> recordDto 集合
     * @param dstIdToFldLinkDstIdMap 数表 -> (关联字段 -> 关联表ID)
     * @param dstIdToUpdateRecIdsMap 数表 -> 需要修改的recordId 集合
     * @param linkDstIdToRecIdsMap   关联表 -> 被使用的recordId 集合
     */
    private void processDeletedLinkFieldData(Map<String, List<DataSheetRecordDto>> recordDtoMap, Map<String, Map<String, String>> dstIdToFldLinkDstIdMap,
            Map<String, Set<String>> dstIdToUpdateRecIdsMap, Map<String, Set<String>> linkDstIdToRecIdsMap) {
        if (MapUtil.isEmpty(linkDstIdToRecIdsMap)) {
            return;
        }
        // 关联字段存在关联数据，处理获得各关联表对应被使用的记录映射数据的关系
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
            // 从视图的属性中，找出首列字段ID
            MetaMapRo metaMapRo = JSONUtil.parseObj(snapshotMapRo.getMeta()).toBean(MetaMapRo.class);
            ViewMapRo viewMapRo = JSONUtil.parseObj(metaMapRo.getViews().get(0)).toBean(ViewMapRo.class);
            String firstColumnId = JSONUtil.parseObj(viewMapRo.getColumns().get(0)).get("fieldId").toString();
            // 获取首列字段的属性
            FieldMapRo fieldMapRo = JSONUtil.parseObj(metaMapRo.getFieldMap().get(firstColumnId)).toBean(FieldMapRo.class);
            FieldType fieldType = FieldType.create(fieldMapRo.getType());
            // 遍历被使用的 recordId 集合，组成记录ID和数据的MAP
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
        // 替换原数表关联列中的单元格数据
        List<DatasheetRecordEntity> entities = new ArrayList<>();
        dstIdToUpdateRecIdsMap.forEach((dstId, recIds) -> {
            Map<String, String> fldIdToLinkDstIdMap = dstIdToFldLinkDstIdMap.get(dstId);
            Map<String, DataSheetRecordDto> recIdToDtoMap = recordDtoMap.get(dstId).stream().collect(Collectors.toMap(DataSheetRecordDto::getRecordId, record -> record));
            recIds.forEach(recId -> {
                DataSheetRecordDto recordDto = recIdToDtoMap.get(recId);
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
                                strBuilder.append("未命名记录");
                            }
                            else {
                                strBuilder.append(recIdToValMap.get(cellRecId));
                            }
                        });
                        JSONObject obj = JSONUtil.createObj();
                        obj.set("type", SegmentType.TEXT.getSegmentType());
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
        // 保存更改
        if (CollUtil.isNotEmpty(entities)) {
            datasheetRecordService.updateBatchById(entities, entities.size());
        }
    }

    @Override
    public String parseCellData(FieldType fieldType, JSONObject property, Object cellVal) {
        log.info("解析数表的单元格数据");
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
        // 批量获取数表元数据
        List<DatasheetMetaDTO> metaList = iDatasheetMetaService.findMetaDtoByDstIds(dstIdList);
        if (CollUtil.isNotEmpty(metaList)) {
            // 遍历数表元数据
            for (DatasheetMetaDTO meta : metaList) {
                // 构建返回体，节点ID和关联字段名称
                Map<String, List<String>> map = new HashMap<>();
                List<String> foreignFieldNames = new ArrayList<>();
                MetaMapRo metaMapRo = JSONUtil.parseObj(meta.getMetaData()).toBean(MetaMapRo.class);
                for (Object field : metaMapRo.getFieldMap().values()) {
                    FieldMapRo fieldMapRo = JSONUtil.parseObj(field).toBean(FieldMapRo.class);
                    // 判断是否存在关联字段
                    if (fieldMapRo.getType().equals(FieldType.LINK.getFieldType())) {
                        LinkFieldProperty property = fieldMapRo.getProperty().toBean(LinkFieldProperty.class);
                        // 判断关联字段是否关联外表
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
