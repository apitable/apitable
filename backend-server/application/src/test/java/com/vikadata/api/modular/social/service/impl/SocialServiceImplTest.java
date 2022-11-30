package com.vikadata.api.modular.social.service.impl;

import javax.annotation.Resource;

import org.junit.jupiter.api.Test;

import com.vikadata.api.AbstractIntegrationTest;
import com.vikadata.api.enterprise.social.enums.SocialAppType;
import com.vikadata.api.enterprise.social.enums.SocialPlatformType;
import com.vikadata.api.enterprise.social.service.ISocialService;
import com.vikadata.api.enterprise.social.service.ISocialTenantService;
import com.vikadata.api.mock.bean.MockUserSpace;
import com.vikadata.api.space.model.SpaceGlobalFeature;
import com.vikadata.api.space.model.SpaceUpdateOperate;
import com.vikadata.core.exception.BusinessException;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

public class SocialServiceImplTest extends AbstractIntegrationTest {

    @Resource
    private ISocialTenantService iSocialTenantService;

    @Resource
    private ISocialService iSocialService;

    @Test
    void testGetFalseRootManageable() {
        MockUserSpace userSpace = createSingleUserAndSpace();
        iSpaceService.switchSpacePros(userSpace.getUserId(), userSpace.getSpaceId(),
                SpaceGlobalFeature.builder().rootManageable(false).build());
        SpaceGlobalFeature globalFeature = iSpaceService.getSpaceGlobalFeature(userSpace.getSpaceId());
        assertThat(globalFeature.rootManageableOrDefault()).isFalse();
    }

    @Test
    void testGetDefaultRootManageable() {
        MockUserSpace userSpace = createSingleUserAndSpace();
        SpaceGlobalFeature globalFeature = iSpaceService.getSpaceGlobalFeature(userSpace.getSpaceId());
        assertThat(globalFeature.rootManageableOrDefault()).isTrue();
    }

    @Test
    void checkOperateUpdateMemberWithoutSocialBind() {
        MockUserSpace userSpace = createSingleUserAndSpace();
        assertDoesNotThrow(() -> iSocialService.checkCanOperateSpaceUpdate(userSpace.getSpaceId(),
                SpaceUpdateOperate.UPDATE_MEMBER));
    }

    @Test
    void checkOperateAddTeamWithoutSocialBind() {
        MockUserSpace userSpace = createSingleUserAndSpace();
        assertDoesNotThrow(() -> iSocialService.checkCanOperateSpaceUpdate(userSpace.getSpaceId(),
                SpaceUpdateOperate.ADD_TEAM));
    }

    @Test
    void checkOperateDeleteSpaceWithoutSocialBind() {
        MockUserSpace userSpace = createSingleUserAndSpace();
        assertDoesNotThrow(() -> iSocialService.checkCanOperateSpaceUpdate(userSpace.getSpaceId(),
                SpaceUpdateOperate.DELETE_SPACE));
    }

    @Test
    void checkOperateUpdateMemberWithLarkIsvBind() {
        MockUserSpace userSpace = createSingleUserAndSpace();
        iSocialTenantService.createTenant(SocialPlatformType.FEISHU, SocialAppType.ISV, "app01", "lark01",
                "{}");
        iSocialTenantBindService.addTenantBind("app01", "lark01", userSpace.getSpaceId());
        assertDoesNotThrow(() -> iSocialService.checkCanOperateSpaceUpdate(userSpace.getSpaceId(),
                SpaceUpdateOperate.UPDATE_MEMBER));
    }

    @Test
    void checkOperateUpdateMemberWithLarkIsvBindAndAppStop() {
        MockUserSpace userSpace = createSingleUserAndSpace();
        iSocialTenantService.createTenant(SocialPlatformType.FEISHU, SocialAppType.ISV, "app01", "lark01",
                "{}");
        iSocialTenantBindService.addTenantBind("app01", "lark01", userSpace.getSpaceId());
        iSocialTenantService.updateTenantStatus("app01", "lark01", false);
        assertDoesNotThrow(() -> iSocialService.checkCanOperateSpaceUpdate(userSpace.getSpaceId(),
                SpaceUpdateOperate.UPDATE_MEMBER));
    }

