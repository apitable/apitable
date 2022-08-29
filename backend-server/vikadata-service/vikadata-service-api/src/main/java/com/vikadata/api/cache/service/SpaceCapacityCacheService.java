package com.vikadata.api.cache.service;

/**
 * <p>
 * 空间容量缓存接口
 * </p>
 *
 * @author Chambers
 * @date 2021/10/28
 */
public interface SpaceCapacityCacheService {

    /**
     * 获取空间总容量
     *
     * @param spaceId 空间ID
     * @return 总容量
     * @author Chambers
     * @date 2021/10/28
     */
    long getSpaceCapacity(String spaceId);

    /**
     * 删除空间总容量缓存
     *
     * @param spaceId 空间ID
     * @author Chambers
     * @date 2021/10/28
     */
    void del(String spaceId);

}
