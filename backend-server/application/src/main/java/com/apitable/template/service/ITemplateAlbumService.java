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

import java.util.List;

import com.apitable.template.vo.AlbumContentVo;
import com.apitable.template.vo.AlbumVo;

/**
 * <p>
 * Template Center - Template Album Service
 * </p>
 */
public interface ITemplateAlbumService {

    /**
     * get template album views by album ids
     */
    List<AlbumVo> getAlbumVosByAlbumIds(List<String> albumIds);

    /**
     * get template album views by category code
     */
    List<AlbumVo> getAlbumVosByCategoryCode(String categoryCode);

    /**
     * get recommended albums
     */
    List<AlbumVo> getRecommendedAlbums(String lang, Integer maxCount, String excludeAlbumId);

    /**
     * fuzzy search album
     */
    List<AlbumVo> searchAlbums(String lang, String keyword);

    /**
     * get album content view
     */
    AlbumContentVo getAlbumContentVo(String albumId);
}
