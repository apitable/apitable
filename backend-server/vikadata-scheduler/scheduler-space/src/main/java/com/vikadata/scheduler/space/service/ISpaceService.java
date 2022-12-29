package com.vikadata.scheduler.space.service;

/**
 * <p>
 * Space Service
 * </p>
 */
public interface ISpaceService {

    /**
     * Delete space
     * (seven days of pre-deletion or direct deletion)
     *
     * @param spaceId space id
     */
    void delSpace(String spaceId);
}
