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
 * 多表格解析监听器
 * @author Shawn Deng
 * @date 2021-11-29 17:51:08
 */
@Slf4j
public class MultiSheetReadListener extends AnalysisEventListener<Map<Integer, String>> {

    /**
     * 每隔100条存储数据库，然后清理，方便内存回收
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
        // 1. 解析头部(如果是空白sheet，这里将不会被调用)
        initHead(headMap, context);
    }

    private void initHead(Map<Integer, String> headMap, AnalysisContext context) {
        Integer sheetNo = context.readSheetHolder().getSheetNo();
        String sheetName = context.readSheetHolder().getSheetName();
        log.info("解析到头部信息, SheetNo:" + sheetNo + ", Sheet: " + sheetName + ", 列数：" + headMap.size());
        int totalSheetSize = context.readWorkbookHolder().getParameterSheetDataList().size();
        // 是否多个Sheet
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

        // 列长度，可能为0
        int headSize = headMap.size();

        // 考虑删除，耗内存
        Map<Integer, String> headerMap = new LinkedHashMap<>(headSize);
        Meta meta = new Meta(headSize);

        // 首个默认视图的有序列定义顺序,
        int totalRow = context.readSheetHolder().getApproximateTotalRowNumber() != null ? context.readSheetHolder().getApproximateTotalRowNumber() : 0;
        View view = new View(headSize, totalRow);
        view.id = IdUtil.createViewId();
        view.name = VikaStrings.t("default_view");
        view.type = ViewType.GRID.getType();
        view.frozenColumnCount = 1;

        // 按序遍历列
        headMap.forEach((index, cellValue) -> {
            String fieldName = StrUtil.isBlank(cellValue) ? String.format("第%d列", index + 1) : cellValue;
            String fieldId = IdUtil.createFieldId();
            // 存储列ID
            headerMap.put(index, fieldId);
            meta.fieldMap.putOnce(fieldId,
                    FieldMapRo.builder()
                            .id(fieldId)
                            .name(fieldName)
                            .type(FieldType.TEXT.getFieldType())
                            .build()
            );
            // 视图列
            Column column = new Column(fieldId);
            if (index == 0) {
                // 首列添加统计记录总数
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
        // 2. 一行行解析数据（如果是空白sheet，这里将不会被调用）
        String sheetName = context.readSheetHolder().getSheetName();
        Map<Integer, String> headerMap = sheetHeadMap.get(sheetName);
        Meta meta = metaMap.get(sheetName);

        // 超过5万行不允许写入数表
        Integer totalRowsIncludingHeader = context.readSheetHolder().getApproximateTotalRowNumber();
        log.info("实际总行数(包含表头): {}", totalRowsIncludingHeader);
        if (totalRowsIncludingHeader != null) {
            ExceptionUtil.isTrue(totalRowsIncludingHeader - 1 <= limitProperties.getMaxRowCount(), ROW_EXCEED_LIMIT);
        }

        if (headerMap.isEmpty()) {
            // 跳过空行不存
            if (data.isEmpty()) {
                return;
            }
            // 列头为空，根据当前行数补齐所有列
            headerMap = new LinkedHashMap<>(data.size());
            for (int index = 0; index < data.size(); index++) {
                String fieldName = String.format("第%d列", index + 1);
                String fieldId = IdUtil.createFieldId();
                headerMap.put(index, fieldId);
                meta.fieldMap.putOnce(fieldId,
                        FieldMapRo.builder()
                                .id(fieldId)
                                .name(fieldName)
                                .type(FieldType.TEXT.getFieldType())
                                .build()
                );
                // 视图列
                Column column = new Column(fieldId);
                if (index == 0) {
                    // 首列添加统计记录总数
                    column.statType = 1;
                }
                meta.views.get(0).columns.add(column);
            }
            sheetHeadMap.put(sheetName, headerMap);
        }
        else {
            // 跳过空行不存
            if (data.isEmpty()) {
                return;
            }
            if (headerMap.size() < data.size()) {
                // invokeHeadMap 解析到的列数量比这个少
                // 如果每一行数据真实是5列，而列头在只有前3列有定义值，
                // 比如: 0 -> 第1列, 1-> 第2列, 2 -> 第3列，那么后面的列需要补全，
                for (int index = headerMap.size(); index < data.size(); index++) {
                    String fieldName = String.format("第%d列", index + 1);
                    String fieldId = IdUtil.createFieldId();
                    headerMap.put(index, fieldId);
                    meta.fieldMap.putOnce(fieldId,
                            FieldMapRo.builder()
                                    .id(fieldId)
                                    .name(fieldName)
                                    .type(FieldType.TEXT.getFieldType())
                                    .build()
                    );
                    // 视图列
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
        // 3. 当前sheet解析完成
        log.info("======================解析完成==============================");

        // sheet解析完之后是空表格，那么就创建一个默认列默认行
        String sheetName = context.readSheetHolder().getSheetName();
        if (!sheetHeadMap.containsKey(sheetName) && !metaMap.containsKey(sheetName) && !nodeMap.containsKey(sheetName)) {
            // 没有解析到列头，那这个sheet是空的，初始化数据
            // 初始化一个空表格
            initHead(MapUtil.of(0, "标题"), context);
        }

        // 超过200列不允许写入数表
        log.info("实际总列数: {}", sheetHeadMap.get(sheetName).size());
        ExceptionUtil.isTrue(sheetHeadMap.get(sheetName).size() <= limitProperties.getMaxColumnCount(), COLUMN_EXCEED_LIMIT);

        int currentSheetIndex = context.readSheetHolder().getSheetNo() + 1;
        int totalSheetSize = context.readWorkbookHolder().getParameterSheetDataList().size();
        if (currentSheetIndex == totalSheetSize) {
            // 已经全部解析完成，执行批量插入数据
            log.info("全部解析完成，执行插入数据");
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

        log.info("开始执行批量插入");
        StopWatch stopWatch = new StopWatch("Batch Insert Data");
        stopWatch.start();
        iNodeService.batchCreateDataSheet(
                new NodeData(null, retNodeData.getNodeId(), null, null, retNodeData.getParentId()),
                nodeEntities, datasheetEntities, metaEntities, recordEntities
        );
        stopWatch.stop();
        log.info("插入完成: {}", stopWatch.prettyPrint());
    }

    public void saveRecords() {
        log.info("分批保存行记录");
        iNodeService.batchSaveDstRecords(recordEntities);
        log.info("存储成功");
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
