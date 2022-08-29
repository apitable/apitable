package com.vikadata.api.lang;

import cn.hutool.core.bean.BeanUtil;
import cn.hutool.json.JSONObject;
import cn.hutool.json.JSONUtil;
import org.junit.jupiter.api.Test;

import com.vikadata.api.enums.lang.ExportLevelEnum;
import com.vikadata.api.model.ro.space.SpaceSecuritySettingRo;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;

/**
 * @author tao
 */
public class SpaceGlobalFeatureTest {

    @Test
    void givenJSONAllowedNodeExportableWithEmptyExportLevelWhenDeserializeJSONThenGetPojoWithExportLevelBeyondEditableValue() {
        String emptyLevel = "{\"nodeExportable\": 1}";
        SpaceGlobalFeature spaceGlobalFeature = JSONUtil.toBean(emptyLevel, SpaceGlobalFeature.class);
        assertThat(spaceGlobalFeature.getNodeExportable()).isTrue();
        assertThat(spaceGlobalFeature.getExportLevel()).isEqualTo(ExportLevelEnum.LEVEL_BEYOND_EDIT.getValue());
    }

    @Test
    void givenJSONAllowedNodeExportableWithExportLevelWhenDeserializeJSONThenGetPojoWithExportLevelSpecialValue() {
        String emptyLevel = "{\"nodeExportable\": 1, \"exportLevel\": \"1\"}";
        SpaceGlobalFeature spaceGlobalFeature = JSONUtil.toBean(emptyLevel, SpaceGlobalFeature.class);
        assertThat(spaceGlobalFeature.getNodeExportable()).isTrue();
        assertThat(spaceGlobalFeature.getExportLevel()).isEqualTo(ExportLevelEnum.LEVEL_BEYOND_READ.getValue());
    }

    @Test
    void givenJSONDisallowedNodeExportableWithExportLevelWhenDeserializeJSONThenGetPojoWithExportLevelClosedValue() {
        String emptyLevel = "{\"nodeExportable\": 0}";
        SpaceGlobalFeature spaceGlobalFeature = JSONUtil.toBean(emptyLevel, SpaceGlobalFeature.class);
        assertThat(spaceGlobalFeature.getNodeExportable()).isFalse();
        assertThat(spaceGlobalFeature.getExportLevel()).isEqualTo(ExportLevelEnum.LEVEL_CLOSED.getValue());
    }

    @Test
    void givenPojoAllowedNodeExportableWithoutExportLevelWhenSerializePojoThenGetJsonWithExportLevelDefaultValue() {
        SpaceGlobalFeature spaceGlobalFeature = new SpaceGlobalFeature();
        spaceGlobalFeature.setNodeExportable(true);
        JSONObject parseJSON = JSONUtil.parseObj(spaceGlobalFeature);
        assertThat(parseJSON.containsKey("exportLevel")).isEqualTo(true);
        assertThat(parseJSON.get("exportLevel")).isEqualTo(ExportLevelEnum.LEVEL_BEYOND_EDIT.getValue());
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
    void givenPojoDisallowedNodeExportableWithExportLevelWhenSerializePojoThenGetJsonWithExportLevelSpecialValue() {
        SpaceGlobalFeature spaceGlobalFeature = new SpaceGlobalFeature();
        spaceGlobalFeature.setNodeExportable(false);
        JSONObject parseJSON = JSONUtil.parseObj(spaceGlobalFeature);
        assertThat(parseJSON.get("nodeExportable")).isEqualTo(false);
        assertThat(parseJSON.containsKey("exportLevel")).isEqualTo(true);
        assertThat(parseJSON.get("exportLevel")).isEqualTo(ExportLevelEnum.LEVEL_CLOSED.getValue());
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