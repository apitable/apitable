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

package com.apitable.workspace.service.impl;

import com.apitable.workspace.entity.DatasheetWidgetEntity;
import com.apitable.workspace.mapper.DatasheetWidgetMapper;
import com.apitable.workspace.service.IDatasheetWidgetService;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import jakarta.annotation.Resource;
import org.springframework.stereotype.Service;

/**
 * datasheet widget service implement.
 */
@Service
public class DatasheetWidgetServiceImpl
    extends ServiceImpl<DatasheetWidgetMapper, DatasheetWidgetEntity>
    implements IDatasheetWidgetService {

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
