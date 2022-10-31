package com.vikadata.api.modular.workspace.listener;

import java.time.Clock;
import java.time.Instant;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;

import cn.hutool.core.map.MapUtil;
import cn.hutool.core.util.StrUtil;
import cn.hutool.json.JSONObject;
import cn.hutool.json.JSONUtil;
import com.alibaba.excel.context.AnalysisContext;
import com.alibaba.excel.event.AnalysisEventListener;
import com.alibaba.excel.read.metadata.ReadSheet;
import com.alibaba.excel.util.ListUtils;
import com.baomidou.mybatisplus.core.toolkit.IdWorker;
import lombok.Data;
import lombok.extern.slf4j.Slf4j;

import com.vikadata.api.config.properties.LimitProperties;
import com.vikadata.api.enums.datasheet.FieldType;
import com.vikadata.api.enums.datasheet.ViewType;
import com.vikadata.api.model.ro.datasheet.FieldMapRo;
import com.vikadata.api.model.ro.datasheet.RecordDataRo;
import com.vikadata.api.modular.workspace.service.INodeService;
import com.vikadata.api.util.IdUtil;
import com.vikadata.api.util.VikaStrings;
import com.vikadata.core.util.ExceptionUtil;
import com.vikadata.define.enums.NodeType;
import com.vikadata.entity.DatasheetEntity;
import com.vikadata.entity.DatasheetMetaEntity;
import com.vikadata.entity.DatasheetRecordEntity;
import com.vikadata.entity.NodeEntity;

import org.springframework.util.StopWatch;

import static com.vikadata.api.enums.exception.ActionException.COLUMN_EXCEED_LIMIT;
import static com.vikadata.api.enums.exception.ActionException.ROW_EXCEED_LIMIT;

/**
 * multi table analysis listener
 */
@Slf4j
public class MultiSheetReadListener extends AnalysisEventListener<Map<Integer, String>> {

    /**
     * Store the database every 100, and then clean it up to facilitate memory recovery.
     */
    private static final int BATCH_COUNT = 100;

    private List<DatasheetRecordEntity> recordEntities = ListUtils.newArrayListWithExpectedSize(BATCH_COUNT);

    /**
     * sheet[index] -> index head
     */
    private Map<String, Map<Integer, String>> sheetHeadMap = new LinkedHashMap<>();

    private Map<String, NodeData> nodeMap = new LinkedHashMap<>();

    private Map<String, Meta> metaMap = new LinkedHashMap<>();

    private JSONObject fieldUpdatedInfo = new JSONObject();

    private INodeService iNodeService;

    private final Long userId;

    private final String spaceId;

    private final Long memberId;

    private final String parentNodeId;

    private final String fileName;

    private final LimitProperties limitProperties = new LimitProperties();

    private NodeData retNodeData = null;

    public MultiSheetReadListener(INodeService iNodeService, Long userId, String uuid, String spaceId, Long memberId, String parentNodeId, String fileName) {
        this.iNodeService = iNodeService;
        this.userId = userId;
        this.spaceId = spaceId;
        this.memberId = memberId;
        this.parentNodeId = parentNodeId;
        this.fileName = fileName;

        fieldUpdatedInfo.set("createdAt", Instant.now(Clock.system(ZoneId.of("+8"))).toEpochMilli());
        fieldUpdatedInfo.set("createdBy", uuid);
    }

    @Override
    public void invokeHeadMap(Map<Integer, String> headMap, AnalysisContext context) {
        // 1. Parse header (if it is a blank sheet, it will not be called here)
        initHead(headMap, context);
    }

