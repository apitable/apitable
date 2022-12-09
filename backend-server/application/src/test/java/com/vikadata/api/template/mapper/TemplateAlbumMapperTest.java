package com.vikadata.api.template.mapper;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import javax.annotation.Resource;

import com.baomidou.mybatisplus.core.toolkit.IdWorker;
import org.junit.jupiter.api.Test;

import com.vikadata.api.AbstractMyBatisMapperTest;
import com.vikadata.api.template.mapper.TemplateAlbumMapper;
import com.vikadata.api.template.vo.AlbumContentVo;
import com.vikadata.api.template.vo.AlbumVo;
import com.vikadata.api.template.model.TemplateAlbumDto;
import com.vikadata.entity.TemplateAlbumEntity;

import org.springframework.test.context.jdbc.Sql;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * <p>
 * Template Album Mapper Test
 * </p>
 */
public class TemplateAlbumMapperTest extends AbstractMyBatisMapperTest {

    @Resource
    private TemplateAlbumMapper templateAlbumMapper;

    @Test
    @Sql("/testdata/template/album.sql")
    void selectAllAlbumIdsByI18nName() {
        List<String> notExistedAlbumIds = templateAlbumMapper.selectAllAlbumIdsByI18nName("xxx");
        assertThat(notExistedAlbumIds).isEmpty();

        List<String> albumIds = templateAlbumMapper.selectAllAlbumIdsByI18nName("en_US");
        assertThat(albumIds).isNotEmpty();
        assertThat(albumIds.size()).isEqualTo(2);
    }

    @Test
    @Sql("/testdata/template/album.sql")
    void selectAlbumVosByAlbumIds() {
        List<AlbumVo> notExistedAlbum = templateAlbumMapper.selectAlbumVosByAlbumIds(Collections.singletonList("alb4uFzSy2vbg"));
        assertThat(notExistedAlbum).isEmpty();

        List<String> albumIds = new ArrayList<>();
        albumIds.add("albn5UgHThZj2");
        albumIds.add("albSr5vHPgzGG");
        List<AlbumVo> albums = templateAlbumMapper.selectAlbumVosByAlbumIds(albumIds);
        assertThat(albums).isNotEmpty();
        assertThat(albums.size()).isEqualTo(2);
    }

    @Test
    @Sql("/testdata/template/album.sql")
    void selectAlbumVosByI18nNameAndNameLike() {
        List<AlbumVo> albums = templateAlbumMapper.selectAlbumVosByI18nNameAndNameLike("en_US", "a");
        assertThat(albums).isNotEmpty();
        assertThat(albums.size()).isEqualTo(2);
    }

    @Test
    @Sql("/testdata/template/album.sql")
    void selectAlbumContentVoByAlbumId() {
        AlbumContentVo album = templateAlbumMapper.selectAlbumContentVoByAlbumId("albSr5vHPgzGG");
        assertThat(album).isNotNull();
    }

    @Test
    @Sql("/testdata/template/album.sql")
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
    @Sql("/testdata/template/album.sql")
    void removeByAlbumIds() {
        int count = templateAlbumMapper.removeByAlbumIds(Collections.singletonList("albNXV6wY6mME"), 0L);
        assertThat(count).isEqualTo(1);
    }
}
