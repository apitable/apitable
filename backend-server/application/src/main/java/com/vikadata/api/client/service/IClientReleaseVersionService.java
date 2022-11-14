package com.vikadata.api.client.service;

import com.baomidou.mybatisplus.extension.service.IService;

import com.vikadata.entity.ClientReleaseVersionEntity;

/**
 * <p>
 * Version Publish Table Service Class
 * </p>
 */
public interface IClientReleaseVersionService extends IService<ClientReleaseVersionEntity> {

    /**
     * Get specific meta information
     *
     * @param uri nginx $request_uri
     * @return meta
     */
    String getMetaContent(String uri);

    /**
     * Query whether the version number is higher than the current version of datasheet
     *
     * @param version Client Version
     * @return Return the positive and negative versions of the difference
     */
    boolean isMoreThanClientVersion(String version);

    /**
     * Get the latest official version number
     *
     * @return version
     */
    String getLatestVersion();
}
