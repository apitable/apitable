package com.vikadata.api;

import java.util.List;

import org.junit.jupiter.api.BeforeEach;

import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.jdbc.core.JdbcTemplate;

public abstract class TestSuiteWithDB {

    @BeforeEach
    public void beforeMethod() {
        cleanAllTables();
        unsetCache();
    }

    protected abstract JdbcTemplate configureJdbcTemplate();

    protected abstract RedisTemplate<String, Object> configureRedisTemplate();

    protected abstract List<String> configureExcludeTables();

    protected void cleanAllTables() {
        UnitTestUtil.clearDB(configureJdbcTemplate(), configureExcludeTables());
    }

    protected void unsetCache() {
        UnitTestUtil.cleanCacheKeys(configureRedisTemplate());
    }
}
