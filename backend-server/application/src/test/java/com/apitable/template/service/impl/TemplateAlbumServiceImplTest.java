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

package com.apitable.template.service.impl;

import static org.assertj.core.api.Assertions.assertThat;

import cn.hutool.core.io.IoUtil;
import com.apitable.AbstractIntegrationTest;
import com.apitable.FileHelper;
import com.apitable.template.vo.AlbumContentVo;
import com.apitable.template.vo.AlbumVo;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.util.Collections;
import java.util.List;
import org.junit.jupiter.api.Test;

public class TemplateAlbumServiceImplTest extends AbstractIntegrationTest {

    @Test
    void getAlbumVosByAlbumIds() {
        this.initAlbumData();
        List<AlbumVo> albums =
            iTemplateAlbumService.getAlbumVosByAlbumIds(Collections.singletonList("albSr5vHPgzGG"));
        assertThat(albums).isNotEmpty();
    }

    @Test
    void getAlbumVosByCategoryCode() {
        this.initAlbumData();
        this.initAlbumRelData();
        List<AlbumVo> albums = iTemplateAlbumService.getAlbumVosByCategoryCode("tpcKGmpP3oxEc");
        assertThat(albums).isNotEmpty();
        assertThat(albums.size()).isEqualTo(1);
    }

    @Test
    void getRecommendedAlbums() {
        this.initAlbumData();
        List<AlbumVo> albums = iTemplateAlbumService.getRecommendedAlbums("en_US", 5, null);
        assertThat(albums).isNotEmpty();
        assertThat(albums.size()).isEqualTo(2);
    }

    @Test
    void searchAlbums() {
        this.initAlbumData();
        List<AlbumVo> albums = iTemplateAlbumService.searchAlbums("en_US", "a");
        assertThat(albums).isNotEmpty();
        assertThat(albums.size()).isEqualTo(2);
    }

    @Test
    void getAlbumContentVo() {
        this.initAlbumData();
        AlbumContentVo album = iTemplateAlbumService.getAlbumContentVo("albSr5vHPgzGG");
        assertThat(album).isNotNull();
    }

    private void initAlbumData() {
        InputStream inputStream = FileHelper.getInputStreamFromResource("sql/template/album.sql");
        String sql = IoUtil.read(inputStream, StandardCharsets.UTF_8);
        execute(sql);
    }

    private void initAlbumRelData() {
        InputStream inputStream =
            FileHelper.getInputStreamFromResource("sql/template/album-rel.sql");
        String sql = IoUtil.read(inputStream, StandardCharsets.UTF_8);
        execute(sql);
    }
}