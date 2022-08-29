package com.vikadata.scheduler.space.service.impl;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.atomic.AtomicLong;
import java.util.stream.Collectors;

import javax.annotation.Resource;

import cn.hutool.core.collection.CollUtil;
import cn.hutool.core.date.DatePattern;
import cn.hutool.core.date.DateUtil;
import cn.hutool.core.date.TimeInterval;
import cn.hutool.core.io.FileUtil;
import cn.hutool.core.io.IoUtil;
import cn.hutool.core.thread.ThreadUtil;
import cn.hutool.core.util.StrUtil;
import cn.hutool.json.JSONArray;
import cn.hutool.json.JSONObject;
import cn.hutool.json.JSONUtil;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.xxl.job.core.context.XxlJobHelper;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import com.vikadata.boot.autoconfigure.spring.SpringContextHolder;
import com.vikadata.integration.oss.OssClientTemplate;
import com.vikadata.integration.oss.OssObject;
import com.vikadata.integration.vika.VikaOperations;
import com.vikadata.integration.vika.factory.CollaCommandFactory;
import com.vikadata.scheduler.space.config.properties.ConfigProperties;
import com.vikadata.scheduler.space.handler.ClearOneWayLinkJobHandler;
import com.vikadata.scheduler.space.handler.ClearOneWayLinkJobHandler.JobParam.RunFunc;
import com.vikadata.scheduler.space.handler.FixDatasheetDataHandler;
import com.vikadata.scheduler.space.mapper.workspace.DatasheetMetaMapper;
import com.vikadata.scheduler.space.mapper.workspace.DatasheetRecordMapper;
import com.vikadata.scheduler.space.model.DataSheetMetaDto;
import com.vikadata.scheduler.space.model.DataSheetRecordInfo;
import com.vikadata.scheduler.space.model.ForeignDataSheetProperty;
import com.vikadata.scheduler.space.model.ForeignDataSheetProperty.Property;
import com.vikadata.scheduler.space.model.ForeignDatasheetDto;
import com.vikadata.scheduler.space.service.IDatasheetMetaService;
import com.vikadata.scheduler.space.service.impl.DatasheetMetaServiceImpl.WaitProcessedOneWayLinkData.FixType;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;

/**
 * <p>
 * 工作台-数表元数据表 服务实现类
 * </p>
 *
 * @author Chambers
 * @date 2020/5/7
 */
@Service
public class DatasheetMetaServiceImpl implements IDatasheetMetaService {

    @Resource
    private DatasheetMetaMapper datasheetMetaMapper;

    @Resource
    private DatasheetRecordMapper datasheetRecordMapper;

    @Autowired(required = false)
    private OssClientTemplate ossTemplate;

    @Resource
    private ConfigProperties configProperties;

    @Autowired(required = false)
    private VikaOperations vikaOperations;

