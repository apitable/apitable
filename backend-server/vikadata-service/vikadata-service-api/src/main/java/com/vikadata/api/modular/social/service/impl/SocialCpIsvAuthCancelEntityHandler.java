package com.vikadata.api.modular.social.service.impl;

import java.time.LocalDateTime;

import javax.annotation.Resource;

import cn.hutool.core.lang.Assert;
import me.chanjar.weixin.common.error.WxErrorException;

import com.vikadata.api.cache.service.UserSpaceService;
import com.vikadata.api.modular.appstore.enums.AppType;
import com.vikadata.api.modular.appstore.service.IAppInstanceService;
import com.vikadata.api.modular.social.enums.SocialCpIsvMessageProcessStatus;
import com.vikadata.api.modular.social.service.ISocialCpIsvEntityHandler;
import com.vikadata.api.modular.social.service.ISocialCpIsvMessageService;
import com.vikadata.api.modular.social.service.ISocialTenantBindService;
import com.vikadata.api.modular.social.service.ISocialTenantService;
import com.vikadata.entity.SocialCpIsvMessageEntity;
import com.vikadata.entity.SocialTenantEntity;
import com.vikadata.social.wecom.constants.WeComIsvMessageType;

import org.springframework.beans.factory.InitializingBean;
import org.springframework.context.ApplicationContext;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * <p>
 * 第三方平台集成 - 企业微信第三方服务商取消授权处理
 * </p>
 * @author 刘斌华
 * @date 2022-01-19 17:16:43
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

        // 1 获取企业已有的租户信息
        SocialTenantEntity socialTenantEntity = socialTenantService.getByAppIdAndTenantId(suiteId, authCorpId);
        Assert.notNull(socialTenantEntity, () -> new IllegalStateException(String
                .format("没有找到可用的租户信息，tenantId：%s，appId：%s", authCorpId, suiteId)));

        // 2 解除应用市场的绑定状态
        String spaceId = socialTenantBindService.getTenantBindSpaceId(socialTenantEntity.getTenantId(), socialTenantEntity.getAppId());
        iAppInstanceService.deleteBySpaceIdAndAppType(spaceId, AppType.WECOM_STORE.name());
        // 3 停用
        socialTenantEntity.setStatus(false);
        socialTenantEntity.setUpdatedAt(LocalDateTime.now());
        socialTenantService.updateById(socialTenantEntity);
        // 4 清空空间站缓存
        userSpaceService.delete(spaceId);
        // 5 将消息改成处理成功状态
        unprocessed.setProcessStatus(SocialCpIsvMessageProcessStatus.SUCCESS.getValue());
        socialCpIsvMessageService.updateById(unprocessed);

        return true;

    }

    @Override
    public void afterPropertiesSet() {

        this.socialCpIsvMessageService = applicationContext.getBean(ISocialCpIsvMessageService.class);

    }

}
