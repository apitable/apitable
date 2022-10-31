package com.vikadata.api.modular.workspace.mapper;

import java.util.Collection;
import java.util.List;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Param;

import com.vikadata.api.model.dto.datasheet.DatasheetMetaDTO;
import com.vikadata.api.model.vo.datasheet.DatasheetMetaVo;
import com.vikadata.api.modular.workspace.model.DatasheetSnapshot;
import com.vikadata.entity.DatasheetMetaEntity;

public interface DatasheetMetaMapper extends BaseMapper<DatasheetMetaEntity> {

    /**
     * @param entities datasheet metas
     * @return affected rows
     */
    int insertBatch(@Param("entities") List<DatasheetMetaEntity> entities);

    /**
     * Query datasheet data source by datasheet id.
     * @param dstId datasheet id
     * @return DatasheetSnapshot
     */
    DatasheetSnapshot selectByDstId(@Param("dstId") String dstId);

    /**
     * @param dstId datasheet id
     * @return DatasheetMetaVo
     */
    @Deprecated
    DatasheetMetaVo selectByNodeId(@Param("dstId") String dstId);

    /**
     * @param dstIdList datasheet ids
     * @return DatasheetMetaDTO
     */
    List<DatasheetMetaDTO> selectDtoByDstIds(@Param("list") List<String> dstIdList);

    /**
     * @param entity datasheet meta
     * @return affected rows
     */
    int insertMeta(@Param("entity") DatasheetMetaEntity entity);

    /**
     * update meta by datasheet id.
     *
     * @param userId user id
     * @param dstId datasheet id
     * @param meta   datasheet meta
     * @return affected rows
     */
    int updateByDstId(@Param("userId") Long userId, @Param("meta") String meta, @Param("dstId") String dstId);

    /**
     * @param userId user id
     * @param nodeIds node ids
     * @param isDel   logical delete status
     * @return affected rows
     */
    int updateIsDeletedByNodeId(@Param("userId") Long userId, @Param("nodeIds") Collection<String> nodeIds, @Param("isDel") Boolean isDel);

    /**
     * the number of nodes that metadata contains  with keywords.
     * 
     * @param nodeIds node ids
     * @param keyword keyword
     * @return count
     */
    Integer countByMetaData(@Param("nodeIds") Collection<String> nodeIds, @Param("keyword") String keyword);
}
