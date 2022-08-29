package com.vikadata.api.modular.space.service.impl;

import javax.annotation.Resource;

import org.junit.jupiter.api.Test;

import com.vikadata.api.AbstractIntegrationTest;
import com.vikadata.api.enums.social.SocialPlatformType;
import com.vikadata.api.lang.SpaceGlobalFeature;
import com.vikadata.api.mock.bean.MockUserSpace;
import com.vikadata.api.modular.social.enums.SocialAppType;
import com.vikadata.api.modular.social.service.ISocialTenantService;
import com.vikadata.api.modular.space.model.SpaceUpdateOperate;
import com.vikadata.core.exception.BusinessException;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

/**
 * @author tao
 */
public class SpaceServiceImplTest extends AbstractIntegrationTest {

    @Resource
    private ISocialTenantService iSocialTenantService;

    @Test
    void testGetFalseRootManageable() {
        MockUserSpace userSpace = createSingleUserAndSpace();
        iSpaceService.switchSpacePros(userSpace.getUserId(), userSpace.getSpaceId(),
                SpaceGlobalFeature.builder().rootManageable(false).build());
        SpaceGlobalFeature globalFeature = iSpaceService.getSpaceGlobalFeature(userSpace.getSpaceId());
        assertThat(globalFeature.getRootManageable()).isFalse();
    }

    @Test
    void testGetDefaultRootManageable() {
        MockUserSpace userSpace = createSingleUserAndSpace();
        SpaceGlobalFeature globalFeature = iSpaceService.getSpaceGlobalFeature(userSpace.getSpaceId());
        assertThat(globalFeature.getRootManageable()).isTrue();
    }

    @Test
    void checkOperateUpdateMemberWithoutSocialBind() {
        MockUserSpace userSpace = createSingleUserAndSpace();
        assertDoesNotThrow(() -> iSpaceService.checkCanOperateSpaceUpdate(userSpace.getSpaceId(),
                SpaceUpdateOperate.UPDATE_MEMBER));
    }

    @Test
    void checkOperateAddTeamWithoutSocialBind() {
        MockUserSpace userSpace = createSingleUserAndSpace();
        assertDoesNotThrow(() -> iSpaceService.checkCanOperateSpaceUpdate(userSpace.getSpaceId(),
                SpaceUpdateOperate.ADD_TEAM));
    }

    @Test
    void checkOperateDeleteSpaceWithoutSocialBind() {
        MockUserSpace userSpace = createSingleUserAndSpace();
        assertDoesNotThrow(() -> iSpaceService.checkCanOperateSpaceUpdate(userSpace.getSpaceId(),
                SpaceUpdateOperate.DELETE_SPACE));
    }

    @Test
    void checkOperateUpdateMemberWithLarkIsvBind() {
        MockUserSpace userSpace = createSingleUserAndSpace();
        iSocialTenantService.createTenant(SocialPlatformType.FEISHU, SocialAppType.ISV, "app01", "lark01",
                "{}");
        iSocialTenantBindService.addTenantBind("app01", "lark01", userSpace.getSpaceId());
        BusinessException exception =
                assertThrows(BusinessException.class,
                        () -> iSpaceService.checkCanOperateSpaceUpdate(userSpace.getSpaceId(),
                                SpaceUpdateOperate.UPDATE_MEMBER));
        assertEquals(411, exception.getCode());
    }

    @Test
    void checkOperateUpdateMemberWithLarkIsvBindAndAppStop() {
        MockUserSpace userSpace = createSingleUserAndSpace();
        iSocialTenantService.createTenant(SocialPlatformType.FEISHU, SocialAppType.ISV, "app01", "lark01",
                "{}");
        iSocialTenantBindService.addTenantBind("app01", "lark01", userSpace.getSpaceId());
        iSocialTenantService.updateTenantStatus("app01", "lark01", false);
        BusinessException exception =
                assertThrows(BusinessException.class,
                        () -> iSpaceService.checkCanOperateSpaceUpdate(userSpace.getSpaceId(),
                                SpaceUpdateOperate.UPDATE_MEMBER));
        assertEquals(411, exception.getCode());
    }

