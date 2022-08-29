package com.vikadata.api.util;

import cn.hutool.core.io.IoUtil;
import cn.hutool.core.io.LineHandler;

import java.io.InputStream;
import java.nio.charset.StandardCharsets;

/**
 * <p>
 * 字节流工具
 * </p>
 *
 * @author Shawn Deng
 * @date 2020/1/13 19:20
 */
public class BufferTool {

    /**
     * 读取流并且换行
     */
    public static String addNewline(InputStream inputStream) {
        StringBuilder desc = new StringBuilder();
        IoUtil.readLines(inputStream, StandardCharsets.UTF_8, (LineHandler) line -> desc.append(line).append("\n"));
        return desc.toString();
    }
}
