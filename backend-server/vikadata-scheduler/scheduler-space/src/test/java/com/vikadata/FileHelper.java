package com.vikadata;

import java.io.InputStream;

/**
 * File Helper
 */
public class FileHelper {

    /**
     * Get ClassPath resource file stream
     */
    public static InputStream getInputStreamFromResource(String resourcePath) {
        ClassLoader classLoader = FileHelper.class.getClassLoader();
        return classLoader.getResourceAsStream(resourcePath);
    }
}
