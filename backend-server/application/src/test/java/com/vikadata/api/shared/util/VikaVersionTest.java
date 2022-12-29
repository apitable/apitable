package com.vikadata.api.shared.util;

import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

/**
 * version handling tool test
 */
public class VikaVersionTest {

    @Test
    public void testSaasEnv() {
        boolean isSaas1 = VikaVersion.isSaaSEnv("integration");
        Assertions.assertThat(isSaas1).isTrue();

        boolean isSaas2 = VikaVersion.isSaaSEnv("unknown");
        Assertions.assertThat(isSaas2).isFalse();
    }

    @Test
    public void testParseNullValue() {
        assertThrows(IllegalArgumentException.class, () -> VikaVersion.parse(null));
    }

    @Test
    public void testParseWithoutPrefix() {
        String versionName = "0.7.6-feature.30405";
        VikaVersion version = VikaVersion.parse(versionName);
        assertEquals(version.getMajor(), 0);
        assertEquals(version.getMinor(), 7);
        assertEquals(version.getPatch(), 6);
        assertEquals(version.getBuild(), "feature");
        assertEquals(version.getBugfix(), 30405);
    }

    @Test
    public void testParseReleaseVersion() {
        String versionName = "v0.12.1-release.3";
        VikaVersion version = VikaVersion.parse(versionName);
        assertNotNull(version);
        assertTrue(version.isReleaseVersion());
        assertEquals(version.toString(), versionName);
    }

    @Test
    public void testParseAlphaVersion() {
        String versionName = "v0.12.1-alpha.3";
        VikaVersion version = VikaVersion.parse(versionName);
        assertNotNull(version);
        assertEquals(version.toString(), versionName);
    }

    @Test
    public void testParseBetaVersion() {
        String versionName = "v0.12.1-beta.3";
        VikaVersion version = VikaVersion.parse(versionName);
        assertNotNull(version);
        assertEquals(version.toString(), versionName);
    }

    @Test
    public void testParseFeatureVersion() {
        String versionName = "v0.12.1-feature.3123";
        VikaVersion version = VikaVersion.parse(versionName);
        assertNotNull(version);
        assertEquals(version.toString(), versionName);
        assertTrue(version.isFeatureVersion());
    }

    @Test
    public void testParseIncorrectVersion() {
        assertThrows(Exception.class, () -> {
            VikaVersion.parse("0");
            VikaVersion.parse("0.1");
            VikaVersion.parse("0.1.2");
            VikaVersion.parse("0.1.3-no");
            VikaVersion.parse("0.1.3-no+1");
        });
    }

    @Test
    public void testParseIncorrectVersionNotException() {
        String incorrectVersionName = "0.1";
        VikaVersion version = VikaVersion.parseNotException(incorrectVersionName);
        assertNull(version);
    }

    @Test
    public void testVersionIsEqual() {
        String versionName = "v0.12.1-release.3";
        VikaVersion version = VikaVersion.parse(versionName);
        VikaVersion expectVersion = new VikaVersion(0, 12, 1, "release", 3);
        Assertions.assertThat(expectVersion).isEqualTo(version);
    }

    @Test
    public void testVersionIsGreaterThanWithNormalVersion() {
        String versionName1 = "v0.12.1-release.3";
        String versionName2 = "v0.12.2-release.3";
        VikaVersion version1 = VikaVersion.parse(versionName1);
        VikaVersion version2 = VikaVersion.parse(versionName2);
        assertTrue(version2.isGreaterThan(version1));
    }

    @Test
    public void testVersionIsGreaterThanOnSomeNormalVersionWithBuildMetaVersion() {
        String versionName1 = "v0.12.1-release.3";
        String versionName2 = "v0.12.2-release.3";
        VikaVersion version1 = VikaVersion.parse(versionName1);
        VikaVersion version2 = VikaVersion.parse(versionName2);
        assertTrue(version2.isGreaterThan(version1));
    }

    @Test
    public void testVersionIsGreaterThanOrEqual() {
        String versionName1 = "v0.12.1-release.3";
        String versionName2 = "v0.12.1-release.3";
        VikaVersion version1 = VikaVersion.parse(versionName1);
        VikaVersion version2 = VikaVersion.parse(versionName2);
        assertTrue(version2.isGreaterThanOrEqualTo(version1));
    }

    @Test
    public void testVersionIsLessThan() {
        String versionName1 = "v0.12.1-release.3";
        String versionName2 = "v0.12.2-release.5";
        VikaVersion version1 = VikaVersion.parse(versionName1);
        VikaVersion version2 = VikaVersion.parse(versionName2);
        assertTrue(version1.isLessThan(version2));
    }

    @Test
    public void testVersionIsLessThanOrEqual() {
        String versionName1 = "v0.12.1-release.3";
        String versionName2 = "v0.12.1-release.3";
        VikaVersion version1 = VikaVersion.parse(versionName1);
        VikaVersion version2 = VikaVersion.parse(versionName2);
        assertTrue(version2.isLessThanOrEqualTo(version1));
    }
}
