package com.vikadata.api.cache.bean;

import java.util.List;
import java.util.stream.Collectors;

import cn.hutool.core.collection.CollUtil;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * <p>
 * Template Center - Recommend Config
 * </p>
 *
 * @author Chambers
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class RecommendConfig {

    /**
     * top banner
     */
    List<Banner> top;

    /**
     * custom category dto
     * delete after using new recommend config(include all poc)
     */
    List<CategoryDto> categories;

    /**
     * custom album group config
     */
    private List<AlbumGroup> albumGroups;

    /**
     * custom template group config
     */
    private List<TemplateGroup> templateGroups;

    public RecommendConfig(List<Banner> top, List<CategoryDto> categories) {
        this.top = top;
        this.categories = categories;
    }

    public List<TemplateGroup> getTemplateGroups() {
        if (CollUtil.isNotEmpty(templateGroups)) {
            return templateGroups;
        }
        // compatible old version config
        if (CollUtil.isNotEmpty(categories)) {
            return categories.stream().map(item -> new TemplateGroup(item.getCategoryName(), item.getTemplateIds())).collect(Collectors.toList());
        }
        return templateGroups;
    }

    //TODO compatible code (delete after 0.13.9)
    public void setTemplateGroups(List<TemplateGroup> templateGroups) {
        this.templateGroups = templateGroups;
        this.categories = templateGroups.stream().map(item -> new CategoryDto(item.getName(), item.getTemplateIds())).collect(Collectors.toList());
    }

    public static class AlbumGroup {
        private String name;

        private List<String> albumIds;

        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }

        public List<String> getAlbumIds() {
            return albumIds;
        }

        public void setAlbumIds(List<String> albumIds) {
            this.albumIds = albumIds;
        }
    }

    public static class TemplateGroup {
        private String name;

        private List<String> templateIds;

        public TemplateGroup() {
        }

        public TemplateGroup(String name, List<String> templateIds) {
            this.name = name;
            this.templateIds = templateIds;
        }

        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }

        public List<String> getTemplateIds() {
            return templateIds;
        }

        public void setTemplateIds(List<String> templateIds) {
            this.templateIds = templateIds;
        }
    }

}