    @Test
    void checkOperateUpdateMemberWithLarkInternalBind() {
        MockUserSpace userSpace = createSingleUserAndSpace();
        iSocialTenantService.createTenant(SocialPlatformType.FEISHU, SocialAppType.INTERNAL, "app01", "lark01",
                "{}");
        iSocialTenantBindService.addTenantBind("app01", "lark01", userSpace.getSpaceId());
        BusinessException exception =
                assertThrows(BusinessException.class,
                        () -> iSpaceService.checkCanOperateSpaceUpdate(userSpace.getSpaceId(),
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
                        () -> iSpaceService.checkCanOperateSpaceUpdate(userSpace.getSpaceId(),
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
                        () -> iSpaceService.checkCanOperateSpaceUpdate(userSpace.getSpaceId(),
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
                        () -> iSpaceService.checkCanOperateSpaceUpdate(userSpace.getSpaceId(),
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
                        () -> iSpaceService.checkCanOperateSpaceUpdate(userSpace.getSpaceId(),
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
                        () -> iSpaceService.checkCanOperateSpaceUpdate(userSpace.getSpaceId(),
                                SpaceUpdateOperate.ADD_TEAM));
        assertEquals(411, exception.getCode());
    }

    @Test
    void checkOperateUpdateMemberWithWecomIsvBind() {
        MockUserSpace userSpace = createSingleUserAndSpace();
        iSocialTenantService.createTenant(SocialPlatformType.WECOM, SocialAppType.ISV, "app01", "wecom01",
                "{}");
        iSocialTenantBindService.addTenantBind("app01", "wecom01", userSpace.getSpaceId());
        assertDoesNotThrow(() -> iSpaceService.checkCanOperateSpaceUpdate(userSpace.getSpaceId(),
                SpaceUpdateOperate.UPDATE_MEMBER));
    }

    @Test
    void checkOperateUpdateMemberWithWecomIsvBindAndStopÅpp() {
        MockUserSpace userSpace = createSingleUserAndSpace();
        iSocialTenantService.createTenant(SocialPlatformType.WECOM, SocialAppType.ISV, "app01", "wecom01",
                "{}");
        iSocialTenantBindService.addTenantBind("app01", "wecom01", userSpace.getSpaceId());
        iSocialTenantService.updateTenantStatus("app01", "wecom01", false);
        assertDoesNotThrow(() -> iSpaceService.checkCanOperateSpaceUpdate(userSpace.getSpaceId(),
                SpaceUpdateOperate.UPDATE_MEMBER));
    }

    @Test
    void checkOperateUpdateMemberWithWecomInternalBind() {
        MockUserSpace userSpace = createSingleUserAndSpace();
        iSocialTenantService.createTenant(SocialPlatformType.WECOM, SocialAppType.INTERNAL, "app01", "wecom01",
                "{}");
        iSocialTenantBindService.addTenantBind("app01", "wecom01", userSpace.getSpaceId());
        BusinessException exception = assertThrows(BusinessException.class,
                () -> iSpaceService.checkCanOperateSpaceUpdate(userSpace.getSpaceId(),
                        SpaceUpdateOperate.UPDATE_MEMBER));
        assertEquals(411, (int) exception.getCode());
    }

    @Test
    void checkOperateUpdateMemberWithWecomInternalBindAndStopÅpp() {
        MockUserSpace userSpace = createSingleUserAndSpace();
        iSocialTenantService.createTenant(SocialPlatformType.WECOM, SocialAppType.INTERNAL, "app01", "wecom01",
                "{}");
        iSocialTenantBindService.addTenantBind("app01", "wecom01", userSpace.getSpaceId());
        iSocialTenantService.updateTenantStatus("app01", "wecom01", false);
        BusinessException exception = assertThrows(BusinessException.class,
                () -> iSpaceService.checkCanOperateSpaceUpdate(userSpace.getSpaceId(),
                        SpaceUpdateOperate.UPDATE_MEMBER));
        assertEquals(411, (int) exception.getCode());
    }

    @Test
    void checkOperateUpdateMemberWithDingTalkIsvBind() {
        MockUserSpace userSpace = createSingleUserAndSpace();
        iSocialTenantService.createTenant(SocialPlatformType.DINGTALK, SocialAppType.ISV, "app01", "ding01",
                "{}");
        iSocialTenantBindService.addTenantBind("app01", "ding01", userSpace.getSpaceId());
        assertDoesNotThrow(() -> iSpaceService.checkCanOperateSpaceUpdate(userSpace.getSpaceId(),
                SpaceUpdateOperate.UPDATE_MEMBER));
    }

    @Test
    void checkOperateUpdateMemberWithDingTalkIsvBindAndStopÅpp() {
        MockUserSpace userSpace = createSingleUserAndSpace();
        iSocialTenantService.createTenant(SocialPlatformType.DINGTALK, SocialAppType.ISV, "app01", "ding01",
                "{}");
        iSocialTenantBindService.addTenantBind("app01", "ding01", userSpace.getSpaceId());
        iSocialTenantService.updateTenantStatus("app01", "ding01", false);
        assertDoesNotThrow(() -> iSpaceService.checkCanOperateSpaceUpdate(userSpace.getSpaceId(),
                SpaceUpdateOperate.UPDATE_MEMBER));
    }

    @Test
    void checkOperateUpdateMemberWithDingTalkInternalBind() {
        MockUserSpace userSpace = createSingleUserAndSpace();
        iSocialTenantService.createTenant(SocialPlatformType.DINGTALK, SocialAppType.INTERNAL, "app01", "ding01",
                "{}");
        iSocialTenantBindService.addTenantBind("app01", "ding01", userSpace.getSpaceId());
        BusinessException exception = assertThrows(BusinessException.class,
                () -> iSpaceService.checkCanOperateSpaceUpdate(userSpace.getSpaceId(),
                        SpaceUpdateOperate.UPDATE_MEMBER));
        assertEquals(411, (int) exception.getCode());
    }

    @Test
    void checkOperateUpdateMemberWithDingTalkInternalBindAndStopÅpp() {
        MockUserSpace userSpace = createSingleUserAndSpace();
        iSocialTenantService.createTenant(SocialPlatformType.DINGTALK, SocialAppType.INTERNAL, "app01", "ding01",
                "{}");
        iSocialTenantBindService.addTenantBind("app01", "ding01", userSpace.getSpaceId());
        iSocialTenantService.updateTenantStatus("app01", "ding01", false);
        BusinessException exception = assertThrows(BusinessException.class,
                () -> iSpaceService.checkCanOperateSpaceUpdate(userSpace.getSpaceId(),
                        SpaceUpdateOperate.UPDATE_MEMBER));
        assertEquals(411, (int) exception.getCode());
    }

    @Test
    void checkOperateAddTeamWithWecomIsvBind() {
        MockUserSpace userSpace = createSingleUserAndSpace();
        iSocialTenantService.createTenant(SocialPlatformType.WECOM, SocialAppType.ISV, "app01", "wecom01",
                "{}");
        iSocialTenantBindService.addTenantBind("app01", "wecom01", userSpace.getSpaceId());
        assertDoesNotThrow(() -> iSpaceService.checkCanOperateSpaceUpdate(userSpace.getSpaceId(),
                SpaceUpdateOperate.ADD_TEAM));
    }

    @Test
    void checkOperateAddTeamWithWecomIsvBindAndStopÅpp() {
        MockUserSpace userSpace = createSingleUserAndSpace();
        iSocialTenantService.createTenant(SocialPlatformType.WECOM, SocialAppType.ISV, "app01", "wecom01",
                "{}");
        iSocialTenantBindService.addTenantBind("app01", "wecom01", userSpace.getSpaceId());
        iSocialTenantService.updateTenantStatus("app01", "wecom01", false);
        assertDoesNotThrow(() -> iSpaceService.checkCanOperateSpaceUpdate(userSpace.getSpaceId(),
                SpaceUpdateOperate.ADD_TEAM));
    }

    @Test
    void checkOperateAddTeamWithWecomInternalBind() {
        MockUserSpace userSpace = createSingleUserAndSpace();
        iSocialTenantService.createTenant(SocialPlatformType.WECOM, SocialAppType.INTERNAL, "app01", "wecom01",
                "{}");
        iSocialTenantBindService.addTenantBind("app01", "wecom01", userSpace.getSpaceId());
        BusinessException exception = assertThrows(BusinessException.class,
                () -> iSpaceService.checkCanOperateSpaceUpdate(userSpace.getSpaceId(),
                        SpaceUpdateOperate.ADD_TEAM));
        assertEquals(411, (int) exception.getCode());
    }

    @Test
    void checkOperateAddTeamWithWecomInternalBindAndStopÅpp() {
        MockUserSpace userSpace = createSingleUserAndSpace();
        iSocialTenantService.createTenant(SocialPlatformType.WECOM, SocialAppType.INTERNAL, "app01", "wecom01",
                "{}");
        iSocialTenantBindService.addTenantBind("app01", "wecom01", userSpace.getSpaceId());
        iSocialTenantService.updateTenantStatus("app01", "wecom01", false);
        BusinessException exception = assertThrows(BusinessException.class,
                () -> iSpaceService.checkCanOperateSpaceUpdate(userSpace.getSpaceId(),
                        SpaceUpdateOperate.ADD_TEAM));
        assertEquals(411, (int) exception.getCode());
    }

    @Test
    void checkOperateAddTeamWithDingTalkIsvBind() {
        MockUserSpace userSpace = createSingleUserAndSpace();
        iSocialTenantService.createTenant(SocialPlatformType.DINGTALK, SocialAppType.ISV, "app01", "ding01",
                "{}");
        iSocialTenantBindService.addTenantBind("app01", "ding01", userSpace.getSpaceId());
        assertDoesNotThrow(() -> iSpaceService.checkCanOperateSpaceUpdate(userSpace.getSpaceId(),
                SpaceUpdateOperate.ADD_TEAM));
    }

    @Test
    void checkOperateAddTeamWithDingTalkIsvBindAndStopÅpp() {
        MockUserSpace userSpace = createSingleUserAndSpace();
        iSocialTenantService.createTenant(SocialPlatformType.DINGTALK, SocialAppType.ISV, "app01", "ding01",
                "{}");
        iSocialTenantBindService.addTenantBind("app01", "ding01", userSpace.getSpaceId());
        iSocialTenantService.updateTenantStatus("app01", "ding01", false);
        assertDoesNotThrow(() -> iSpaceService.checkCanOperateSpaceUpdate(userSpace.getSpaceId(),
                SpaceUpdateOperate.ADD_TEAM));
    }

    @Test
    void checkOperateAddTeamWithDingTalkInternalBind() {
        MockUserSpace userSpace = createSingleUserAndSpace();
        iSocialTenantService.createTenant(SocialPlatformType.DINGTALK, SocialAppType.INTERNAL, "app01", "ding01",
                "{}");
        iSocialTenantBindService.addTenantBind("app01", "ding01", userSpace.getSpaceId());
        BusinessException exception = assertThrows(BusinessException.class,
                () -> iSpaceService.checkCanOperateSpaceUpdate(userSpace.getSpaceId(),
                        SpaceUpdateOperate.ADD_TEAM));
        assertEquals(411, (int) exception.getCode());
    }

    @Test
    void checkOperateAddTeamWithDingTalkInternalBindAndStopÅpp() {
        MockUserSpace userSpace = createSingleUserAndSpace();
        iSocialTenantService.createTenant(SocialPlatformType.DINGTALK, SocialAppType.INTERNAL, "app01", "ding01",
                "{}");
        iSocialTenantBindService.addTenantBind("app01", "ding01", userSpace.getSpaceId());
        iSocialTenantService.updateTenantStatus("app01", "ding01", false);
        BusinessException exception = assertThrows(BusinessException.class,
                () -> iSpaceService.checkCanOperateSpaceUpdate(userSpace.getSpaceId(),
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
                        () -> iSpaceService.checkCanOperateSpaceUpdate(userSpace.getSpaceId(),
                                SpaceUpdateOperate.DELETE_SPACE));
        assertEquals(411, exception.getCode());
    }

    @Test
    void checkOperateDeleteSpaceWithDingTalkIsvBindAndStopÅpp() {
        MockUserSpace userSpace = createSingleUserAndSpace();
        iSocialTenantService.createTenant(SocialPlatformType.DINGTALK, SocialAppType.ISV, "app01", "ding01",
                "{}");
        iSocialTenantBindService.addTenantBind("app01", "ding01", userSpace.getSpaceId());
        iSocialTenantService.updateTenantStatus("app01", "ding01", false);
        assertDoesNotThrow(() -> iSpaceService.checkCanOperateSpaceUpdate(userSpace.getSpaceId(),
                SpaceUpdateOperate.DELETE_SPACE));
    }

    @Test
    void checkOperateDeleteSpaceWithDingTalkInternalBind() {
        MockUserSpace userSpace = createSingleUserAndSpace();
        iSocialTenantService.createTenant(SocialPlatformType.DINGTALK, SocialAppType.INTERNAL, "app01", "ding01",
                "{}");
        iSocialTenantBindService.addTenantBind("app01", "ding01", userSpace.getSpaceId());
        BusinessException exception = assertThrows(BusinessException.class,
                () -> iSpaceService.checkCanOperateSpaceUpdate(userSpace.getSpaceId(),
                        SpaceUpdateOperate.DELETE_SPACE));
        assertEquals(411, (int) exception.getCode());
    }

    @Test
    void checkOperateDeleteSpaceDingTalkInternalBindAndStopÅpp() {
        MockUserSpace userSpace = createSingleUserAndSpace();
        iSocialTenantService.createTenant(SocialPlatformType.DINGTALK, SocialAppType.INTERNAL, "app01", "ding01",
                "{}");
        iSocialTenantBindService.addTenantBind("app01", "ding01", userSpace.getSpaceId());
        iSocialTenantService.updateTenantStatus("app01", "ding01", false);
        assertDoesNotThrow(() -> iSpaceService.checkCanOperateSpaceUpdate(userSpace.getSpaceId(),
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
                        () -> iSpaceService.checkCanOperateSpaceUpdate(userSpace.getSpaceId(),
                                SpaceUpdateOperate.DELETE_SPACE));
        assertEquals(411, exception.getCode());
    }

    @Test
    void checkOperateDeleteSpaceWithLarkBindAndStopÅpp() {
        MockUserSpace userSpace = createSingleUserAndSpace();
        iSocialTenantService.createTenant(SocialPlatformType.FEISHU, SocialAppType.ISV, "app01", "feishu01",
                "{}");
        iSocialTenantBindService.addTenantBind("app01", "feishu01", userSpace.getSpaceId());
        iSocialTenantService.updateTenantStatus("app01", "feishu01", false);
        BusinessException exception =
                assertThrows(BusinessException.class,
                        () -> iSpaceService.checkCanOperateSpaceUpdate(userSpace.getSpaceId(),
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
                () -> iSpaceService.checkCanOperateSpaceUpdate(userSpace.getSpaceId(),
                        SpaceUpdateOperate.DELETE_SPACE));
        assertEquals(411, (int) exception.getCode());
    }

    @Test
    void checkOperateDeleteSpaceLarkInternalBindAndStopÅpp() {
        MockUserSpace userSpace = createSingleUserAndSpace();
        iSocialTenantService.createTenant(SocialPlatformType.FEISHU, SocialAppType.INTERNAL, "app01", "ding01",
                "{}");
        iSocialTenantBindService.addTenantBind("app01", "ding01", userSpace.getSpaceId());
        iSocialTenantService.updateTenantStatus("app01", "ding01", false);
        assertDoesNotThrow(() -> iSpaceService.checkCanOperateSpaceUpdate(userSpace.getSpaceId(),
                SpaceUpdateOperate.DELETE_SPACE));
    }

}
