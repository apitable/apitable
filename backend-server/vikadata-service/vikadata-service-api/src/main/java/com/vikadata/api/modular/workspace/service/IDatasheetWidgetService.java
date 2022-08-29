package com.vikadata.api.modular.workspace.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.vikadata.entity.DatasheetWidgetEntity;

/**
 * @author Shawn Deng
 * @date 2021-01-09 16:08:01
 */
public interface IDatasheetWidgetService extends IService<DatasheetWidgetEntity> {

    /**
     * 获取数表关联组件实体
     *
     * @param widgetId 组件ID
     * @return DatasheetWidgetEntity
     * @author Shawn Deng
     * @date 2021/1/9 16:12
     */
    DatasheetWidgetEntity getByWidgetId(String widgetId);

    /**
     * 创建小程序的数据源数表信息
     *
     * @param spaceId  空间ID
     * @param dstId    数表ID
     * @param widgetId 组件ID
     * @param sourceId 来源ID
     * @author Shawn Deng
     * @date 2021/1/9 16:35
     */
    void create(String spaceId, String dstId, String widgetId, String sourceId);
}
