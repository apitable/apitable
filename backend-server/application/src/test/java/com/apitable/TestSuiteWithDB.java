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
