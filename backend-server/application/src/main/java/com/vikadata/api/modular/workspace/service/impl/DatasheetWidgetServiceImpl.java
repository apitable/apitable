package com.vikadata.api.modular.workspace.service.impl;

import javax.annotation.Resource;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;

import com.vikadata.api.modular.workspace.mapper.DatasheetWidgetMapper;
import com.vikadata.api.modular.workspace.service.IDatasheetWidgetService;
import com.vikadata.entity.DatasheetWidgetEntity;

import org.springframework.stereotype.Service;

/**
 * 
 * 
 */
@Service
public class DatasheetWidgetServiceImpl extends ServiceImpl<DatasheetWidgetMapper, DatasheetWidgetEntity> implements IDatasheetWidgetService {

    @Resource
    private DatasheetWidgetMapper datasheetWidgetMapper;

    @Override
    public DatasheetWidgetEntity getByWidgetId(String widgetId) {
        return datasheetWidgetMapper.selectByWidgetId(widgetId);
    }

    @Override
    public void create(String spaceId, String dstId, String widgetId, String sourceId) {
        DatasheetWidgetEntity datasheetWidget = new DatasheetWidgetEntity();
        datasheetWidget.setSpaceId(spaceId);
        datasheetWidget.setDstId(dstId);
        datasheetWidget.setWidgetId(widgetId);
        datasheetWidget.setSourceId(sourceId);
        save(datasheetWidget);
    }
}
