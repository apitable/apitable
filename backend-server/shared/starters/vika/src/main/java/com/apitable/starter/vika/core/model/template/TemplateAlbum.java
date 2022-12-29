package com.apitable.starter.vika.core.model.template;

import java.util.List;

/**
 * <p>
 * Template Center - Template Album
 * </p>
 *
 */
public class TemplateAlbum {

    private String name;

    private String cover;

    private String description;

    private String content;

    private String publisherName;

    private String publisherLogo;

    private String publisherDesc;

    private List<String> templateNames;

    private List<String> templateTags;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getCover() {
        return cover;
    }

    public void setCover(String cover) {
        this.cover = cover;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public String getPublisherName() {
        return publisherName;
    }

    public void setPublisherName(String publisherName) {
        this.publisherName = publisherName;
    }

    public String getPublisherLogo() {
        return publisherLogo;
    }

    public void setPublisherLogo(String publisherLogo) {
        this.publisherLogo = publisherLogo;
    }

    public String getPublisherDesc() {
        return publisherDesc;
    }

    public void setPublisherDesc(String publisherDesc) {
        this.publisherDesc = publisherDesc;
    }

    public List<String> getTemplateNames() {
        return templateNames;
    }

    public void setTemplateNames(List<String> templateNames) {
        this.templateNames = templateNames;
    }

    public List<String> getTemplateTags() {
        return templateTags;
    }

    public void setTemplateTags(List<String> templateTags) {
        this.templateTags = templateTags;
    }
}
