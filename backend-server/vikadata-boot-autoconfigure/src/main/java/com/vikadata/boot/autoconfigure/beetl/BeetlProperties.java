package com.vikadata.boot.autoconfigure.beetl;

import java.nio.charset.Charset;
import java.nio.charset.StandardCharsets;

import org.springframework.boot.context.properties.ConfigurationProperties;

/**
 * @author Shawn Deng
 * @date 2021-01-11 13:17:52
 */
@ConfigurationProperties(prefix = "vikadata-starter.beetl")
public class BeetlProperties {

    private Charset charset = StandardCharsets.UTF_8;

    private String classPath = "templates";

    /** 自定义模板占位起始符号，作为第二对占位符使用 */
    private String placeholderStart = "{{";

    /** 自定义模板占位结束符号 */
    private String placeholderEnd = "}}";

    public Charset getCharset() {
        return charset;
    }

    public void setCharset(Charset charset) {
        this.charset = charset;
    }

    public String getClassPath() {
        return classPath;
    }

    public void setClassPath(String classPath) {
        this.classPath = classPath;
    }

    public String getPlaceholderStart() {
        return placeholderStart;
    }

    public void setPlaceholderStart(String placeholderStart) {
        this.placeholderStart = placeholderStart;
    }

    public String getPlaceholderEnd() {
        return placeholderEnd;
    }

    public void setPlaceholderEnd(String placeholderEnd) {
        this.placeholderEnd = placeholderEnd;
    }
}
