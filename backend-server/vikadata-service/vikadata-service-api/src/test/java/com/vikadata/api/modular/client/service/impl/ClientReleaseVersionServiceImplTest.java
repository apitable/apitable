package com.vikadata.api.modular.client.service.impl;

import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Base64;

import cn.hutool.core.util.StrUtil;
import org.assertj.core.util.Lists;
import org.assertj.core.util.Strings;
import org.junit.jupiter.api.Test;

import com.vikadata.api.AbstractIntegrationTest;
import com.vikadata.api.config.properties.ClientProperties;
import com.vikadata.api.model.ro.client.ClientBuildRo;
import com.vikadata.api.modular.client.service.IClientReleaseVersionService;
import com.vikadata.api.util.VikaVersion;
import com.vikadata.entity.ClientReleaseVersionEntity;

import org.springframework.beans.factory.annotation.Autowired;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * 客户端版本服务类测试
 */
public class ClientReleaseVersionServiceImplTest extends AbstractIntegrationTest {

    @Test
    public void testCreateClientVersionWithFeatureVersionOnIntegration(@Autowired ClientProperties clientProperties) {
        clientProperties.getDatasheet().setEnv("integration");
        clientProperties.getDatasheet().getPublish().setAuthUser(Lists.list("dengguiheng@vikadata.com"));

        ClientBuildRo clientBuildRo = new ClientBuildRo();
        clientBuildRo.setVersion("0.7.6-feature.12345");
        clientBuildRo.setDescription("some description");
        clientBuildRo.setHtmlContent(exampleEncodeHtmlContent());
        clientBuildRo.setPublishUser("dengguiheng@vikadata.com");

        iClientReleaseVersionService.createClientVersion(clientBuildRo);

        // 改变环境配置会影响当前测试类的其他单元测试方法，需要设置回去
        clientProperties.getDatasheet().setEnv(null);
    }

    @Test
    public void testCreateClientVersionWithAlphaVersionOnIntegration(@Autowired ClientProperties clientProperties) {
        clientProperties.getDatasheet().setEnv("integration");
        clientProperties.getDatasheet().getPublish().setAuthUser(Lists.list("dengguiheng@vikadata.com"));

        ClientBuildRo clientBuildRo = new ClientBuildRo();
        clientBuildRo.setVersion("0.7.6-alpha.12345");
        clientBuildRo.setDescription("some description");
        clientBuildRo.setHtmlContent(exampleEncodeHtmlContent());
        clientBuildRo.setPublishUser("dengguiheng@vikadata.com");

        iClientReleaseVersionService.createClientVersion(clientBuildRo);
        // 改变环境配置会影响当前测试类的其他单元测试方法，需要设置回去
        clientProperties.getDatasheet().setEnv(null);
    }

    @Test
    public void testCreateClientVersionWithBetaVersionOnStaging(@Autowired ClientProperties clientProperties) {
        clientProperties.getDatasheet().setEnv("staging");
        clientProperties.getDatasheet().getPublish().setAuthUser(Lists.list("dengguiheng@vikadata.com"));

        ClientBuildRo clientBuildRo = new ClientBuildRo();
        clientBuildRo.setVersion("0.7.6-beta.12345");
        clientBuildRo.setDescription("some description");
        clientBuildRo.setHtmlContent(exampleEncodeHtmlContent());
        clientBuildRo.setPublishUser("dengguiheng@vikadata.com");

        iClientReleaseVersionService.createClientVersion(clientBuildRo);

        // 改变环境配置会影响当前测试类的其他单元测试方法，需要设置回去
        clientProperties.getDatasheet().setEnv(null);
    }

