package com.vikadata.api.modular.workspace.service;

import java.util.Collection;
import java.util.List;
import java.util.Map;

import com.vikadata.api.model.dto.widget.DatasheetWidgetDTO;
import com.vikadata.api.model.ro.widget.WidgetCreateRo;
import com.vikadata.api.model.ro.widget.WidgetStoreListRo;
import com.vikadata.api.model.vo.widget.WidgetInfo;
import com.vikadata.api.model.vo.widget.WidgetPack;
import com.vikadata.api.model.vo.widget.WidgetStoreListInfo;

/**
 * <p>
 * 组件 服务接口
 * </p>
 *
 * @author Chambers
 * @date 2020/12/18
 */
public interface IWidgetService {

    /**
     * 获取组件商店列表列表
     *
     * @param userId        用户Id
     * @param spaceId       空间站ID
     * @param storeListRo   请求参数
     * @return WidgetPackageInfos
     * @author Pengap
     * @date 2021/9/27 20:14:29
     */
    List<WidgetStoreListInfo> widgetStoreList(Long userId, String spaceId, WidgetStoreListRo storeListRo);

    /**
     * 获取指定空间下的组件信息
     *
     * @param spaceId  空间ID
     * @param memberId 成员ID
     * @param count    加载数量
     * @return WidgetInfos
     * @author Chambers
     * @date 2021/1/11
     */
    List<WidgetInfo> getWidgetInfoList(String spaceId, Long memberId, Integer count);

    /**
     * 创建组件
     *
     * @param userId  用户ID
     * @param spaceId 空间ID
     * @param widget  组件创建的请求参数
     * @return widgetId
     * @author Chambers
     * @date 2020/12/23
     */
    String create(Long userId, String spaceId, WidgetCreateRo widget);

    /**
     * 复制组件到仪表盘
     *
     * @param userId        用户ID
     * @param spaceId       空间ID
     * @param dashboardId   仪表盘ID
     * @param widgetIds     组件ID 列表
     * @return WidgetPack
     * @author Chambers
     * @date 2021/1/11
     */
    Collection<String> copyToDashboard(Long userId, String spaceId, String dashboardId, List<String> widgetIds);

    /**
     * 复制组件
     *
     * @param userId         用户ID
     * @param destSpaceId    目标空间ID
     * @param newNodeMap     原节点ID-新创建节点ID MAP
     * @param newWidgetIdMap 原组件ID-新创建组件ID MAP
     * @param newWidgetIdToDstMap 新创建组件ID-数据源数表ID MAP
     * @author Chambers
     * @date 2021/1/20
     */
    void copyBatch(Long userId, String destSpaceId, Map<String, String> newNodeMap, Map<String, String> newWidgetIdMap, Map<String, DatasheetWidgetDTO> newWidgetIdToDstMap);

    /**
     * 检验组件
     *
     * @param widgetIds 组件ID 列表
     * @return spaceId
     * @author Chambers
     * @date 2021/1/25
     */
    String checkByWidgetIds(List<String> widgetIds);

    /**
     * 获取组件包信息
     *
     * @param widgetId  组件ID
     * @return WidgetPack
     * @author Chambers
     * @date 2021/1/11
     */
    WidgetPack getWidgetPack(String widgetId);

    /**
     * 获取组件包信息集合
     *
     * @param widgetIds 组件ID 集合
     * @return WidgetPacks
     * @author Chambers
     * @date 2021/1/11
     */
    List<WidgetPack> getWidgetPackList(Collection<String> widgetIds);
}
