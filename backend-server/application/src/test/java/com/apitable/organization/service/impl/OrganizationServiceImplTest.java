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

package com.apitable.organization.service.impl;

import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.util.List;

import javax.annotation.Resource;

import cn.hutool.core.collection.CollUtil;
import org.apache.commons.io.IOUtils;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;

import com.apitable.AbstractIntegrationTest;
import com.apitable.FileHelper;
import com.apitable.organization.vo.SubUnitResultVo;
import com.apitable.organization.service.IOrganizationService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;

import static org.assertj.core.api.Assertions.assertThat;

public class OrganizationServiceImplTest extends AbstractIntegrationTest {

    @Resource
    private IOrganizationService iOrganizationService;

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Test
    @Disabled
    void testLoadMemberFirstTeams() throws IOException {
        List<Long> teamIds = CollUtil.newArrayList(1279306279580438529L, 1342304314473648129L, 1236159916641619970L, 1283285207447699457L);
        String resourceName = "sql/orgIsolated-vut-data.sql";
        InputStream inputStream = FileHelper.getInputStreamFromResource(resourceName);
        String sql = IOUtils.toString(inputStream, StandardCharsets.UTF_8);
        jdbcTemplate.execute(sql);

        SubUnitResultVo subUnitResultVo = iOrganizationService.loadMemberFirstTeams("spczdmQDfBAn5", teamIds);
        assertThat(subUnitResultVo.getTeams().size()).isEqualTo(0);
    }
}
