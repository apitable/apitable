package com.vikadata.integration.vika.model.template;

import java.util.List;

/**
 * <p>
 * Template Center - Template Category
 * </p>
 *
 * @author Chambers
 * @date 2022/9/22
 */
public class TemplateCategory {

    private String name;

    private List<String> albumNames;

    private List<String> templateNames;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public List<String> getAlbumNames() {
        return albumNames;
    }

    public void setAlbumNames(List<String> albumNames) {
        this.albumNames = albumNames;
    }

    public List<String> getTemplateNames() {
        return templateNames;
    }

    public void setTemplateNames(List<String> templateNames) {
        this.templateNames = templateNames;
    }
}
