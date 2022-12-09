package com.vikadata.api.workspace.service.impl;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import cn.hutool.core.collection.CollUtil;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;

import com.vikadata.api.AbstractIntegrationTest;
import com.vikadata.api.workspace.dto.DatasheetMetaDTO;
import com.vikadata.api.workspace.service.IDatasheetMetaService;
import com.vikadata.api.workspace.service.IDatasheetService;

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
