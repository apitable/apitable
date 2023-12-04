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

package com.apitable;

import com.apitable.shared.config.MybatisPlusConfig;
import com.apitable.sql.script.enhance.ModifyBeforeSqlScriptsTestExecutionListener;
import com.baomidou.mybatisplus.autoconfigure.MybatisPlusProperties;
import com.baomidou.mybatisplus.test.autoconfigure.MybatisPlusTest;
import java.util.List;
import java.util.Objects;
import org.junit.jupiter.api.BeforeAll;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase.Replace;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.TestExecutionListeners;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.context.event.ApplicationEventsTestExecutionListener;
import org.springframework.test.context.event.EventPublishingTestExecutionListener;
import org.springframework.test.context.support.DependencyInjectionTestExecutionListener;
import org.springframework.test.context.support.DirtiesContextBeforeModesTestExecutionListener;
import org.springframework.test.context.support.DirtiesContextTestExecutionListener;
import org.springframework.test.context.transaction.TransactionalTestExecutionListener;
import org.springframework.test.context.web.ServletTestExecutionListener;

/**
 * Quickly test Mapper and use Mybatis-Plus's illegal sql plug-in to achieve reasonable sql
 */
@MybatisPlusTest
@ContextConfiguration(classes = {MybatisPlusConfig.class, TestMybatisPlusConfig.class})
@AutoConfigureTestDatabase(replace = Replace.NONE)
@TestPropertySource(value = {
    "classpath:test.properties",
})
@TestExecutionListeners(value = {
    ServletTestExecutionListener.class,
    DirtiesContextBeforeModesTestExecutionListener.class,
    ApplicationEventsTestExecutionListener.class,
    DependencyInjectionTestExecutionListener.class,
    DirtiesContextTestExecutionListener.class,
    TransactionalTestExecutionListener.class,
    ModifyBeforeSqlScriptsTestExecutionListener.class,
    EventPublishingTestExecutionListener.class
})
public abstract class AbstractMyBatisMapperTest {

    @BeforeAll
    static void setUp(@Autowired JdbcTemplate jdbcTemplate,
                      @Value("#{'${exclude}'.split(',')}") List<String> excludeTables,
                      @Autowired MybatisPlusProperties mybatisPlusProperties) {
        Object tablePrefixObj =
            mybatisPlusProperties.getConfigurationProperties().get("tablePrefix");
        String tablePrefix = Objects.isNull(tablePrefixObj) ? "" : tablePrefixObj.toString();
        UnitTestUtil.clearDB(jdbcTemplate, excludeTables, tablePrefix);
    }
}
