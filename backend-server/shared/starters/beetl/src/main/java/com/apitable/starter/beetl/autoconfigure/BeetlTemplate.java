/*
 * APITable <https://github.com/apitable/apitable>
 * Copyright (C) 2022 APITable Ltd. <https://apitable.com>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

package com.apitable.starter.beetl.autoconfigure;

import static cn.hutool.core.io.FileUtil.touch;

import java.io.BufferedOutputStream;
import java.io.File;
import java.io.IOException;
import java.io.OutputStream;
import java.io.StringWriter;
import java.io.Writer;
import java.nio.charset.Charset;
import java.nio.file.Files;
import java.util.Map;
import org.beetl.core.Configuration;
import org.beetl.core.GroupTemplate;
import org.beetl.core.ResourceLoader;
import org.beetl.core.Template;
import org.beetl.core.resource.ClasspathResourceLoader;

/**
 * beetl render template api.
 *
 * @author Shawn Deng
 */
public class BeetlTemplate {

    private final GroupTemplate groupTemplate;

    /**
     * constructor.
     *
     * @param classPath        base class path
     * @param charset          charset
     * @param placeholderStart placeholder start
     * @param placeholderEnd   placeholder end
     */
    public BeetlTemplate(String classPath, Charset charset, String placeholderStart,
                         String placeholderEnd) {
        try {
            Configuration conf = Configuration.defaultConfiguration();
            conf.setPlaceholderStart2(placeholderStart);
            conf.setPlaceholderEnd2(placeholderEnd);
            this.groupTemplate =
                createGroupTemplate(new ClasspathResourceLoader(classPath, charset.toString()),
                    conf);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    private static GroupTemplate createGroupTemplate(ResourceLoader<String> loader,
                                                     Configuration conf) {
        return new GroupTemplate(loader, conf);
    }

    public GroupTemplate getGroupTemplate() {
        return this.groupTemplate;
    }

    /**
     * render method.
     *
     * @param resource   path under class path
     * @param bindingMap variables map
     * @return template string
     */
    public String render(String resource, Map<?, ?> bindingMap) {
        final StringWriter writer = new StringWriter();
        render(resource, bindingMap, writer);
        return writer.toString();
    }

    /**
     * render method.
     *
     * @param resource   path under class path
     * @param bindingMap variables map
     * @param file       output template file
     */
    public void render(String resource, Map<?, ?> bindingMap, File file) {
        try (BufferedOutputStream out = new BufferedOutputStream(
            Files.newOutputStream(touch(file).toPath()))) {
            render(resource, bindingMap, out);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    /**
     * render method.
     *
     * @param resource   path under class path
     * @param bindingMap variables map
     * @param writer     writer stream
     */
    public void render(String resource, Map<?, ?> bindingMap, Writer writer) {
        Template template = groupTemplate.getTemplate(resource);
        template.binding(bindingMap);
        template.renderTo(writer);
    }

    /**
     * render method.
     *
     * @param resource   path under class path
     * @param bindingMap variables map
     * @param out        output stream
     */
    public void render(String resource, Map<?, ?> bindingMap, OutputStream out) {
        Template template = groupTemplate.getTemplate(resource);
        template.binding(bindingMap);
        template.renderTo(out);
    }
}
