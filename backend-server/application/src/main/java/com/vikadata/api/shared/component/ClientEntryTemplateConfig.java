package com.vikadata.api.shared.component;

import java.util.Map;

import cn.hutool.core.util.StrUtil;
import org.beetl.core.Configuration;
import org.beetl.core.GroupTemplate;
import org.beetl.core.Template;
import org.beetl.core.resource.StringTemplateResourceLoader;

import org.springframework.beans.factory.InitializingBean;
import org.springframework.stereotype.Component;

/**
 * <p>
 * Client Entry template config
 * </p>
 *
 * @author zoe zheng
 */
@Component
public class ClientEntryTemplateConfig implements InitializingBean {

    private static final String HTML_PLACEHOLDER_START = "{{";

    private static final String HTML_PLACEHOLDER_END = "}}";

    private GroupTemplate groupTemplate;

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
