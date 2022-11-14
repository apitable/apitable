package com.vikadata.api.enterprise.social.service.impl;

import java.time.LocalDateTime;

import javax.annotation.Resource;

import cn.hutool.core.lang.Assert;
import me.chanjar.weixin.common.error.WxErrorException;

import com.vikadata.api.shared.cache.service.UserSpaceService;
import com.vikadata.api.enterprise.appstore.enums.AppType;
import com.vikadata.api.enterprise.appstore.service.IAppInstanceService;
import com.vikadata.api.enterprise.social.service.ISocialCpIsvEntityHandler;
import com.vikadata.api.enterprise.social.service.ISocialCpIsvMessageService;
import com.vikadata.api.enterprise.social.service.ISocialTenantBindService;
import com.vikadata.api.enterprise.social.service.ISocialTenantService;
import com.vikadata.entity.SocialCpIsvMessageEntity;
import com.vikadata.entity.SocialTenantEntity;
import com.vikadata.social.wecom.constants.WeComIsvMessageType;

import org.springframework.beans.factory.InitializingBean;
import org.springframework.context.ApplicationContext;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * <p>
 * Third party platform integration - WeCom third-party service provider cancels authorization processing
 * </p>
 */
@Service
public class SocialCpIsvAuthCancelEntityHandler implements ISocialCpIsvEntityHandler, InitializingBean {

    @Resource
    private ApplicationContext applicationContext;

    @Resource
    private IAppInstanceService iAppInstanceService;

    @Resource
    private ISocialTenantService socialTenantService;

    @Resource
    private ISocialTenantBindService socialTenantBindService;

    @Resource
    private UserSpaceService userSpaceService;

    private ISocialCpIsvMessageService socialCpIsvMessageService;

    @Override
    public WeComIsvMessageType type() {

        return WeComIsvMessageType.AUTH_CANCEL;

    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public boolean process(SocialCpIsvMessageEntity unprocessed) throws WxErrorException {

        String suiteId = unprocessed.getSuiteId();
        String authCorpId = unprocessed.getAuthCorpId();

        // 1 Obtain the existing tenant information of the enterprise
        SocialTenantEntity socialTenantEntity = socialTenantService.getByAppIdAndTenantId(suiteId, authCorpId);
        Assert.notNull(socialTenantEntity, () -> new IllegalStateException(String
                .format("No available tenant information found,tenantId：%s，appId：%s", authCorpId, suiteId)));

        // 2 Unbind the app market
        String spaceId = socialTenantBindService.getTenantBindSpaceId(socialTenantEntity.getTenantId(), socialTenantEntity.getAppId());
        iAppInstanceService.deleteBySpaceIdAndAppType(spaceId, AppType.WECOM_STORE.name());
        // 3 Deactivate
        socialTenantEntity.setStatus(false);
        socialTenantEntity.setUpdatedAt(LocalDateTime.now());
        socialTenantService.updateById(socialTenantEntity);
        // 4 Clear the space station cache
        userSpaceService.delete(spaceId);
        return true;

    }

    @Override
    public void afterPropertiesSet() {

        this.socialCpIsvMessageService = applicationContext.getBean(ISocialCpIsvMessageService.class);

    }

}
