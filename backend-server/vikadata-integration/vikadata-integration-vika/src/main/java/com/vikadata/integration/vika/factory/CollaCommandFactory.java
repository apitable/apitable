package com.vikadata.integration.vika.factory;

import java.util.Map;

import cn.hutool.core.lang.Dict;
import cn.hutool.core.lang.TypeReference;
import cn.hutool.core.util.StrUtil;
import cn.hutool.json.JSONUtil;

/**
 * <p>
 * 简单的执行Command工厂</br>
 * 由于是一个低频操作，没有定义对象模型，直接使用Json Str数据结构
 * </p>
 *
 * @author Pengap
 * @date 2022/2/21 10:44:33
 */
public class CollaCommandFactory {

    /**
     * 修复单向关联自定义Cmd </br>
     * 通过单向copy，然后变更关联foreignDstId修复 </br>
     *
     * @author Pengap
     * @date 2022/2/21 16:37:49
     */
    public static Map<String, Object> fixOneWayLinkByChangeDstId(String dstId, String fieldId, String foreignDstId) {
        String jsonStr = "{\n"
                + "    \"cmd\":\"AddFields\",\n"
                + "    \"copyCell\":true,\n"
                + "    \"internalFix\":{\n"
                + "        \"fixUser\":{\n"
                + "              \"userId\":-1,\n"
                + "              \"uuid\":\"-1\"\n"
                + "         },\n"
                + "        \"selfCreateNewField\":false,\n"
                + "        \"changeOneWayLinkDstId\":true\n"
                + "    },\n"
                + "    \"data\":[\n"
                + "        {\n"
                + "            \"data\":{\n"
                + "                \"type\":7,\n"
                + "                \"property\":{\n"
                + "                    \"foreignDatasheetId\":\"{foreignDatasheetId}\"\n"
                + "                }\n"
                + "            },\n"
                + "            \"fieldId\":\"{fieldId}\"\n"
                + "        }\n"
                + "    ],\n"
                + "    \"fieldId\":\"{fieldId}\",\n"
                + "    \"resourceId\":\"{resourceId}\",\n"
                + "    \"resourceType\":0\n"
                + "}";

        Dict dict = Dict.create();
        dict.set("resourceId", dstId)
                .set("fieldId", fieldId)
                .set("foreignDatasheetId", foreignDstId);

        jsonStr = StrUtil.format(jsonStr, dict);

        return JSONUtil.parse(jsonStr).toBean(new TypeReference<Map<String, Object>>() {});
    }

    /**
     * 修复单向关联自定义Cmd </br>
     * 修复单向关联，B表不存在的情况 </br>
     * 缺失B表，转换关联列为多行文本 </br>
     *
     * @author Pengap
     * @date 2022/2/21 16:37:49
     */
    public static Map<String, Object> fixOneWayLinkByMultilineText(String dstId, String fieldId, String fieldName) {
        String jsonStr = "{\n"
                + "    \"cmd\":\"SetFieldAttr\",\n"
                + "    \"includeLink\": false,\n"
                + "    \"internalFix\":{\n"
                + "        \"fixUser\":{\n"
                + "              \"userId\":-1,\n"
                + "              \"uuid\":\"-1\"\n"
                + "         }\n"
                + "    },\n"
                + "    \"data\":{\n"
                + "        \"id\":\"{fieldId}\",\n"
                + "        \"name\":\"{fieldName}\",\n"
                + "        \"type\":1,\n"
                + "        \"property\":null\n"
                + "    },\n"
                + "    \"fieldId\":\"{fieldId}\",\n"
                + "    \"resourceId\":\"{resourceId}\",\n"
                + "    \"resourceType\":0\n"
                + "}";

        Dict dict = Dict.create();
        dict.set("resourceId", dstId)
                .set("fieldId", fieldId)
                .set("fieldName", fieldName);

        jsonStr = StrUtil.format(jsonStr, dict);

        return JSONUtil.parse(jsonStr).toBean(new TypeReference<Map<String, Object>>() {});
    }

}