    @Test
    void checkOperateUpdateMemberWithLarkInternalBind() {
        MockUserSpace userSpace = createSingleUserAndSpace();
        iSocialTenantService.createTenant(SocialPlatformType.FEISHU, SocialAppType.INTERNAL, "app01", "lark01",
                "{}");
        iSocialTenantBindService.addTenantBind("app01", "lark01", userSpace.getSpaceId());
        BusinessException exception =
                assertThrows(BusinessException.class,
                        () -> iSocialService.checkCanOperateSpaceUpdate(userSpace.getSpaceId(),
                                SpaceUpdateOperate.UPDATE_MEMBER));
        assertEquals(411, exception.getCode());
    }

    @Test
    void checkOperateUpdateMemberWithLarkInternalBindAndAppStop() {
        MockUserSpace userSpace = createSingleUserAndSpace();
        iSocialTenantService.createTenant(SocialPlatformType.FEISHU, SocialAppType.INTERNAL, "app01", "lark01",
                "{}");
        iSocialTenantBindService.addTenantBind("app01", "lark01", userSpace.getSpaceId());
        iSocialTenantService.updateTenantStatus("app01", "lark01", false);
        BusinessException exception =
                assertThrows(BusinessException.class,
                        () -> iSocialService.checkCanOperateSpaceUpdate(userSpace.getSpaceId(),
                                SpaceUpdateOperate.UPDATE_MEMBER));
        assertEquals(411, exception.getCode());
    }

    @Test
    void checkOperateAddTeamWithLarkIsvBind() {
        MockUserSpace userSpace = createSingleUserAndSpace();
        iSocialTenantService.createTenant(SocialPlatformType.FEISHU, SocialAppType.ISV, "app01", "lark01",
                "{}");
        iSocialTenantBindService.addTenantBind("app01", "lark01", userSpace.getSpaceId());
        BusinessException exception =
                assertThrows(BusinessException.class,
                        () -> iSocialService.checkCanOperateSpaceUpdate(userSpace.getSpaceId(),
                                SpaceUpdateOperate.ADD_TEAM));
        assertEquals(411, exception.getCode());
    }

    @Test
    void checkOperateAddTeamWithLarkIsvBindAndAppStop() {
        MockUserSpace userSpace = createSingleUserAndSpace();
        iSocialTenantService.createTenant(SocialPlatformType.FEISHU, SocialAppType.ISV, "app01", "lark01",
                "{}");
        iSocialTenantBindService.addTenantBind("app01", "lark01", userSpace.getSpaceId());
        iSocialTenantService.updateTenantStatus("app01", "lark01", false);
        BusinessException exception =
                assertThrows(BusinessException.class,
                        () -> iSocialService.checkCanOperateSpaceUpdate(userSpace.getSpaceId(),
                                SpaceUpdateOperate.ADD_TEAM));
        assertEquals(411, exception.getCode());
    }

    @Test
    void checkOperateAddTeamWithLarkInternalBind() {
        MockUserSpace userSpace = createSingleUserAndSpace();
        iSocialTenantService.createTenant(SocialPlatformType.FEISHU, SocialAppType.INTERNAL, "app01", "lark01",
                "{}");
        iSocialTenantBindService.addTenantBind("app01", "lark01", userSpace.getSpaceId());
        BusinessException exception =
                assertThrows(BusinessException.class,
                        () -> iSocialService.checkCanOperateSpaceUpdate(userSpace.getSpaceId(),
                                SpaceUpdateOperate.ADD_TEAM));
        assertEquals(411, exception.getCode());
    }

    @Test
    void checkOperateAddTeamWithLarkInternalBindAndAppStop() {
        MockUserSpace userSpace = createSingleUserAndSpace();
        iSocialTenantService.createTenant(SocialPlatformType.FEISHU, SocialAppType.INTERNAL, "app01", "lark01",
                "{}");
        iSocialTenantBindService.addTenantBind("app01", "lark01", userSpace.getSpaceId());
        iSocialTenantService.updateTenantStatus("app01", "lark01", false);
        BusinessException exception =
                assertThrows(BusinessException.class,
                        () -> iSocialService.checkCanOperateSpaceUpdate(userSpace.getSpaceId(),
                                SpaceUpdateOperate.ADD_TEAM));
        assertEquals(411, exception.getCode());
    }

