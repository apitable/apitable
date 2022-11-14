package com.vikadata.api.asset.mapper;

import java.util.Collection;
import java.util.List;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Param;

import com.vikadata.entity.AssetEntity;

/**
 * Basics - Attachment Table Mapper Interface
 */
public interface AssetMapper extends BaseMapper<AssetEntity> {

    /**
     * Get the same attachment ID and cloud save file name as the abstract
     *
     * @param checksum md5 summary
     * @return dto
     */
    AssetEntity selectByChecksum(@Param("checksum") String checksum);

    /**
     * view file extensions
     *
     * @param fileUrl cloud file name
     * @return extension
     */
    String selectExtensionNameByFileUrl(@Param("fileUrl") String fileUrl);

    /**
     * Get checksum and ID
     *
     * @param fileUrls Cloud file storage path
     * @return List<AssetChecksumDto>
     */
    List<AssetEntity> selectByFileUrl(@Param("fileUrls") Collection<String> fileUrls);

    /**
     * Update resource file size
     *
     * @param id           id
     * @param incrFileSize incremental file size
     * @return int number of execution results
     */
    int updateFileSizeById(@Param("id") Long id, @Param("incrFileSize") Long incrFileSize);

    /**
     * update asset, file size, mime type
     * @param asset     updated info
     * @return updated rows
     */
    Integer updateFileSizeMimeTypeById(@Param("entity") AssetEntity asset);
}