    @Test
    public void testCreateClientVersionWithReleaseVersionWithoutHotfixOnProduction(@Autowired ClientProperties clientProperties) {
        clientProperties.getDatasheet().setEnv("production");
        clientProperties.getDatasheet().getPublish().setAuthUser(Lists.list("dengguiheng@vikadata.com"));

        ClientBuildRo clientBuildRo = new ClientBuildRo();
        clientBuildRo.setVersion("0.7.6-release");
        clientBuildRo.setDescription("some description");
        clientBuildRo.setHtmlContent(exampleEncodeHtmlContent());
        clientBuildRo.setPublishUser("dengguiheng@vikadata.com");

        iClientReleaseVersionService.createClientVersion(clientBuildRo);

        // 改变环境配置会影响当前测试类的其他单元测试方法，需要设置回去
        clientProperties.getDatasheet().setEnv(null);
    }

    @Test
    public void testCreateClientVersionWithReleaseHotfixVersionOnProduction(@Autowired ClientProperties clientProperties) {
        clientProperties.getDatasheet().setEnv("production");
        clientProperties.getDatasheet().getPublish().setAuthUser(Lists.list("dengguiheng@vikadata.com"));

        ClientBuildRo clientBuildRo = new ClientBuildRo();
        clientBuildRo.setVersion("0.7.6-release.2");
        clientBuildRo.setDescription("some description");
        clientBuildRo.setHtmlContent(exampleEncodeHtmlContent());
        clientBuildRo.setPublishUser("dengguiheng@vikadata.com");

        iClientReleaseVersionService.createClientVersion(clientBuildRo);

        // 改变环境配置会影响当前测试类的其他单元测试方法，需要设置回去
        clientProperties.getDatasheet().setEnv(null);
    }

    @Test
    public void testGetLatestVersionOnTest(@Autowired ClientProperties clientProperties) {
        // 加入客户端配置的env为integration
        clientProperties.getDatasheet().setEnv("test");

        VikaVersion version1 = new VikaVersion(0, 12, 3, "test", 10);
        VikaVersion version2 = new VikaVersion(0, 12, 4, "test", 33);
        // 依次插入版本号
        prepareVersion(version1.toString());
        prepareVersion(version2.toString());
        // 最后插入多个feature版本
        prepareVersion("feature.18203");
        prepareVersion("feature.19201");

        String latestVersion = iClientReleaseVersionService.getLatestVersion();
        assertThat(latestVersion).isEqualTo(version2.toString());

        // 改变环境配置会影响当前测试类的其他单元测试方法，需要设置回去
        clientProperties.getDatasheet().setEnv(null);
    }

    @Test
    public void testGetLatestVersionOnIntegration(@Autowired ClientProperties clientProperties) {
        // 加入客户端配置的env为integration
        clientProperties.getDatasheet().setEnv("integration");

        VikaVersion version1 = new VikaVersion(0, 12, 3, "alpha", 10);
        VikaVersion version2 = new VikaVersion(0, 12, 4, "alpha", 33);
        // 依次插入版本号
        prepareVersion(version1.toString());
        prepareVersion(version2.toString());
        // 最后插入多个feature版本
        prepareVersion("feature.18203");
        prepareVersion("feature.19201");

        String latestVersion = iClientReleaseVersionService.getLatestVersion();
        assertThat(latestVersion).isEqualTo(version2.toString());

        // 改变环境配置会影响当前测试类的其他单元测试方法，需要设置回去
        clientProperties.getDatasheet().setEnv(null);
    }

    @Test
    public void testGetLatestVersionOnStaging(@Autowired ClientProperties clientProperties) {
        // 加入客户端配置的env为integration
        clientProperties.getDatasheet().setEnv("staging");

        // 第一个beta版本
        VikaVersion version1 = new VikaVersion(0, 12, 3, "beta", 111);
        VikaVersion version2 = new VikaVersion(0, 12, 3, "release", 1);
        VikaVersion version3 = new VikaVersion(0, 12, 3, "beta", 222);
        // 依次插入版本号
        prepareVersion(version1.toString());
        prepareVersion(version2.toString());
        prepareVersion(version3.toString());
        // 最后插入多个feature版本
        prepareVersion("feature.18203");
        prepareVersion("feature.19201");
        // 在Staging环境，最终的版本是beta.222
        String latestVersion = iClientReleaseVersionService.getLatestVersion();
        assertThat(latestVersion).isEqualTo(version3.toString());

        // 改变环境配置会影响当前测试类的其他单元测试方法，需要设置回去
        clientProperties.getDatasheet().setEnv(null);
    }

