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

import com.apitable.workspace.entity.ResourceMetaEntity;
import java.util.Collection;
import java.util.List;
import org.apache.ibatis.annotations.Param;

/**
 * resource meta mapper.
 */
public interface ResourceMetaMapper {

    /**
     * query by resource id list.
     *
     * @param resourceIds resource ids
     * @return metas
     */
    List<ResourceMetaEntity> selectByResourceIds(@Param("list") Collection<String> resourceIds);

    /**
     * query meta by resource id.
     *
     * @param resourceId resource id
     * @return meta
     */
    String selectMetaDataByResourceId(@Param("resourceId") String resourceId);

    /**
     * batch insert.
     *
     * @param entities resource metas
     * @return affected rows
     */
    int insertBatch(@Param("entities") Collection<ResourceMetaEntity> entities);

    /**
     * count the number of dashboard widget.
     *
     * @param dashboardId dashboard id
     */
    Integer countDashboardWidgetNumber(@Param("dashboardId") String dashboardId);
}
