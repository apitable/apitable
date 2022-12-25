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

package com.apitable.workspace.service.impl;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import cn.hutool.core.collection.CollUtil;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;

import com.apitable.AbstractIntegrationTest;
import com.apitable.workspace.dto.DatasheetMetaDTO;
import com.apitable.workspace.service.IDatasheetMetaService;
import com.apitable.workspace.service.IDatasheetService;

import org.springframework.boot.test.mock.mockito.MockBean;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.BDDMockito.given;

@Disabled("no assert")
public class DatasheetServiceImplTest extends AbstractIntegrationTest {

    @Resource
    private IDatasheetService iDatasheetService;

    @MockBean
    private IDatasheetMetaService iDatasheetMetaService;

    @Test
    void testGetForeignFieldNames() {
        List<String> dstList = CollUtil.newArrayList("dst1");
        List<DatasheetMetaDTO> metaList = new ArrayList<>();
        DatasheetMetaDTO datasheetMetaDTO = new DatasheetMetaDTO();
        datasheetMetaDTO.setDstId("dst1");
        datasheetMetaDTO.setMetaData("{fieldMap:{fld123:{id:fld123, name:test field, type:7, property:{foreignDatasheetId:dst3, }}}}");
        metaList.add(datasheetMetaDTO);
        // given
        given(iDatasheetMetaService.findMetaDtoByDstIds(dstList)).willReturn(metaList);
        // when
        Map<String, List<String>> getForeignFieldNames = iDatasheetService.getForeignFieldNames(dstList);
        // then
        assertThat(getForeignFieldNames).isNotEmpty();
        for (String dst : getForeignFieldNames.keySet()) {
            assertThat(dst).isEqualTo("dst1");
            assertThat(getForeignFieldNames.get(dst).get(0)).isEqualTo("test field");
        }
    }
}