    @Test
    public void testGetLatestVersionOnProduction(@Autowired ClientProperties clientProperties) {
        // 加入客户端配置的env为integration
        clientProperties.getDatasheet().setEnv("production");

        VikaVersion version1 = new VikaVersion(0, 12, 3, "beta", 123);
        VikaVersion version2 = new VikaVersion(0, 12, 3, "release", 0);
        VikaVersion version3 = new VikaVersion(0, 12, 3, "release", 1);
        VikaVersion version4 = new VikaVersion(0, 12, 3, "release", 2);
        VikaVersion version5 = new VikaVersion(0, 12, 3, "beta", 456);
        // 依次插入版本号
        prepareVersion(version1.toString());
        prepareVersion(version2.toString());
        prepareVersion(version3.toString());
        prepareVersion(version4.toString());
        prepareVersion(version5.toString());
        // 最后插入多个feature版本
        prepareVersion("feature.18203");
        prepareVersion("feature.19201");

        String latestVersion = iClientReleaseVersionService.getLatestVersion();
        // 在Production环境，最终的版本是release.2
        assertThat(latestVersion).isEqualTo(version4.toString());

        // 改变环境配置会影响当前测试类的其他单元测试方法，需要设置回去
        clientProperties.getDatasheet().setEnv(null);
    }

    @Test
    public void testGetLatestVersionOnAnyOtherEnv() {
        // 依次插入版本号
        String version1 = Strings.concat("v0.0.8-release.staging-1111-",
                LocalDateTime.of(22, 1, 10, 8, 30)
                        .atZone(ZoneId.systemDefault()).toInstant().toEpochMilli());
        prepareVersion(version1);
        String version2 = Strings.concat("v0.0.8-release.staging-2222-",
                LocalDateTime.of(22, 2, 10, 8, 30)
                        .atZone(ZoneId.systemDefault()).toInstant().toEpochMilli());
        prepareVersion(version2);
        String version3 = Strings.concat("v0.0.8-release.staging-3333-",
                LocalDateTime.of(22, 3, 10, 8, 30)
                        .atZone(ZoneId.systemDefault()).toInstant().toEpochMilli());
        prepareVersion(version3);

        String latestVersion = iClientReleaseVersionService.getLatestVersion();
        // 最终版本是 version3
        assertThat(latestVersion).isEqualTo(version3);
    }

    private String exampleEncodeHtmlContent() {
        String sourceHtmlContent = "<html></html>";
        return Base64.getEncoder().encodeToString(sourceHtmlContent.getBytes(StandardCharsets.UTF_8));
    }

    private void prepareVersion(String version) {
        ClientReleaseVersionEntity entity = ClientReleaseVersionEntity.builder()
                .version(version)
                .description(StrUtil.sub("some description", 0, 255))
                .htmlContent("<html></html>")
                .publishUser("a user")
                .build();
        iClientReleaseVersionService.save(entity);
    }

    /**
     * Test get html content from machine memory
     * condition: having version html content
     */
    @Test
    public void testGetHtmlContentCacheIfAbsent() {
        // prepare cache html content in memory
        VikaVersion version = new VikaVersion(0, 12, 3, "alpha", 10);
        prepareVersion(version.toString());
        String versionName = version.toString();
        String htmlContent = iClientReleaseVersionService.getHtmlContentCacheIfAbsent(versionName);
        assertThat(htmlContent).isNotBlank();
    }
}