    @Test
    void checkOperateUpdateMemberWithWecomIsvBind() {
        MockUserSpace userSpace = createSingleUserAndSpace();
        iSocialTenantService.createTenant(SocialPlatformType.WECOM, SocialAppType.ISV, "app01", "wecom01",
                "{}");
        iSocialTenantBindService.addTenantBind("app01", "wecom01", userSpace.getSpaceId());
        assertDoesNotThrow(() -> iSocialService.checkCanOperateSpaceUpdate(userSpace.getSpaceId(),
                SpaceUpdateOperate.UPDATE_MEMBER));
    }

    @Test
    void checkOperateUpdateMemberWithWecomIsvBindAndStopApp() {
        MockUserSpace userSpace = createSingleUserAndSpace();
        iSocialTenantService.createTenant(SocialPlatformType.WECOM, SocialAppType.ISV, "app01", "wecom01",
                "{}");
        iSocialTenantBindService.addTenantBind("app01", "wecom01", userSpace.getSpaceId());
        iSocialTenantService.updateTenantStatus("app01", "wecom01", false);
        assertDoesNotThrow(() -> iSocialService.checkCanOperateSpaceUpdate(userSpace.getSpaceId(),
                SpaceUpdateOperate.UPDATE_MEMBER));
    }

    @Test
    void checkOperateUpdateMemberWithWecomInternalBind() {
        MockUserSpace userSpace = createSingleUserAndSpace();
        iSocialTenantService.createTenant(SocialPlatformType.WECOM, SocialAppType.INTERNAL, "app01", "wecom01",
                "{}");
        iSocialTenantBindService.addTenantBind("app01", "wecom01", userSpace.getSpaceId());
        BusinessException exception = assertThrows(BusinessException.class,
                () -> iSocialService.checkCanOperateSpaceUpdate(userSpace.getSpaceId(),
                        SpaceUpdateOperate.UPDATE_MEMBER));
        assertEquals(411, (int) exception.getCode());
    }

    @Test
    void checkOperateUpdateMemberWithWecomInternalBindAndStopApp() {
        MockUserSpace userSpace = createSingleUserAndSpace();
        iSocialTenantService.createTenant(SocialPlatformType.WECOM, SocialAppType.INTERNAL, "app01", "wecom01",
                "{}");
        iSocialTenantBindService.addTenantBind("app01", "wecom01", userSpace.getSpaceId());
        iSocialTenantService.updateTenantStatus("app01", "wecom01", false);
        BusinessException exception = assertThrows(BusinessException.class,
                () -> iSocialService.checkCanOperateSpaceUpdate(userSpace.getSpaceId(),
                        SpaceUpdateOperate.UPDATE_MEMBER));
        assertEquals(411, (int) exception.getCode());
    }

    @Test
    void checkOperateUpdateMemberWithDingTalkIsvBind() {
        MockUserSpace userSpace = createSingleUserAndSpace();
        iSocialTenantService.createTenant(SocialPlatformType.DINGTALK, SocialAppType.ISV, "app01", "ding01",
                "{}");
        iSocialTenantBindService.addTenantBind("app01", "ding01", userSpace.getSpaceId());
        assertDoesNotThrow(() -> iSocialService.checkCanOperateSpaceUpdate(userSpace.getSpaceId(),
                SpaceUpdateOperate.UPDATE_MEMBER));
    }

    @Test
    void checkOperateUpdateMemberWithDingTalkIsvBindAndStopApp() {
        MockUserSpace userSpace = createSingleUserAndSpace();
        iSocialTenantService.createTenant(SocialPlatformType.DINGTALK, SocialAppType.ISV, "app01", "ding01",
                "{}");
        iSocialTenantBindService.addTenantBind("app01", "ding01", userSpace.getSpaceId());
        iSocialTenantService.updateTenantStatus("app01", "ding01", false);
        assertDoesNotThrow(() -> iSocialService.checkCanOperateSpaceUpdate(userSpace.getSpaceId(),
                SpaceUpdateOperate.UPDATE_MEMBER));
    }

