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

import java.util.List;

import cn.hutool.json.JSONObject;
import org.apache.ibatis.annotations.Param;

import com.apitable.internal.dto.SimpleDatasheetMetaDTO;
import com.apitable.workspace.dto.DatasheetMetaDTO;
import com.apitable.workspace.dto.DatasheetSnapshot;
import com.apitable.workspace.entity.DatasheetMetaEntity;
import com.apitable.workspace.ro.MetaOpRo;

public interface IDatasheetMetaService {

    /**
     * @param metaEntities meta
     */
    void batchSave(List<DatasheetMetaEntity> metaEntities);

    /**
     * @param dstId datasheet id
     * @return DatasheetMetaVo
     */
    SimpleDatasheetMetaDTO findByDstId(String dstId);

    /**
     * @param dstIds datasheet ids
     * @return DatasheetMetaDTO
     */
    List<DatasheetMetaDTO> findMetaDtoByDstIds(@Param("list") List<String> dstIds);

    /**
     * @param userId user id
     * @param dstId datasheet id
     * @param metaData
     */
    void create(Long userId, String dstId, String metaData);

    /**
     * @param userId user id
     * @param dstId datasheet id
     * @param meta   request parameters
     */
    void edit(Long userId, String dstId, MetaOpRo meta);

    /**
     * Check whether the specified view of the number table exists.
     *
     * @param dstId datasheet id
     * @param viewId view id
     */
    void checkViewIfExist(String dstId, String viewId);

    /**
     * get data datasheet source information
     * @param dstId datasheet id
     * @return DatasheetSnapshot
     */
    DatasheetSnapshot getMetaByDstId(String dstId);

    /**
     * Check if the field exists in the table
     *
     * @param dstId datasheet id
     * @param fieldId fieldId
     */
    void checkFieldIfExist(String dstId, String fieldId);

    /**
     * Query field properties based on the number table ID query and field name.
     *
     * @param dstId datasheet id
     * @param fieldName fieldName
     * @return field properties
     */
    JSONObject getFieldPropertyByDstIdAndFieldName(String dstId, String fieldName);
}
