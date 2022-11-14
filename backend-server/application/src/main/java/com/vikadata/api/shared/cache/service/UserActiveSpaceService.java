package com.vikadata.api.shared.cache.service;

/**
 * <p>
 * user active space interface
 * </p>
 *
 * @author Shawn Deng
 */
public interface UserActiveSpaceService {

    /**
     * Cache the space latest worked user stayed
     *
     * @param userId  user id
     * @param spaceId space id
     */
    void save(Long userId, String spaceId);

    /**
     * get the space latest worked user stayed
     *
     * @param userId user id
     * @return space id
     */
    String getLastActiveSpace(Long userId);

    /**
     * delete cache
     *
     * @param userId user id
     */
    void delete(Long userId);
}
