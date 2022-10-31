package com.vikadata.scheduler.space.service.impl;

import java.util.List;

import javax.annotation.Resource;

import cn.hutool.json.JSONUtil;
import com.xxl.job.core.context.XxlJobHelper;
import lombok.extern.slf4j.Slf4j;

import com.vikadata.define.constants.RedisConstants;
import com.vikadata.integration.vika.VikaOperations;
import com.vikadata.integration.vika.model.DingTalkAgentAppInfo;
import com.vikadata.integration.vika.model.DingTalkDaTemplateInfo;
import com.vikadata.scheduler.space.service.IDingTalkConfigService;
import com.vikadata.social.dingtalk.DingtalkConfig.AgentApp;
import com.vikadata.social.dingtalk.config.DingTalkConfigStorage;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

/**
 * <p>
 * DingTalk App Service Implement Class
 * </p>
 */
@Service
@Slf4j
public class DingTalkConfigServiceImpl implements IDingTalkConfigService {

    @Autowired(required = false)
    private VikaOperations vikaOperations;

    @Autowired(required = false)
    private DingTalkConfigStorage dingTalkConfigStorage;

    @Resource
    private RedisTemplate<String, String> redisTemplate;

    @Override
    public void saveDingTalkAgentAppConfig(String dstId) {
        List<DingTalkAgentAppInfo> agentAppInfos = vikaOperations.getDingTalkAgentAppConfiguration(dstId);
        agentAppInfos.forEach(appInfo -> {
            if (!dingTalkConfigStorage.hasAgentApp(appInfo.getAgentId())) {
                AgentApp agentApp = new AgentApp();
                agentApp.setAgentId(appInfo.getAgentId());
                agentApp.setCustomKey(appInfo.getCustomKey());
                agentApp.setCustomSecret(appInfo.getCustomSecret());
                agentApp.setToken(appInfo.getToken());
                agentApp.setAesKey(appInfo.getAesKey());
                agentApp.setCorpId(appInfo.getCorpId());
                agentApp.setSuiteTicket(appInfo.getSuiteTicket());
                dingTalkConfigStorage.setAgentApp(agentApp);
            }
        });
    }

    @Override
    public void saveDingTalkDaTemplateConfig(String dstId, String viewId) {
        List<DingTalkDaTemplateInfo> templateInfo = vikaOperations.getDingTalkDaTemplateInfo(dstId, viewId);
        templateInfo.forEach(template -> {
            String cacheKey = RedisConstants.getDingTalkTemplateIconKey(template.getTemplateId());
            if (!Boolean.TRUE.equals(redisTemplate.hasKey(cacheKey))) {
                redisTemplate.opsForValue().set(cacheKey, JSONUtil.toJsonStr(template));
                XxlJobHelper.log("Save DingTalk template information. TemplateId: {}", template.getTemplateId());
            }
        });
    }
}