    private void initHead(Map<Integer, String> headMap, AnalysisContext context) {
        Integer sheetNo = context.readSheetHolder().getSheetNo();
        String sheetName = context.readSheetHolder().getSheetName();
        log.info("parse to header information, SheetNo:" + sheetNo + ", Sheet: " + sheetName + ", col：" + headMap.size());
        int totalSheetSize = context.readWorkbookHolder().getParameterSheetDataList().size();
        // is there more than one sheet
        if (totalSheetSize > 1) {
            if (retNodeData == null) {
                retNodeData = new NodeData(NodeType.FOLDER, IdUtil.createNodeId(), fileName, null, parentNodeId);
            }
            String preNodeId = sheetNo == 0 ? null : nodeMap.get(context.readWorkbookHolder().getParameterSheetDataList().get(sheetNo - 1).getSheetName()).getNodeId();
            nodeMap.put(sheetName, new NodeData(NodeType.DATASHEET, IdUtil.createDstId(), sheetName, preNodeId, retNodeData.getNodeId()));
        }
        else {
            if (retNodeData == null) {
                retNodeData = new NodeData(NodeType.DATASHEET, IdUtil.createDstId(), fileName, null, parentNodeId);
                nodeMap.put(sheetName, retNodeData);
            }
        }

        // Column length, possibly 0
        int headSize = headMap.size();

        // Consider deleting, consuming memory
        Map<Integer, String> headerMap = new LinkedHashMap<>(headSize);
        Meta meta = new Meta(headSize);

        // The sequence definition order for the first default view,
        int totalRow = context.readSheetHolder().getApproximateTotalRowNumber() != null ? context.readSheetHolder().getApproximateTotalRowNumber() : 0;
        View view = new View(headSize, totalRow);
        view.id = IdUtil.createViewId();
        view.name = VikaStrings.t("default_view");
        view.type = ViewType.GRID.getType();
        view.frozenColumnCount = 1;

        // traverse columns in order
        headMap.forEach((index, cellValue) -> {
            String fieldName = StrUtil.isBlank(cellValue) ? String.format("the %d col", index + 1) : cellValue;
            String fieldId = IdUtil.createFieldId();
            // storage column id
            headerMap.put(index, fieldId);
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

        sheetHeadMap.put(sheetName, headerMap);

        meta.views.add(view);
        metaMap.put(sheetName, meta);
    }

    @Override
    public void invoke(Map<Integer, String> data, AnalysisContext context) {
        // 2. One line parsing data (if it is a blank sheet, it will not be called here)
        String sheetName = context.readSheetHolder().getSheetName();
        Map<Integer, String> headerMap = sheetHeadMap.get(sheetName);
        Meta meta = metaMap.get(sheetName);

        // More than 50,000 rows are not allowed to write to the number table.
        Integer totalRowsIncludingHeader = context.readSheetHolder().getApproximateTotalRowNumber();
        log.info("Actual total number of rows (including header): {}", totalRowsIncludingHeader);
        if (totalRowsIncludingHeader != null) {
            ExceptionUtil.isTrue(totalRowsIncludingHeader - 1 <= limitProperties.getMaxRowCount(), ROW_EXCEED_LIMIT);
        }

        if (headerMap.isEmpty()) {
            // skip blank lines without saving
            if (data.isEmpty()) {
                return;
            }
            // The column header is empty, and all columns are filled according to the current number of rows.
            headerMap = new LinkedHashMap<>(data.size());
            for (int index = 0; index < data.size(); index++) {
                String fieldName = String.format("the %d col", index + 1);
                String fieldId = IdUtil.createFieldId();
                headerMap.put(index, fieldId);
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
            sheetHeadMap.put(sheetName, headerMap);
        }
        else {
            // skip blank lines without saving
            if (data.isEmpty()) {
                return;
            }
            if (headerMap.size() < data.size()) {
                // invokeHeadMap the number of columns resolved is less than this
                // If each row of data is actually 5 columns, and the column header has defined values in only the first 3 columns,
                // such as: 0 -> the first column, 1-> the second column, 2 -> the third column.
                // then the following columns need to be complete，
                for (int index = headerMap.size(); index < data.size(); index++) {
                    String fieldName = String.format("the %d col", index + 1);
                    String fieldId = IdUtil.createFieldId();
                    headerMap.put(index, fieldId);
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
                sheetHeadMap.put(sheetName, headerMap);
            }
        }

        String recordId = IdUtil.createRecordId();
        meta.views.get(0).rows.add(new Row(recordId));

        JSONObject recordData = new JSONObject();

        for (Entry<Integer, String> entry : data.entrySet()) {
            if ((StrUtil.isNotBlank(entry.getValue()))) {
                recordData.putOnce(headerMap.get(entry.getKey()), JSONUtil.createArray().set(RecordDataRo.builder().text(entry.getValue()).type(FieldType.TEXT.getFieldType()).build()));
            }
        }

        recordEntities.add(DatasheetRecordEntity.builder()
                .id(IdWorker.getId())
                .dstId(nodeMap.get(sheetName).getNodeId())
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

    @Override
    public void doAfterAllAnalysed(AnalysisContext context) {
        // 3. the current sheet resolution is complete
        log.info("======================analysis completed==============================");

        // After the sheet is parsed, an empty table is created, then a default column default row is created.
        String sheetName = context.readSheetHolder().getSheetName();
        if (!sheetHeadMap.containsKey(sheetName) && !metaMap.containsKey(sheetName) && !nodeMap.containsKey(sheetName)) {
            // If it is not parsed to the column header, then this sheet is empty and initializes the data.
            // initialize an empty table
            initHead(MapUtil.of(0, "标题"), context);
        }

        // More than 200 columns are not allowed to write to the number table.
        log.info("actual total number of columns: {}", sheetHeadMap.get(sheetName).size());
        ExceptionUtil.isTrue(sheetHeadMap.get(sheetName).size() <= limitProperties.getMaxColumnCount(), COLUMN_EXCEED_LIMIT);

        int currentSheetIndex = context.readSheetHolder().getSheetNo() + 1;
        int totalSheetSize = context.readWorkbookHolder().getParameterSheetDataList().size();
        if (currentSheetIndex == totalSheetSize) {
            // All parsing has been completed, and batch data insertion is performed.
            log.info("Complete parsing and insert data ");
            saveData(context.readWorkbookHolder().getParameterSheetDataList());
        }
    }

    private void saveData(List<ReadSheet> readSheetList) {
        List<NodeEntity> nodeEntities = new ArrayList<>();
        List<DatasheetEntity> datasheetEntities = new ArrayList<>();
        List<DatasheetMetaEntity> metaEntities = new ArrayList<>();

        if (retNodeData.getType() == NodeType.FOLDER) {
            nodeEntities.add(NodeEntity.builder()
                    .id(IdWorker.getId())
                    .spaceId(spaceId)
                    .parentId(retNodeData.getParentId())
                    .preNodeId(retNodeData.getPreNodeId())
                    .nodeId(retNodeData.getNodeId())
                    .nodeName(retNodeData.getNodeName())
                    .type(retNodeData.getType().getNodeType())
                    .isTemplate(false)
                    .creator(memberId)
                    .createdBy(userId)
                    .updatedBy(userId).build());
        }

        readSheetList.forEach(readSheet -> {
            NodeData nodeData = nodeMap.get(readSheet.getSheetName());

            nodeEntities.add(NodeEntity.builder()
                    .id(IdWorker.getId())
                    .spaceId(spaceId)
                    .parentId(nodeData.getParentId())
                    .preNodeId(nodeData.getPreNodeId())
                    .nodeId(nodeData.getNodeId())
                    .nodeName(nodeData.getNodeName())
                    .type(nodeData.getType().getNodeType())
                    .isTemplate(false)
                    .creator(memberId)
                    .createdBy(userId)
                    .updatedBy(userId).build());

            DatasheetEntity datasheet = DatasheetEntity.builder()
                    .id(IdWorker.getId())
                    .spaceId(spaceId)
                    .nodeId(nodeData.getNodeId())
                    .dstId(nodeData.getNodeId())
                    .dstName(nodeData.getNodeName())
                    .revision(0L)
                    .creator(memberId)
                    .build();

            datasheetEntities.add(datasheet);

            Meta meta = metaMap.get(readSheet.getSheetName());
            DatasheetMetaEntity metaEntity = DatasheetMetaEntity.builder()
                    .id(IdWorker.getId())
                    .dstId(nodeData.getNodeId())
                    .metaData(JSONUtil.toJsonStr(meta))
                    .revision(0L)
                    .createdBy(userId)
                    .updatedBy(userId)
                    .build();
            metaEntities.add(metaEntity);
        });

        log.info("start bulk insertion");
        StopWatch stopWatch = new StopWatch("Batch Insert Data");
        stopWatch.start();
        iNodeService.batchCreateDataSheet(
                new NodeData(null, retNodeData.getNodeId(), null, null, retNodeData.getParentId()),
                nodeEntities, datasheetEntities, metaEntities, recordEntities
        );
        stopWatch.stop();
        log.info("Insert complete: {}", stopWatch.prettyPrint());
    }

    public void saveRecords() {
        log.info("save line records in batches");
        iNodeService.batchSaveDstRecords(recordEntities);
        log.info("storage successfully");
    }

    public NodeData getRetNodeData() {
        return retNodeData;
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
