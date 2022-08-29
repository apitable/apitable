package com.vikadata.api.modular.workspace.listener;

import java.time.Clock;
import java.time.Duration;
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
import com.alibaba.excel.util.ListUtils;
import com.baomidou.mybatisplus.core.toolkit.IdWorker;
import lombok.Data;
import lombok.extern.slf4j.Slf4j;

import com.vikadata.api.enums.datasheet.FieldType;
import com.vikadata.api.enums.datasheet.ViewType;
import com.vikadata.api.model.ro.datasheet.FieldMapRo;
import com.vikadata.api.model.ro.datasheet.RecordDataRo;
import com.vikadata.api.modular.workspace.service.INodeService;
import com.vikadata.api.util.IdUtil;
import com.vikadata.api.util.VikaStrings;
import com.vikadata.define.enums.NodeType;
import com.vikadata.entity.DatasheetEntity;
import com.vikadata.entity.DatasheetMetaEntity;
import com.vikadata.entity.DatasheetRecordEntity;
import com.vikadata.entity.NodeEntity;

/**
 * CSV 数据解析监听器
 * @author Shawn Deng
 * @date 2021-11-29 15:31:04
 */
@Slf4j
public class CsvReadListener extends AnalysisEventListener<Map<Integer, String>> {

    /**
     * 每隔100条存储数据库，然后清理，方便内存回收
     */
    private static final int BATCH_COUNT = 100;

    private List<DatasheetRecordEntity> recordEntities = ListUtils.newArrayListWithExpectedSize(BATCH_COUNT);

    private Map<Integer, String> sheetHeadMap;

    private Meta meta;

    private JSONObject fieldUpdatedInfo = new JSONObject();

    private String retNodeId;

    private final INodeService iNodeService;

    private final Long userId;

    private final String spaceId;

    private final Long memberId;

    private final String parentNodeId;

    private final String fileName;

    public CsvReadListener(INodeService iNodeService, Long userId, String uuid, String spaceId, Long memberId, String parentNodeId, String fileName) {
        this.iNodeService = iNodeService;
        this.userId = userId;
        this.spaceId = spaceId;
        this.memberId = memberId;
        this.parentNodeId = parentNodeId;
        this.fileName = fileName;

        this.retNodeId = IdUtil.createDstId();

        fieldUpdatedInfo.set("createdAt", Instant.now(Clock.system(ZoneId.of("+8"))).toEpochMilli());
        fieldUpdatedInfo.set("createdBy", uuid);
    }

    @Override
    public void invokeHeadMap(Map<Integer, String> headMap, AnalysisContext context) {
        log.info("解析到头部信息");
        initHead(headMap, context);
    }

    private void initHead(Map<Integer, String> headMap, AnalysisContext context) {
        // 列长度，可能为0
        int headSize = headMap.size();
        meta = new Meta(headSize);

        sheetHeadMap = new LinkedHashMap<>(headSize);

        // 首个默认视图的有序列定义顺序,
        View view = new View(headSize, 0);
        view.id = IdUtil.createViewId();
        view.name = VikaStrings.t("default_view");
        view.type = ViewType.GRID.getType();
        view.frozenColumnCount = 1;

        // 按序遍历列
        headMap.forEach((index, cellValue) -> {
            String fieldName = StrUtil.isBlank(cellValue) ? String.format("第%d列", index + 1) : cellValue;
            String fieldId = IdUtil.createFieldId();
            // 存储列ID
            sheetHeadMap.put(index, fieldId);
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

        meta.views.add(view);
    }

    @Override
    public void invoke(Map<Integer, String> data, AnalysisContext context) {
        if (MapUtil.isEmpty(sheetHeadMap)) {
            // 列头为空，根据当前行数补齐所有列
            if (!data.isEmpty()) {
                sheetHeadMap = new LinkedHashMap<>(data.size());
                for (int index = 0; index < data.size(); index++) {
                    String fieldName = String.format("第%d列", index + 1);
                    String fieldId = IdUtil.createFieldId();
                    sheetHeadMap.put(index, fieldId);
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
            }
        }
        else {
            if (!data.isEmpty()) {
                if (sheetHeadMap.size() < data.size()) {
                    // invokeHeadMap 解析到的列数量比这个少
                    // 如果每一行数据真实是5列，而列头在只有前3列有定义值，
                    // 比如: 0 -> 第1列, 1-> 第2列, 2 -> 第3列，那么后面的列需要补全，
                    for (int index = sheetHeadMap.size(); index < data.size(); index++) {
                        String fieldName = String.format("第%d列", index + 1);
                        String fieldId = IdUtil.createFieldId();
                        sheetHeadMap.put(index, fieldId);
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
                }
            }
        }

        String recordId = IdUtil.createRecordId();
        meta.views.get(0).rows.add(new Row(recordId));

        JSONObject recordData = new JSONObject();

        for (Entry<Integer, String> entry : data.entrySet()) {
            if ((StrUtil.isNotBlank(entry.getValue()))) {
                recordData.putOnce(sheetHeadMap.get(entry.getKey()), JSONUtil.createArray().set(RecordDataRo.builder().text(entry.getValue()).type(FieldType.TEXT.getFieldType()).build()));
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
        log.info("分批保存行记录");
        iNodeService.batchSaveDstRecords(recordEntities);
    }

    @Override
    public void doAfterAllAnalysed(AnalysisContext context) {
        log.info("======================解析完成==============================");

        if (meta == null) {
            initHead(MapUtil.of(0, "标题"), context);
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

        log.info("开始执行批量插入");
        long begin = System.currentTimeMillis();
        iNodeService.batchCreateDataSheet(
                new NodeData(null, retNodeId, null, null, parentNodeId),
                nodeEntities, datasheetEntities, metaEntities, recordEntities
        );
        long end = System.currentTimeMillis();
        log.info("插入完成: {}", Duration.ofMillis(end - begin).getSeconds());
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