    @Override
    public void change(String nodeId) {
        List<String> nodeIds;
        if (StrUtil.isNotBlank(nodeId)) {
            nodeIds = Collections.singletonList(nodeId);
        }
        else {
            // 查询需要修改的数表
            nodeIds = datasheetMetaMapper.selectNodeIdByMetaLike("\"type\": 20");
        }
        if (CollUtil.isEmpty(nodeIds)) {
            XxlJobHelper.log("没有数表需要修改");
            return;
        }
        int dateFieldType = 20;
        List<List<String>> split = CollUtil.split(nodeIds, 10);
        for (List<String> ids : split) {
            // 批量获取 meta、record
            List<DataSheetMetaDto> metaDtoList = datasheetMetaMapper.selectDtoByNodeIds(ids);
            List<DataSheetRecordInfo> dataSheetRecordInfos = datasheetRecordMapper.selectInfoByNodeIds(ids);
            Map<String, List<DataSheetRecordInfo>> dstIdToInfosMap = dataSheetRecordInfos.stream()
                    .collect(Collectors.groupingBy(DataSheetRecordInfo::getDstId));
            // 处理数表
            for (DataSheetMetaDto dto : metaDtoList) {
                // 处理 meta 中的 fieldMap
                JSONObject meta = JSONUtil.parseObj(dto.getMetaData());
                JSONObject fieldMap = meta.getJSONObject("fieldMap");
                if (JSONUtil.isNull(fieldMap)) {
                    continue;
                }
                // 遍历每一列、记录全部未处理的自增字段ID
                List<String> unProcessFldIds = new ArrayList<>();
                fieldMap.values().forEach(value -> {
                    JSONObject field = JSONUtil.parseObj(value);
                    Integer fieldType = field.getInt("type");
                    if (fieldType != null && fieldType == dateFieldType) {
                        String fldId = field.getStr("id");
                        // 未处理的自增字段，属性中不存在 datasheetId
                        Object datasheetId = JSONUtil.parseObj(field.get("property")).get("datasheetId");
                        if (datasheetId == null) {
                            unProcessFldIds.add(fldId);
                        }
                    }
                });
                if (CollUtil.isEmpty(unProcessFldIds)) {
                    continue;
                }
                // 向指定字段的 property 新增 datasheetId 值
                datasheetMetaMapper.updateMetaByJsonInsert(dto.getDstId(), unProcessFldIds);
                // 处理记录
                List<DataSheetRecordInfo> infos = dstIdToInfosMap.get(dto.getDstId());
                // 不存在记录，跳过
                if (CollUtil.isEmpty(infos)) {
                    continue;
                }
                // 遍历每一行，处理自增字段单元格里的数据
                this.processRecord(infos, unProcessFldIds);
            }
        }
        XxlJobHelper.log("更改完成");
    }

    @Override
    public void oneWayLinkDataHandler(ClearOneWayLinkJobHandler.JobParam jobParam) {
        TimeInterval timer = DateUtil.timer();
        List<WaitProcessedOneWayLinkData> oneWayLinkDataList = null;

        if (RunFunc.READ_REMOTE_STREAM == jobParam.getRunFunc()) {
            String readRemoteStreamUrl = jobParam.getReadRemoteStreamUrl();
            if (StrUtil.isBlank(readRemoteStreamUrl)) {
                XxlJobHelper.log("远端Url为空，跳过处理");
                return;
            }

            XxlJobHelper.log("加载远端数据流-Url：{}...");
            OssObject object = ossTemplate.getObject(configProperties.getOssBucketName(), readRemoteStreamUrl);
            String content = IoUtil.readUtf8(object.getInputStream());
            XxlJobHelper.log("远端数据流加载完成!");

            ObjectMapper objectMapper = new ObjectMapper();
            objectMapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
            try {
                oneWayLinkDataList = objectMapper.readValue(content, new TypeReference<List<WaitProcessedOneWayLinkData>>() {});
            }
            catch (JsonProcessingException e) {
                e.printStackTrace();
            }
        }
        else {
            String activeProfile = SpringContextHolder.getActiveProfile();

            if (!"local".equals(activeProfile) && StrUtil.isEmpty(jobParam.getSpaceId())) {
                XxlJobHelper.log("目前不支持全空间站扫描修复，请指定「空间站ID」");
                return;
            }

            oneWayLinkDataList = planA(jobParam, timer);
            // timer = timer.restart();

            // planB(timer);
            // timer = timer.restart();

            if ("local".equals(activeProfile)) {
                String fileName = "结果.txt";
                String outFile = StrUtil.format("{}/temp/analyzeAssociationData/{}", System.getProperty("user.dir"), fileName);
                // 对分析结果去除空白元素、去重
                FileUtil.appendUtf8Lines(CollUtil.removeBlank(oneWayLinkDataList.stream().map(WaitProcessedOneWayLinkData::toDesc).collect(Collectors.toSet())), FileUtil.file(outFile));
                System.out.println("结果写入「" + outFile + "」完成");
            }
            else {
                if (CollUtil.isNotEmpty(oneWayLinkDataList) && RunFunc.LIST == jobParam.getRunFunc()) {
                    try {
                        // 分析结果输出到oss
                        String paht = StrUtil.format("job/analyze/association/result/{}-{}.json", activeProfile, DateUtil.date().toString(DatePattern.PURE_DATETIME_FORMAT));
                        ossTemplate.upload(configProperties.getOssBucketName(), IoUtil.toUtf8Stream(JSONUtil.toJsonStr(oneWayLinkDataList)), paht, MediaType.APPLICATION_JSON_VALUE, null);
                        System.out.println("结果上传OSS「" + paht + "」完成");
                        XxlJobHelper.log("结果上传OSS「" + paht + "」完成");
                    }
                    catch (IOException e) {
                        e.printStackTrace();
                    }
                }
            }
        }

        if (CollUtil.isNotEmpty(oneWayLinkDataList) && RunFunc.LIST != jobParam.getRunFunc()) {
            repairOneWayLinkDataHandle(oneWayLinkDataList, jobParam);
            String outStr = "修复单向关联数据已完成，总耗时：" + timer.intervalPretty();
            System.out.println(outStr);
            XxlJobHelper.log(outStr);
        }
    }

