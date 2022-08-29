package com.vikadata.scheduler.space.mapper.asset;

import java.util.Collection;
import java.util.List;

import org.apache.ibatis.annotations.Param;

import com.vikadata.entity.AssetEntity;
import com.vikadata.scheduler.space.model.AssetDto;

/**
 * <p>
 * 附件表 Mapper 接口
 * </p>
 *
 * @author Chambers
 * @date 2020/4/23
 */
public interface AssetMapper {

    /**
     * 获取附件资源信息
     *
     * @param tokenList token列表
     * @return dto
     * @author Chambers
     * @date 2020/4/23
     */
    List<AssetDto> selectDtoByTokens(@Param("list") List<String> tokenList);

    /**
     * 获取拓展名列表
     *
     * @return extension_name
     * @author Chambers
     * @date 2020/10/13
     */
    List<String> selectExtensionName();

    /**
     * 修改 Bucket 和 MimeType
     *
     * @param bucket        bucket
     * @param mimeType      MimeType
     * @param extensionName 拓展名
     * @return 执行结果数
     * @author Chambers
     * @date 2020/10/13
     */
    int updateBucketAndMimeType(@Param("bucket") String bucket, @Param("mimeType") String mimeType, @Param("extensionName") String extensionName);

    /**
     * 修改 Bucket
     *
     * @param bucket bucket
     * @return 执行结果数
     * @author Chambers
     * @date 2020/10/13
     */
    int updateBucket(@Param("bucket") String bucket);

    /**
     * 新增实体
     *
     * @param entity 实体
     * @return 执行结果数
     * @author Chambers
     * @date 2020/12/9
     */
    int insertEntity(@Param("entity") AssetEntity entity);

    /**
     * 逻辑删除
     *
     * @param checksums md5唯一标识
     * @return 执行结果数
     */
    int updateIsDeletedByChecksums(@Param("checksums") Collection<String> checksums);
}
