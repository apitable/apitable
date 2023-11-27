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

import com.apitable.template.entity.TemplateAlbumEntity;
import com.apitable.template.model.TemplateAlbumDto;
import com.apitable.template.vo.AlbumContentVo;
import com.apitable.template.vo.AlbumVo;
import com.baomidou.mybatisplus.annotation.InterceptorIgnore;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import java.util.List;
import org.apache.ibatis.annotations.Param;

/**
 * <p>
 * Template Center - Template Album Mapper.
 * </p>
 */
public interface TemplateAlbumMapper extends BaseMapper<TemplateAlbumEntity> {

    /**
     * query all album ids by i18n.
     */
    @InterceptorIgnore(illegalSql = "true")
    List<String> selectAllAlbumIdsByI18nName(@Param("i18nName") String i18nName);

    /**
     * query album views by album ids.
     */
    List<AlbumVo> selectAlbumVosByAlbumIds(@Param("albumIds") List<String> albumIds);

    /**
     * query album views by i18nName and likeName.
     */
    @InterceptorIgnore(illegalSql = "true")
    List<AlbumVo> selectAlbumVosByI18nNameAndNameLike(@Param("i18nName") String i18nName,
                                                      @Param("likeName") String likeName);

    /**
     * query album content view by album id.
     */
    AlbumContentVo selectAlbumContentVoByAlbumId(@Param("albumId") String albumId);

    /**
     * query all template album.
     */
    @InterceptorIgnore(illegalSql = "true")
    List<TemplateAlbumDto> selectAllTemplateAlbumDto();

    /**
     * batch insert.
     */
    int insertBatch(@Param("entities") List<TemplateAlbumEntity> entities);

    /**
     * remove by albumIds.
     */
    int removeByAlbumIds(@Param("albumIds") List<String> albumIds,
                         @Param("updatedBy") Long updatedBy);
}
