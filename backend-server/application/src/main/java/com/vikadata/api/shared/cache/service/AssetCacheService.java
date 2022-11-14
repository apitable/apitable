package com.vikadata.api.shared.cache.service;

import com.vikadata.api.shared.cache.bean.SpaceAssetDTO;

/**
 * <p>
 * resource cache service
 * </p>
 *
 * @author Chambers
 */
public interface AssetCacheService {

    /**
     * get space resource cache information
     *
     * @param key   resource key
     * @return SpaceAssetDTO
     * @author Chambers
     * @date 2022/8/11
     */
    SpaceAssetDTO getSpaceAssetDTO(String key);

    /**
     * save space resource cache information
     *
     * @param key           resource key
     * @param spaceAssetDTO space resource dto
     * @param expireSecond  expire time (unit：second)
     * @author Chambers
     * @date 2022/8/11
     */
    void save(String key, SpaceAssetDTO spaceAssetDTO, int expireSecond);
}
