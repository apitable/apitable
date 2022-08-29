package com.vikadata.integration.idaas.api;

import java.io.InputStream;

/**
 * 测试文件工具类
 * @author Shawn Deng
 * @date 2022-03-25 12:13:14
 */
public class FileHelper {

    /**
     * 获取ClassPath资源文件流
     * @param resourcePath ClassPath下的相对路径
     * @return InputStream
     */
    public static InputStream getInputStreamFromResource(String resourcePath) {
        ClassLoader classLoader = FileHelper.class.getClassLoader();
        return classLoader.getResourceAsStream(resourcePath);
    }
}
