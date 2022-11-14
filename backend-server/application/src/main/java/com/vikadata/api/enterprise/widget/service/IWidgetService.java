package com.vikadata.api.enterprise.widget.service;

import java.util.Collection;
import java.util.List;
import java.util.Map;

import com.vikadata.api.enterprise.widget.dto.DatasheetWidgetDTO;
import com.vikadata.api.enterprise.widget.ro.WidgetCreateRo;
import com.vikadata.api.enterprise.widget.ro.WidgetStoreListRo;
import com.vikadata.api.enterprise.widget.vo.WidgetInfo;
import com.vikadata.api.enterprise.widget.vo.WidgetPack;
import com.vikadata.api.enterprise.widget.vo.WidgetStoreListInfo;

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
     * copy widget to dashboard
     *
     * @param userId user id
     * @param spaceId space id
     * @param dashboardId   dashboardId
     * @param widgetIds     widgetIds
     * @return WidgetPack
     */
    Collection<String> copyToDashboard(Long userId, String spaceId, String dashboardId, List<String> widgetIds);

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
}
