package com.vikadata.api.enterprise.widget.service.impl;

import com.fasterxml.jackson.core.JsonProcessingException;
import org.junit.jupiter.api.Test;

import com.vikadata.api.asset.ro.AssetUploadTokenRo;
import com.vikadata.api.asset.vo.AssetUploadTokenVo;
import com.vikadata.api.enterprise.AbstractEnterpriseIntegrationTest;
import com.vikadata.api.enterprise.widget.enums.WidgetPackageStatus;
import com.vikadata.api.enterprise.widget.enums.WidgetPackageType;
import com.vikadata.api.enterprise.widget.enums.WidgetReleaseType;
import com.vikadata.api.enterprise.widget.ro.WidgetPackageBaseRo.I18nField;
import com.vikadata.api.shared.util.IdUtil;
import com.vikadata.api.user.entity.UserEntity;
import com.vikadata.entity.WidgetPackageEntity;

import static org.assertj.core.api.Assertions.assertThat;

public class WidgetUploadServiceImplTest extends AbstractEnterpriseIntegrationTest {

    @Test
    public void testCreateWidgetAssetsUploadAuth() {
        UserEntity testUser = getTestUser();
        WidgetPackageEntity widgetPackage;
        try {
            widgetPackage = initWidget(testUser);
        }
        catch (JsonProcessingException e) {
            throw new RuntimeException(e);
        }

        Long opUserId = testUser.getId();
        String nodeId = widgetPackage.getPackageId();
        AssetUploadTokenRo assetUploadTokenRo = new AssetUploadTokenRo();
        assetUploadTokenRo.setPrefixalScope(0);
        assetUploadTokenRo.setAssetsKey("test.jpg");

        AssetUploadTokenVo widgetAssetsUploadAuth = iWidgetUploadService.createWidgetAssetsUploadToken(opUserId, nodeId, assetUploadTokenRo);

        assertThat(widgetAssetsUploadAuth).isNotNull();
        assertThat(widgetAssetsUploadAuth.getUploadToken()).isNotNull();
    }

    private UserEntity getTestUser() {
        return iUserService.createUserByEmail("test@vikadata.com");
    }

    private WidgetPackageEntity initWidget(UserEntity testOpUser) throws JsonProcessingException {
        I18nField i18nName = new I18nField();
        i18nName.setZhCN("Single test applet");
        i18nName.setEnUS("single_test_applet");

        WidgetPackageEntity widgetPack = new WidgetPackageEntity()
                .setPackageId(IdUtil.createWidgetPackageId())
                .setI18nName(i18nName.toJson())
                .setPackageType(WidgetPackageType.THIRD_PARTY.getValue())
                .setReleaseType(WidgetReleaseType.GLOBAL.getValue())
                // The space station applet takes effect by default, and the global applet does not take effect by default
                .setIsEnabled(true)
                .setIsTemplate(false)
                .setStatus(WidgetPackageStatus.DEVELOP.getValue())
                .setSandbox(true)
                .setOwner(testOpUser.getId());
        iWidgetPackageService.save(widgetPack);
        return widgetPack;
    }
}