    @Override
    public void fixTemplateViewSortInfo(FixDatasheetDataHandler.JobParam jobParam) {
        if (StrUtil.isBlank(jobParam.getSpaceId())) {
            XxlJobHelper.log("目前不支持全空间站扫描修复，请指定「空间站ID」");
            return;
        }

        List<DataSheetMetaDto> dataSheetMetaDtos = datasheetMetaMapper.selectMetaDataByFixMode(jobParam.getSpaceId(), 1);
        XxlJobHelper.log("扫描存在排序「模版」数量：{}", CollUtil.size(dataSheetMetaDtos));

        for (DataSheetMetaDto dataSheetMetaDto : dataSheetMetaDtos) {
            String dstId = dataSheetMetaDto.getDstId();
            JSONObject object = JSONUtil.parseObj(dataSheetMetaDto.getMetaData());

            CollUtil.forEach(object.getJSONArray("views"), (viewsObject, i) -> {
                JSONObject views = (JSONObject) viewsObject;
                Object sortInfoObject = views.get("sortInfo");
                if (sortInfoObject instanceof JSONArray) {
                    XxlJobHelper.log("dst_id:{},sortInfo:{}", dstId, sortInfoObject);
                    // Update sql
                    int affectRows = datasheetMetaMapper.updateTemplateViewSortInfo(dstId, i);
                    XxlJobHelper.log("dst_id:{},执行结果:{}", dstId, affectRows);
                }
            });
        }
    }

