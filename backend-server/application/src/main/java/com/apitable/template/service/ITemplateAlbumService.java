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

package com.apitable.template.service;

import com.apitable.template.entity.TemplateAlbumEntity;
import com.apitable.template.vo.AlbumContentVo;
import com.apitable.template.vo.AlbumVo;
import com.baomidou.mybatisplus.extension.service.IService;
import java.util.List;

/**
 * <p>
 * Template Center - Template Album Service.
 * </p>
 */
public interface ITemplateAlbumService extends IService<TemplateAlbumEntity> {

    /**
     * get template album views by album ids.
     *
     * @param albumIds album ids
     */
    List<AlbumVo> getAlbumVosByAlbumIds(List<String> albumIds);

    /**
     * get template album views by category code.
     *
     * @param categoryCode category code
     */
    List<AlbumVo> getAlbumVosByCategoryCode(String categoryCode);

    /**
     * get recommended albums.
     *
     * @param lang           locale
     * @param maxCount       max count
     * @param excludeAlbumId exclude album id
     */
    List<AlbumVo> getRecommendedAlbums(String lang, Integer maxCount, String excludeAlbumId);

    /**
     * fuzzy search album.
     *
     * @param lang    locale
     * @param keyword keyword
     */
    List<AlbumVo> searchAlbums(String lang, String keyword);

    /**
     * get album content view.
     *
     * @param albumId album id
     */
    AlbumContentVo getAlbumContentVo(String albumId);
}
