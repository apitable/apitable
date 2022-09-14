package com.vikadata.api.lang;

import cn.hutool.core.bean.BeanUtil;
import cn.hutool.json.JSONObject;
import cn.hutool.json.JSONUtil;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.json.JsonMapper;
import org.junit.jupiter.api.Test;

import com.vikadata.api.enums.lang.ExportLevelEnum;
import com.vikadata.api.model.ro.space.SpaceSecuritySettingRo;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;

/**
 * @author tao
 */
public class SpaceGlobalFeatureTest {

    @Test
    void givenEmptyJsonStringWhenDeserializeJSONThenGetPojoWithExportLevelBeyondEditableValue() throws JsonProcessingException {
        String emptyLevel = "{}";
        SpaceGlobalFeature spaceGlobalFeature = JSONUtil.toBean(emptyLevel, SpaceGlobalFeature.class);
        ObjectMapper jsonMapper = new ObjectMapper();
        String feature = jsonMapper.writeValueAsString(spaceGlobalFeature);
        assertThat(feature.contains("\"rootManageable\":true")).isTrue();
        assertThat(feature.contains("\"exportLevel\":0")).isTrue();
    }

    @Test
    void givenJSONAllowedNodeExportableWithExportLevelWhenDeserializeJSONThenGetPojoWithExportLevelSpecialValue() {
        String emptyLevel = "{\"nodeExportable\": 1, \"exportLevel\": \"1\"}";
        SpaceGlobalFeature spaceGlobalFeature = JSONUtil.toBean(emptyLevel, SpaceGlobalFeature.class);
        assertThat(spaceGlobalFeature.getNodeExportable()).isTrue();
        assertThat(spaceGlobalFeature.getExportLevel()).isEqualTo(ExportLevelEnum.LEVEL_BEYOND_READ.getValue());
    }

    @Test
    void givenPojoWithExportLevelWhenSerializePojoThenGetJsonWithExportLevelSpecialValue() {
        SpaceGlobalFeature spaceGlobalFeature = new SpaceGlobalFeature();
        spaceGlobalFeature.setExportLevel(ExportLevelEnum.LEVEL_BEYOND_READ.getValue());
        JSONObject parseJSON = JSONUtil.parseObj(spaceGlobalFeature);
        assertThat(parseJSON.containsKey("exportLevel")).isEqualTo(true);
        assertThat(parseJSON.get("exportLevel")).isEqualTo(ExportLevelEnum.LEVEL_BEYOND_READ.getValue());
    }

    @Test
    void givenPojoNullExportLevelWhenSerializePojoThenNoExistExportLevel() {
        SpaceGlobalFeature spaceGlobalFeature = new SpaceGlobalFeature();
        JSONObject parseJSON = JSONUtil.parseObj(spaceGlobalFeature);
        assertThat(parseJSON.containsKey("exportLevel")).isEqualTo(false);
    }

    @Test
    void givenRoRootManageableWhenSerializePojoThenGetJsonWithTrueRootManageable() {
        SpaceSecuritySettingRo settingRo = new SpaceSecuritySettingRo();
        settingRo.setRootManageable(true);
        SpaceGlobalFeature feature = new SpaceGlobalFeature();
        BeanUtil.copyProperties(settingRo, feature);
        JSONObject parseJSON = JSONUtil.parseObj(feature);
        assertThat(parseJSON.get("rootManageable")).isEqualTo(true);
    }
}