    @Test
    void checkOperateUpdateMemberWithDingTalkInternalBind() {
        MockUserSpace userSpace = createSingleUserAndSpace();
        iSocialTenantService.createTenant(SocialPlatformType.DINGTALK, SocialAppType.INTERNAL, "app01", "ding01",
                "{}");
        iSocialTenantBindService.addTenantBind("app01", "ding01", userSpace.getSpaceId());
        BusinessException exception = assertThrows(BusinessException.class,
                () -> iSocialService.checkCanOperateSpaceUpdate(userSpace.getSpaceId(),
                        SpaceUpdateOperate.UPDATE_MEMBER));
        assertEquals(411, (int) exception.getCode());
    }

    @Test
    void checkOperateUpdateMemberWithDingTalkInternalBindAndStopApp() {
        MockUserSpace userSpace = createSingleUserAndSpace();
        iSocialTenantService.createTenant(SocialPlatformType.DINGTALK, SocialAppType.INTERNAL, "app01", "ding01",
                "{}");
        iSocialTenantBindService.addTenantBind("app01", "ding01", userSpace.getSpaceId());
        iSocialTenantService.updateTenantStatus("app01", "ding01", false);
        BusinessException exception = assertThrows(BusinessException.class,
                () -> iSocialService.checkCanOperateSpaceUpdate(userSpace.getSpaceId(),
                        SpaceUpdateOperate.UPDATE_MEMBER));
        assertEquals(411, (int) exception.getCode());
    }

    @Test
    void checkOperateAddTeamWithWecomIsvBind() {
        MockUserSpace userSpace = createSingleUserAndSpace();
        iSocialTenantService.createTenant(SocialPlatformType.WECOM, SocialAppType.ISV, "app01", "wecom01",
                "{}");
        iSocialTenantBindService.addTenantBind("app01", "wecom01", userSpace.getSpaceId());
        assertDoesNotThrow(() -> iSocialService.checkCanOperateSpaceUpdate(userSpace.getSpaceId(),
                SpaceUpdateOperate.ADD_TEAM));
    }

    @Test
    void checkOperateAddTeamWithWecomIsvBindAndStopApp() {
        MockUserSpace userSpace = createSingleUserAndSpace();
        iSocialTenantService.createTenant(SocialPlatformType.WECOM, SocialAppType.ISV, "app01", "wecom01",
                "{}");
        iSocialTenantBindService.addTenantBind("app01", "wecom01", userSpace.getSpaceId());
        iSocialTenantService.updateTenantStatus("app01", "wecom01", false);
        assertDoesNotThrow(() -> iSocialService.checkCanOperateSpaceUpdate(userSpace.getSpaceId(),
                SpaceUpdateOperate.ADD_TEAM));
    }

    @Test
    void checkOperateAddTeamWithWecomInternalBind() {
        MockUserSpace userSpace = createSingleUserAndSpace();
        iSocialTenantService.createTenant(SocialPlatformType.WECOM, SocialAppType.INTERNAL, "app01", "wecom01",
                "{}");
        iSocialTenantBindService.addTenantBind("app01", "wecom01", userSpace.getSpaceId());
        BusinessException exception = assertThrows(BusinessException.class,
                () -> iSocialService.checkCanOperateSpaceUpdate(userSpace.getSpaceId(),
                        SpaceUpdateOperate.ADD_TEAM));
        assertEquals(411, (int) exception.getCode());
    }

    @Test
    void checkOperateAddTeamWithWecomInternalBindAndStopApp() {
        MockUserSpace userSpace = createSingleUserAndSpace();
        iSocialTenantService.createTenant(SocialPlatformType.WECOM, SocialAppType.INTERNAL, "app01", "wecom01",
                "{}");
        iSocialTenantBindService.addTenantBind("app01", "wecom01", userSpace.getSpaceId());
        iSocialTenantService.updateTenantStatus("app01", "wecom01", false);
        BusinessException exception = assertThrows(BusinessException.class,
                () -> iSocialService.checkCanOperateSpaceUpdate(userSpace.getSpaceId(),
                        SpaceUpdateOperate.ADD_TEAM));
        assertEquals(411, (int) exception.getCode());
    }

