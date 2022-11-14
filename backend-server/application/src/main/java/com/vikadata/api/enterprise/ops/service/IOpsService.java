package com.vikadata.api.enterprise.ops.service;

/**
 * <p>
 * Product Operation System Service
 * </p>
 */
public interface IOpsService {

    /**
     * mark template asset
     *
     * @param templateId    template custom ID
     * @param isReversed    whether it is a reverse operation, that is, cancel the flag
     */
    void markTemplateAsset(String templateId, Boolean isReversed);
}
