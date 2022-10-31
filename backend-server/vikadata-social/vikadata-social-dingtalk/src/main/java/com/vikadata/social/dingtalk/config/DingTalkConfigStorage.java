package com.vikadata.social.dingtalk.config;

import java.util.List;

import com.vikadata.social.dingtalk.DingtalkConfig.AgentApp;

/**
 * DingTalk Authorized Service Provider Application Configuration Storage Interface
 */
public interface DingTalkConfigStorage {
    /**
     * Get the configuration of agentApp
     *
     * @param agentId agentId
     * @return AgentApp
     */
    AgentApp getAgentApp(String agentId);

    /**
     * Save the configuration of aagent App
     *
     * @param agentApp agent app configuration
     */
    void setAgentApp(AgentApp agentApp);

    /**
     * Get all agent apps
     * @return List<AgentApp>
     */
    List<AgentApp> getAllAgentApps();

    /**
     * does the agent app exist
     *
     * @param agentId agent id
     * @return Boolean
     */
    Boolean hasAgentApp(String agentId);

    /**
     * Determine whether the key exists
     *
     * @param key redis key
     * @return Boolean
     */
    Boolean hasKey(String key);

    /**
     * Get the key of agent app storage
     *
     * @return redis key
     */
    String getAgentStorageKey();
}
