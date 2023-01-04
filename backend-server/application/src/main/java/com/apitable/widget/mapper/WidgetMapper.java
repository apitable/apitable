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

package com.apitable.widget.mapper;

import java.util.Collection;
import java.util.List;

import org.apache.ibatis.annotations.Param;

import com.apitable.widget.dto.NodeWidgetDto;
import com.apitable.widget.dto.WidgetBaseInfo;
import com.apitable.widget.dto.WidgetDTO;
import com.apitable.widget.entity.WidgetEntity;
import com.apitable.widget.vo.WidgetInfo;

public interface WidgetMapper {

    /**
     * query the number of components
     *
     * @param spaceId space id
     * @param widgetIds widget ids
     * @return count
     */
    Integer selectCountBySpaceIdAndWidgetIds(@Param("spaceId") String spaceId, @Param("list") List<String> widgetIds);

    /**
     * @param widgetIds widget ids
     * @return WidgetBaseInfos
     */
    List<WidgetBaseInfo> selectWidgetBaseInfoByWidgetIds(@Param("list") Collection<String> widgetIds);

    /**
     * @param spaceId space id
     * @param nodeType  node type
     * @return WidgetInfo
     */
    List<WidgetInfo> selectInfoBySpaceIdAndNodeType(@Param("spaceId") String spaceId, @Param("nodeType") Integer nodeType);

    /**
     * @param nodeId node id
     * @return WidgetBaseInfos
     */
    List<WidgetInfo> selectInfoByNodeId(@Param("nodeId") String nodeId);

    /**
     * @param nodeIds node ids
     * @return NodeWidgetDto
     */
    List<NodeWidgetDto> selectNodeWidgetDtoByNodeIds(@Param("nodeIds") List<String> nodeIds);

    /**
     * query component and data source datasheet information
     *
     * @param widgetIds widget ids
     * @return WidgetDTO
     */
    List<WidgetDTO> selectWidgetDtoByWidgetIds(@Param("list") Collection<String> widgetIds);

    /**
     * @param widgetIds widget ids
     * @return spaceIds
     */
    List<String> selectSpaceIdByWidgetIds(@Param("list") Collection<String> widgetIds);

    /**
     * @param nodeId node id
     * @return WidgetIds
     */
    List<String> selectWidgetIdsByNodeId(@Param("nodeId") String nodeId);

    /**
     * Query the components under the specified node, and the data source number table set referenced.
     *
     * @param nodeIds node ids
     * @return datasheet ids
     */
    List<String> selectDataSourceDstIdsByNodeIds(@Param("nodeIds") List<String> nodeIds);

    /**
     * @param entities widgets
     * @return affected rows
     */
    int insertBatch(@Param("entities") List<WidgetEntity> entities);

    /**
     * @param widgetId widget id
     * @return space id
     */
    String selectSpaceIdByWidgetIdIncludeDeleted(@Param("widgetId") String widgetId);
}
