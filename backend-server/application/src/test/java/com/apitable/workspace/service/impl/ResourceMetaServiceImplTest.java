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

import cn.hutool.core.io.IoUtil;
import com.apitable.AbstractIntegrationTest;
import com.apitable.workspace.dto.NodeDescParseDTO;
import com.baomidou.mybatisplus.core.toolkit.IdWorker;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.core.io.ClassPathResource;

/**
 * resource meta service test
 */
public class ResourceMetaServiceImplTest extends AbstractIntegrationTest {

    @Test
    public void testParsFormDescWithNull() {
        NodeDescParseDTO desc = iResourceMetaService.parseFormDescByFormId(IdWorker.getIdStr());
        Assertions.assertEquals(0, desc.getContent().size());
    }

    @Test
    public void testParsFormDescWithText() {
        String formId = IdWorker.get32UUID();
        prepareFormMetaData(formId, "meta/form_text_meta.json");
        NodeDescParseDTO desc = iResourceMetaService.parseFormDescByFormId(formId);
        Assertions.assertTrue(desc.getContent().size() > 0);
        Assertions.assertEquals("test", desc.getContent().get(0));
    }

    @Test
    public void testParsFormDescWithUrl() {
        String formId = IdWorker.get32UUID();
        prepareFormMetaData(formId, "meta/form_url_meta.json");
        NodeDescParseDTO desc = iResourceMetaService.parseFormDescByFormId(formId);
        Assertions.assertTrue(desc.getContent().size() > 0);
        Assertions.assertEquals("https://apitable.com", desc.getContent().get(0));
    }

    @Test
    public void testParsFormDescWithTextHasBlank() {
        String formId = IdWorker.get32UUID();
        prepareFormMetaData(formId, "meta/form_text_blank_meta.json");
        NodeDescParseDTO desc = iResourceMetaService.parseFormDescByFormId(formId);
        Assertions.assertTrue(desc.getContent().size() > 0);
        Assertions.assertEquals("test test", desc.getContent().get(0));
    }

    private void prepareFormMetaData(String formId, String fileName) {
        InputStream resourceAsStream =
            ClassPathResource.class.getClassLoader().getResourceAsStream(fileName);
        if (resourceAsStream == null) {
            return;
        }
        String jsonString = IoUtil.read(resourceAsStream, StandardCharsets.UTF_8);
        iResourceMetaService.create(null, formId, 1, jsonString);
    }
}
