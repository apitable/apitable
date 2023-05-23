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

package com.apitable.shared.cache.service;

import static org.assertj.core.api.Assertions.assertThat;

import cn.hutool.core.util.StrUtil;
import com.apitable.AbstractIntegrationTest;
import org.junit.jupiter.api.Test;

public class TemplateConfigInRedisImplTest extends AbstractIntegrationTest {

    private final static String CATEGORIES_LIST_CONFIG =
        "[{\"templateIds\":[\"tpl1\",\"tpl2\"],\"categoryCode\":\"pc1\",\"categoryName\":\"cn1\"},"
            +
            "{\"templateIds\":[\"tpl3\",\"tpl4\"],\"categoryCode\":\"pc2\",\"categoryName\":\"cn2\"}]";

    @Test
    void testGetCategoriesListConfigCacheByLangFromCache() {
        String lang = "zh_CN";
        String key = StrUtil.format("config:{}:{}", "template", lang + ":online");
        redisTemplate.opsForValue().set(key, CATEGORIES_LIST_CONFIG);
        String cache = templateConfigCacheService.getCategoriesListConfigCacheByLang(lang);
        assertThat(cache).isEqualTo(CATEGORIES_LIST_CONFIG);
        redisTemplate.delete(key);
    }
}
