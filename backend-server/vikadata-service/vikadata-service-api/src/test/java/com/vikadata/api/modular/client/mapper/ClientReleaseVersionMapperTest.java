package com.vikadata.api.modular.client.mapper;

import com.baomidou.mybatisplus.extension.toolkit.SqlHelper;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;

import com.vikadata.api.AbstractMyBatisMapperTest;
import com.vikadata.api.model.dto.client.ClientEntryDetailDto;
import com.vikadata.api.util.VikaVersion;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.jdbc.Sql;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * <p>
 * 数据访问层测试：客户端版本表测试
 * <p>
 *
 * @author liuzijing
 * @date 2022/2/18 10:28 AM
 */
class ClientReleaseVersionMapperTest extends AbstractMyBatisMapperTest {

    @Autowired
    private ClientReleaseVersionMapper clientReleaseVersionMapper;

    @Test
    @Sql("/testdata/client-version-data.sql")
    void testSelectClientEntryDetailByVersion() {
        // 版本字符串规范跟git tag保持一致
        String selectReleaseVersion = "v0.12.2-release.2";
        ClientEntryDetailDto clientEntryDetailDto = clientReleaseVersionMapper.selectClientEntryDetailByVersion(selectReleaseVersion);
        assertThat(clientEntryDetailDto).isNotNull()
                .hasFieldOrPropertyWithValue("version", selectReleaseVersion);
    }

    @Test
    @Sql("/testdata/client-version-data.sql")
    void testSelectClientEntryDetailByErrorVersion() {
        // 版本字符串规范跟git tag保持一致
        String selectReleaseVersion = "0.12.3";
        ClientEntryDetailDto clientEntryDetailDto = clientReleaseVersionMapper.selectClientEntryDetailByVersion(selectReleaseVersion);
        assertThat(clientEntryDetailDto).isNull();
    }

    @Test
    @Sql("/testdata/client-version-data.sql")
    void testSelectClientEntryDetailByPipelineId() {
        // 非生产环境存储PipelineId
        VikaVersion selectPipelineVersion = new VikaVersion(0, 0, 0, "feature", 7446);
        ClientEntryDetailDto clientEntryDetailDto = clientReleaseVersionMapper.selectClientEntryDetailByVersion(selectPipelineVersion.getBuildMetaVersion());
        assertThat(clientEntryDetailDto).isNotNull()
                .hasFieldOrPropertyWithValue("version", selectPipelineVersion.getBuildMetaVersion());
    }

    @Test
    @Sql("/testdata/client-version-data.sql")
    void testSelectClientLatestVersion() {
        long count = SqlHelper.retCount(clientReleaseVersionMapper.selectTotalCount());
        for (long i = 0; i < count; i++) {
            String versionName = clientReleaseVersionMapper.selectClientLatestVersionByOffset(i);
            VikaVersion version = VikaVersion.parseNotException(versionName);
            if (version != null && version.isReleaseVersion()) {
                Assertions.assertEquals(version.toString(), "v0.12.3-release.3");
                break;
            }
        }
    }
}