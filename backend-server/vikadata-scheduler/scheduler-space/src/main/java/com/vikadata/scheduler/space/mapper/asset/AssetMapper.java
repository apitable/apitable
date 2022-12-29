package com.vikadata.scheduler.space.mapper.asset;

import java.util.List;

import org.apache.ibatis.annotations.Param;

import com.vikadata.scheduler.space.model.AssetDto;
import com.vikadata.scheduler.space.pojo.Asset;

/**
 * <p>
 * Asset Mapper
 * </p>
 */
public interface AssetMapper {

    /**
     * Get attachment resource information
     *
     * @param tokenList token list
     * @return dto
     */
    List<AssetDto> selectDtoByTokens(@Param("list") List<String> tokenList);

    /**
     * Insert entity
     *
     * @param entity entity
     * @return number of execution results
     */
    int insertEntity(@Param("entity") Asset entity);

}
