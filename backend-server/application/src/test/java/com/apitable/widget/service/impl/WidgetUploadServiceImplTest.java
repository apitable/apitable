package com.apitable.widget.service.impl;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.doReturn;

import cn.hutool.core.util.RandomUtil;
import com.apitable.AbstractIntegrationTest;
import com.apitable.base.model.WidgetAssetUploadCertificateRO;
import com.apitable.base.model.WidgetUploadTokenVo;
import com.apitable.shared.util.IdUtil;
import com.apitable.starter.oss.core.OssUploadAuth;
import com.apitable.user.entity.UserEntity;
import com.apitable.widget.entity.WidgetPackageEntity;
import com.apitable.widget.enums.WidgetPackageStatus;
import com.apitable.widget.enums.WidgetPackageType;
import com.apitable.widget.enums.WidgetReleaseType;
import com.apitable.widget.ro.WidgetPackageBaseRo.I18nField;
import com.fasterxml.jackson.core.JsonProcessingException;
import java.util.Collections;
import java.util.List;
import org.junit.jupiter.api.Test;

public class WidgetUploadServiceImplTest extends AbstractIntegrationTest {

    @Test
    public void testCreateWidgetAssetsUploadAuth() {
        UserEntity testUser = getTestUser();
        WidgetPackageEntity widgetPackage;
        try {
            widgetPackage = initWidget(testUser);
        } catch (JsonProcessingException e) {
            throw new RuntimeException(e);
        }

        Long opUserId = testUser.getId();
        String packageId = widgetPackage.getPackageId();
        WidgetAssetUploadCertificateRO ro = new WidgetAssetUploadCertificateRO();
        ro.setFileType(0);
        ro.setFilenames(Collections.singletonList("test.jpg"));

        OssUploadAuth ossUploadAuth = new OssUploadAuth();
        ossUploadAuth.setUploadUrl(RandomUtil.randomString(10));

        doReturn(ossUploadAuth).when(ossTemplate).uploadToken(anyString(), anyString(), anyLong());

        List<WidgetUploadTokenVo> result =
            iWidgetUploadService.createWidgetAssetPreSignedUrl(opUserId, packageId, ro);

        assertThat(result).isNotEmpty();
        assertThat(result).extracting(WidgetUploadTokenVo::getUploadUrl).isNotEmpty();
    }

    private UserEntity getTestUser() {
        return iUserService.createUserByEmail("test@aitable.ai");
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
