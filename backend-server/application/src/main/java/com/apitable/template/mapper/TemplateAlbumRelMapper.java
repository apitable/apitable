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

import com.apitable.template.entity.TemplateAlbumRelEntity;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import java.util.List;
import org.apache.ibatis.annotations.Param;

/**
 * <p>
 * Template Center - Template Album Rel Mapper.
 * </p>
 */
public interface TemplateAlbumRelMapper extends BaseMapper<TemplateAlbumRelEntity> {

    /**
     * query album ids by relate id and type.
     */
    List<String> selectAlbumIdByRelateIdAndType(@Param("relateId") String relateId,
                                                @Param("type") Integer type);

    /**
     * query relate ids by albumId id and type.
     */
    List<String> selectRelateIdByAlbumIdAndType(@Param("albumId") String albumId,
                                                @Param("type") Integer type);

    /**
     * batch insert.
     */
    int insertBatch(@Param("entities") List<TemplateAlbumRelEntity> entities);

    /**
     * batch delete.
     */
    int deleteBatch();

}
