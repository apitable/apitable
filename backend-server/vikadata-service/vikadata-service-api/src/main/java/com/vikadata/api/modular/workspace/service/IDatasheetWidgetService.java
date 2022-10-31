package com.vikadata.api.modular.workspace.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.vikadata.entity.DatasheetWidgetEntity;

public interface IDatasheetWidgetService extends IService<DatasheetWidgetEntity> {

    /**
     * get the datasheet association component entity
     *
     * @param widgetId widget id
     * @return DatasheetWidgetEntity
     */
    DatasheetWidgetEntity getByWidgetId(String widgetId);

    /**
     * Create data source table information for widget
     *
     * @param spaceId space id
     * @param dstId datasheet id
     * @param widgetId widget id
     * @param sourceId source id
     */
    void create(String spaceId, String dstId, String widgetId, String sourceId);
}
