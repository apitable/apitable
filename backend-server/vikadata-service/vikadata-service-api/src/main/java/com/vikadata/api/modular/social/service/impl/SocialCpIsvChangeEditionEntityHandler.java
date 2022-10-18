package com.vikadata.api.modular.social.service.impl;

import java.util.List;

import javax.annotation.Resource;

import cn.hutool.core.collection.CollUtil;
import cn.hutool.json.JSONUtil;
import me.chanjar.weixin.common.error.WxErrorException;

import com.vikadata.api.context.ClockManager;
import com.vikadata.api.enums.social.SocialPlatformType;
import com.vikadata.api.modular.finance.strategy.SocialOrderStrategyFactory;
import com.vikadata.api.modular.social.factory.SocialFactory;
import com.vikadata.api.modular.social.service.ISocialCpIsvEntityHandler;
import com.vikadata.api.modular.social.service.ISocialCpIsvMessageService;
import com.vikadata.api.modular.social.service.ISocialEditionChangelogWeComService;
import com.vikadata.api.modular.social.service.ISocialTenantBindService;
import com.vikadata.api.util.billing.WeComPlanConfigManager;
import com.vikadata.entity.SocialCpIsvMessageEntity;
import com.vikadata.entity.SocialEditionChangelogWecomEntity;
import com.vikadata.social.wecom.constants.WeComIsvMessageType;
import com.vikadata.social.wecom.event.order.WeComOrderPaidEvent;
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
                WeComOrderPaidEvent event = SocialFactory.formatWecomTailEditionOrderPaidEvent(suiteId, authCorpId,
                        ClockManager.me().getLocalDateTimeNow(), agent);
                SocialOrderStrategyFactory.getService(SocialPlatformType.WECOM).retrieveOrderPaidEvent(event);
            }
        }
        return true;
    }

}