    /**
     * Plan A，多线程执行分析处理数据
     *
     * @author Pengap
     * @date 2022/2/22 14:16:51
     */
    private List<WaitProcessedOneWayLinkData> planA(ClearOneWayLinkJobHandler.JobParam jobParam, TimeInterval timer) {
        long newNextId = -1L;
        int analyzeSize = 200;
        List<WaitProcessedOneWayLinkData> analyzeResult = new ArrayList<>();
        AtomicLong dataSheetCount = new AtomicLong(0);

        do {
            ExecutorService queryExs = Executors.newFixedThreadPool(jobParam.getCoreQueryPoolSize());
            List<CompletableFuture<LeftAssociationData>> queryCf = new ArrayList<>();
            try {
                for (int i = 1; i <= jobParam.getCoreQueryPoolSize(); i++) {
                    int finalI = i;
                    long finalNewNextId = newNextId;
                    queryCf.add(
                            CompletableFuture
                                    .supplyAsync(() ->
                                                    batchQueryLinkFieldData(jobParam.getSpaceId(), finalNewNextId, finalI, jobParam.getPageSize(), jobParam.getCoreQueryPoolSize())
                                            , queryExs)
                                    .thenApply(left -> {
                                        String outLog = StrUtil.format("当前ID：{}，执行下标：{}，当前扫描：{}，已扫描：{}，下一个Id：{}", finalNewNextId, finalI, left.getRecordSize(), dataSheetCount.get(), left.getNextId());
                                        System.out.println(outLog);
                                        XxlJobHelper.log(outLog);

                                        List<ForeignDatasheetDto> records = left.getRecords();
                                        if (CollUtil.isNotEmpty(records)) {
                                            ExecutorService analyzeExs = Executors.newFixedThreadPool(jobParam.getCoreAnalyzePoolSize());

                                            // 累加查询数量
                                            dataSheetCount.addAndGet(left.getRecordSize());

                                            List<CompletableFuture<List<WaitProcessedOneWayLinkData>>> analyzeCf = new ArrayList<>();
                                            for (int j = 0; j < (int) Math.ceil((double) left.getRecordSize() / (double) analyzeSize); j++) {
                                                List<ForeignDatasheetDto> list = CollUtil.page(j, analyzeSize, records);
                                                analyzeCf.add(
                                                        CompletableFuture.supplyAsync(() -> analyzeLinkFieldData(list), analyzeExs)
                                                                .thenApplyAsync(data -> {
                                                                    analyzeResult.addAll(data);
                                                                    return analyzeResult;
                                                                })
                                                );
                                            }
                                            // 并行Run
                                            CompletableFuture.allOf(analyzeCf.toArray(new CompletableFuture[0])).join();
                                            analyzeExs.shutdown();
                                        }
                                        return left;
                                    })
                    );
                }

                CompletableFuture<Void> allFutures = CompletableFuture.allOf(queryCf.toArray(new CompletableFuture[0]));
                CompletableFuture<List<Long>> completableFuture = allFutures
                        .thenApply(o ->
                                queryCf.stream()
                                        .map(CompletableFuture::join)
                                        .map(LeftAssociationData::getNextId)
                                        .collect(Collectors.toList())
                        );

                try {
                    List<Long> result = completableFuture.get();
                    newNextId = CollUtil.getLast(result);
                }
                catch (Exception e) {
                    e.printStackTrace();
                    XxlJobHelper.log(e);
                }

            }
            catch (Exception e) {
                e.printStackTrace();
                XxlJobHelper.log(e);
                throw e;
            }
            finally {
                queryExs.shutdown();
            }
        } while (newNextId != -1L);

        String outStr = StrUtil.format("输出统计...\nDataSheetCount：{}\n「PlanA」总耗时：{}", dataSheetCount.get(), timer.intervalPretty());
        System.out.println(outStr);
        XxlJobHelper.log(outStr);
        return analyzeResult;
    }

    /**
     * Plan B，单线程执行分析处理数据
     *
     * @author Pengap
     * @date 2022/2/22 14:16:51
     */
    private void planB(TimeInterval timer) {
        long newNextId = -1L;
        List<ForeignDatasheetDto> records;
        AtomicLong dataSheetCount = new AtomicLong(0);
        List<WaitProcessedOneWayLinkData> analyzeResult = new ArrayList<>();

        do {
            LeftAssociationData leftAssociationData = batchQueryLinkFieldData(null, newNextId, 1, 1000, 1);
            records = leftAssociationData.getRecords();

            dataSheetCount.addAndGet(leftAssociationData.getRecordSize());

            analyzeResult.addAll(
                    analyzeLinkFieldData(records)
            );

            newNextId = leftAssociationData.getNextId();
            System.err.println("下一次查询Id：" + newNextId);
        } while (newNextId != -1L);

        System.out.println("输出统计...");
        System.out.println("DataSheetCount：" + dataSheetCount.get());
        System.out.println("AnalyzeResult：\n" + JSONUtil.toJsonPrettyStr(analyzeResult.stream().map(WaitProcessedOneWayLinkData::toDesc).collect(Collectors.toList())));

        System.err.println("「PlanB」总耗时：" + timer.intervalPretty());
    }

