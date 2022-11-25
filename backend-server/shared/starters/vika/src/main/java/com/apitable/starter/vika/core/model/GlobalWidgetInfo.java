package com.apitable.starter.vika.core.model;

/**
 * <p>
 * Global widget config
 * </p>
 *
 */
public class GlobalWidgetInfo {

    private String packageId;

    private String packageName;

    private Boolean isEnabled;

    private Boolean isTemplate;

    private String version;

    private Integer widgetSort;

    /* Widget Extension Fields, widget_body */
    private String openSourceAddres;

    private String templateCover;

    private String website;
    /* Widget Extension Fields, widget_body */

    public String getPackageName() {
        return packageName;
    }

    public void setPackageName(String packageName) {
        this.packageName = packageName;
    }

    public String getPackageId() {
        return packageId;
    }

    public void setPackageId(String packageId) {
        this.packageId = packageId;
    }

    public Boolean getIsEnabled() {
        return isEnabled;
    }

    public void setIsEnabled(Boolean enabled) {
        this.isEnabled = enabled;
    }

    public Boolean getIsTemplate() {
        return isTemplate;
    }

    public void setIsTemplate(Boolean template) {
        this.isTemplate = template;
    }

    public String getVersion() {
        return version;
    }

    public void setVersion(String version) {
        this.version = version;
    }

    public Integer getWidgetSort() {
        return widgetSort;
    }

    public void setWidgetSort(Integer widgetSort) {
        this.widgetSort = widgetSort;
    }

    public String getOpenSourceAddres() {
        return openSourceAddres;
    }

    public void setOpenSourceAddres(String openSourceAddres) {
        this.openSourceAddres = openSourceAddres;
    }

    public String getTemplateCover() {
        return templateCover;
    }

    public void setTemplateCover(String templateCover) {
        this.templateCover = templateCover;
    }

    public String getWebsite() {
        return website;
    }

    public void setWebsite(String website) {
        this.website = website;
    }
}
