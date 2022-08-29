package com.vikadata;

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
 * 数据库沙箱工具类
 * 负责清理数据库，保持单元测试类的隔离性
 * @author Shawn Deng
 * @date 2022-03-25 12:47:45
 */
public class UnitTestUtil {

    private static final Logger logger = LoggerFactory.getLogger(UnitTestUtil.class);

    public static final String LIQUIBASE_TABLE_PREFIX = "vika_db_changelog";

    public static final String ASSET_TABLE_NAME = "vika_asset";

    public static void cleanCacheKeys(RedisTemplate<String, Object> redisTemplate) {
        Set<String> keys = redisTemplate.keys("*");
        if (!CollectionUtils.isEmpty(keys)) {
            redisTemplate.delete(keys);
        }
    }

    public static void clearDB(JdbcTemplate jdbcTemplate, List<String> excludeTables) {
        String catalog = getDbName(jdbcTemplate);
        logger.info("prepare db for unit test, schema: {}", catalog);
        // 这里是在ci环境下，清理ci中MySQL中的数据库所有表格数据，在本地开发并不会执行，因为指定了vika_test
        List<String> tableNames = getTableNames(jdbcTemplate, catalog);
        if (catalog.equals("vikadata")) {
            // 为了不让开发者连上使用环境或者测试环境，不允许操作相关vikadata字眼的数据库名称
            throw new RuntimeException("may be you should be using db name which called 「vikadata」");
        }
        tableNames.removeIf(tableName -> tableName.equals(ASSET_TABLE_NAME));
        List<String> rows = getAssetTableExcludeRows();
        if (!rows.isEmpty()) {
            String whereClause = StrUtil.format("file_url not in({})",
                    CollUtil.join(rows, ",", "'", "'"));
            JdbcTestUtils.deleteFromTableWhere(jdbcTemplate, ASSET_TABLE_NAME, whereClause);
        }
        filterTableNames(tableNames, excludeTables);
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

    private static List<String> getTableNames(JdbcTemplate jdbcTemplate, String database) {
        final String sql = StrUtil.format(
                "SELECT table_name FROM information_schema.tables WHERE table_name not like '{}%' AND table_schema = '{}'"
                , LIQUIBASE_TABLE_PREFIX, database);
        List<Map<String, Object>> mapList = jdbcTemplate.queryForList(sql);
        return mapList.stream().map(m -> m.get("table_name").toString()).collect(Collectors.toList());
    }

    private static List<String> getAssetTableExcludeRows() {
        String resourceName = "vika_asset_exclude_row.txt";
        InputStream inputStream = FileHelper.getInputStreamFromResource(resourceName);
        return IoUtil.readUtf8Lines(inputStream, new ArrayList<>());
    }

    private static void filterTableNames(List<String> tableNames, List<String> excludeTables) {
        // 排除清理某些初始化数据的表格数据
        logger.info("排除清理的表格:{}", excludeTables);
        tableNames.removeIf(excludeTables::contains);
        logger.info("排除后清理的表格：{}", tableNames);
    }
}
