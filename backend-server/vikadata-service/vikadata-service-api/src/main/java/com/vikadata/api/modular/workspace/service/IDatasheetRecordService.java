package com.vikadata.api.modular.workspace.service;

import java.util.Collection;
import java.util.List;

import cn.hutool.json.JSONObject;
import com.baomidou.mybatisplus.extension.service.IService;

import com.vikadata.api.model.vo.datasheet.DatasheetRecordMapVo;
import com.vikadata.api.modular.workspace.model.NodeCopyDTO;
import com.vikadata.entity.DatasheetRecordEntity;

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
