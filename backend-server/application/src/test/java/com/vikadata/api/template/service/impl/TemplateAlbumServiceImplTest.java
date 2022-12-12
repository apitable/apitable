package com.vikadata.api.template.service.impl;

import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.util.Collections;
import java.util.List;

import javax.annotation.Resource;

import cn.hutool.core.io.IoUtil;
import org.junit.jupiter.api.Test;

import com.vikadata.api.AbstractIntegrationTest;
import com.vikadata.api.FileHelper;
import com.vikadata.api.template.vo.AlbumContentVo;
import com.vikadata.api.template.vo.AlbumVo;
import com.vikadata.api.template.service.ITemplateAlbumService;

import static org.assertj.core.api.Assertions.assertThat;

public class TemplateAlbumServiceImplTest extends AbstractIntegrationTest {

    @Resource
    private ITemplateAlbumService iTemplateAlbumService;

    @Test
    void getAlbumVosByAlbumIds() {
        this.initAlbumData();
        List<AlbumVo> albums = iTemplateAlbumService.getAlbumVosByAlbumIds(Collections.singletonList("albSr5vHPgzGG"));
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
        InputStream inputStream = FileHelper.getInputStreamFromResource("sql/template/album-rel.sql");
        String sql = IoUtil.read(inputStream, StandardCharsets.UTF_8);
        execute(sql);
    }
}