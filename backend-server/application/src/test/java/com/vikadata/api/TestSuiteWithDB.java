package com.vikadata.api;

import java.util.List;

import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.jdbc.core.JdbcTemplate;

public abstract class TestSuiteWithDB {

    public void beforeMethod() {
        cleanAllTables();
        unsetCache();
    }

    protected abstract JdbcTemplate configureJdbcTemplate();

    protected abstract RedisTemplate<String, Object> configureRedisTemplate();

    protected abstract List<String> configureExcludeTables();

    protected abstract String tablePrefix();

    protected void cleanAllTables() {
        UnitTestUtil.clearDB(configureJdbcTemplate(), configureExcludeTables(), tablePrefix());
    }

    protected void unsetCache() {
        UnitTestUtil.cleanCacheKeys(configureRedisTemplate());
    }
}
