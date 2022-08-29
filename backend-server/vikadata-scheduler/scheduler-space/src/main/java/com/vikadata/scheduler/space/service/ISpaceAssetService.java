package com.vikadata.scheduler.space.service;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.Set;

/**
 * <p>
 * 空间-附件资源 服务类
 * </p>
 *
 * @author Chambers
 * @since 2020/4/16
 */
public interface ISpaceAssetService {

    /**
     * 引用计数统计
     *
     * @param spaceId 指定空间的ID
     * @author Chambers
     * @date 2020/4/16
     */
    void referenceCounting(String spaceId);

    /**
     * 释放上传之后一直没有用过的附件
     *
     * @param spaceId 指定空间的ID
     * @param startAt 开始时间
     * @param endAt 结束时间
     */
    void releaseAsset(String spaceId, LocalDateTime startAt, LocalDateTime endAt);

    /**
     * 批量删除附件，通过ID
     *
     * @param spaceAssetIds space_asset主键
     * @param checksums assets checksum
     */
    void batchRemoveAssetByIds(Set<Long> spaceAssetIds, Collection<String> checksums);
}
