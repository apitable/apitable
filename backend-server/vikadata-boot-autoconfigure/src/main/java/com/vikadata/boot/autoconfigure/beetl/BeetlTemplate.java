package com.vikadata.boot.autoconfigure.beetl;

import java.io.BufferedOutputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.io.StringWriter;
import java.io.Writer;
import java.nio.charset.Charset;
import java.nio.charset.StandardCharsets;
import java.util.Map;

import org.beetl.core.Configuration;
import org.beetl.core.GroupTemplate;
import org.beetl.core.ResourceLoader;
import org.beetl.core.Template;
import org.beetl.core.resource.ClasspathResourceLoader;

import static cn.hutool.core.io.FileUtil.touch;

/**
 * Beetl 渲染模版引擎接口
 *
 * @author Shawn Deng
 * @date 2021-01-09 10:43:52
 */
public class BeetlTemplate {

    private final GroupTemplate groupTemplate;

    public BeetlTemplate() {
        this("");
    }

    public BeetlTemplate(String classPath) {
        this(classPath, StandardCharsets.UTF_8, null, null);
    }

    public BeetlTemplate(String classPath, Charset charset, String placeholderStart, String placeholderEnd) {
        try {
            Configuration conf = Configuration.defaultConfiguration();
            conf.setPlaceholderStart2(placeholderStart);
            conf.setPlaceholderEnd2(placeholderEnd);
            this.groupTemplate = createGroupTemplate(new ClasspathResourceLoader(classPath, charset.toString()), conf);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    private static GroupTemplate createGroupTemplate(ResourceLoader<String> loader, Configuration conf) {
        return new GroupTemplate(loader, conf);
    }

    public GroupTemplate getGroupTemplate() {
        return this.groupTemplate;
    }

    public String render(String resource, Map<?, ?> bindingMap) {
        final StringWriter writer = new StringWriter();
        render(resource, bindingMap, writer);
        return writer.toString();
    }

    public void render(String resource, Map<?, ?> bindingMap, File file) {
        try (BufferedOutputStream out = new BufferedOutputStream(new FileOutputStream(touch(file)))) {
            render(resource, bindingMap, out);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    public void render(String resource, Map<?, ?> bindingMap, Writer writer) {
        Template template = groupTemplate.getTemplate(resource);
        template.binding(bindingMap);
        template.renderTo(writer);
    }

    public void render(String resource, Map<?, ?> bindingMap, OutputStream out) {
        Template template = groupTemplate.getTemplate(resource);
        template.binding(bindingMap);
        template.renderTo(out);
    }
}
