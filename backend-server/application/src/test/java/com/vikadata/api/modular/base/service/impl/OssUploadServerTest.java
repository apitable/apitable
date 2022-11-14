package com.vikadata.api.modular.base.service.impl;

import lombok.SneakyThrows;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;

import com.vikadata.api.AbstractIntegrationTest;
import com.vikadata.api.enterprise.widget.enums.WidgetPackageStatus;
import com.vikadata.api.enterprise.widget.enums.WidgetPackageType;
import com.vikadata.api.enterprise.widget.enums.WidgetReleaseType;
import com.vikadata.api.asset.ro.AssetUploadTokenRo;
import com.vikadata.api.enterprise.widget.ro.WidgetPackageBaseRo.I18nField;
import com.vikadata.api.asset.vo.AssetUploadTokenVo;
import com.vikadata.api.asset.service.IAssetUploadTokenService;
import com.vikadata.api.user.service.IUserService;
import com.vikadata.api.enterprise.widget.service.IWidgetPackageService;
import com.vikadata.api.shared.util.IdUtil;
import com.vikadata.api.user.entity.UserEntity;
import com.vikadata.entity.WidgetPackageEntity;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultHandlers;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;

import static org.assertj.core.api.Assertions.assertThat;

public class OssUploadServerTest extends AbstractIntegrationTest {

    @Autowired
    private IAssetUploadTokenService iAssetUploadTokenService;

    @Autowired
    private IWidgetPackageService iWidgetPackageService;

    @Autowired
    private IUserService iUserService;

    @Autowired
    private MockMvc mockMvc;

    private final static String callBackJson = "{\n"
            + "    \"ext\":\".png\",\n"
            + "    \"imageWidth\":\"64\",\n"
            + "    \"fname\":\"image.png\",\n"
            + "    \"uploadSource\":0,\n"
            + "    \"uploadDeveloperAssetId\":1514140107337134081,\n"
            + "    \"mimeType\":\"image/png\",\n"
            + "    \"suffix\":\".png\",\n"
            + "    \"uploadAssetId\":1514140107169361922,\n"
            + "    \"imageHeight\":\"64\",\n"
            + "    \"bucket\":\"vk-public-assets-ltd\",\n"
            + "    \"uploadUserId\":1506556359125004289,\n"
            + "    \"spaceId\":\"spc123456\",\n"
            + "    \"fsize\":\"1123\",\n"
            + "    \"nodeId\":\"wpk1w3eEFBR5Z\",\n"
            + "    \"key\":\"widget/wpk1w3eEFBR5Z/image.png\",\n"
            + "    \"hash\":\"Fk4-P8ygCfgH1NzoPZSFom-2Nf7W\"\n"
            + "}";

    @Test
    public void testCreateWidgetAssetsUploadAuth() {
        UserEntity testUser = getTestUser();
        WidgetPackageEntity widgetPackage = initWidget(testUser);

        Long opUserId = testUser.getId();
        String nodeId = widgetPackage.getPackageId();
        AssetUploadTokenRo assetUploadTokenRo = new AssetUploadTokenRo();
        assetUploadTokenRo.setPrefixalScope(0);
        assetUploadTokenRo.setAssetsKey("test.jpg");

        AssetUploadTokenVo widgetAssetsUploadAuth = iAssetUploadTokenService.createWidgetAssetsUploadToken(opUserId, nodeId, assetUploadTokenRo);

        assertThat(widgetAssetsUploadAuth).isNotNull();
        assertThat(widgetAssetsUploadAuth.getUploadToken()).isNotNull();
    }

    @Test
    @Disabled("no assert")
    public void testAssetQiniuUploadCallback() throws Exception {
        mockMvc.perform(MockMvcRequestBuilders.post("/api/v1/asset/qiniu/uploadCallback")
                .contextPath("/api/v1")
                .servletPath("/asset/qiniu/uploadCallback")
                .contentType(MediaType.APPLICATION_JSON)
                .content(callBackJson)
                .header("Authorization", "QBox B7OyF1ZORX4iHaqJ5uN62qXAgoDnc7Jv7_zf1SpJ:6GPYOEhFns8hXHHpJYIMyJ4bEcY=")
        )
                .andDo(MockMvcResultHandlers.print())
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.jsonPath("$.code").value("200"))
                .andReturn();
        // .getResponse().setCharacterEncoding("UTF-8")
    }

    private UserEntity getTestUser() {
        return iUserService.createUserByEmail("test@vikadata.com");
    }

    @SneakyThrows
    private WidgetPackageEntity initWidget(UserEntity testOpUser) {
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
