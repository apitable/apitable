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

import com.apitable.AbstractIntegrationTest;
import com.apitable.template.entity.TemplateAlbumEntity;
import com.apitable.template.entity.TemplateAlbumRelEntity;
import com.apitable.template.vo.AlbumContentVo;
import com.apitable.template.vo.AlbumVo;
import java.util.ArrayList;
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
        List<TemplateAlbumEntity> albumEntities = new ArrayList<>();
        albumEntities.add(TemplateAlbumEntity.builder()
            .albumId("alb4uFzSy2vbg")
            .i18nName("en_US")
            .name("this is an album2")
            .description("")
            .content("{}")
            .isDeleted(1)
            .build());
        albumEntities.add(TemplateAlbumEntity.builder()
            .albumId("albNXV6wY6mME")
            .i18nName("zh_CN")
            .name("so and so topic")
            .description("")
            .content("{}")
            .build());
        albumEntities.add(TemplateAlbumEntity.builder()
            .albumId("albn5UgHThZj2")
            .i18nName("en_US")
            .name("this is an album")
            .description("")
            .content("{}")
            .build());
        albumEntities.add(TemplateAlbumEntity.builder()
            .albumId("albSr5vHPgzGG")
            .i18nName("en_US")
            .name("New Game")
            .description("")
            .content("{}")
            .build());
        albumEntities.add(TemplateAlbumEntity.builder()
            .albumId("alb671STQDHvt")
            .i18nName("zh_CN")
            .name("New templates for September")
            .description("")
            .content("{}")
            .build());
        iTemplateAlbumService.saveBatch(albumEntities);
    }

    private void initAlbumRelData() {
        List<TemplateAlbumRelEntity> albumRelEntities = new ArrayList<>();
        albumRelEntities.add(TemplateAlbumRelEntity.builder()
            .albumId("albn5UgHThZj2")
            .type(0)
            .relateId("tpcE7fyADP99W")
            .build());

        albumRelEntities.add(TemplateAlbumRelEntity.builder()
            .albumId("albSr5vHPgzGG")
            .type(0)
            .relateId("tpccZzzJ9TvS8")
            .build());

        albumRelEntities.add(TemplateAlbumRelEntity.builder()
            .albumId("alb671STQDHvt")
            .type(1)
            .relateId("tplHRx6j4Ewbv")
            .build());

        albumRelEntities.add(TemplateAlbumRelEntity.builder()
            .albumId("alb671STQDHvt")
            .type(1)
            .relateId("tplBf5yarhmpb")
            .build());

        albumRelEntities.add(TemplateAlbumRelEntity.builder()
            .albumId("alb671STQDHvt")
            .type(1)
            .relateId("tplGUNxZVFLS0")
            .build());

        albumRelEntities.add(TemplateAlbumRelEntity.builder()
            .albumId("alb671STQDHvt")
            .type(2)
            .relateId("tptzhZHBhSYmL")
            .build());

        albumRelEntities.add(TemplateAlbumRelEntity.builder()
            .albumId("albNXV6wY6mME")
            .type(1)
            .relateId("tpln1adcyXXr1")
            .build());

        albumRelEntities.add(TemplateAlbumRelEntity.builder()
            .albumId("albNXV6wY6mME")
            .type(1)
            .relateId("tplqrYjGhxLh3")
            .build());

        albumRelEntities.add(TemplateAlbumRelEntity.builder()
            .albumId("albNXV6wY6mME")
            .type(2)
            .relateId("tptbiDZtMSE3K")
            .build());

        albumRelEntities.add(TemplateAlbumRelEntity.builder()
            .albumId("alb671STQDHvt")
            .type(0)
            .relateId("tpcuvjd72Skap")
            .build());

        albumRelEntities.add(TemplateAlbumRelEntity.builder()
            .albumId("albNXV6wY6mME")
            .type(0)
            .relateId("tpcKGmpP3oxEc")
            .build());

        iTemplateAlbumRelService.saveBatch(albumRelEntities);
    }
}