package com.vikadata.api.shared.cache.service;

import com.vikadata.api.shared.cache.bean.SocialAuthInfo;

public interface SocialAuthInfoCacheService {

    /**
     * Save user authorization information to cache
     *
     * @param authInfo User authorization information
     * @return token
     */
    String saveAuthInfoToCache(SocialAuthInfo authInfo);

    /**
     * Get user information from cache
     *
     * @param token token
     * @return UserAuthInfo
     */
    SocialAuthInfo getAuthInfoFromCache(String token);
}