    /**
     * 批量查询关联字段数据
     *
     * @param spaceId           指定空间站ID
     * @param nextId            分页查询下一次Id
     * @param current           分页页码
     * @param pageSize          分页条数
     * @param newIdMaxIndex     刷新下次Id最大分页下标
     * @author Pengap
     * @date 2022/2/22 14:13:22
     */
    private LeftAssociationData batchQueryLinkFieldData(String spaceId, long nextId, long current, long pageSize, long newIdMaxIndex) {
        Page<ForeignDatasheetDto> page = new Page<>();
        page.setSearchCount(false).setCurrent(current).setSize(pageSize);

        IPage<ForeignDatasheetDto> foreignDatasheetDtoIPage = datasheetMetaMapper.selectForeignDatasheetIdsByPage(spaceId, nextId == -1L ? null : nextId, page);
        List<ForeignDatasheetDto> records = foreignDatasheetDtoIPage.getRecords();
        int currentTotal = records.size();

        long newNextId = nextId;
        if (CollUtil.isEmpty(records) || currentTotal < page.getSize()) {
            newNextId = -1L;
        }
        else if (current >= newIdMaxIndex) {
            newNextId = Optional.ofNullable(CollUtil.getLast(records)).map(ForeignDatasheetDto::getId).orElse(-1L);
        }
        return LeftAssociationData.builder()
                .nextId(newNextId)
                .records(records)
                .recordSize(currentTotal)
                .build();
    }

    /**
     * 分析单项关联数据
     *
     * @param records 待分析数据
     * @author Pengap
     * @date 2022/2/22 14:16:14
     */
    private List<WaitProcessedOneWayLinkData> analyzeLinkFieldData(List<ForeignDatasheetDto> records) {
        ObjectMapper objectMapper = new ObjectMapper();
        objectMapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);

        List<WaitProcessedOneWayLinkData> analyzeResult = new ArrayList<>();
        List<ForeignDataSheetProperty> allAssociationData = records.stream()
                .map(dto -> {
                            List<ForeignDataSheetProperty> foreignDataSheetProperties = new ArrayList<>();
                            try {
                                foreignDataSheetProperties = objectMapper.readValue(dto.getFieldMap(), new TypeReference<List<ForeignDataSheetProperty>>() {});
                            }
                            catch (JsonProcessingException e) {
                                e.printStackTrace();
                            }
                            return foreignDataSheetProperties.stream()
                                    // 过滤空对象，过滤非神奇关联对象，并且过滤子关联对象
                                    .filter(o -> {
                                        Property property = o.getProperty();
                                        if (null != property && null != property.getBrotherFieldId() && null != property.getForeignDatasheetId() && !property.getForeignDatasheetId().equals(dto.getDstId())) {
                                            o.setDstId(dto.getDstId());
                                            return true;
                                        }
                                        return false;
                                    })
                                    .distinct()
                                    .collect(Collectors.toList());
                        }
                )
                // 对于单表中出现多列神奇关联进行合并操作
                .reduce(new ArrayList<>(), (all, item) -> {
                    if (CollUtil.isNotEmpty(item)) {
                        all.addAll(item);
                    }
                    return all;
                });

