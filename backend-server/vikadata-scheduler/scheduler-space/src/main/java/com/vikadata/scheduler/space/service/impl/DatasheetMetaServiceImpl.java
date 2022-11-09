package com.vikadata.scheduler.space.service.impl;

import java.io.IOException;
import java.util.ArrayList;
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
import cn.hutool.core.util.ArrayUtil;
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

import com.apitable.starter.oss.core.OssClientTemplate;
import com.apitable.starter.oss.core.OssObject;
import com.apitable.starter.vika.core.VikaOperations;
import com.apitable.starter.vika.core.factory.CollaCommandFactory;
import com.vikadata.scheduler.space.config.properties.ConfigProperties;
import com.vikadata.scheduler.space.handler.ClearOneWayLinkJobHandler;
import com.vikadata.scheduler.space.handler.ClearOneWayLinkJobHandler.JobParam.RunFunc;
import com.vikadata.scheduler.space.handler.FixDatasheetDataHandler;
import com.vikadata.scheduler.space.mapper.workspace.DatasheetMetaMapper;
import com.vikadata.scheduler.space.model.DataSheetMetaDto;
import com.vikadata.scheduler.space.model.ForeignDataSheetProperty;
import com.vikadata.scheduler.space.model.ForeignDataSheetProperty.Property;
import com.vikadata.scheduler.space.model.ForeignDatasheetDto;
import com.vikadata.scheduler.space.service.IDatasheetMetaService;
import com.vikadata.scheduler.space.service.impl.DatasheetMetaServiceImpl.WaitProcessedOneWayLinkData.FixType;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;

/**
 * <p>
 * Datasheet Meta Service Implement Class
 * </p>
 */
@Service
public class DatasheetMetaServiceImpl implements IDatasheetMetaService {

    @Resource
    private DatasheetMetaMapper datasheetMetaMapper;

    @Autowired(required = false)
    private OssClientTemplate ossTemplate;

    @Resource
    private ConfigProperties configProperties;

    @Autowired(required = false)
    private VikaOperations vikaOperations;

    @Resource
    private Environment environment;

    @Override
    public void oneWayLinkDataHandler(ClearOneWayLinkJobHandler.JobParam jobParam) {
        TimeInterval timer = DateUtil.timer();
        List<WaitProcessedOneWayLinkData> oneWayLinkDataList = null;

        if (RunFunc.READ_REMOTE_STREAM == jobParam.getRunFunc()) {
            String readRemoteStreamUrl = jobParam.getReadRemoteStreamUrl();
            if (StrUtil.isBlank(readRemoteStreamUrl)) {
                XxlJobHelper.log("Remote Url is empty, skip processing.");
                return;
            }

            XxlJobHelper.log("Load remote data stream-Url: {}");
            OssObject object = ossTemplate.getObject(configProperties.getOssBucketName(), readRemoteStreamUrl);
            String content = IoUtil.readUtf8(object.getInputStream());
            XxlJobHelper.log("Remote data stream loading completed!");

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
            final String[] activeProfiles = environment.getActiveProfiles();
            String activeProfile = ArrayUtil.isNotEmpty(activeProfiles) ? activeProfiles[0] : null;

            if (!"local".equals(activeProfile) && StrUtil.isEmpty(jobParam.getSpaceId())) {
                XxlJobHelper.log("Currently does not support full space station scan and repair, please specify space id.");
                return;
            }

            oneWayLinkDataList = planA(jobParam, timer);
            // timer = timer.restart();

            // planB(timer);
            // timer = timer.restart();

            if ("local".equals(activeProfile)) {
                String fileName = "result.txt";
                String outFile = StrUtil.format("{}/temp/analyzeAssociationData/{}", System.getProperty("user.dir"), fileName);
                // Remove blank elements and deduplication from analysis results
                FileUtil.appendUtf8Lines(CollUtil.removeBlank(oneWayLinkDataList.stream().map(WaitProcessedOneWayLinkData::toDesc).collect(Collectors.toSet())), FileUtil.file(outFile));
                System.out.println("Write result「" + outFile + "」finish");
            }
            else {
                if (CollUtil.isNotEmpty(oneWayLinkDataList) && RunFunc.LIST == jobParam.getRunFunc()) {
                    try {
                        // The analysis results are output to oss
                        String paht = StrUtil.format("job/analyze/association/result/{}-{}.json", activeProfile, DateUtil.date().toString(DatePattern.PURE_DATETIME_FORMAT));
                        ossTemplate.upload(configProperties.getOssBucketName(), IoUtil.toUtf8Stream(JSONUtil.toJsonStr(oneWayLinkDataList)), paht, MediaType.APPLICATION_JSON_VALUE, null);
                        XxlJobHelper.log("Upload the result to OSS「" + paht + "」finish");
                    }
                    catch (IOException e) {
                        e.printStackTrace();
                    }
                }
            }
        }

        if (CollUtil.isNotEmpty(oneWayLinkDataList) && RunFunc.LIST != jobParam.getRunFunc()) {
            repairOneWayLinkDataHandle(oneWayLinkDataList, jobParam);
            String outStr = "Repair one-way linked data completed. Total time: " + timer.intervalPretty();
            System.out.println(outStr);
            XxlJobHelper.log(outStr);
        }
    }

