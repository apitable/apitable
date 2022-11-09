package com.apitable.starter.oss.autoconfigure;

abstract class OssConnectionConfiguration {

    private final OssProperties properties;

    protected OssConnectionConfiguration(OssProperties properties) {
        this.properties = properties;
    }

    protected final OssProperties getProperties() {
        return this.properties;
    }
}
