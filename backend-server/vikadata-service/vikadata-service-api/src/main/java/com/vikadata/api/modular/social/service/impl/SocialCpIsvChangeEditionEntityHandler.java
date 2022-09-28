package com.vikadata.api.modular.social.service.impl;

import java.util.List;
import java.util.Objects;

import javax.annotation.Resource;

import cn.hutool.core.collection.CollUtil;
import cn.hutool.json.JSONUtil;
import me.chanjar.weixin.common.error.WxErrorException;

import com.vikadata.api.modular.social.enums.SocialCpIsvMessageProcessStatus;
import com.vikadata.api.modular.social.service.ISocialCpIsvEntityHandler;
import com.vikadata.api.modular.social.service.ISocialCpIsvMessageService;
import com.vikadata.api.modular.social.service.ISocialCpIsvService;
import com.vikadata.api.modular.social.service.ISocialEditionChangelogWeComService;
import com.vikadata.api.modular.social.service.ISocialTenantBindService;
import com.vikadata.api.util.billing.WeComPlanConfigManager;
import com.vikadata.entity.SocialCpIsvMessageEntity;
import com.vikadata.entity.SocialEditionChangelogWecomEntity;
import com.vikadata.social.wecom.constants.WeComIsvMessageType;
import com.vikadata.social.wecom.model.WxCpIsvAuthInfo;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * <p>
 * 第三方平台集成 - 企业微信第三方服务商应用版本变更处理
 * </p>
 *
 * @author 刘斌华
 * @date 2022-04-25 10:13:31
 */
@Service
public class SocialCpIsvChangeEditionEntityHandler implements ISocialCpIsvEntityHandler {

    @Resource
    private ISocialEditionChangelogWeComService socialEditionChangelogWeComService;

    @Resource
    private ISocialCpIsvService socialCpIsvService;

    @Resource
    private ISocialCpIsvMessageService socialCpIsvMessageService;

    @Resource
    private ISocialTenantBindService socialTenantBindService;

    @Override
    public WeComIsvMessageType type() {

        return WeComIsvMessageType.CHANGE_EDITION;

    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public boolean process(SocialCpIsvMessageEntity unprocessed) throws WxErrorException {
        List<String> spaceIds = socialTenantBindService.getSpaceIdsByTenantIdAndAppId(unprocessed.getAuthCorpId(), unprocessed.getSuiteId());
        if (CollUtil.isNotEmpty(spaceIds)) {
            // 租户空间站不存在不做处理
            // 如果是企业安装的同时付费，则由【授权安装】处理
            String suiteId = unprocessed.getSuiteId();
            String authCorpId = unprocessed.getAuthCorpId();
            // 1 获取上一次版本信息
            SocialEditionChangelogWecomEntity lastChangelog = socialEditionChangelogWeComService
                    .getLastChangeLog(suiteId, authCorpId);
            // 2 保存本次版本信息
            SocialEditionChangelogWecomEntity changelogWecomEntity = socialEditionChangelogWeComService
                    .createChangelog(suiteId, authCorpId);
            // 3 处理试用订阅
            WxCpIsvAuthInfo.EditionInfo.Agent agent = JSONUtil.toBean(changelogWecomEntity.getEditionInfo(), WxCpIsvAuthInfo.EditionInfo.Agent.class);
            String editionId = agent.getEditionId();
            if (WeComPlanConfigManager.isWeComTrialEdition(editionId)) {
                // 当前为免费试用版，需要手动补充订单信息
                // 注意，安装时试用是不会有版本变更通知的
                // 根据是否已存在版本信息来判断是试用延期还是新试用
                int orderType = Objects.isNull(lastChangelog) ? 0 : 2;
                // 不限时试用时忽略试用过期时间
                Long expiredTime = agent.getAppStatus() == 5 ? null : agent.getExpiredTime();
                socialCpIsvService.handleTenantTrialSubscribe(suiteId, authCorpId, editionId, orderType, expiredTime);
            }
        }
        // 将消息改成处理成功状态
        unprocessed.setProcessStatus(SocialCpIsvMessageProcessStatus.SUCCESS.getValue());
        socialCpIsvMessageService.updateById(unprocessed);
        return true;
    }

}
