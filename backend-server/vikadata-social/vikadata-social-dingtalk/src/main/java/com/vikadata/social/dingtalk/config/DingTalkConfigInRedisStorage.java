package com.vikadata.social.dingtalk.config;

import java.util.List;
import java.util.stream.Collectors;

import com.vikadata.social.dingtalk.DingtalkConfig.AgentApp;

/**
 * <p>
 * 钉钉授权服务商应用redis配置存储
 * </p>
 * @author zoe zheng
 * @date 2021/7/26 2:20 下午
 */
public class DingTalkConfigInRedisStorage implements DingTalkConfigStorage {
    private static final String DING_TALK_AGENT_APP_CONFIG = "%s:dingtalk:config:agent_app";

    private final DingTalkRedisOperations redisOps;

    private final String redisKeyPrefix;

    public DingTalkConfigInRedisStorage(DingTalkRedisOperations redisOps, String redisKeyPrefix) {
        this.redisOps = redisOps;
        this.redisKeyPrefix = redisKeyPrefix;
    }

    @Override
    public AgentApp getAgentApp(String agentId) {
        Object value = this.redisOps.getHashMapValue(getAgentStorageKey(), agentId);
        if (value != null) {
            return (AgentApp) value;
        }
        return null;
    }

    @Override
    public void setAgentApp(AgentApp agentApp) {
        this.redisOps.setHashMapValue(getAgentStorageKey(), agentApp.getAgentId(), agentApp);
    }

    @Override
    public List<AgentApp> getAllAgentApps() {
        List<Object> values = this.redisOps.getHashMapValues(getAgentStorageKey());
        return values.stream().map(item -> (AgentApp) item).collect(Collectors.toList());
    }

    @Override
    public Boolean hasAgentApp(String agentId) {
        return this.redisOps.hasMapKey(getAgentStorageKey(), agentId);
    }

    @Override
    public Boolean hasKey(String key) {
        return this.redisOps.hasKey(key);
    }

    @Override
    public String getAgentStorageKey() {
        return String.format(DING_TALK_AGENT_APP_CONFIG, this.redisKeyPrefix);
    }
}
