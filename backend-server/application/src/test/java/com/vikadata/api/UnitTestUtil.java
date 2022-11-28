package com.vikadata.api;

import java.io.InputStream;
import java.sql.Connection;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

import javax.sql.DataSource;

import cn.hutool.core.collection.CollUtil;
import cn.hutool.core.io.IoUtil;
import cn.hutool.core.util.ArrayUtil;
import cn.hutool.core.util.StrUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.jdbc.core.JdbcTemplate;
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

    public static void clearDB(JdbcTemplate jdbcTemplate, List<String> excludeTables, String tablePrefix) {
        String catalog = getDbName(jdbcTemplate);
        logger.info("prepare db for unit test, schema: {}", catalog);
        // Here is in the ci environment, clean up all table data in the database in My SQL in ci, it will not be executed in local development, because vika test is specified
        List<String> tableNames = getTableNames(jdbcTemplate, catalog, tablePrefix);
        if (catalog.equals("vikadata")) {
            // In order to prevent developers from connecting to the use environment or test environment, it is not allowed to operate the database name of the relevant vikadata word
            throw new RuntimeException("may be you should not use db name which called 「vikadata」");
        }
        tableNames.removeIf(tableName -> tableName.equals(tablePrefix + ASSET_TABLE_NAME));
        List<String> rows = getAssetTableExcludeRows();
        if (!rows.isEmpty()) {
            String whereClause = StrUtil.format("file_url not in({})",
                    CollUtil.join(rows, ",", "'", "'"));
            JdbcTestUtils.deleteFromTableWhere(jdbcTemplate, tablePrefix + ASSET_TABLE_NAME, whereClause);
        }
        List<String> excludeTablesWithTablePrefix = excludeTables.stream().map(excludeTable -> tablePrefix + excludeTable).collect(Collectors.toList());
        filterTableNames(tableNames, excludeTablesWithTablePrefix);
        JdbcTestUtils.deleteFromTables(jdbcTemplate, ArrayUtil.toArray(tableNames, String.class));
    }

    public static String getDbName(JdbcTemplate jdbcTemplate) {
        DataSource dataSource = jdbcTemplate.getDataSource();
        if (dataSource == null) {
            throw new RuntimeException("please confirm datasource url");
        }
        try (Connection connection = dataSource.getConnection()) {
            return connection.getCatalog();
        }
        catch (SQLException e) {
            throw new RuntimeException("connect db is not work", e);
        }
    }

    private static List<String> getTableNames(JdbcTemplate jdbcTemplate, String database, String tablePrefix) {
        final String sql = StrUtil.format(
                "SELECT table_name FROM information_schema.tables WHERE table_name not like '{}%' AND table_schema = '{}'"
                , tablePrefix + LIQUIBASE_TABLE_PREFIX, database);
        List<Map<String, Object>> mapList = jdbcTemplate.queryForList(sql);
        return mapList.stream().map(m -> m.get("table_name").toString()).collect(Collectors.toList());
    }

    private static List<String> getAssetTableExcludeRows() {
        String resourceName = "vika_asset_exclude_row.txt";
        InputStream inputStream = FileHelper.getInputStreamFromResource(resourceName);
        return IoUtil.readUtf8Lines(inputStream, new ArrayList<>());
    }

    private static void filterTableNames(List<String> tableNames, List<String> excludeTables) {
        // Tables that exclude initialization data
        logger.info("Exclude table: {}", excludeTables);
        tableNames.removeIf(excludeTables::contains);
        logger.info("Table cleaned after exclusion: {}", tableNames);
    }
}
