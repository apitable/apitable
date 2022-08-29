package com.vikadata.api.component;

import cn.hutool.core.util.StrUtil;
import org.beetl.core.Configuration;
import org.beetl.core.GroupTemplate;
import org.beetl.core.Template;
import org.beetl.core.resource.StringTemplateResourceLoader;
import org.springframework.beans.factory.InitializingBean;
import org.springframework.stereotype.Component;

import java.util.Map;

/**
 * <p>
 * beetle 模版用于加载客户端html入口
 * </p>
 *
 * @author zoe zheng
 * @date 2020/4/15 3:50 下午
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
        // 初始化代码 为了兼容前端的模板引擎 单独设置标志符 重新加载
        StringTemplateResourceLoader resourceLoader = new StringTemplateResourceLoader();
        Configuration cfg = Configuration.defaultConfiguration();
        cfg.setPlaceholderStart(HTML_PLACEHOLDER_START);
        cfg.setPlaceholderEnd(HTML_PLACEHOLDER_END);
        this.groupTemplate = new GroupTemplate(resourceLoader, cfg);
    }
}
