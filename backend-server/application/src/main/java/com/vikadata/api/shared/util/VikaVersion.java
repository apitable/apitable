package com.vikadata.api.shared.util;

import java.util.Objects;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;


/**
 * vika version tool
 * @author Shawn Deng
 * @deprecated future
 */
@Deprecated
public class VikaVersion implements Comparable<VikaVersion> {

    private static final Logger logger = LoggerFactory.getLogger(VikaVersion.class);

    private static final String PREFIX = "v";

    private final int major;

    private final int minor;

    private final int patch;

    private final String build;

    private final int bugfix;

    public enum Env {

        TEST("test"),
        INTEGRATION("alpha"),
        STAGING("beta"),
        PRODUCTION("release");

        private final String env;

        Env(String env) {
            this.env = env;
        }

        public String getEnv() {
            return env;
        }

        public static Env of(String env) {
            for (Env value : Env.values()) {
                if (value.name().equalsIgnoreCase(env)) {
                    return value;
                }
            }
            return null;
        }

        public boolean isTestEnv() {
            return this == TEST;
        }

        public boolean isIntegrationEnv() {
            return this == INTEGRATION;
        }
    }

    public VikaVersion(int major, int minor, int patch, String build, int bugfix) {
        this.major = major;
        this.minor = minor;
        this.patch = patch;
        this.build = build;
        this.bugfix = bugfix;
    }

    public static boolean isSaaSEnv(String env) {
        for (Env saasEnv : Env.values()) {
            if (saasEnv.name().equalsIgnoreCase(env)) {
                return true;
            }
        }
        return false;
    }

    public static VikaVersion parseNotException(String input) {
        try {
            return parse(input);
        }
        catch (Exception e) {
            logger.error("Parse Version Error");
            return null;
        }
    }

    public static VikaVersion parse(String input) {
        if (input == null || input.length() == 0) {
            throw new IllegalArgumentException("Version must not be null or empty!");
        }

        String[] parts = input.trim().split("-");
        if (parts.length != 2) {
            throw new IllegalArgumentException("version must contain char '-'");
        }
        String[] normal = input.startsWith(PREFIX) ? parts[0].trim().substring(1).split("\\.") :
                parts[0].trim().split("\\.");
        if (normal.length != 3) {
            throw new IllegalArgumentException("normal version is illegal");
        }
        int major, minor, path;
        try {
            major = Integer.parseInt(normal[0]);
            minor = Integer.parseInt(normal[1]);
            path = Integer.parseInt(normal[2]);
        }
        catch (NumberFormatException e) {
            throw new IllegalArgumentException("normal version must contain char", e);
        }
        String[] meta = parts[1].split("\\.");
        if (meta.length <= 0) {
            throw new IllegalArgumentException("version don't contain build meta");
        }
        String build = meta[0];
        // All kinds of nonsensical build values, no way, no verification
        if (build == null || build.length() == 0) {
            throw new IllegalArgumentException("version build name is not exist");
        }
        int bugfix = meta.length > 1 ? Integer.parseInt(meta[1]) : 0;
        return new VikaVersion(major, minor, path, build, bugfix);
    }

    public boolean isVersionOfEnv(Env env) {
        return build.equals(env.getEnv());
    }

    public boolean isFeatureVersion() {
        return "feature".equals(build);
    }

    public boolean isReleaseVersion() {
        return build != null && build.equals(Env.PRODUCTION.getEnv());
    }

    public String getBuildMetaVersion() {
        return String.format("%s.%d", build, bugfix);
    }

    public boolean isGreaterThan(VikaVersion version) {
        return compareTo(version) > 0;
    }

    public boolean isGreaterThanOrEqualTo(VikaVersion version) {
        return compareTo(version) >= 0;
    }

    public boolean is(VikaVersion version) {
        return equals(version);
    }

    public boolean isLessThan(VikaVersion version) {
        return compareTo(version) < 0;
    }

    public boolean isLessThanOrEqualTo(VikaVersion version) {
        return compareTo(version) <= 0;
    }

    public int getMajor() {
        return major;
    }

    public int getMinor() {
        return minor;
    }

    public int getPatch() {
        return patch;
    }

    public String getBuild() {
        return build;
    }

    public int getBugfix() {
        return bugfix;
    }

    @Override
    public int compareTo(VikaVersion that) {
        int result = major - that.major;
        if (result == 0) {
            result = minor - that.minor;
            if (result == 0) {
                result = patch - that.patch;
            }
        }
        if (result == 0) {
            // compare build meta
            if (build != null && that.build != null) {
                result = build.compareTo(that.build);
                if (result == 0) {
                    result = bugfix - that.bugfix;
                }
            }
        }
        return result;
    }

    @Override
    public boolean equals(Object other) {
        if (this == other) {
            return true;
        }
        if (!(other instanceof VikaVersion)) {
            return false;
        }
        return compareTo((VikaVersion) other) == 0;
    }


    @Override
    public int hashCode() {
        return Objects.hash(major, minor, patch, build, bugfix);
    }

    @Override
    public String toString() {
        StringBuilder sb = new StringBuilder(String.format("v%d.%d.%d", major, minor, patch));
        if (build != null && !"".equals(build)) {
            sb.append("-").append(build);
        }
        if (bugfix != 0) {
            sb.append(".").append(bugfix);
        }
        return sb.toString();
    }
}
