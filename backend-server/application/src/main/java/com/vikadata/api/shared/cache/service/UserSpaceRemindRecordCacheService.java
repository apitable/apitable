package com.vikadata.api.shared.cache.service;

import java.util.List;

/**
 * <p>
 * Member records recently mentioned by users in the space
 * </p>
 *
 * @author Chambers
 */
public interface UserSpaceRemindRecordCacheService {

    /**
     * get member unit id list recently mentioned by users in the space
     *
     * @param userId  user id
     * @param spaceId space id
     * @return member id list
     */
    List<Long> getRemindUnitIds(Long userId, String spaceId);

    /**
     * refresh cache
     *
     * @param userId  user id
     * @param spaceId space id
     * @param unitIds unit id list
     */
    void refresh(Long userId, String spaceId, List<Long> unitIds);
}
