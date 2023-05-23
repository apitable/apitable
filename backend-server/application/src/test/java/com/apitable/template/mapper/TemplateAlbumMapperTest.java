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

package com.apitable.template.mapper;

import static org.assertj.core.api.Assertions.assertThat;

import com.apitable.AbstractMyBatisMapperTest;
import com.apitable.template.entity.TemplateAlbumEntity;
import com.apitable.template.model.TemplateAlbumDto;
import com.apitable.template.vo.AlbumContentVo;
import com.apitable.template.vo.AlbumVo;
import com.baomidou.mybatisplus.core.toolkit.IdWorker;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.jdbc.Sql;

/**
 * <p>
 * Template Album Mapper Test
 * </p>
 */
public class TemplateAlbumMapperTest extends AbstractMyBatisMapperTest {

    @Autowired
    private TemplateAlbumMapper templateAlbumMapper;

    @Test
    @Sql("/sql/template/album.sql")
    void selectAllAlbumIdsByI18nName() {
        List<String> notExistedAlbumIds = templateAlbumMapper.selectAllAlbumIdsByI18nName("xxx");
        assertThat(notExistedAlbumIds).isEmpty();

        List<String> albumIds = templateAlbumMapper.selectAllAlbumIdsByI18nName("en_US");
        assertThat(albumIds).isNotEmpty();
        assertThat(albumIds.size()).isEqualTo(2);
    }

    @Test
    @Sql("/sql/template/album.sql")
    void selectAlbumVosByAlbumIds() {
        List<AlbumVo> notExistedAlbum = templateAlbumMapper.selectAlbumVosByAlbumIds(
            Collections.singletonList("alb4uFzSy2vbg"));
        assertThat(notExistedAlbum).isEmpty();

        List<String> albumIds = new ArrayList<>();
        albumIds.add("albn5UgHThZj2");
        albumIds.add("albSr5vHPgzGG");
        List<AlbumVo> albums = templateAlbumMapper.selectAlbumVosByAlbumIds(albumIds);
        assertThat(albums).isNotEmpty();
        assertThat(albums.size()).isEqualTo(2);
    }

    @Test
    @Sql("/sql/template/album.sql")
    void selectAlbumVosByI18nNameAndNameLike() {
        List<AlbumVo> albums =
            templateAlbumMapper.selectAlbumVosByI18nNameAndNameLike("en_US", "a");
        assertThat(albums).isNotEmpty();
        assertThat(albums.size()).isEqualTo(2);
    }

    @Test
    @Sql("/sql/template/album.sql")
    void selectAlbumContentVoByAlbumId() {
        AlbumContentVo album = templateAlbumMapper.selectAlbumContentVoByAlbumId("albSr5vHPgzGG");
        assertThat(album).isNotNull();
    }

    @Test
    @Sql("/sql/template/album.sql")
    void selectAllTemplateAlbumDto() {
        List<TemplateAlbumDto> albums = templateAlbumMapper.selectAllTemplateAlbumDto();
        assertThat(albums).isNotEmpty();
        assertThat(albums.size()).isEqualTo(4);
    }

    @Test
    void insertBatch() {
        String albumId = "albSr5vHPgzGG";
        TemplateAlbumEntity entity = TemplateAlbumEntity.builder()
            .id(IdWorker.getId())
            .albumId(albumId)
            .i18nName("en_US")
            .name("Test Album")
            .description("description")
            .content("{}")
            .build();
        int count = templateAlbumMapper.insertBatch(Collections.singletonList(entity));
        assertThat(count).isEqualTo(1);
    }

    @Test
    @Sql("/sql/template/album.sql")
    void removeByAlbumIds() {
        int count =
            templateAlbumMapper.removeByAlbumIds(Collections.singletonList("albNXV6wY6mME"), 0L);
        assertThat(count).isEqualTo(1);
    }
}
