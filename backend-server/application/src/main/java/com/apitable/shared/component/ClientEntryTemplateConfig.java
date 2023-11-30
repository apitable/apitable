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

package com.apitable.shared.component;

import cn.hutool.core.util.StrUtil;
import java.util.Map;
import org.beetl.core.Configuration;
import org.beetl.core.GroupTemplate;
import org.beetl.core.Template;
import org.beetl.core.resource.StringTemplateResourceLoader;
import org.springframework.beans.factory.InitializingBean;
import org.springframework.stereotype.Component;

/**
 * <p>
 * Client Entry template config.
 * </p>
 *
 * @author zoe zheng
 */
@Component
public class ClientEntryTemplateConfig implements InitializingBean {

    private static final String HTML_PLACEHOLDER_START = "{{";

    private static final String HTML_PLACEHOLDER_END = "}}";

    private GroupTemplate groupTemplate;

    /**
     * render template.
     *
     * @param templateStr template string
     * @param map         template params
     * @return render result
     */
    public String render(String templateStr, Map<String, Object> map) {
        if (StrUtil.isNotBlank(templateStr)) {
            Template template = this.groupTemplate.getTemplate(templateStr);
            template.binding(map);
            return template.render();
        }
        return "";
    }

    @Override
    public void afterPropertiesSet() throws Exception {
        // Initialization code In order to be compatible with the front-end template engine, set the identifier separately and reload
        StringTemplateResourceLoader resourceLoader = new StringTemplateResourceLoader();
        Configuration cfg = Configuration.defaultConfiguration();
        cfg.setPlaceholderStart(HTML_PLACEHOLDER_START);
        cfg.setPlaceholderEnd(HTML_PLACEHOLDER_END);
        this.groupTemplate = new GroupTemplate(resourceLoader, cfg);
    }
}
