package com.vikadata.api.marketplace.service.impl;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;

import javax.annotation.Resource;

import cn.hutool.core.util.ObjectUtil;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import lombok.extern.slf4j.Slf4j;

import com.vikadata.api.base.enums.AuthException;
import com.vikadata.api.marketplace.mapper.MarketplaceSpaceAppMapper;
import com.vikadata.api.marketplace.service.IMarketplaceAppService;
import com.vikadata.api.marketplace.vo.MarketplaceSpaceAppVo;
import com.vikadata.api.shared.context.LoginContext;
import com.vikadata.api.enterprise.social.enums.SocialPlatformType;
import com.vikadata.api.organization.service.IMemberService;
import com.vikadata.api.enterprise.social.enums.SocialAppType;
import com.vikadata.api.enterprise.social.service.IDingTalkService;
import com.vikadata.api.enterprise.social.service.ISocialTenantBindService;
import com.vikadata.api.enterprise.social.service.ISocialTenantService;
import com.vikadata.api.enterprise.social.service.IWeComService;
import com.vikadata.api.space.service.ISpaceService;
import com.vikadata.api.space.enums.SpaceException;
import com.vikadata.core.util.ExceptionUtil;
import com.vikadata.core.util.SqlTool;
import com.vikadata.entity.MarketplaceSpaceAppRelEntity;
import com.vikadata.system.config.SystemConfigManager;

import org.springframework.stereotype.Service;

/**
 * <p>
 * Marketplace App Service Implement Class
 * </p>
 */
@Slf4j
@Service
public class MarketplaceAppServiceImpl extends ServiceImpl<MarketplaceSpaceAppMapper, MarketplaceSpaceAppRelEntity> implements IMarketplaceAppService {

    @Resource
    private MarketplaceSpaceAppMapper marketplaceSpaceAppMapper;

    @Resource
    private ISocialTenantBindService socialTenantBindService;

    @Resource
    private ISocialTenantService socialTenantService;

    @Resource
    private ISpaceService spaceService;

    @Resource
    private IMemberService memberService;

    @Resource
    private IDingTalkService dingTalkService;

    @Resource
    private IWeComService iWeComService;

    @Override
    public List<MarketplaceSpaceAppVo> getSpaceAppList(String spaceId) {
        log.info("Query built-in integrated applications of space 「{}」", spaceId);
        List<MarketplaceSpaceAppVo> list = new ArrayList<>();
        // Query the application activation record of the current space
        List<String> spaceAppList = getAppIdsBySpaceId(spaceId);
        SystemConfigManager.getConfig().getMarketplace().entrySet().stream()
                .sorted(Comparator.comparing(entry -> entry.getValue().getDisplayOrder()))
                .forEachOrdered(entry -> {
                            if (entry.getValue().getAppId().equals(dingTalkService.getVikaDingAppId())) {
                                // DingTalk additional inquiry
                                MarketplaceSpaceAppVo vo = new MarketplaceSpaceAppVo();
                                vo.setAppId(entry.getValue().getAppId());
                                vo.setStatus(socialTenantBindService.getSpaceBindStatusByPlatformType(spaceId, SocialPlatformType.DINGTALK));
                                list.add(vo);
                            }
                            else {
                                MarketplaceSpaceAppVo spaceApp = MarketplaceSpaceAppVo.builder()
                                        .appId(entry.getValue().getAppId())
                                        .status(spaceAppList.contains(entry.getValue().getAppId()))
                                        .build();
                                list.add(spaceApp);
                            }

                        }
                );
        return list;
    }

    @Override
    public List<String> getAppIdsBySpaceId(String spaceId) {
        return marketplaceSpaceAppMapper.selectBySpaceId(spaceId);
    }

    @Override
    public boolean checkBySpaceIdAndAppId(String spaceId, String appId) {
        Integer count = marketplaceSpaceAppMapper.selectCountBySpaceIdAndAppId(spaceId, appId);
        return SqlTool.retCount(count) > 0;
    }

    @Override
    public MarketplaceSpaceAppRelEntity getBySpaceIdAndAppId(String spaceId, String appId) {
        return marketplaceSpaceAppMapper.selectBySpaceIdAndAppId(spaceId, appId);
    }

    @Override
    public void removeBySpaceIdAndAppId(String spaceId, String appId) {
        marketplaceSpaceAppMapper.deleteBySpaceIdAndAppId(spaceId, appId);
    }

    @Override
    public void openSpaceApp(String spaceId, String appId) {
        log.info("Space 「{}」 open built-in integrated applications 「{}」", spaceId, appId);
        // Check whether the space station has opened this application
        int count = SqlTool.retCount(marketplaceSpaceAppMapper.selectCountBySpaceIdAndAppId(spaceId, appId));
        if (count > 0) {
            return;
        }
        MarketplaceSpaceAppRelEntity spaceApp = MarketplaceSpaceAppRelEntity.builder()
                .appId(appId)
                .spaceId(spaceId)
                .build();
        marketplaceSpaceAppMapper.insert(spaceApp);
    }

    @Override
    public void stopSpaceApp(String spaceId, String appId) {
        log.info("Space 「{}」 stop built-in integrated applications 「{}」", spaceId, appId);
        // DingTalk application deactivation logic
        if (appId.equals(dingTalkService.getVikaDingAppId())) {
            Long userId = LoginContext.me().getLoginUser().getUserId();
            Long memberId = memberService.getMemberIdByUserIdAndSpaceId(userId, spaceId);
            // Detect if the deactivated space is the current user's space
            ExceptionUtil.isNotNull(memberId, AuthException.UNAUTHORIZED);
            // Check if it is the primary administrator
            Long mainMemberId = spaceService.getSpaceMainAdminMemberId(spaceId);
            ExceptionUtil.isTrue(ObjectUtil.equal(memberId, mainMemberId), SpaceException.NOT_SPACE_MAIN_ADMIN);
            socialTenantService.removeSpaceIdSocialBindInfo(spaceId);
            return;
        }
        else if (iWeComService.getVikaWeComAppId().equals(appId)) {
            boolean isWeComIsv = Optional.ofNullable(socialTenantBindService.getTenantBindInfoBySpaceId(spaceId))
                    .map(bind -> socialTenantService.getByAppIdAndTenantId(bind.getAppId(), bind.getTenantId()))
                    .map(tenant -> Boolean.TRUE.equals(tenant.getStatus()) &&
                            SocialPlatformType.WECOM.getValue().equals(tenant.getPlatform()) &&
                            SocialAppType.ISV.getType() == tenant.getAppType())
                    .orElse(false);
            if (!isWeComIsv) {
                // Wecom deactivation logic
                Long userId = LoginContext.me().getLoginUser().getUserId();
                Long memberId = memberService.getMemberIdByUserIdAndSpaceId(userId, spaceId);
                // Detect if the deactivated space is the current user's space
                ExceptionUtil.isNotNull(memberId, AuthException.UNAUTHORIZED);
                // Check if it is the primary administrator
                Long mainMemberId = spaceService.getSpaceMainAdminMemberId(spaceId);
                ExceptionUtil.isTrue(ObjectUtil.equal(memberId, mainMemberId), SpaceException.NOT_SPACE_MAIN_ADMIN);
                iWeComService.stopWeComApp(spaceId);
            }
        }
        removeBySpaceIdAndAppId(spaceId, appId);
    }
}
