package com.vikadata.scheduler.space.mapper.space;

import java.util.Collection;
import java.util.List;

import org.apache.ibatis.annotations.Param;

import com.vikadata.entity.SpaceAssetEntity;
import com.vikadata.scheduler.space.model.SpaceAssetDto;

/**
 * <p>
 * Space Asset Mapper
 * </p>
 */
public interface SpaceAssetMapper {

    /**
     * Get space asset info
     *
     * @param nodeIds node id list
     * @return dto
     */
    List<SpaceAssetDto> selectDtoByNodeIds(@Param("nodeIds") Collection<String> nodeIds);

    /**
     * Change citation count
     *
     * @param ids  table id list
     * @param cite citation count
     */
    void updateCiteByIds(@Param("list") List<Long> ids, @Param("cite") Integer cite);

    /**
     * batch insert
     *
     * @param entities entities
     * @return number of execution results
     */
    int insertList(@Param("entities") List<SpaceAssetEntity> entities);

}
