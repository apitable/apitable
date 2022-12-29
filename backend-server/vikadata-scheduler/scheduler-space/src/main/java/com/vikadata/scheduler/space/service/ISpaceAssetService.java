package com.vikadata.scheduler.space.service;

/**
 * <p>
 * Space Asset Service
 * </p>
 */
public interface ISpaceAssetService {

    /**
     * Space asset reference count statistics
     *
     * @param spaceId space id
     */
    void referenceCounting(String spaceId);
}
