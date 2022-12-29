package com.apitable.starter.vika.core.model.template;

import java.util.List;

/**
 * <p>
 * Template Center - Config Info
 * </p>
 *
 */
public class TemplateCenterConfigInfo {

    private String i18n;

    private RecommendInfo recommend;

    private List<TemplateCategory> templateCategories;

    private List<TemplateAlbum> albums;

    private List<Template> template;

    public String getI18n() {
        return i18n;
    }

    public void setI18n(String i18n) {
        this.i18n = i18n;
    }

    public RecommendInfo getRecommend() {
        return recommend;
    }

    public void setRecommend(RecommendInfo recommend) {
        this.recommend = recommend;
    }

    public List<TemplateCategory> getTemplateCategories() {
        return templateCategories;
    }

    public void setTemplateCategories(List<TemplateCategory> templateCategories) {
        this.templateCategories = templateCategories;
    }

    public List<TemplateAlbum> getAlbums() {
        return albums;
    }

    public void setAlbums(List<TemplateAlbum> albums) {
        this.albums = albums;
    }

    public List<Template> getTemplate() {
        return template;
    }

    public void setTemplate(List<Template> template) {
        this.template = template;
    }

}