    @Test
    void checkOperateAddTeamWithDingTalkIsvBind() {
        MockUserSpace userSpace = createSingleUserAndSpace();
        iSocialTenantService.createTenant(SocialPlatformType.DINGTALK, SocialAppType.ISV, "app01", "ding01",
                "{}");
        iSocialTenantBindService.addTenantBind("app01", "ding01", userSpace.getSpaceId());
        assertDoesNotThrow(() -> iSocialService.checkCanOperateSpaceUpdate(userSpace.getSpaceId(),
                SpaceUpdateOperate.ADD_TEAM));
    }

    @Test
    void checkOperateAddTeamWithDingTalkIsvBindAndStopApp() {
        MockUserSpace userSpace = createSingleUserAndSpace();
        iSocialTenantService.createTenant(SocialPlatformType.DINGTALK, SocialAppType.ISV, "app01", "ding01",
                "{}");
        iSocialTenantBindService.addTenantBind("app01", "ding01", userSpace.getSpaceId());
        iSocialTenantService.updateTenantStatus("app01", "ding01", false);
        assertDoesNotThrow(() -> iSocialService.checkCanOperateSpaceUpdate(userSpace.getSpaceId(),
                SpaceUpdateOperate.ADD_TEAM));
    }

    @Test
    void checkOperateAddTeamWithDingTalkInternalBind() {
        MockUserSpace userSpace = createSingleUserAndSpace();
        iSocialTenantService.createTenant(SocialPlatformType.DINGTALK, SocialAppType.INTERNAL, "app01", "ding01",
                "{}");
        iSocialTenantBindService.addTenantBind("app01", "ding01", userSpace.getSpaceId());
        BusinessException exception = assertThrows(BusinessException.class,
                () -> iSocialService.checkCanOperateSpaceUpdate(userSpace.getSpaceId(),
                        SpaceUpdateOperate.ADD_TEAM));
        assertEquals(411, (int) exception.getCode());
    }

    @Test
    void checkOperateAddTeamWithDingTalkInternalBindAndStopApp() {
        MockUserSpace userSpace = createSingleUserAndSpace();
        iSocialTenantService.createTenant(SocialPlatformType.DINGTALK, SocialAppType.INTERNAL, "app01", "ding01",
                "{}");
        iSocialTenantBindService.addTenantBind("app01", "ding01", userSpace.getSpaceId());
        iSocialTenantService.updateTenantStatus("app01", "ding01", false);
        BusinessException exception = assertThrows(BusinessException.class,
                () -> iSocialService.checkCanOperateSpaceUpdate(userSpace.getSpaceId(),
                        SpaceUpdateOperate.ADD_TEAM));
        assertEquals(411, (int) exception.getCode());
    }


    @Test
    void checkOperateDeleteSpaceWithDingTalkIsvBind() {
        MockUserSpace userSpace = createSingleUserAndSpace();
        iSocialTenantService.createTenant(SocialPlatformType.DINGTALK, SocialAppType.ISV, "app01", "ding01",
                "{}");
        iSocialTenantBindService.addTenantBind("app01", "ding01", userSpace.getSpaceId());
        BusinessException exception =
                assertThrows(BusinessException.class,
                        () -> iSocialService.checkCanOperateSpaceUpdate(userSpace.getSpaceId(),
                                SpaceUpdateOperate.DELETE_SPACE));
        assertEquals(411, exception.getCode());
    }

    @Test
    void checkOperateDeleteSpaceWithDingTalkIsvBindAndStopApp() {
        MockUserSpace userSpace = createSingleUserAndSpace();
        iSocialTenantService.createTenant(SocialPlatformType.DINGTALK, SocialAppType.ISV, "app01", "ding01",
                "{}");
        iSocialTenantBindService.addTenantBind("app01", "ding01", userSpace.getSpaceId());
        iSocialTenantService.updateTenantStatus("app01", "ding01", false);
        assertDoesNotThrow(() -> iSocialService.checkCanOperateSpaceUpdate(userSpace.getSpaceId(),
                SpaceUpdateOperate.DELETE_SPACE));
    }

