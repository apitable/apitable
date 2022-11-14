package com.vikadata.api;

import java.util.Objects;

import com.baomidou.mybatisplus.core.toolkit.IdWorker;

import com.vikadata.api.enterprise.social.enums.SocialPlatformType;
import com.vikadata.api.mock.bean.MockUserSpace;
import com.vikadata.api.enterprise.appstore.enums.AppType;
import com.vikadata.api.enterprise.appstore.service.IAppInstanceService;
import com.vikadata.api.enterprise.billing.strategy.SocialOrderStrategyFactory;
import com.vikadata.api.enterprise.social.enums.SocialAppType;
import com.vikadata.api.enterprise.social.enums.SocialTenantAuthMode;
import com.vikadata.api.enterprise.social.service.ISocialTenantService;
import com.vikadata.api.workspace.model.CreateNodeDto;
import com.vikadata.api.workspace.service.INodeService;
import com.vikadata.api.shared.util.IdUtil;
import com.vikadata.api.workspace.enums.NodeType;
import com.vikadata.entity.SocialTenantBindEntity;
import com.vikadata.entity.SocialTenantEntity;
import com.vikadata.entity.SpaceEntity;
import com.vikadata.social.wecom.event.order.WeComOrderPaidEvent;

import org.springframework.beans.factory.annotation.Autowired;

/**
 * <p>
 * Unit test for wecom isv
 * </p>
 * @author Codeman
 * @date 2022-08-29 18:57:35
 */
public abstract class AbstractIsvTest extends AbstractIntegrationTest {
    protected static final SocialAppType ISV = SocialAppType.ISV;

    @Autowired
    private IAppInstanceService iAppInstanceService;

    @Autowired
    private ISocialTenantService iSocialTenantService;

    @Autowired
    private INodeService iNodeService;

    protected MockUserSpace prepareSocialBindInfo(String tenantId, String appId, SocialPlatformType platformType,
            SocialAppType appType) {
        MockUserSpace userSpace = createSingleUserAndSpace();
        SocialTenantBindEntity entity =
                SocialTenantBindEntity.builder()
                        .id(IdWorker.getId())
                        .tenantId(tenantId)
                        .appId(appId)
                        .spaceId(userSpace.getSpaceId()).build();
        iSocialTenantBindService.save(entity);
        iSocialTenantService.save(SocialTenantEntity.builder()
                .id(IdWorker.getId())
                .tenantId(tenantId)
                .appId(appId)
                .platform(platformType.getValue())
                .appType(appType.getType()).build());
        return userSpace;
    }

    /**
     * Create wecom isv tenant without any subscriptions
     *
     * @param suiteId Wecom isv suite ID
     * @param authCorpId Paid corporation ID
     * @return Related space ID
     * @author Codeman
     * @date 2022-08-02 15:21:15
     */
    protected String createWecomIsvTenant(String suiteId, String authCorpId) {
        return createWecomIsvTenant(suiteId, authCorpId, null);
    }

    /**
     * Create wecom isv tenant with subscription
     *
     * @param suiteId Wecom isv suite ID
     * @param authCorpId Paid corporation ID
     * @param isPaid True with paid subscription, trial otherwise. NULL without any subscriptions
     * @return Related space ID
     * @author Codeman
     * @date 2022-08-02 15:21:15
     */
    protected String createWecomIsvTenant(String suiteId, String authCorpId, Boolean isPaid) {
        String authCorpName = "testCorpName";
        // 1 save auth info for corporation, create tenant
        SocialTenantEntity tenantEntity = SocialTenantEntity.builder()
                .appId(suiteId)
                .appType(SocialAppType.ISV.getType())
                .tenantId(authCorpId)
                .contactAuthScope("{}")
                .authMode(SocialTenantAuthMode.ADMIN.getValue())
                .permanentCode("")
                .authInfo("{}")
                .platform(SocialPlatformType.WECOM.getValue())
                .status(true)
                .build();
        iSocialTenantService.createOrUpdateByTenantAndApp(tenantEntity);
        // 2 create its space
        SpaceEntity spaceEntity = iSpaceService.createWeComIsvSpaceWithoutUser(String.format("%s's space'", authCorpName));
        String spaceId = spaceEntity.getSpaceId();
        // 2.1 bind space to the tenant
        iSocialTenantBindService.addTenantBind(tenantEntity.getAppId(), tenantEntity.getTenantId(), spaceId);
        // 2.2 create root node for the space
        String rootNodeId = iNodeService.createChildNode(-1L, CreateNodeDto.builder()
                .spaceId(spaceId)
                .newNodeId(IdUtil.createNodeId())
                .type(NodeType.ROOT.getNodeType())
                .build());
        // 3 set app instance
        iAppInstanceService.createInstanceByAppType(spaceId, AppType.WECOM_STORE.name());
        // 4 create subscription
        if (Objects.nonNull(isPaid)) {
            if (isPaid) {
                WeComOrderPaidEvent paidEvent = new WeComOrderPaidEvent();
                paidEvent.setSuiteId(suiteId);
                paidEvent.setPaidCorpId(authCorpId);
                paidEvent.setOrderId("N00000DF51A3A62FDFD04B5C80000");
                paidEvent.setOrderStatus(1);
                paidEvent.setOrderType(0);
                paidEvent.setOperatorId("kelvinpoon");
                paidEvent.setEditionId("sp4ec7bdf66c091737");
                paidEvent.setEditionName("Standard");
                paidEvent.setPrice(198000);
                paidEvent.setUserCount(10L);
                paidEvent.setOrderPeriod(365);
                paidEvent.setOrderTime(getClock().getNow(testTimeZone).toEpochSecond());
                paidEvent.setPaidTime(getClock().getNow(testTimeZone).toEpochSecond());
                paidEvent.setBeginTime(getClock().getNow(testTimeZone).toEpochSecond());
                paidEvent.setEndTime(getClock().getNow(testTimeZone).plusDays(365).toEpochSecond());
                paidEvent.setOrderFrom(0);
                paidEvent.setOperatorCorpId(authCorpId);
                paidEvent.setServiceShareAmount(198000);
                paidEvent.setPlatformShareAmount(0);
                paidEvent.setDealerShareAmount(0);
                SocialOrderStrategyFactory.getService(SocialPlatformType.WECOM)
                        .retrieveOrderPaidEvent(paidEvent);
            }
            else {
                long currentSeconds = getClock().getNow(testTimeZone).toEpochSecond();
                WeComOrderPaidEvent paidEvent = new WeComOrderPaidEvent();
                paidEvent.setSuiteId(suiteId);
                paidEvent.setPaidCorpId(authCorpId);
                paidEvent.setOrderType(0);
                paidEvent.setEditionId("sp0e8c1d98ca123945");
                paidEvent.setPrice(0);
                paidEvent.setOrderTime(currentSeconds);
                paidEvent.setPaidTime(currentSeconds);
                paidEvent.setBeginTime(currentSeconds);
                paidEvent.setEndTime(null);
                SocialOrderStrategyFactory.getService(SocialPlatformType.WECOM)
                        .retrieveOrderPaidEvent(paidEvent);
            }
        }
        // return related space ID
        return spaceId;
    }

}
