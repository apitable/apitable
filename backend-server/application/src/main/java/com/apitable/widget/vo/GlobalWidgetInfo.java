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

package com.apitable.widget.vo;

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
    private String openSourceAddress;

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

    public String getOpenSourceAddress() {
        return openSourceAddress;
    }

    public void setOpenSourceAddress(String openSourceAddress) {
        this.openSourceAddress = openSourceAddress;
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
