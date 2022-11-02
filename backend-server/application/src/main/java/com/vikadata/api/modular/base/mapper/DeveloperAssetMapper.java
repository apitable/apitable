package com.vikadata.api.modular.base.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Param;

import com.vikadata.entity.DeveloperAssetEntity;

/**
 * developer attachment table mapper interface
 */
public interface DeveloperAssetMapper extends BaseMapper<DeveloperAssetEntity> {

    /**
     * Update resource file size
     *
     * @param id           data Id
     * @param incrFileSize incremental file size
     * @return int number of execution results
     */
    int updateFileSizeById(@Param("id") Long id, @Param("incrFileSize") Long incrFileSize);

}
