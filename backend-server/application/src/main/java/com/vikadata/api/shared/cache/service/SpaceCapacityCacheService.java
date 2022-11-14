package com.vikadata.api.shared.cache.service;

/**
 * <p>
 * space capacity cache interface
 * </p>
 *
 * @author Chambers
 */
public interface SpaceCapacityCacheService {

    /**
     * get space capacity cache
     *
     * @param spaceId space id
     * @return capacity size(byte)
     */
    long getSpaceCapacity(String spaceId);

    /**
     * delete cache
     *
     * @param spaceId space id
     */
    void del(String spaceId);

}