    @Test
    void checkOperateDeleteSpaceWithDingTalkInternalBind() {
        MockUserSpace userSpace = createSingleUserAndSpace();
        iSocialTenantService.createTenant(SocialPlatformType.DINGTALK, SocialAppType.INTERNAL, "app01", "ding01",
                "{}");
        iSocialTenantBindService.addTenantBind("app01", "ding01", userSpace.getSpaceId());
        BusinessException exception = assertThrows(BusinessException.class,
                () -> iSocialService.checkCanOperateSpaceUpdate(userSpace.getSpaceId(),
                        SpaceUpdateOperate.DELETE_SPACE));
        assertEquals(411, (int) exception.getCode());
    }

    @Test
    void checkOperateDeleteSpaceDingTalkInternalBindAndStopApp() {
        MockUserSpace userSpace = createSingleUserAndSpace();
        iSocialTenantService.createTenant(SocialPlatformType.DINGTALK, SocialAppType.INTERNAL, "app01", "ding01",
                "{}");
        iSocialTenantBindService.addTenantBind("app01", "ding01", userSpace.getSpaceId());
        iSocialTenantService.updateTenantStatus("app01", "ding01", false);
        assertDoesNotThrow(() -> iSocialService.checkCanOperateSpaceUpdate(userSpace.getSpaceId(),
                SpaceUpdateOperate.DELETE_SPACE));
    }


    @Test
    void checkOperateDeleteSpaceWithLarkIsvBind() {
        MockUserSpace userSpace = createSingleUserAndSpace();
        iSocialTenantService.createTenant(SocialPlatformType.FEISHU, SocialAppType.ISV, "app01", "feishu01",
                "{}");
        iSocialTenantBindService.addTenantBind("app01", "feishu01", userSpace.getSpaceId());
        BusinessException exception =
                assertThrows(BusinessException.class,
                        () -> iSocialService.checkCanOperateSpaceUpdate(userSpace.getSpaceId(),
                                SpaceUpdateOperate.DELETE_SPACE));
        assertEquals(411, exception.getCode());
    }

    @Test
    void checkOperateDeleteSpaceWithLarkBindAndStopApp() {
        MockUserSpace userSpace = createSingleUserAndSpace();
        iSocialTenantService.createTenant(SocialPlatformType.FEISHU, SocialAppType.ISV, "app01", "feishu01",
                "{}");
        iSocialTenantBindService.addTenantBind("app01", "feishu01", userSpace.getSpaceId());
        iSocialTenantService.updateTenantStatus("app01", "feishu01", false);
        BusinessException exception =
                assertThrows(BusinessException.class,
                        () -> iSocialService.checkCanOperateSpaceUpdate(userSpace.getSpaceId(),
                                SpaceUpdateOperate.DELETE_SPACE));
        assertEquals(411, exception.getCode());
    }

    @Test
    void checkOperateDeleteSpaceWithLarkInternalBind() {
        MockUserSpace userSpace = createSingleUserAndSpace();
        iSocialTenantService.createTenant(SocialPlatformType.FEISHU, SocialAppType.INTERNAL, "app01", "feishu01",
                "{}");
        iSocialTenantBindService.addTenantBind("app01", "feishu01", userSpace.getSpaceId());
        BusinessException exception = assertThrows(BusinessException.class,
                () -> iSocialService.checkCanOperateSpaceUpdate(userSpace.getSpaceId(),
                        SpaceUpdateOperate.DELETE_SPACE));
        assertEquals(411, (int) exception.getCode());
    }

    @Test
    void checkOperateDeleteSpaceLarkInternalBindAndStopApp() {
        MockUserSpace userSpace = createSingleUserAndSpace();
        iSocialTenantService.createTenant(SocialPlatformType.FEISHU, SocialAppType.INTERNAL, "app01", "ding01",
                "{}");
        iSocialTenantBindService.addTenantBind("app01", "ding01", userSpace.getSpaceId());
        iSocialTenantService.updateTenantStatus("app01", "ding01", false);
        assertDoesNotThrow(() -> iSocialService.checkCanOperateSpaceUpdate(userSpace.getSpaceId(),
                SpaceUpdateOperate.DELETE_SPACE));
    }
}
