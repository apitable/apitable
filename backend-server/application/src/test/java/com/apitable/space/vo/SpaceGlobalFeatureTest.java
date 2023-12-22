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

package com.apitable.space.vo;

import static org.assertj.core.api.Assertions.assertThat;

import cn.hutool.core.bean.BeanUtil;
import cn.hutool.json.JSONObject;
import cn.hutool.json.JSONUtil;
import com.apitable.control.infrastructure.ExportLevelEnum;
import com.apitable.space.ro.SpaceSecuritySettingRo;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;

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