package com.vikadata.integration.vika.model.template;

import java.util.List;

/**
 * <p>
 * Template Center - Template
 * </p>
 *
 * @author Chambers
 * @date 2022/9/22
 */
public class Template {

    private String name;

    private List<String> templateTags;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public List<String> getTemplateTags() {
        return templateTags;
    }

    public void setTemplateTags(List<String> templateTags) {
        this.templateTags = templateTags;
    }
}
