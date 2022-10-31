package com.vikadata.scheduler.space.service;

/**
 * <p>
 * DingTalk App Service
 * </p>
 */
public interface IDingTalkConfigService {

    /**
     * Save the configuration of Dingding self-built application -> service provider mode
     *
     * @param dstId datasheetId
     */
    void saveDingTalkAgentAppConfig(String dstId);

    /**
     * Save the configuration of Dingding and icon
     *
     * @param dstId     datasheetId
     * @param viewId    viewId
     */
    void saveDingTalkDaTemplateConfig(String dstId, String viewId);
}
