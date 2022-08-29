package com.vikadata.boot.autoconfigure.social;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.Writer;
import java.nio.CharBuffer;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.http.MediaType;

/**
 * Servlet 工具
 * @author Shawn Deng
 * @date 2022-02-08 11:28:06
 */
public class ServletUtil {

    private static final Logger LOG = LoggerFactory.getLogger(ServletUtil.class);

    public static String getRequestBody(HttpServletRequest request) {
        try {
            return getRequestBody(request.getReader());
        }
        catch (IOException e) {
            // 不需要处理这种问题
            LOG.error("事件回调读取HttpServletRequest失败", e);
            return null;
        }
    }

    public static String getRequestBody(BufferedReader reader) {
        final StringBuilder builder = new StringBuilder();
        // 默认缓存大小 8192
        final CharBuffer buffer = CharBuffer.allocate(2 << 12);
        try {
            while (-1 != reader.read(buffer)) {
                builder.append(buffer.flip());
            }
        }
        catch (IOException e) {
            throw new RuntimeException(e);
        }
        return builder.toString();
    }

    public static void toResponseData(HttpServletResponse response, String responseText) {
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        try (Writer writer = response.getWriter()) {
            writer.write(responseText);
            writer.flush();
        }
        catch (IOException e) {
            throw new RuntimeException(e);
        }
    }
}
