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

import cn.hutool.core.collection.CollUtil;
import cn.hutool.core.io.IoUtil;
import cn.hutool.core.util.ArrayUtil;
import cn.hutool.core.util.StrUtil;
import java.io.InputStream;
import java.sql.DatabaseMetaData;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import javax.sql.DataSource;
import org.jetbrains.annotations.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.support.DatabaseMetaDataCallback;
import org.springframework.jdbc.support.JdbcUtils;
import org.springframework.jdbc.support.MetaDataAccessException;
import org.springframework.test.jdbc.JdbcTestUtils;
import org.springframework.util.CollectionUtils;

/**
 * database sandbox tool class.
 * Responsible for cleaning up the database and keeping unit test classes isolated
 */
public class UnitTestUtil {

    public static final String LIQUIBASE_TABLE_PREFIX = "db_changelog";

    public static final String ASSET_TABLE_NAME = "asset";

    private static final Logger logger = LoggerFactory.getLogger(UnitTestUtil.class);

    public static void cleanCacheKeys(RedisTemplate<String, Object> redisTemplate) {
        Set<String> keys = redisTemplate.keys("*");
        if (!CollectionUtils.isEmpty(keys)) {
            redisTemplate.delete(keys);
        }
    }

    public static void clearDB(JdbcTemplate jdbcTemplate, List<String> excludeTables,
                               String tablePrefix) {
        // String catalog = getDbName(jdbcTemplate);
        // logger.info("prepare db for unit test, schema: {}", catalog);
        // Here is in the ci environment, clean up all table data in the database in My SQL in ci,
        // it will not be executed in local development, because test is specified
        DataSource dataSource = jdbcTemplate.getDataSource();
        if (dataSource == null) {
            throw new RuntimeException("can't connect to database");
        }
        GetTableNames getTableNames = new GetTableNames();
        List<String> tableNames;
        try {
            tableNames =
                JdbcUtils.extractDatabaseMetaData(dataSource, getTableNames);
        } catch (MetaDataAccessException e) {
            throw new RuntimeException("extract table names fail", e);
        }
        tableNames.removeIf(tableName -> tableName.equals(tablePrefix + ASSET_TABLE_NAME)
            || tableName.contains(LIQUIBASE_TABLE_PREFIX)
            || !tableName.startsWith(tablePrefix));
        List<String> rows = getAssetTableExcludeRows();
        if (!rows.isEmpty()) {
            String whereClause = StrUtil.format("file_url not in({})",
                CollUtil.join(rows, ",", "'", "'"));
            JdbcTestUtils.deleteFromTableWhere(jdbcTemplate,
                tablePrefix + ASSET_TABLE_NAME,
                whereClause);
        }
        List<String> excludeTablesWithTablePrefix =
            excludeTables.stream().map(excludeTable -> tablePrefix + excludeTable).toList();
        filterTableNames(tableNames, excludeTablesWithTablePrefix);
        JdbcTestUtils.deleteFromTables(jdbcTemplate, ArrayUtil.toArray(tableNames, String.class));
    }

    private static List<String> getAssetTableExcludeRows() {
        String resourceName = "asset_exclude_row.txt";
        InputStream inputStream = FileHelper.getInputStreamFromResource(resourceName);
        return IoUtil.readUtf8Lines(inputStream, new ArrayList<>());
    }

    private static void filterTableNames(List<String> tableNames, List<String> excludeTables) {
        // Tables that exclude initialization data
        logger.info("Exclude table: {}", excludeTables);
        tableNames.removeIf(excludeTables::contains);
        logger.info("Table cleaned after exclusion: {}", tableNames);
    }

    private static class GetTableNames implements DatabaseMetaDataCallback<List<String>> {

        @Override
        @NotNull
        public List<String> processMetaData(DatabaseMetaData dbmd) throws SQLException {
            ResultSet tables = dbmd.getTables(null, null, "%", new String[] {"TABLE"});
            List<String> tableNames = new ArrayList<>();
            while (tables.next()) {
                String tableName = tables.getString("TABLE_NAME");
                if (!tableName.equals("sys_config")) {
                    tableNames.add(tableName);
                }
            }
            return tableNames;
        }
    }
}
