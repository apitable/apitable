package com.apitable.starter.autoconfigure.beetl;

import java.nio.charset.Charset;
import java.nio.charset.StandardCharsets;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "vikadata-starter.beetl")
public class BeetlProperties {

    private Charset charset = StandardCharsets.UTF_8;

    private String classPath = "templates";

    /**
     * Customized template placeholder starting symbol, used as the second pair of placeholders
     */
    private String placeholderStart = "{{";

    /**
     * Custom Template Placeholder End Symbol
     */
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
