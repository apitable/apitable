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

package com.apitable.internal.service.impl;

import static org.assertj.core.api.Assertions.assertThat;

import com.apitable.AbstractIntegrationTest;
import com.apitable.internal.vo.UrlAwareContentsVo;
import java.util.ArrayList;
import java.util.List;
import org.junit.jupiter.api.Test;

public class FieldServiceImplTest extends AbstractIntegrationTest {

    @Test
    void testFetchOffSiteUrl() {
        List<String> urls = new ArrayList<>();
        urls.add("https://www.bilibili.com/");
        UrlAwareContentsVo urlAwareContents = iFieldService.getUrlAwareContents(urls, null);
        assertThat(urlAwareContents.getContents()).isNotNull();
    }

    @Test
    void testFetchOffSiteUrlMetaTitle() {
        List<String> urls = new ArrayList<>();
        urls.add("https://mp.weixin.qq.com/s/GRlMDR0DUjjuz82Ndbu96Q");
        UrlAwareContentsVo urlAwareContents = iFieldService.getUrlAwareContents(urls, null);
        assertThat(urlAwareContents.getContents()).isNotNull();
    }

    @Test
    void testFetchOffSiteUrls() {
        List<String> urls = new ArrayList<>();
        urls.add("https://aitable.ai");
        urls.add("www.baidu.com");
        urls.add("https://www.bilibili.com/");
        UrlAwareContentsVo urlAwareContents = iFieldService.getUrlAwareContents(urls, null);
        assertThat(urlAwareContents.getContents()).isNotNull();
    }

}
