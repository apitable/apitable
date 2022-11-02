package com.vikadata.api.modular.client.service;

import com.baomidou.mybatisplus.extension.service.IService;

import com.vikadata.api.model.ro.client.ClientBuildRo;
import com.vikadata.api.util.VikaVersion.Env;
import com.vikadata.entity.ClientReleaseVersionEntity;

/**
 * <p>
 * Version Publish Table Service Class
 * </p>
 */
public interface IClientReleaseVersionService extends IService<ClientReleaseVersionEntity> {

    /**
     * Adapt to obtain the client version number
     *
     * @param env Client environment
     * @param pipelineId Client pipeline ID
     * @return String
     */
    String getVersionOrDefault(Env env, String pipelineId);

    /**
     * Create Client Version
     *
     * @param clientBuildRo Request parameters
     */
    void createClientVersion(ClientBuildRo clientBuildRo);

    /**
     * Get the HTML content of the specified version
     *
     * @param version version ID
     * @return Html Content
     */
    String getHtmlContentByVersion(String version);

    /**
     * Cache refreshes the specified version of html content
     *
     * @param version version ID
     * @return Html Content
     */
    String refreshHtmlContent(String version);

    /**
     * Get html Content according to version
     *
     * @param version Version ID
     * @return String
     */
    String getHtmlContentCacheIfAbsent(String version);

    /**
     * Send post email reminder
     *
     * @param version Release Version
     */
    void sendNotifyEmail(String version);

    /**
     * Get specific meta information
     *
     * @param uri nginx $request_uri
     * @return meta
     */
    String getMetaContent(String uri);

    /**
     * Get the node ID according to the uri
     *
     * @param uri Request Path
     * @return Node ID
     */
    String getNodeIdFromUri(String uri);

    /**
     * Get Space id according to uri
     *
     * @param uri Request Path
     * @return Space ID
     */
    String getSpaceIdFromUri(String uri);

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
