package com.vikadata.boot.autoconfigure.oss;

/**
 * @author Shawn Deng
 * @date 2021-01-05 11:30:17
 */
abstract class OssConnectionConfiguration {

    private final OssProperties properties;

    protected OssConnectionConfiguration(OssProperties properties) {
        this.properties = properties;
    }

    protected final OssProperties getProperties() {
        return this.properties;
    }
}
