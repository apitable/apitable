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

import java.util.Collection;
import java.util.List;

import cn.hutool.json.JSONObject;
import com.baomidou.mybatisplus.extension.service.IService;

import com.apitable.workspace.vo.DatasheetRecordMapVo;
import com.apitable.workspace.dto.NodeCopyDTO;
import com.apitable.workspace.entity.DatasheetRecordEntity;

public interface IDatasheetRecordService extends IService<DatasheetRecordEntity> {

    /**
     * @param entities records
     */
    void batchSave(List<DatasheetRecordEntity> entities);

    /**
     * @param userId user id
     * @param recordMap json format: record - field
     * @param dstId datasheet id
     */
    void saveBatch(Long userId, JSONObject recordMap, String dstId);

    /**
     * copy datasheet records
     *
     * @param userId user id
     * @param oDstId      source datasheet id
     * @param tDstId      target datasheet id
     * @param nodeCopyDTO node replication DTO
     * @param retain      reserved RecordMeta
     */
    void copyRecords(Long userId, String oDstId, String tDstId, NodeCopyDTO nodeCopyDTO, boolean retain);

    /**
     * copy data from a column to a new column
     *
     * @param dstId datasheet id
     * @param oFieldId source field id
     * @param tFieldId target field id
     */
    void copyFieldData(String dstId, String oFieldId, String tFieldId);

    /**
     * Deletes the data of the specified field in the number table record.
     *
     * @param dstId datasheet id
     * @param delFieldIds deleted field id list
     * @param saveDb      whether save to database
     * @return map
     */
    DatasheetRecordMapVo delFieldData(String dstId, List<String> delFieldIds, boolean saveDb);

    /**
     * @param dstIds datasheet ids
     * @return recordMapVo
     */
    List<DatasheetRecordMapVo> findMapByDstIds(Collection<String> dstIds);
}
