package com.apitable.starter.idaas.core.api;

import java.io.InputStream;

/**
 * Test file tool class
 */
public class FileHelper {

    /**
     * Get ClassPath resource file stream
     *
     * @param resourcePath Relative path under ClassPath
     * @return InputStream
     */
    public static InputStream getInputStreamFromResource(String resourcePath) {
        ClassLoader classLoader = FileHelper.class.getClassLoader();
        return classLoader.getResourceAsStream(resourcePath);
    }
}
