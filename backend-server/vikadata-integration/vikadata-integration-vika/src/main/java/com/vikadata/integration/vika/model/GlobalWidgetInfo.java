package com.vikadata.integration.vika.model;

/**
 * <p>
 * 全局小组件配置
 * </p>
 *
 * @author Chambers
 * @date 2021/3/25
 */
public class GlobalWidgetInfo {

    private String packageId;

    private String packageName;

    private Boolean isEnabled;

    private Boolean isTemplate;

    private String version;

    private Integer widgetSort;

    /* 小组件扩展字段，widget_body */
    private String openSourceAddres;

    private String templateCover;

    private String website;
    /* 小组件扩展字段，widget_body */

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
