package com.vikadata.api.modular.marketplace.service;

import java.util.List;

import com.baomidou.mybatisplus.extension.service.IService;

import com.vikadata.api.model.vo.marketplace.MarketplaceSpaceAppVo;
import com.vikadata.entity.MarketplaceSpaceAppRelEntity;

/**
 *
 * <p>
 * Marketplace App Service
 * </p>
 */
@Deprecated
public interface IMarketplaceAppService extends IService<MarketplaceSpaceAppRelEntity> {

    /**
     * Query the application list of the space station
     */
    List<MarketplaceSpaceAppVo> getSpaceAppList(String spaceId);

    /**
     * Get the list of application IDs that the space has opened
     * * Old version data will be deleted soon
     */
    List<String> getAppIdsBySpaceId(String spaceId);

    /**
     * Check if space and apps are enabled
     */
    boolean checkBySpaceIdAndAppId(String spaceId, String appId);

    /**
     * Get the application entity that is opened in the specified space
     */
    MarketplaceSpaceAppRelEntity getBySpaceIdAndAppId(String spaceId, String appId);

    /**
     * Remove the open application of the space
     */
    void removeBySpaceIdAndAppId(String spaceId, String appId);

    /**
     * Open the application
     */
    void openSpaceApp(String spaceId, String appId);

    /**
     * Stop the application
     */
    void stopSpaceApp(String spaceId, String appId);
}
