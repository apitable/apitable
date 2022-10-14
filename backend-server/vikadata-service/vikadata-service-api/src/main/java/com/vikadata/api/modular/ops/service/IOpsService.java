package com.vikadata.api.modular.ops.service;

/**
 * <p>
 * Product Operation System Service
 * </p>
 *
 * @author Chambers
 * @date 2022/8/15
 */
public interface IOpsService {

    /**
     * mark template asset
     *
     * @param templateId    template custom ID
     * @param isReversed    whether it is a reverse operation, that is, cancel the flag
     * @author Chambers
     * @date 2022/8/15
     */
    void markTemplateAsset(String templateId, Boolean isReversed);
}
