package com.vikadata.schedule.space.service;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import javax.annotation.Resource;

import cn.hutool.core.io.FileUtil;
import cn.hutool.core.util.StrUtil;
import cn.hutool.json.JSONObject;
import cn.hutool.json.JSONUtil;
import com.xxl.job.core.context.XxlJobContext;
import groovy.util.logging.Slf4j;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.SneakyThrows;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;

import com.apitable.starter.vika.core.VikaOperations;
import com.apitable.starter.vika.core.factory.CollaCommandFactory;
import com.vikadata.scheduler.space.SchedulerSpaceApplication;
import com.vikadata.scheduler.space.handler.ClearOneWayLinkJobHandler;
import com.vikadata.scheduler.space.handler.FixDatasheetDataHandler;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@Disabled("no assertion")
@Slf4j
@SpringBootTest(classes = SchedulerSpaceApplication.class)
public class DatasheetMetaTest {

    @Resource
    private ClearOneWayLinkJobHandler clearOneWayLinkJobHandler;

    @Resource
    private FixDatasheetDataHandler fixDatasheetDataHandler;

    @Autowired(required = false)
    private VikaOperations vikaOperations;

    @Test
    public void testClearOneWayLinkJobHandler() {
        String fileName = "result.txt";
        String aadPath = StrUtil.format("{}/temp/analyzeAssociationData/{}", System.getProperty("user.dir"), fileName);

        System.err.println(
                StrUtil.format("Reset file: {}. OutFile: {}", FileUtil.del(aadPath), FileUtil.touch(aadPath))
        );

        try {
            clearOneWayLinkJobHandler.execute();
            Thread.sleep(300000L);
        }
        catch (InterruptedException e) {
            e.printStackTrace();
        }
    }

    @Test
    public void testFixDatasheetDataHandler() {
        JSONObject jobParam = new JSONObject();
        jobParam.set("fixDataMode", "FIX_TEMPLATE_VIEW_SORTINFO").set("spaceId", "spcvPyya2zJl6");

        XxlJobContext.setXxlJobContext(
                new XxlJobContext(-1, jobParam.toString(), null, -1, -1)
        );

        fixDatasheetDataHandler.execute();
    }

    @Test
    public void testExecuteCommand() {
        // String dstId = "dst0W5T1ptnXhqaKxW";
        // Map<String, Object> request = CollaCommandFactory.fixOneWayLinkByChangeDstId(dstId, "fldCaqUMp3uAl", "dstsYKEAdG7bipEiLb");
        String dstId = "dstsYKEAdG7bipEiLb";
        Map<String, Object> request = CollaCommandFactory.fixOneWayLinkByMultilineText(dstId, "fld2QCEyYpEIJ", "2A Table 3");
        vikaOperations.executeCommand(dstId, request);
    }

    @Disabled("no assertion")
    public static class InternalTest {

        @Test
        @SneakyThrows
        public void testMetaJsonSerialization() {
            String jsonStr = "[{\"options\": [{\"id\": \"optYQgL1LYfye\", \"name\": \"finance\", \"color\": 0}, {\"id\": \"opt3JxdpGzwSU\", \"name\": \"administrative\", \"color\": 1}]}, {\"brotherFieldId\": \"fldDrutmejZp2\", \"foreignDatasheetId\": \"dstV2D0lHmER062Mxm\"}, {\"options\": [{\"id\": \"optWpbdL1mOv8\", \"name\": \"A\", \"color\": 0}, {\"id\": \"optcMRZ53TggL\", \"name\": \"B\", \"color\": 1}]}]";

            // ObjectMapper objectMapper = new ObjectMapper();
            // objectMapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
            // objectMapper.setSerializationInclusion(JsonInclude.Include.NON_EMPTY);
            //
            // List<ForeignObj> foreignObjs = objectMapper.readValue(jsonStr, new TypeReference<List<ForeignObj>>() {});
            // System.out.println(foreignObjs);

            List<ForeignObj> foreignObjs = JSONUtil.toList(jsonStr, ForeignObj.class);
            foreignObjs = foreignObjs.stream().filter(o -> o.getBrotherFieldId() != null && o.getForeignDatasheetId() != null).collect(Collectors.toList());

            System.out.println(foreignObjs);
        }

    }

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    static class ForeignObj {
        String brotherFieldId;

        String foreignDatasheetId;
    }

}
