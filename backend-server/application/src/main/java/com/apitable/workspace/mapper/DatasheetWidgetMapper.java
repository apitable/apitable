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

package com.apitable.workspace.mapper;

import com.apitable.workspace.dto.DatasheetWidgetDTO;
import com.apitable.workspace.entity.DatasheetWidgetEntity;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import java.util.Collection;
import java.util.List;
import org.apache.ibatis.annotations.Param;

/**
 * datasheet widget mapper.
 */
public interface DatasheetWidgetMapper extends BaseMapper<DatasheetWidgetEntity> {

    /**
     * query by widget id.
     *
     * @param widgetId widget id
     * @return DatasheetWidgetEntity
     */
    DatasheetWidgetEntity selectByWidgetId(@Param("widgetId") String widgetId);

    /**
     * query by datasheet id.
     *
     * @param dstId datasheet id
     * @return DatasheetWidgetEntity
     */
    DatasheetWidgetEntity selectByDstId(@Param("dstId") String dstId);

    /**
     * query by widget ids.
     *
     * @param widgetIds widget ids
     * @return datasheetWidgetDTOs
     */
    List<DatasheetWidgetDTO> selectDtoByWidgetIds(@Param("list") Collection<String> widgetIds);

    /**
     * insert batch.
     *
     * @param entities datasheet's widgets
     * @return affected rows
     */
    int insertBatch(@Param("entities") List<DatasheetWidgetEntity> entities);
}
