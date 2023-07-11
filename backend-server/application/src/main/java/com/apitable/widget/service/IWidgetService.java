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

package com.apitable.widget.service;

import java.util.Collection;
import java.util.List;
import java.util.Map;

import com.apitable.widget.ro.WidgetCreateRo;
import com.apitable.widget.ro.WidgetStoreListRo;
import com.apitable.widget.vo.WidgetInfo;
import com.apitable.widget.vo.WidgetPack;
import com.apitable.widget.vo.WidgetStoreListInfo;
import com.apitable.workspace.dto.DatasheetWidgetDTO;

public interface IWidgetService {

    /**
     * @param userId user id
     * @param spaceId space id
     * @param storeListRo   request parameters
     * @return WidgetPackageInfos
     */
    List<WidgetStoreListInfo> widgetStoreList(Long userId, String spaceId, WidgetStoreListRo storeListRo);

    /**
     * Gets the component information in the specified space.
     *
     * @param spaceId space id
     * @param memberId member id
     * @param count    load quantity
     * @return WidgetInfos
     */
    List<WidgetInfo> getWidgetInfoList(String spaceId, Long memberId, Integer count);

    /**
     * @param userId user id
     * @param spaceId space id
     * @param widget  widget
     * @return widgetId
     */
    String create(Long userId, String spaceId, WidgetCreateRo widget);

    /**
     * copy widget
     *
     * @param userId user id
     * @param spaceId space id
     * @param nodeId   nodeId
     * @param widgetIds     widgetIds
     * @return WidgetPack
     */
    Collection<String> copyWidget(Long userId, String spaceId, String nodeId, List<String> widgetIds);

    /**
     * @param userId user id
     * @param destSpaceId    destSpaceId
     * @param newNodeMap     Original node ID-newly created node ID MAP
     * @param newWidgetIdMap Original component ID-newly created component ID MAP
     * @param newWidgetIdToDstMap Newly Created Component ID-Data Source Table ID MAP
     */
    void copyBatch(Long userId, String destSpaceId, Map<String, String> newNodeMap, Map<String, String> newWidgetIdMap, Map<String, DatasheetWidgetDTO> newWidgetIdToDstMap);

    /**
     * @param widgetIds widgetIds
     * @return spaceId
     */
    String checkByWidgetIds(List<String> widgetIds);

    /**
     * @param widgetId widget id
     * @return WidgetPack
     */
    WidgetPack getWidgetPack(String widgetId);

    /**
     * @param widgetIds widgetIds
     * @return WidgetPacks
     */
    List<WidgetPack> getWidgetPackList(Collection<String> widgetIds);

    String getSpaceIdByWidgetId(String widgetId);

    void checkWidgetReference(List<String> subNodeIds, List<String> widgetIds);
}
