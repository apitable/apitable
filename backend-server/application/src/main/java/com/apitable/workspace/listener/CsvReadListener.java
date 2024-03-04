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

package com.apitable.workspace.listener;

import cn.hutool.core.map.MapUtil;
import cn.hutool.core.util.StrUtil;
import cn.hutool.json.JSONObject;
import cn.hutool.json.JSONUtil;
import com.alibaba.excel.context.AnalysisContext;
import com.alibaba.excel.event.AnalysisEventListener;
import com.alibaba.excel.util.ListUtils;
import com.apitable.shared.sysconfig.i18n.I18nStringsUtil;
import com.apitable.shared.util.IdUtil;
import com.apitable.workspace.dto.NodeData;
import com.apitable.workspace.entity.DatasheetEntity;
import com.apitable.workspace.entity.DatasheetMetaEntity;
import com.apitable.workspace.entity.DatasheetRecordEntity;
import com.apitable.workspace.entity.NodeEntity;
import com.apitable.workspace.enums.FieldType;
import com.apitable.workspace.enums.NodeType;
import com.apitable.workspace.enums.ViewType;
import com.apitable.workspace.ro.FieldMapRo;
import com.apitable.workspace.ro.RecordDataRo;
import com.apitable.workspace.service.INodeService;
import com.baomidou.mybatisplus.core.toolkit.IdWorker;
import java.time.Clock;
import java.time.Duration;
import java.time.Instant;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import lombok.Data;
import lombok.extern.slf4j.Slf4j;

/**
 * CSV data parser listener.
 */
@Slf4j
public class CsvReadListener extends AnalysisEventListener<Map<Integer, String>> {

    /**
     * Store the database every 100, and then clean it up to facilitate memory recovery.
     */
    private static final int BATCH_COUNT = 100;

    private List<DatasheetRecordEntity> recordEntities =
        ListUtils.newArrayListWithExpectedSize(BATCH_COUNT);

    private Map<Integer, String> sheetHeadMap;

    private Meta meta;

    private final JSONObject fieldUpdatedInfo = new JSONObject();

    private final String retNodeId;

    private final INodeService iNodeService;

    private final Long userId;

    private final String spaceId;

    private final Long memberId;

    private final String parentNodeId;

    private final String viewName;

    private final String fileName;

    private final Long unitId;

    /**
     * constructor.
     *
     * @param nodeService  node service
     * @param userId       user id
     * @param uuid         user uuid
     * @param spaceId      space id
     * @param memberId     member id
     * @param parentNodeId parent node id
     * @param viewName     view name
     * @param fileName     file name
     * @param unitId       unit id
     */
    public CsvReadListener(INodeService nodeService, Long userId, String uuid, String spaceId,
                           Long memberId, String parentNodeId, Long unitId, String viewName,
                           String fileName) {
        this.iNodeService = nodeService;
        this.userId = userId;
        this.spaceId = spaceId;
        this.memberId = memberId;
        this.parentNodeId = parentNodeId;
        this.viewName = viewName;
        this.fileName = fileName;
        this.unitId = unitId;
        this.retNodeId = IdUtil.createDstId();

        fieldUpdatedInfo.set("createdAt",
            Instant.now(Clock.system(ZoneId.of("+8"))).toEpochMilli());
        fieldUpdatedInfo.set("createdBy", uuid);
    }

    @Override
    public void invokeHeadMap(Map<Integer, String> headMap, AnalysisContext context) {
        log.info("parse to header information");
        initHead(headMap);
    }

    private void initHead(Map<Integer, String> headMap) {
        // Column length, possibly 0
        int headSize = headMap.size();
        meta = new Meta(headSize);

        sheetHeadMap = new LinkedHashMap<>(headSize);

        // The sequence definition order for the first default view,
        View view = new View(headSize, 0);
        view.id = IdUtil.createViewId();
        view.name = viewName != null ? viewName : I18nStringsUtil.t("default_view");
        view.type = ViewType.GRID.getType();
        view.frozenColumnCount = 1;

        // traverse columns in order
        headMap.forEach((index, cellValue) -> {
            String fieldName =
                StrUtil.isBlank(cellValue) ? String.format("the %d col", index + 1) : cellValue;
            String fieldId = IdUtil.createFieldId();
            // storage column id
            sheetHeadMap.put(index, fieldId);
            meta.fieldMap.putOnce(fieldId,
                FieldMapRo.builder()
                    .id(fieldId)
                    .name(fieldName)
                    .type(FieldType.TEXT.getFieldType())
                    .build()
            );
            // view column
            Column column = new Column(fieldId);
            if (index == 0) {
                // Add the total number of statistical records in the first column
                column.statType = 1;
            }
            view.columns.add(column);
        });

        meta.views.add(view);
    }

