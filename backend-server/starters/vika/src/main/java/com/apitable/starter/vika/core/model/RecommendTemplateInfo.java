package com.apitable.starter.vika.core.model;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

/**
 * <p>
 * Recommend Config Info
 * </p>
 *
 */
@JsonIgnoreProperties(ignoreUnknown = true)
public class RecommendTemplateInfo {

    @JsonProperty("SUBJECT")
    private List<String> subject;

    @JsonProperty("LAYOUT")
    private String layout;

    @JsonProperty("CUSTOM_GROUP")
    private String customGroup;

    @Deprecated
    @JsonProperty("TEMPLATE_NAME")
    private String templateName;

    @JsonProperty("TITLE")
    private String title;

    @JsonProperty("DESC")
    private String description;

    @JsonProperty("BANNER")
    private List<AttachmentField> banners;

    @Deprecated
    @JsonProperty("CUSTOM_CATEGORY")
    private String customCategory;

    @JsonProperty("COLOR")
    private String color;

    @JsonProperty("i18n")
    private String i18n;

    public String getSubjectValue() {
        return subject == null || subject.isEmpty() ? null : subject.get(0);
    }

    public void setSubject(List<String> subject) {
        this.subject = subject;
    }

    public String getLayout() {
        return layout;
    }

    public void setLayout(String layout) {
        this.layout = layout;
    }

    public String getCustomGroup() {
        return customGroup;
    }

    public void setCustomGroup(String customGroup) {
        this.customGroup = customGroup;
    }

    public String getTemplateName() {
        return templateName;
    }

    public void setTemplateName(String templateName) {
        this.templateName = templateName;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public List<AttachmentField> getBanners() {
        return banners;
    }

    public void setBanners(List<AttachmentField> banners) {
        this.banners = banners;
    }

    public String getCustomCategory() {
        return customCategory;
    }

    public void setCustomCategory(String customCategory) {
        this.customCategory = customCategory;
    }

    public String getColor() {
        return color;
    }

    public void setColor(String color) {
        this.color = color;
    }

    public String getI18n() {
        return i18n;
    }

    public void setI18n(String i18n) {
        this.i18n = i18n;
    }
}
