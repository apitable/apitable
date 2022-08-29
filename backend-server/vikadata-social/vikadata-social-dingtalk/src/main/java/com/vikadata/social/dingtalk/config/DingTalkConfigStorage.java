package com.vikadata.social.dingtalk.config;

import java.util.List;

import com.vikadata.social.dingtalk.DingtalkConfig.AgentApp;

/**
 * 钉钉授权服务商应用配置存储接口
 *
 * @author Shawn Deng
 * @date 2020-11-21 12:33:04
 */
public interface DingTalkConfigStorage {
    /**
     * 获取agentApp 的配置
     *
     * @param agentId agentId
     * @return AgentApp
     * @author zoe zheng
     * @date 2021/7/26 5:01 下午
     */
    AgentApp getAgentApp(String agentId);

    /**
     * 保存aagentApp的配置
     *
     * @param agentApp agent app 配置
     * @author zoe zheng
     * @date 2021/7/26 5:02 下午
     */
    void setAgentApp(AgentApp agentApp);

    /**
     * 获取所有的agent app
     * @return List<AgentApp>
     * @author zoe zheng
     * @date 2021/7/26 7:53 下午
     */
    List<AgentApp> getAllAgentApps();

    /**
     * agent app是否存在
     *
     * @param agentId agent id
     * @return Boolean
     * @author zoe zheng
     * @date 2021/7/26 8:22 下午
     */
    Boolean hasAgentApp(String agentId);

    /**
     * 判断key 是否存在
     *
     * @param key redis key
     * @return Boolean
     * @author zoe zheng
     * @date 2021/7/27 11:30 上午
     */
    Boolean hasKey(String key);

    /**
     * 获取agent app storage 的key
     *
     * @return redis key
     * @author zoe zheng
     * @date 2021/7/27 3:21 下午
     */
    String getAgentStorageKey();
}
