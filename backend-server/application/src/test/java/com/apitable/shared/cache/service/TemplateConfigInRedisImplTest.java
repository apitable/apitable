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

import java.util.List;

import cn.hutool.core.collection.CollUtil;
import cn.hutool.core.util.StrUtil;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;

import com.apitable.AbstractIntegrationTest;
import com.apitable.shared.cache.bean.CategoryDto;
import com.apitable.template.service.ITemplatePropertyService;

import org.springframework.boot.test.mock.mockito.SpyBean;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.BDDMockito.willReturn;

/**
 * @author tao
 */
@Disabled("no assert")
public class TemplateConfigInRedisImplTest extends AbstractIntegrationTest {

    private final static String CATEGORIES_LIST_CONFIG =
            "[{\"templateIds\":[\"tpl1\",\"tpl2\"],\"categoryCode\":\"pc1\",\"categoryName\":\"cn1\"},"
                    + "{\"templateIds\":[\"tpl3\",\"tpl4\"],\"categoryCode\":\"pc2\",\"categoryName\":\"cn2\"}]";

    @SpyBean
    private TemplateConfigCacheService templateConfigCacheService;

    @SpyBean
    private ITemplatePropertyService templatePropertyService;

    @Test
    void testGetCategoriesListConfigCacheByLangFromCache() {
        String lang = "zh_CN";
        String key = StrUtil.format("config:{}:{}", "template", lang + ":online");
        redisTemplate.opsForValue().set(key, CATEGORIES_LIST_CONFIG);
        String cache = templateConfigCacheService.getCategoriesListConfigCacheByLang(lang);
        assertThat(cache).isEqualTo(CATEGORIES_LIST_CONFIG);
        redisTemplate.delete(key);
    }

    @Test
    void testGetCategoriesListConfigCacheByLangFromDB() {
        String lang = "zh_CN";
        List<CategoryDto> categories = CollUtil.newArrayList(
                CategoryDto.builder().categoryCode("pc1")
                        .categoryName("cn1")
                        .templateIds(CollUtil.newArrayList("tpl1", "tpl2"))
                        .build(),
                CategoryDto.builder().categoryCode("pc2")
                        .categoryName("cn2")
                        .templateIds(CollUtil.newArrayList("tpl3", "tpl4"))
                        .build()
        );
        willReturn(categories).given(templatePropertyService).getCategories(lang);
        String db = templateConfigCacheService.getCategoriesListConfigCacheByLang(lang);
        assertThat(db).isEqualTo(CATEGORIES_LIST_CONFIG);
    }

}