    @Override
    public void fixTemplateViewSortInfo(FixDatasheetDataHandler.JobParam jobParam) {
        if (StrUtil.isBlank(jobParam.getSpaceId())) {
            XxlJobHelper.log("Currently does not support full space station scan and repair, please specify space id.");
            return;
        }

        List<DataSheetMetaDto> dataSheetMetaDtos = datasheetMetaMapper.selectMetaDataByFixMode(jobParam.getSpaceId(), 1);
        XxlJobHelper.log("Scan the number of templates that exist sorted. Count: {}", CollUtil.size(dataSheetMetaDtos));

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
                    XxlJobHelper.log("dst_id:{}. Execute result:{}", dstId, affectRows);
                }
            });
        }
    }

    /**
     * Plan A
     * Multi-threaded execution of analytical processing data
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
                                        String outLog = StrUtil.format("Current ID: {}. Execute index:{}. Current scan:{}. Scanned:{}. Next id:{}", finalNewNextId, finalI, left.getRecordSize(), dataSheetCount.get(), left.getNextId());
                                        System.out.println(outLog);
                                        XxlJobHelper.log(outLog);

                                        List<ForeignDatasheetDto> records = left.getRecords();
                                        if (CollUtil.isNotEmpty(records)) {
                                            ExecutorService analyzeExs = Executors.newFixedThreadPool(jobParam.getCoreAnalyzePoolSize());

                                            // Cumulative number of queries
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
                                            // Execute Run
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

        String outStr = StrUtil.format("Output statistics...\nDataSheetCount：{}\n「PlanA」total time: {}", dataSheetCount.get(), timer.intervalPretty());
        System.out.println(outStr);
        XxlJobHelper.log(outStr);
        return analyzeResult;
    }

    /**
     * Plan B.
     * Single-threaded execution of analytical processing data
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
            System.err.println("Next query id：" + newNextId);
        } while (newNextId != -1L);

        System.out.println("Output statistics...");
        System.out.println("DataSheetCount：" + dataSheetCount.get());
        System.out.println("AnalyzeResult：\n" + JSONUtil.toJsonPrettyStr(analyzeResult.stream().map(WaitProcessedOneWayLinkData::toDesc).collect(Collectors.toList())));

        System.err.println("「PlanB」total time：" + timer.intervalPretty());
    }

    /**
     * Batch query related field data
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
     * Analyze single item of linked data
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
                                    // Filters empty objects, filters non-magic related objects, and filters child related objects
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
                // Merge operation for multi-column magical associations in a single table
                .reduce(new ArrayList<>(), (all, item) -> {
                    if (CollUtil.isNotEmpty(item)) {
                        all.addAll(item);
                    }
                    return all;
                });

        if (CollUtil.isNotEmpty(allAssociationData)) {
            // List the associated table IDs, and deduplicate references to the same table ID
            List<String> dstIds = allAssociationData.stream().map(o -> o.getProperty().getForeignDatasheetId()).distinct().collect(Collectors.toList());
            List<DataSheetMetaDto> dataSheetMetaDtos = datasheetMetaMapper.selectDtoByNodeIds(dstIds);

            // For query results, convert to Map according to dstId
            // key: dstId
            Map<String, String> metaJsonByDstId = dataSheetMetaDtos.stream().collect(Collectors.toMap(DataSheetMetaDto::getDstId, DataSheetMetaDto::getMetaData));

            /*
             * Query the data table corresponding to the FdstId
             *  1: table does not exist
             *      Directly convert associated columns to text columns
             *  2: table exists
             *      2.1: Associated column does not exist
             *      2.2: Associative columns become non-associative columns (type: 7)
             *      Add a new column via Fusion Api
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
     * Fix one-way linked data processing
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
                        String outStr = StrUtil.format("{}-{}-{}. The current data does not define a data patching scheme", datum.getDstId(), datum.getFieldId(), datum.getFieldName());
                        System.out.println(outStr);
                        XxlJobHelper.log("\n" + outStr);
                        break;
                }

                if (null == request) {
                    continue;
                }

                boolean result = vikaOperations.executeCommand(datum.getDstId(), request);
                String outStr = StrUtil.format("{}：Fix with[{}]. Result: {}. Params: {}", datum.getDstId(), datum.getFixType(), result, JSONUtil.toJsonStr(request));
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
            // One-way COPY fix
            COPY_FIX,
            // Convert to text fix
            CONVERT_TEXT_FIX;
        }

        private String dstId;

        private String fieldId;

        private String fieldName;

        private String brotherFieldId;

        private Integer brotherFieldType;

        private String foreignDstId;

        private FixType fixType;

        private boolean brotherExist;

        private boolean foreignDstExist;

        // format description
        public String toDesc() {
            if (this.foreignDstExist) {
                if (this.brotherExist) {
                    return StrUtil.format("Table A Id: {} - Field Id: {} - Field Name: {}，Table B Id: {} - Field Id: {} - Non-Associated Columns! Current type:{}", this.dstId, this.fieldId, this.fieldName, this.foreignDstId, this.brotherFieldId, this.brotherFieldType);
                }
                else {
                    return StrUtil.format("Table A Id: {} - Field Id: {} - Field Name: {}，Table B Id: {} - Field Id: {} - Not Exist!", this.dstId, this.fieldId, this.fieldName, this.foreignDstId, this.brotherFieldId);
                }
            }
            else {
                return StrUtil.format("Table A Id: {} - Field Id: {} - Field Name: {}，Table B Id: {} - Not Exist!", this.dstId, this.fieldId, this.fieldName, this.foreignDstId);
            }
        }
    }

}
