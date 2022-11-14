package com.vikadata.api.workspace.mapper;

import java.util.Collection;
import java.util.List;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Param;

import com.vikadata.entity.DatasheetEntity;

public interface DatasheetMapper extends BaseMapper<DatasheetEntity> {

    /**
     * @param entities datasheets
     * @return affected rows
     */
    int insertBatch(@Param("entities") List<DatasheetEntity> entities);

    /**
     * @param userId user id
     * @param dstId datasheet id
     * @param dstName new datasheet name
     * @return affected rows
     */
    int updateNameByDstId(@Param("userId") Long userId, @Param("dstId") String dstId, @Param("dstName") String dstName);

    /**
     * @param userId user id
     * @param nodeIds node ids
     * @param isDel   logical delete status
     * @return affected rows
     */
    int updateIsDeletedByNodeIds(@Param("userId") Long userId, @Param("nodeIds") Collection<String> nodeIds, @Param("isDel") Boolean isDel);

    /**
     * @param nodeId datasheet id
     * @return DatasheetEntity
     * */
    DatasheetEntity selectByDstId(@Param("nodeId") String nodeId);
}
