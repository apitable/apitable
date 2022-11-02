package com.vikadata.api;

import java.io.InputStream;

public class FileHelper {

    /**
     * Get Class Path resource file stream
     * @param resourcePath relative path under class path
     * @return InputStream
     */
    public static InputStream getInputStreamFromResource(String resourcePath) {
        ClassLoader classLoader = FileHelper.class.getClassLoader();
        return classLoader.getResourceAsStream(resourcePath);
    }
}
