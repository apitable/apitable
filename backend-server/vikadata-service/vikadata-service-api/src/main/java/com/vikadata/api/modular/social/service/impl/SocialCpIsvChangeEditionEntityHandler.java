package com.vikadata.api.modular.social.service.impl;

import java.util.List;

import javax.annotation.Resource;

import cn.hutool.core.collection.CollUtil;
import cn.hutool.json.JSONUtil;
import me.chanjar.weixin.common.error.WxErrorException;

import com.vikadata.api.context.ClockManager;
import com.vikadata.api.enums.social.SocialPlatformType;
import com.vikadata.api.event.SyncOrderEvent;
import com.vikadata.api.modular.finance.strategy.SocialOrderStrategyFactory;
import com.vikadata.api.modular.social.factory.SocialFactory;
import com.vikadata.api.modular.social.service.ISocialCpIsvEntityHandler;
import com.vikadata.api.modular.social.service.ISocialCpIsvMessageService;
import com.vikadata.api.modular.social.service.ISocialEditionChangelogWeComService;
import com.vikadata.api.modular.social.service.ISocialTenantBindService;
import com.vikadata.api.util.billing.WeComPlanConfigManager;
import com.vikadata.boot.autoconfigure.spring.SpringContextHolder;
import com.vikadata.entity.SocialCpIsvMessageEntity;
import com.vikadata.entity.SocialEditionChangelogWecomEntity;
import com.vikadata.social.wecom.constants.WeComIsvMessageType;
import com.vikadata.social.wecom.event.order.WeComOrderPaidEvent;
import com.vikadata.social.wecom.model.WxCpIsvAuthInfo;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * <p>
 * Third party platform integration - WeCom third-party service provider application version change processing
 * </p>
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
            // Tenant space station does not exist, so it will not be processed
            // If the enterprise installation is paid at the same time, it will be handled by Authorized Installation
            String suiteId = unprocessed.getSuiteId();
            String authCorpId = unprocessed.getAuthCorpId();
            // 1 Get the last version information
            SocialEditionChangelogWecomEntity lastChangelog = socialEditionChangelogWeComService
                    .getLastChangeLog(suiteId, authCorpId);
            // 2 Save this version information
            SocialEditionChangelogWecomEntity changelogWecomEntity = socialEditionChangelogWeComService
                    .createChangelog(suiteId, authCorpId);
            // 3 Process Trial Subscription
            WxCpIsvAuthInfo.EditionInfo.Agent agent = JSONUtil.toBean(changelogWecomEntity.getEditionInfo(), WxCpIsvAuthInfo.EditionInfo.Agent.class);
            String editionId = agent.getEditionId();
            if (WeComPlanConfigManager.isWeComTrialEdition(editionId)) {
                WeComOrderPaidEvent event = SocialFactory.formatWecomTailEditionOrderPaidEvent(suiteId, authCorpId,
                        ClockManager.me().getLocalDateTimeNow(), agent);
                String orderId = SocialOrderStrategyFactory.getService(SocialPlatformType.WECOM).retrieveOrderPaidEvent(event);
                // Synchronize order events
                if (orderId != null) {
                    SpringContextHolder.getApplicationContext().publishEvent(new SyncOrderEvent(this, orderId));
                }
            }
        }
        return true;
    }

}
