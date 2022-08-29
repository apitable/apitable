package com.vikadata.api.cache.service;

/**
 * <p>
 * 用户激活空间 服务接口
 * </p>
 *
 * @author Shawn Deng
 * @date 2019/11/12 17:22
 */
public interface UserActiveSpaceService {

    /**
     * 缓存用户最近工作的空间
     *
     * @param userId  用户ID
     * @param spaceId 空间ID
     * @author Shawn Deng
     * @date 2019/11/15 15:58
     */
    void save(Long userId, String spaceId);

    /**
     * 获取用户最近工作的空间ID
     *
     * @param userId 用户ID
     * @return 空间ID
     * @author Shawn Deng
     * @date 2019/11/15 15:59
     */
    String getLastActiveSpace(Long userId);

    /**
     * 删除缓存
     *
     * @param userId 用户ID
     * @author Shawn Deng
     * @date 2019/11/15 17:23
     */
    void delete(Long userId);
}
