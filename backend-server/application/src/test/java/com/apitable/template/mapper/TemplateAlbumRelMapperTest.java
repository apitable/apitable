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
import com.apitable.template.entity.TemplateAlbumRelEntity;
import com.apitable.template.enums.TemplateAlbumRelType;
import com.baomidou.mybatisplus.core.toolkit.IdWorker;
import java.util.Collections;
import java.util.List;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.jdbc.Sql;

public class TemplateAlbumRelMapperTest extends AbstractMyBatisMapperTest {

    @Autowired
    private TemplateAlbumRelMapper templateAlbumRelMapper;

    @Test
    @Sql("/sql/template/album-rel.sql")
    void selectAlbumIdByRelateIdAndType() {
        List<String> albumIds =
            templateAlbumRelMapper.selectAlbumIdByRelateIdAndType("tpcE7fyADP99W",
                TemplateAlbumRelType.TEMPLATE_CATEGORY.getType());
        assertThat(albumIds).isNotEmpty();
        assertThat(albumIds.size()).isEqualTo(1);
    }

    @Test
    @Sql("/sql/template/album-rel.sql")
    void selectRelateIdByAlbumIdAndType() {
        List<String> relateIds =
            templateAlbumRelMapper.selectRelateIdByAlbumIdAndType("albSr5vHPgzGG",
                TemplateAlbumRelType.TEMPLATE_CATEGORY.getType());
        assertThat(relateIds).isNotEmpty();
        assertThat(relateIds.size()).isEqualTo(1);
    }

    @Test
    void insertBatch() {
        TemplateAlbumRelEntity entity = TemplateAlbumRelEntity.builder()
            .id(IdWorker.getId())
            .albumId("alb0909")
            .type(0)
            .relateId("tpc12")
            .build();
        int count = templateAlbumRelMapper.insertBatch(Collections.singletonList(entity));
        assertThat(count).isEqualTo(1);
    }
}