    @Override
    public void invoke(Map<Integer, String> data, AnalysisContext context) {
        if (MapUtil.isEmpty(sheetHeadMap)) {
            // The column header is empty, and all columns are filled according to the current number of rows.
            if (!data.isEmpty()) {
                sheetHeadMap = new LinkedHashMap<>(data.size());
                for (int index = 0; index < data.size(); index++) {
                    String fieldName = String.format("the %d col", index + 1);
                    String fieldId = IdUtil.createFieldId();
                    sheetHeadMap.put(index, fieldId);
                    meta.fieldMap.putOnce(fieldId,
                        FieldMapRo.builder()
                            .id(fieldId)
                            .name(fieldName)
                            .type(FieldType.TEXT.getFieldType())
                            .build()
                    );
                    // view column
                    Column column = new Column(fieldId);
                    if (index == 0) {
                        // Add the total number of statistical records in the first column
                        column.statType = 1;
                    }
                    meta.views.get(0).columns.add(column);
                }
            }
        } else {
            if (!data.isEmpty()) {
                if (sheetHeadMap.size() < data.size()) {
                    // invokeHeadMap the number of columns resolved is less than this
                    // If each row of data is actually 5 columns, and the column header has defined values in only the first 3 columns,
                    // such as: 0 -> the first column, 1-> the second column, 2 -> the third column.
                    // then the following columns need to be complete，
                    for (int index = sheetHeadMap.size(); index < data.size(); index++) {
                        String fieldName = String.format("the %d col", index + 1);
                        String fieldId = IdUtil.createFieldId();
                        sheetHeadMap.put(index, fieldId);
                        meta.fieldMap.putOnce(fieldId,
                            FieldMapRo.builder()
                                .id(fieldId)
                                .name(fieldName)
                                .type(FieldType.TEXT.getFieldType())
                                .build()
                        );
                        // view column
                        meta.views.get(0).columns.add(new Column(fieldId));
                    }
                }
            }
        }

        String recordId = IdUtil.createRecordId();
        meta.views.get(0).rows.add(new Row(recordId));

        JSONObject recordData = new JSONObject();

        for (Entry<Integer, String> entry : data.entrySet()) {
            if ((StrUtil.isNotBlank(entry.getValue()))) {
                recordData.putOnce(sheetHeadMap.get(entry.getKey()), JSONUtil.createArray().set(
                    RecordDataRo.builder().text(entry.getValue())
                        .type(FieldType.TEXT.getFieldType()).build()));
            }
        }

        recordEntities.add(DatasheetRecordEntity.builder()
            .id(IdWorker.getId())
            .dstId(retNodeId)
            .recordId(recordId)
            .data(recordData.toString())
            .fieldUpdatedInfo(fieldUpdatedInfo.toString())
            .createdBy(userId)
            .updatedBy(userId)
            .build());

        if (recordEntities.size() >= BATCH_COUNT) {
            saveRecords();
            recordEntities = ListUtils.newArrayListWithExpectedSize(BATCH_COUNT);
        }
    }

    public void saveRecords() {
        log.info("save line records in batches");
        iNodeService.batchSaveDstRecords(recordEntities);
    }

    @Override
    public void doAfterAllAnalysed(AnalysisContext context) {
        log.info("======================analysis completed==============================");

        if (meta == null) {
            initHead(MapUtil.of(0, "标题"));
        }

        List<NodeEntity> nodeEntities = new ArrayList<>();
        nodeEntities.add(NodeEntity.builder()
            .id(IdWorker.getId())
            .spaceId(spaceId)
            .parentId(parentNodeId)
            .preNodeId(null)
            .nodeId(retNodeId)
            .nodeName(fileName)
            .type(NodeType.DATASHEET.getNodeType())
            .isTemplate(false)
            .unitId(unitId)
            .creator(memberId)
            .createdBy(userId)
            .updatedBy(userId).build());

        List<DatasheetEntity> datasheetEntities = new ArrayList<>();
        datasheetEntities.add(DatasheetEntity.builder()
            .id(IdWorker.getId())
            .spaceId(spaceId)
            .nodeId(retNodeId)
            .dstId(retNodeId)
            .dstName(fileName)
            .revision(0L)
            .creator(memberId)
            .build());

        List<DatasheetMetaEntity> metaEntities = new ArrayList<>();
        metaEntities.add(DatasheetMetaEntity.builder()
            .id(IdWorker.getId())
            .dstId(retNodeId)
            .metaData(JSONUtil.toJsonStr(meta))
            .revision(0L)
            .createdBy(userId)
            .updatedBy(userId)
            .build());

        log.info("start bulk insertion");
        long begin = System.currentTimeMillis();
        iNodeService.batchCreateDataSheet(
            new NodeData(null, retNodeId, null, null, parentNodeId),
            nodeEntities, datasheetEntities, metaEntities, recordEntities
        );
        long end = System.currentTimeMillis();
        log.info("insert complete: {}", Duration.ofMillis(end - begin).getSeconds());
    }

    public String getRetNodeId() {
        return retNodeId;
    }

    @Data
    static class Meta {

        Views views;

        JSONObject fieldMap;

        Meta(int fieldSize) {
            views = new Views();
            fieldMap = new JSONObject(fieldSize, true);
        }
    }

    static class Views extends ArrayList<View> {

        public Views() {
            super(1);
        }
    }

    @Data
    static class View {

        String id;

        String name;

        Integer type;

        Integer frozenColumnCount;

        Boolean authSave = false;

        Columns columns;

        Rows rows;

        public View(int columnSize, int rowSize) {
            columns = new Columns(columnSize);
            rows = new Rows(rowSize);
        }
    }

    static class Columns extends ArrayList<Column> {

        public Columns(int initialCapacity) {
            super(initialCapacity);
        }
    }

    @Data
    static class Column {

        public Column(String fieldId) {
            this.fieldId = fieldId;
        }

        String fieldId;

        Integer statType;
    }

    static class Rows extends ArrayList<Row> {

        public Rows(int initialCapacity) {
            super(initialCapacity);
        }
    }

    @Data
    static class Row {
        String recordId;

        public Row(String recordId) {
            this.recordId = recordId;
        }
    }
}
