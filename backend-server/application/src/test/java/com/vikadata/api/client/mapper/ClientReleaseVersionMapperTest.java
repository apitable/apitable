package com.vikadata.api.client.mapper;

import com.baomidou.mybatisplus.extension.toolkit.SqlHelper;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;

import com.vikadata.api.AbstractMyBatisMapperTest;
import com.vikadata.api.client.dto.ClientEntryDetailDto;
import com.vikadata.api.client.mapper.ClientReleaseVersionMapper;
import com.vikadata.api.shared.util.VikaVersion;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.jdbc.Sql;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * <p>
 * Data access layer test: client version table test
 * <p>
 */
class ClientReleaseVersionMapperTest extends AbstractMyBatisMapperTest {

    @Autowired
    private ClientReleaseVersionMapper clientReleaseVersionMapper;

    @Test
    @Sql("/sql/client-version-data.sql")
    void testSelectClientEntryDetailByVersion() {
        // The version string specification is consistent with the git tag
        String selectReleaseVersion = "v0.12.2-release.2";
        ClientEntryDetailDto clientEntryDetailDto = clientReleaseVersionMapper.selectClientEntryDetailByVersion(selectReleaseVersion);
        assertThat(clientEntryDetailDto).isNotNull()
                .hasFieldOrPropertyWithValue("version", selectReleaseVersion);
    }

    @Test
    @Sql("/sql/client-version-data.sql")
    void testSelectClientEntryDetailByErrorVersion() {
        // The version string specification is consistent with the git tag
        String selectReleaseVersion = "0.12.3";
        ClientEntryDetailDto clientEntryDetailDto = clientReleaseVersionMapper.selectClientEntryDetailByVersion(selectReleaseVersion);
        assertThat(clientEntryDetailDto).isNull();
    }

    @Test
    @Sql("/sql/client-version-data.sql")
    void testSelectClientEntryDetailByPipelineId() {
        // Non production environment storage pipeline Id
        VikaVersion selectPipelineVersion = new VikaVersion(0, 0, 0, "feature", 7446);
        ClientEntryDetailDto clientEntryDetailDto = clientReleaseVersionMapper.selectClientEntryDetailByVersion(selectPipelineVersion.getBuildMetaVersion());
        assertThat(clientEntryDetailDto).isNotNull()
                .hasFieldOrPropertyWithValue("version", selectPipelineVersion.getBuildMetaVersion());
    }

    @Test
    @Sql("/sql/client-version-data.sql")
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