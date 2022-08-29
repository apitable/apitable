package com.vikadata.scheduler.space.handler;

import java.util.Arrays;

import javax.annotation.Resource;

import cn.hutool.core.util.StrUtil;
import cn.hutool.json.JSONObject;
import cn.hutool.json.JSONUtil;
import com.xxl.job.core.context.XxlJobHelper;
import com.xxl.job.core.handler.annotation.XxlJob;

import com.vikadata.scheduler.space.service.IAssetAuditService;
import com.vikadata.scheduler.space.service.IDingTalkConfigService;
import com.vikadata.social.dingtalk.exception.DingTalkApiException;

import org.springframework.stereotype.Component;

/**
 * <p>
 * 图片审核任务处理器
 * </p>
 *
 * @author Benson Cheung
 * @date 2020/03/28
 */
@Component
public class DingTalkMsgJobHandler {
    @Resource
    private IDingTalkConfigService dingTalkService;

    @Resource
    private IAssetAuditService iAssetsService;

    /**
     * 推送钉钉群消息
     * */
    @XxlJob(value = "sendDtMsgJobHandler")
    public void execute() throws DingTalkApiException {
        String param = XxlJobHelper.getJobParam();
        XxlJobHelper.log("推送待人工审核图片的钉钉群消息.param:{}", param);
        if (StrUtil.isBlank(param)) {
            XxlJobHelper.handleFail("参数有误");
            return;
        }
        JSONObject obj = JSONUtil.parseObj(param);
        iAssetsService.auditAssetsSendDtMsg(obj.getStr("resourceUrl"), obj.getStr("dtCensorPath"), obj.getStr("dtCensorChatId"));
    }

    /**
     * 保存钉钉应用的配置到redis
     * @author zoe zheng
     * @date 2021/7/27 10:05 上午
     */
    @XxlJob(value = "saveDingTalkAgentAppConfig")
    public void saveDingTalkAgentAppConfig() {
        String param = XxlJobHelper.getJobParam();
        XxlJobHelper.log("保存钉钉应用的配置到redis. param:{}", param);
        if (StrUtil.isBlank(param) || !JSONUtil.parseObj(param).containsKey("datasheetId")) {
            XxlJobHelper.handleFail("参数错误");
            return;
        }
        dingTalkService.saveDingTalkAgentAppConfig(JSONUtil.parseObj(param).getStr("datasheetId"));
    }

    /**
     * 保存钉钉搭应用icon的配置到redis中
     * @author zoe zheng
     * @date 2021/7/27 10:05 上午
     */
    @XxlJob(value = "saveDingTalkDaIconConfig")
    public void saveDingTalkDaIconConfig() {
        String param = XxlJobHelper.getJobParam();
        String[] params = param.split(",");
        if (params.length != 2) {
            XxlJobHelper.log("参数错误: param:[{}]", Arrays.toString(params));
            XxlJobHelper.handleFail("参数错误");
        }
        dingTalkService.saveDingTalkDaTemplateConfig(params[0], params[1]);
    }
}
