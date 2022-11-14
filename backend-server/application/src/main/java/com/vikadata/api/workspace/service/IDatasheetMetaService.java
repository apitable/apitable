package com.vikadata.api.workspace.service;

import java.util.List;

import cn.hutool.json.JSONObject;
import org.apache.ibatis.annotations.Param;

import com.vikadata.api.workspace.dto.DatasheetMetaDTO;
import com.vikadata.api.workspace.ro.MetaOpRo;
import com.vikadata.api.workspace.vo.DatasheetMetaVo;
import com.vikadata.api.workspace.model.DatasheetSnapshot;
import com.vikadata.entity.DatasheetMetaEntity;

public interface IDatasheetMetaService {

    /**
     * @param metaEntities meta
     */
    void batchSave(List<DatasheetMetaEntity> metaEntities);

    /**
     * @param dstId datasheet id
     * @return DatasheetMetaVo
     */
    DatasheetMetaVo findByDstId(String dstId);

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
