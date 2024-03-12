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

package com.apitable.workspace.service;

import com.apitable.workspace.entity.DatasheetWidgetEntity;
import com.baomidou.mybatisplus.extension.service.IService;

/**
 * datasheet widget service.
 */
public interface IDatasheetWidgetService extends IService<DatasheetWidgetEntity> {

    /**
     * get the datasheet association component entity.
     *
     * @param widgetId widget id
     * @return DatasheetWidgetEntity
     */
    DatasheetWidgetEntity getByWidgetId(String widgetId);

    /**
     * Create data source table information for widget.
     *
     * @param spaceId  space id
     * @param dstId    datasheet id
     * @param widgetId widget id
     * @param sourceId source id
     */
    void create(String spaceId, String dstId, String widgetId, String sourceId);
}
