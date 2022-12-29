package com.apitable.starter.vika.core.model.template;

import java.util.List;

/**
 * <p>
 * Template Center - Template
 * </p>
 *
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
