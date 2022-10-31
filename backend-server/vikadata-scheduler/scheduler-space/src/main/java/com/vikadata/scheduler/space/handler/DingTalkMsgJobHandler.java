package com.vikadata.scheduler.space.handler;

import java.util.Arrays;

import javax.annotation.Resource;

import cn.hutool.core.util.StrUtil;
import cn.hutool.json.JSONUtil;
import com.xxl.job.core.context.XxlJobHelper;
import com.xxl.job.core.handler.annotation.XxlJob;

import com.vikadata.scheduler.space.service.IDingTalkConfigService;

import org.springframework.stereotype.Component;

/**
 * <p>
 * Ding Talk Msg Job Handler
 * </p>
 */
@Component
public class DingTalkMsgJobHandler {

    @Resource
    private IDingTalkConfigService dingTalkService;

    /**
     * Save the configuration of DingTalk application to redis
     */
    @XxlJob(value = "saveDingTalkAgentAppConfig")
    public void saveDingTalkAgentAppConfig() {
        String param = XxlJobHelper.getJobParam();
        XxlJobHelper.log("Save the configuration of DingTalk application to redis. param:{}", param);
        if (StrUtil.isBlank(param) || !JSONUtil.parseObj(param).containsKey("datasheetId")) {
            XxlJobHelper.handleFail("Wrong Parameter!");
            return;
        }
        dingTalkService.saveDingTalkAgentAppConfig(JSONUtil.parseObj(param).getStr("datasheetId"));
    }

    /**
     * Save the configuration of DingTalk application icon to redis
     */
    @XxlJob(value = "saveDingTalkDaIconConfig")
    public void saveDingTalkDaIconConfig() {
        String param = XxlJobHelper.getJobParam();
        String[] params = param.split(",");
        if (params.length != 2) {
            XxlJobHelper.log("Wrong Parameter!: param:[{}]", Arrays.toString(params));
            XxlJobHelper.handleFail("Wrong Parameter!");
        }
        dingTalkService.saveDingTalkDaTemplateConfig(params[0], params[1]);
    }
}
