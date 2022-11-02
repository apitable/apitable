package com.vikadata.api.cache.service;

import com.vikadata.api.cache.bean.UserLinkInfo;

/**
 * <p>
 * user link interface
 * </p>
 *
 * @author Chambers
 */
public interface UserLinkInfoService {

    /**
     * get user related information
     *
     * @param userId user id
     * @return UserLinkInfo
     */
    UserLinkInfo getUserLinkInfo(Long userId);

    /**
     * delete cache
     *
     * @param userId user id
     */
    void delete(Long userId);
}