        if (CollUtil.isNotEmpty(allAssociationData)) {
            // 列出关联的数表Id，并且对于引用同一张数表Id去重
            List<String> dstIds = allAssociationData.stream().map(o -> o.getProperty().getForeignDatasheetId()).distinct().collect(Collectors.toList());
            List<DataSheetMetaDto> dataSheetMetaDtos = datasheetMetaMapper.selectDtoByNodeIds(dstIds);

            // 对于查询结果根据 dstId 转换成 Map
            // key: dstId
            Map<String, String> metaJsonByDstId = dataSheetMetaDtos.stream().collect(Collectors.toMap(DataSheetMetaDto::getDstId, DataSheetMetaDto::getMetaData));

            /*
             * 查询对应FdstId 对应的数表
             *  1: 表不存在
             *      直接转换关联列为文本列
             *  2: 表存在
             *      2.1: 关联列不存在
             *      2.2: 关联列变成非关联列（type：7）
             *      通过Fusion Api 新增一列
             */
            for (ForeignDataSheetProperty fdsp : allAssociationData) {
                String foreignDatasheetId = fdsp.getProperty().getForeignDatasheetId();
                String metaJson = metaJsonByDstId.get(foreignDatasheetId);
                if (StrUtil.isNotBlank(metaJson)) {
                    String brotherFieldId = fdsp.getProperty().getBrotherFieldId();
                    JSONObject brotherField = JSONUtil.parseObj(JSONUtil.getByPath(JSONUtil.parse(metaJson), StrUtil.format("fieldMap.{}", brotherFieldId)));
                    try {
                        if (!brotherField.isEmpty()) {
                            Integer type = brotherField.getInt("type");
                            if (type != 7) {
                                WaitProcessedOneWayLinkData wp1 = WaitProcessedOneWayLinkData.builder().dstId(fdsp.getDstId()).fieldId(fdsp.getFieldId()).fieldName(fdsp.getFieldName())
                                        .brotherFieldId(brotherFieldId).foreignDstId(foreignDatasheetId).brotherFieldType(type)
                                        .fixType(FixType.COPY_FIX).brotherExist(true).foreignDstExist(true).build();
                                analyzeResult.add(wp1);
                                // System.out.println(wp1.toDesc());
                                XxlJobHelper.log("\n" + wp1.toDesc());
                            }
                        }
                        else {
                            WaitProcessedOneWayLinkData wp2 = WaitProcessedOneWayLinkData.builder().dstId(fdsp.getDstId()).fieldId(fdsp.getFieldId()).fieldName(fdsp.getFieldName())
                                    .brotherFieldId(brotherFieldId).foreignDstId(foreignDatasheetId)
                                    .fixType(FixType.COPY_FIX).brotherExist(false).foreignDstExist(true).build();
                            analyzeResult.add(wp2);
                            // System.out.println(wp2.toDesc());
                            XxlJobHelper.log("\n" + wp2.toDesc());
                        }
                    }
                    catch (Exception e) {
                        e.printStackTrace();
                        XxlJobHelper.log(e);
                    }
                }
                else {
                    WaitProcessedOneWayLinkData wp3 = WaitProcessedOneWayLinkData.builder().dstId(fdsp.getDstId()).fieldId(fdsp.getFieldId()).fieldName(fdsp.getFieldName()).foreignDstId(foreignDatasheetId)
                            .fixType(FixType.CONVERT_TEXT_FIX).brotherExist(false).foreignDstExist(false).build();
                    analyzeResult.add(wp3);
                    // System.out.println(wp3.toDesc());
                    XxlJobHelper.log("\n" + wp3.toDesc());
                }
            }
        }
        return analyzeResult;
    }

    /**
     * 修复单向关联数据处理
     *
     * @param data 需要处理的数据
     * @author Pengap
     * @date 2022/2/24 14:58:53
     */
    private void repairOneWayLinkDataHandle(List<WaitProcessedOneWayLinkData> data, ClearOneWayLinkJobHandler.JobParam jobParam) {
        for (WaitProcessedOneWayLinkData datum : data) {
            try {
                Map<String, Object> request = null;
                switch (datum.getFixType()) {
                    case COPY_FIX:
                        request = CollaCommandFactory.fixOneWayLinkByChangeDstId(datum.getDstId(), datum.getFieldId(), datum.getForeignDstId());
                        break;
                    case CONVERT_TEXT_FIX:
                        request = CollaCommandFactory.fixOneWayLinkByMultilineText(datum.getDstId(), datum.getFieldId(), datum.getFieldName());
                        break;
                    default:
                        String outStr = StrUtil.format("{}-{}-{} 当前数据未定义数据修补方案", datum.getDstId(), datum.getFieldId(), datum.getFieldName());
                        System.out.println(outStr);
                        XxlJobHelper.log("\n" + outStr);
                        break;
                }

                if (null == request) {
                    continue;
                }

                boolean result = vikaOperations.executeCommand(datum.getDstId(), request);
                String outStr = StrUtil.format("{}：采用[{}]修复，结果：{}，参数：{}", datum.getDstId(), datum.getFixType(), result, JSONUtil.toJsonStr(request));
                System.out.println(outStr);
                XxlJobHelper.log("\n" + outStr);
                ThreadUtil.sleep(jobParam.getExecutionInterval());
            }
            catch (Exception e) {
                e.printStackTrace();
                XxlJobHelper.log(e);
            }
        }
    }

    private void processRecord(List<DataSheetRecordInfo> infos, List<String> fldIds) {
        for (DataSheetRecordInfo info : infos) {
            JSONObject data = JSONUtil.parseObj(info.getData());
            JSONObject recordMeta = JSONUtil.parseObj(info.getFieldUpdatedInfo());
            Object fieldUpdatedMap = recordMeta.get("fieldUpdatedMap");
            JSONObject json = fieldUpdatedMap == null ? JSONUtil.createObj() : JSONUtil.parseObj(fieldUpdatedMap);
            List<String> modifyFieldIds = new ArrayList<>();
            for (String fieldId : fldIds) {
                Integer cellValue = data.getInt(fieldId);
                // 新结构的 autoNumber 值不会保存在 data
                if (cellValue == null) {
                    continue;
                }
                modifyFieldIds.add(fieldId);
                JSONObject fieldMeta = json.getJSONObject(fieldId);
                if (fieldMeta == null) {
                    // 无 fieldMeta
                    json.set(fieldId, JSONUtil.createObj().putOnce("autoNumber", cellValue));
                    continue;
                }
                Object autoNumber = fieldMeta.get("autoNumber");
                if (autoNumber == null) {
                    // 无 autoNumber
                    fieldMeta.set("autoNumber", cellValue);
                }
            }
            if (CollUtil.isEmpty(modifyFieldIds)) {
                continue;
            }
            // 修改 record
            datasheetRecordMapper.updateMetaByJsonOp(info.getId(), modifyFieldIds, json.toString());
        }
    }

    @Getter
    @Setter
    @Builder
    private static class LeftAssociationData {

        private long nextId;

        private List<ForeignDatasheetDto> records;

        private int recordSize;

    }

    @Getter
    @Setter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class WaitProcessedOneWayLinkData {
        enum FixType {
            // 单向COPY修复
            COPY_FIX,
            // 转换为文本修复
            CONVERT_TEXT_FIX;
        }

        // 数表Id
        private String dstId;

        // 字段Id
        private String fieldId;

        // 字段名称
        private String fieldName;

        // 关联的数表字段Id
        private String brotherFieldId;

        // 关联的数表字段Type
        private Integer brotherFieldType;

        // 关联的数表Id
        private String foreignDstId;

        // 修复类型
        private FixType fixType;

        // 关联字段是否存在
        private boolean brotherExist;

        // 关联表是否存在
        private boolean foreignDstExist;

        // 格式化描述
        public String toDesc() {
            if (this.foreignDstExist) {
                if (this.brotherExist) {
                    return StrUtil.format("A表Id：{} - 字段Id：{} - 字段Name：{}，B表Id：{} - 字段Id：{} - 非关联列！当前类型：{}", this.dstId, this.fieldId, this.fieldName, this.foreignDstId, this.brotherFieldId, this.brotherFieldType);
                }
                else {
                    return StrUtil.format("A表Id：{} - 字段Id：{} - 字段Name：{}，B表Id：{} - 字段Id：{} - 不存在！", this.dstId, this.fieldId, this.fieldName, this.foreignDstId, this.brotherFieldId);
                }
            }
            else {
                return StrUtil.format("A表Id：{} - 字段Id：{} - 字段Name：{}，B表Id：{} - 不存在！", this.dstId, this.fieldId, this.fieldName, this.foreignDstId);
            }
        }
    }

}
