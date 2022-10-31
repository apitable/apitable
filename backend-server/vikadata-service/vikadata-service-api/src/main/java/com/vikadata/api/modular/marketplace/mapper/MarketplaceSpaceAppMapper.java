package com.vikadata.api.modular.marketplace.mapper;

import java.util.List;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Param;

import com.vikadata.entity.MarketplaceSpaceAppRelEntity;

/**
 * <p>
 * Marketplace Space App Mapper
 * </p>
 */
public interface MarketplaceSpaceAppMapper extends BaseMapper<MarketplaceSpaceAppRelEntity> {

    /**
     * Query appid by space id
     */
    @Deprecated
    List<String> selectBySpaceId(@Param("spaceId") String spaceId);

    /**
     * Query count by space id and appid
     */
    @Deprecated
    Integer selectCountBySpaceIdAndAppId(@Param("spaceId") String spaceId, @Param("appId") String appId);

    /**
     * Delete by space id and appid
     */
    @Deprecated
    int deleteBySpaceIdAndAppId(@Param("spaceId") String spaceId, @Param("appId") String appId);

    /**
     * Query By space id and appid
     */
    MarketplaceSpaceAppRelEntity selectBySpaceIdAndAppId(@Param("spaceId") String spaceId, @Param("appId") String appId);
}
